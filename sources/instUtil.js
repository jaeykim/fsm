var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var FileAPI = require('file-api');
var FileReader = FileAPI.FileReader;
var File = FileAPI.File;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var debug = require('./debug.js');

const save_dir = './inst/';
const STATELESS = false;
if (!fs.existsSync(save_dir)) {
	fs.mkdirSync(save_dir);
}
var reader = new FileReader();

var file_num = process.argv.length;
for (var i = 2; i < file_num; i++) {
	console.log('convert ' + process.argv[i]);
	inst_code(process.argv[i]);
}

function inst_code(source) {
	reader.onload = function(e) {
		var code = traceInstrument(e.target.result);
		fs.writeFile(save_dir + source, code, function(err) {
			return console.error(err);
		});
	}
	var regex = new RegExp("^(http|https)://", "i");
	if (regex.test(source)) {
		var req = new XMLHttpRequest();
		req.open("GET", source, false);
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				var code = traceInstrument(req.responseText);
				fs.writeFile(save_dir + source, code, function(err) {
					console.error(err);
				});
			}
		}
		req.send();
	} else {
		console.log('source: ' + source);
		reader.readAsText(new File({path: source}));
	}
}

const Syntax = {
	AssignmentExpression: 'AssignmentExpression',
	ArrayExpression: 'ArrayExpression',
	BlockStatement: 'BlockStatement',
	BinaryExpression: 'BinaryExpression',
	BreakStatement: 'BreakStatement',
	CallExpression: 'CallExpression',
	CatchClause: 'CatchClause',
	ConditionalExpression: 'ConditionalExpression',
	ContinueStatement: 'ContinueStatement',
	DoWhileStatement: 'DoWhileStatement',
	DebuggerStatement: 'DebuggerStatement',
	EmptyStatement: 'EmptyStatement',
	ExpressionStatement: 'ExpressionStatement',
	ForStatement: 'ForStatement',
	ForInStatement: 'ForInStatement',
	FunctionDeclaration: 'FunctionDeclaration',
	FunctionExpression: 'FunctionExpression',
	Identifier: 'Identifier',
	IfStatement: 'IfStatement',
	Literal: 'Literal',
	LabeledStatement: 'LabeledStatement',
	LogicalExpression: 'LogicalExpression',
	MemberExpression: 'MemberExpression',
	NewExpression: 'NewExpression',
	ObjectExpression: 'ObjectExpression',
	Program: 'Program',
	Property: 'Property',
	ReturnStatement: 'ReturnStatement',
	SequenceExpression: 'SequenceExpression',
	SwitchStatement: 'SwitchStatement',
	SwitchCase: 'SwitchCase',
	ThisExpression: 'ThisExpression',
	ThrowStatement: 'ThrowStatement',
	TryStatement: 'TryStatement',
	UnaryExpression: 'UnaryExpression',
	UpdateExpression: 'UpdateExpression',
	VariableDeclaration: 'VariableDeclaration',
	VariableDeclarator: 'VariableDeclarator',
	WhileStatement: 'WhileStatement',
	WithStatement: 'WithStatement'
};


function createSingleton() {
	var scopeChain;
	var scopeObjs;

	return {
		getScopeChain: function() {
			if (!scopeChain) {
				scopeChain = [new Array()];
			}
			return scopeChain;
		},
	}
};
var Singleton = createSingleton();

//var g = window; // node: global
var g = global;
g['document'] = undefined;
g['window'] = undefined;
g['performance'] = undefined;
g['alert'] = undefined;

var referencedGlobals = [];
var statementScope = {
	ForStatement: []
};
function createScopeObjs() {
	var scopeObjs = new Array();
	return {
		pushScope: function(parent, scope_num) {
			var newScope = new Array();
			if (parent.left) {
				newScope.node = parent.left;
				newScope.scope_num = scope_num;
				scopeObjs.push(newScope);
			}
			else if (parent.callee) { // For immediately-invoked function expression
				if(parent.callee.id)newScope.node = parent.callee.id;
				else newScope.node = parent.callee;
				newScope.scope_num = scope_num;
				scopeObjs.push(newScope);
			}
		},
		popScope: function() {
			return scopeObjs.pop();
		},
		push: function(scopeId) {
			var currentScopeObjs = scopeObjs[scopeObjs.length - 1];
			if (currentScopeObjs.scope_num != scopeId && currentScopeObjs.indexOf(scopeId) == -1) {
				currentScopeObjs.push(scopeId);
			}
		}
	}
};
var scopeObjs = createScopeObjs();

// Define prototype
Array.prototype.getScopeStatement = function (name) {
	var scopeId = this.length - 1;
	var argId = -1;
	// find scopeId from the scope chain or the arguments
	for (; scopeId > 0; scopeId--) {
		if (this[scopeId].indexOf(name) != -1) {
			break;
		} else if (this[scopeId].args) {
			argId = this[scopeId].args.indexOf(name);
			if (argId != -1) {
				break;
			}
		}
	}
	debug.log('[getScopeStatement] $fsm' + scopeId + '.' + name);
	if (argId == -1) {
		//if (scopeId < this.length) {
		if (scopeId > 0) {
			debug.log('[getScopeStatement] local variable declaration in the scope');
			scopeObjs.push(scopeId);
			return new MemberExpression(false,
					new Identifier('$fsm' + scopeId),
					new Identifier(name)
					);
		} else {
			// New global variable
			debug.log('[getScopeStatement] global variable declaration in the scope');
			return new MemberExpression(false,
					new Identifier('$fsm0'),
					new Identifier(name)
				);
		}
	} else {
		debug.log('[getScopeStatement] variable is an argument');
		scopeObjs.push(scopeId);
		//return new MemberExpression(true, ('$fsm' + scopeId), 
		//return new Identifier('$fsm' + scopeId+ '.$arguments' + argId); // OPT ME: convert to an AST node
		return new Identifier(name); // OPT ME: convert to an AST node
	}
};

Array.prototype.getCurrent = function() {
	return this[this.length - 1];
}

Array.prototype.pushIdentical = function(e) {
	if (this.indexOf(e) == -1) {
		this.push(e);
	}
}

/*
Array.prototype.pushNextTo = function(node, newNode) {
	var idx = this.indexOf(node);
	for (var i = this.length - 1; i > idx; i--) {
		this[i + 1] = this[i];
	}
	this[idx + 1] = newNode;
}
*/

// Util functions
function isNewScope(node) {
	return node.type == Syntax.FunctionDeclaration ||
		node.type == Syntax.FunctionExpression;
		//node.type == Syntax.Program;
}

function isStatement(node) {
	return node.type == Syntax.ExpressionStatement ||
		node.type == Syntax.ReturnStatement;
}

function printScope(scope, node){
	var varsDisplay = scope.join(', ');
	if (node.type == Syntax.Program) {
		debug.log('Variables declared in the global scope:', 
				varsDisplay);
	} else {
		if (node.id && node.id.name) {
			debug.log('Variables declared in the function ' + node.id.name + '():',
					varsDisplay);
		} else {
			debug.log('Variables declared in anonymous function:',
					varsDisplay);
		}
	}
}

function getName(node){
	var name = "";
	if(node.hasOwnProperty('object')){
		name += getName(node.object);
	}
	else{
		name += node.name;
	}
	if(node.hasOwnProperty('property')){
		name += "." + node.property.name;
	}
	return name;
}

function traceInstrument(code) {
	var ast = esprima.parse(code);

	/* To save closure information */
	var varScope = (function() {
		var varScope = [new Array(), new Object()];
		var currentScope = varScope;
		var anonymous = 0;
		return {
			pushScope: function(id) {
				if(currentScope[1].hasOwnProperty(id)){
					currentScope = currentScope[1][id];
					return;
				}
				if(id == undefined)id = anonymous++;
				currentScope[1][id] = [new Array(), new Object()];
				currentScope[1][id].parent = currentScope;
				currentScope = currentScope[1][id];
			},
			popScope: function() {
				currentScope = currentScope.parent;
			},
			pushVar: function(id, assign) {
				if(assign == undefined){
					currentScope[0].push([id, false]);
					return;
				}
				var temp = currentScope;
				while(temp.parent){
					for(var i = temp[0].length - 1; i >= 0; i--){
						if(temp[0][i][0] == id)return;
					}
					temp = temp.parent;
				}
				for(var i = temp[0].length - 1; i >= 0; i--){
					if(temp[0][i][0] == id)return;
				}
				temp[0].push([id, false]);
			},
			setClosure: function(id, reset) {
				for(var i = currentScope[0].length - 1; i >= 0; i--){
					if(id == currentScope[0][i][0]){
						if(reset)currentScope[0][i][1] = false;
						return false;
					}
				}
				for(var i = currentScope.parent; i != varScope && i != undefined; i = i.parent){
					for(var j = i[0].length - 1; j >= 0; j--){
						if(id == i[0][j][0]){
							if(reset){
								return i[0][j][1] = false;
							}
							return i[0][j][1] = true;
						}
					}
				}
				return false;
			},
			isClosure: function(id) {
				if(!currentScope.parent)return true;
				if(id.startsWith('this.'))return false;
				for(var i = currentScope[0].length - 1; i >= 0; i--){
					if(id == currentScope[0][i][0]){
						return currentScope[0][i][1];
					}
				}
				for(var i in currentScope[1]){
					if(id == i)return false;
				}
				for(var i = currentScope.parent; i != varScope && i != undefined; i = i.parent){
					for(var j = i[0].length - 1; j >= 0; j--){
						if(id == i[0][j][0]){
							return i[0][j][1];
							//return true;
						}
					}
				}
				return false;
			},
			isClosureScope: function() {
				if(!currentScope.parent)return true;
				for(var i = currentScope[0].length - 1; i >= 0; i--){
					if(currentScope[0][i][1])return true;
				}
				return false;
			},
			isGlobal: function(id) {
				var temp = currentScope;
				if(temp){
					while(temp.parent){
						for(var i = temp[0].length - 1; i >= 0; i--){
							if(id == temp[0][i][0])return false;
						}
						for(var i in temp[1]){
							if(id == i)return false;
						}
						temp = temp.parent;
					}
					for(var i = temp[0].length - 1; i >= 0; i--){
						if(id == temp[0][i][0])return true;
					}
					for(var i in temp[1]){
						if(id == i)return true;
					}
				}
				else{
					for(var i = varScope[0].length - 1; i >= 0; i--){
						if(id == varScope[0][i][0])return true;
					}
					for(var i in varScope[1]){
						if(id == i)return true;
					}
				}
				return true;
			}
		}
	})();


	var anonymous = 0;
	/* indirect eval list */
	var indirectEval = [];
	
	/* First traverse to find closure variables */
	(function traverse(ast){
	estraverse.traverse(ast, {
		enter: function (node, parent) {
			if (isNewScope(node)) {
				if(parent.type == Syntax.VariableDeclarator) varScope.pushScope(parent.id.name);
				else if(parent.type == Syntax.AssignmentExpression){
					varScope.pushScope(getName(parent.left));
				}
				//else if(parent.type == Syntax.ReturnStatement || parent.type == Syntax.CallExpression){
				else if(node.id == null){
					varScope.pushScope();
				}
				else {
					varScope.pushScope(node.id.name);
				}
				for(var i = 0; i < node.params.length; i++){
					varScope.pushVar(getName(node.params[i]));
				}
			}

			if (node.type == Syntax.VariableDeclarator) {
				varScope.pushVar(node.id.name);
			}
			if (node.type == Syntax.AssignmentExpression) {
				varScope.pushVar(getName(node.left), 'assign');
				if(node.right.name == 'eval' || indirectEval.indexOf(node.right.name) > -1){
					if(indirectEval.indexOf(node.left.name))indirectEval.push(node.left.name);
				}
			}

			if (node.type == Syntax.Identifier && parent.type != Syntax.VariableDeclarator) {
				varScope.setClosure(node.name);
			}

			if (node.type == Syntax.Identifier && parent.type == Syntax.VariableDeclarator) {
				if(node.name == 'eval' || indirectEval.indexOf(node.name) > -1){
					if(indirectEval.indexOf(parent.id.name) < 0)indirectEval.push(parent.id.name);
				}
			}

			if (node.type == Syntax.Identifier && parent.type == Syntax.CallExpression && node.name == 'eval') {
				if(parent.arguments[0].type == Syntax.Literal){
					var evalCode = parent.arguments[0].value;
					var evalAst = esprima.parse(evalCode);
					traverse(evalAst);
				}
				/*
				else if(parent.arguments[0].type == Syntax.Identifier){
					evalString.push({id:parent.arguments[0].name, value:null});
				}
				*/
			}
		},
		leave: function (node, parent) {
			if (isNewScope(node)) {
				varScope.popScope();
			}
			if (node.type == Syntax.ForStatement && node.init && node.init.type == Syntax.VariableDeclaration){
				for(var i = 0; i < node.init.declarations.length; i++){
					varScope.setClosure(node.init.declarations[i].id.name, true);
				}
			}
		}
	});
	})(ast);

	var scope_num = 0;
	//var scopeChain = [];
	var scopeChain = Singleton.getScopeChain();

	// To handle catch clause
	var catchArg;
	var isCatchBlock = false;

	(function replacement(ast){
	estraverse.replace(ast, {
		enter: function (node, parent) {

			if (node.type == Syntax.FunctionExpression) {
				
				/* varScope push scope */
				if(parent.type == Syntax.VariableDeclarator){
					var name = getName(parent.id);
					if(name.startsWith("$fsm"))name = name.slice(6);
					name = name.replace('fsm_', '');
					varScope.pushScope(name);
				}
				else if(parent.type == Syntax.AssignmentExpression){
					var name = getName(parent.left);
					if(name.startsWith("$fsm"))name = name.slice(6);
					name = name.replace('fsm_', '');
					varScope.pushScope(name);
				}
				else if(node.id == null){
					varScope.pushScope(anonymous++);
				}
				else{
					var name = getName(node.id);
					if(name.startsWith("$fsm"))name = name.slice(6);
					name = name.replace('fsm_', '');
					varScope.pushScope(name);
				}
				

			//node.type == Syntax.Program ||
				// Instrument a creation code
				scope_num++;

				// Make new scope to the scope chain
				var scope = new Array();
				if (node.params) {
					scope.args = new Array();
					for (var i = 0; i < node.params.length; i++) {
						scope.args.push(node.params[i].name);
					}
				}
				scopeChain.push(scope);
				scopeObjs.pushScope(parent, scope_num);
			}

			// FunctionDeclaration -> FunctionExpression
			if (node.type == Syntax.FunctionDeclaration) {
				var currentScope = scopeChain[scope_num];
				currentScope.push(node.id.name);
				node.type = Syntax.FunctionExpression;
				return new ExpressionStatement(
						new AssignmentExpression(
							'=',
							node.id,
							node
							));
			}

			// If the present node is VariableDeclaration
			// var a, b, c
			if (node.type == Syntax.VariableDeclaration) {
				var exps = new Array();
				var currentScope = scopeChain[scopeChain.length - 1];
				var scopeId = scopeChain.length - 1;
				for (var i = 0; i < node.declarations.length; i++) {
					/* Do nothing if parent type is forstatement */
					if(parent.type == Syntax.ForStatement)return node;

					currentScope.push(node.declarations[i].id.name);
					debug.log('[VariableDeclarator] ' + node.declarations[i].id.name);
					debug.log(node.declarations[i]);
					debug.log('[scopeChain]');
					debug.log(scopeChain);
					var replaced = undefined;

					/* If the variable is not a closure variable or global variable, VariableDeclaralation remains */
					if (!varScope.isClosure(node.declarations[i].id.name) || varScope.isGlobal(node.declarations[i].id.name)){
						replaced = new VariableDeclaration(
									[new VariableDeclarator(
										node.declarations[i].id, node.declarations[i].init)],
									node.kind
						);
						exps.push(replaced);
						continue;
					}
					if (node.declarations[i].init) {
						debug.log('[VariableDeclarator] varDecl has node.init');
						//var right = node.declarations[i].init;
						replaced = new AssignmentExpression(
									'=',
									/*
									new MemberExpression(false,
										new Identifier('$fsm' + scopeId),
										new Identifier(node.declarations[i].id.name)
										),
									*/
									new Identifier(node.declarations[i].id.name),
									node.declarations[i].init
						);
					} else {
						replaced = new AssignmentExpression(
									'=',
									/*
									new MemberExpression(false,
										new Identifier('$fsm' + scopeId),
										new Identifier(node.declarations[i].id.name)
										),
									*/
									new Identifier(node.declarations[i].id.name),
									new Identifier('undefined')
									);
					}
					if (parent.type != Syntax.ForStatement) {
						replaced = new ExpressionStatement(replaced);
					}
					exps.push(replaced);
				}
				if (exps.length == 1)
					return exps[0];
				return new BlockStatement(exps);
				//parent.body.splice(parent.body.indexOf(node), 1, ...exps);
				//return replaced;
			}

			// type: AssignmentExpression
			if (node.type == Syntax.AssignmentExpression) {
				// Put a global variable which was written to the reference table
				if (node.left && node.left.type == Syntax.Identifier && node.left.name in g) {
					referencedGlobals.pushIdentical(node.left.name);
				}
			}

			// Event Handler
			if (node.type == Syntax.Identifier) {
				if (['addEventListener', 'onclick', 'onchange', 'onmouseover', 'onmouseout', 'onkeydown', 'onload', 'setTimeout'].includes(node.name)){
					node.name = 'fsm_' + node.name;
				}
			}

			// For CatchClause
			if (node.type == Syntax.CatchClause)isCatchBlock = true;

			if (STATELESS) {
				// Flags
				if (node.type == Syntax.ForStatement) {
					statementScope.ForStatement.push({
						scope: (scopeChain.length - 1),
						vars: []
					});
				}
			}
		}, leave: function(node, parent) {

			// for CatchClause
			if (node.type == Syntax.CatchClause)isCatchBlock = false;
			
			// Pop the current scope
			if (isNewScope(node)) {
				
				// Insert $# = runtime.create(arguments);
				/*
				var signature = '';
				for (var i = 1; i < scope_num; i++) {
					signature += '$fsm' + i + ' = runtime.get(JSON.stringify($' + i + '.key));';
				}
				*/

				/* Create "$fsm.create" code only if the scope has closure variables */
				if(varScope.isClosureScope()){
					signature = 'var $fsm' + scope_num+ ' = $fsm.create(arguments)'; // OPT ME: convert to an AST node
					signature = esprima.parse(signature).body[0];

					// Interleave the signature
					var shifting_body = node.body;
					// Find real code body
					while(shifting_body.type) {
						shifting_body = shifting_body.body;
					}
					shifting_body.unshift(signature); // Interleave at the first line
					//printScope(currentScope, node);
				}


				// scope chain
				//var currentScope = scopeChain.pop();
				
				varScope.popScope();
				scopeChain.pop();

				//scopeObjs.popScope();
				scope_num--;
			}

			// type: Identifier
			if (node.type == Syntax.Identifier) {

				/* Do nothing if identifier's name id 'arguments' */
				if(node.name == "arguments")return;

				/* Instrument string literal argument of eval function */
				if(node.name == "eval" && parent.type == Syntax.CallExpression){
					if(parent.arguments[0].type == Syntax.Literal){
						var evalCode = parent.arguments[0].value;
						var evalAst = esprima.parse(evalCode);
						replacement(evalAst);
						var newCode = escodegen.generate(evalAst);
						parent.arguments[0].value = newCode;
					}
				}
				if(indirectEval.indexOf(node.name) > -1 && parent.type == Syntax.CallExpression){
					if(parent.arguments[0].type == Syntax.Literal){
						var evalCode = parent.arguments[0].value;
						var tempScopeObjs = scopeObjs;
						var tempSingleton = Singleton;
						scopeObjs = createScopeObjs();
						Singleton = createSingleton();
						var newCode = traceInstrument(evalCode);
						Singleton = tempSingleton;
						scopeObjs = tempScopeObjs;
						parent.arguments[0].value = newCode;
					}
				}

				debug.log('[Identifier] ' + node.name);
				debug.log('[Identifier] parent:');
				debug.log(parent);

				/* Handle cacth block */
				if (parent.type == Syntax.CatchClause){
					catchArg = node.name;
					return;
				}
				if (isCatchBlock && node.name == catchArg)return;

				if (parent.type == Syntax.LabeledStatement || parent.type == Syntax.BreakStatement || parent.type == Syntax.ContinueStatement)return;
				if (node.name in g && referencedGlobals.indexOf(node.name) == -1) {
					return;
				}
				//if (node.name in g) return;
				if (parent.type == Syntax.FunctionDeclaration ||
					parent.type == Syntax.FunctionExpression) return;
				if (STATELESS) {
					// ForStatement
					if (statementScope.ForStatement.getCurrent() == (scopeChain.length - 1)) {
						if (parent.type == Syntax.VariableDeclarator && parent.id == node) {
							debug.log('[Identifier] ForStatement Id');
							return;
						}
						if (parent.type == Syntax.BinaryExpression && parent.left == node) {
							debug.log('[Identifier] ForStatement Binary left');
							return;
						}
						if (parent.type == Syntax.UpdateExpression && parent.argument == node) {
							debug.log('[Identifier] ForStatement Update argument');
							return;
						}
					}
				}
				// 
				if (parent.type == Syntax.Property && parent.key == node) return;

				//if (!varScope.isClosure(node.name) && !varScope.isGlobal(node.name))return;
				if (!varScope.isClosure(node.name) || varScope.isGlobal(node.name))return;
				if (parent.type != Syntax.MemberExpression || parent.object == node) {
					// a.b.c -> $n.a.b.c
					debug.log('[Identifier] !MemberExpression || parent.object = node');
					var replaced = scopeChain.getScopeStatement(node.name);
					return replaced;
				}
				if (parent.type == Syntax.MemberExpression && parent.computed == true && parent.property == node) {
					// 
					debug.log('[Identifier] MemberExpression && parent.computed = true && parent.property = node');
					var replaced = scopeChain.getScopeStatement(node.name);
					return replaced;
				}
			}

			// type: AssignmentExpression
			if (node.type == Syntax.ExpressionStatement && node.expression.type == Syntax.AssignmentExpression && isNewScope(node.expression.right)) {

				/* If the function is global, change FunctionExpression to FunctionDeclaration */
				if (node.expression.left.name && varScope.isGlobal(node.expression.left.name)){
					return new FunctionDeclaration(
							node.expression.left,
							node.expression.right.params,
							node.expression.right.body,
							node.expression.right.generator,
							node.expression.right.expression,
							node.expression.right.async
							);
				}

				if (node.expression.right.type == Syntax.FunctionExpression && scope_num > 0) {
					if(!node.expression.left.object || !node.expression.left.object.type == Syntax.ThisExpression){
						return new VariableDeclaration(
								[new VariableDeclarator(
									node.expression.left, node.expression.right)],
								"var"
								);
					}
				}

				//console.log(parent);
				var scopeObj = scopeObjs.popScope();
				var currentScope = scopeObj.node.object;
				if(!currentScope)return;
				while(currentScope.hasOwnProperty("object")){
					currentScope = currentScope.object;
				}
				//var currentScope = scopeObj.node.object.name.substring(4);
				if(currentScope.name)
					currentScope = currentScope.name.substring(4);
				if (currentScope != 0) {
					/*
				parent.body.push(new ExpressionStatement(new AssignmentExpression(
					'=',
					scopeObj.node,
					new Identifier('test')
				)));
				*/
					var exps = [node];

					/* Comment due to some error
					if (scopeObj.length > 0) {
						exps.push(new ExpressionStatement(new AssignmentExpression(
							'=',
							new MemberExpression(false, scopeObj.node, new Identifier('$scopeObj')),
							new Identifier('new Object()') // OPT ME: convert to an AST node
						)));
					}
					for (var i = 0; i < scopeObj.length; i++) {
						//if (currentScope == scopeObj[i]) continue;
						exps.push(new ExpressionStatement(new AssignmentExpression(
							'=',
							new MemberExpression(false, scopeObj.node, new Identifier('$scopeObj.$fsm' + scopeObj[i])),
							new Identifier('$fsm.getScopeObj($fsm' + scopeObj[i] + ')') // OPT ME: convert to an AST node
						)));
					}
					*/
					return new BlockStatement(
						exps
					);
				}

				if (STATELESS) {
					// Flags
					if (node.type == Syntax.ForStatement) {
						statementScope.ForStatement.pop();
					}
				}
			}
		}
	});
	})(ast);
	debug.log('AST');
	debug.log(ast);
	//console.log(ast);

	return escodegen.generate(ast);
}

module.exports = {
	traceInstrument: traceInstrument
}

// Expression
function Identifier(name) {
	this.type = Syntax.Identifier;
	this.name = name;
}

function MemberExpression(computed, object, property) {
	this.type = Syntax.MemberExpression;
	this.computed = computed;
	this.object = object;
	this.property = property;
}

function AssignmentExpression(operator, left, right) {
	this.type = Syntax.AssignmentExpression;
	this.operator = operator;
	this.left = left;
	this.right = right;
}

// Statement
function ExpressionStatement(expression) {
	this.type = Syntax.ExpressionStatement;
	this.expression = expression;
			//directive?: string;
}

function BlockStatement(statementListItem) {
	this.type = Syntax.BlockStatement;
	this.body = statementListItem;
}

function VariableDeclarator(id, init) {
	this.type = Syntax.VariableDeclarator;
	this.id = id;
	this.init = init;
}

function VariableDeclaration(declarations, kind) {
	this.type = Syntax.VariableDeclaration;
	this.declarations = declarations;
	this.kind = kind;
}

function FunctionDeclaration(id, params, body, generator, expression, async){
	this.type = Syntax.FunctionDeclaration;
	this.id = id;
	this.params = params;
	this.body = body;
	this.generator = generator;
	this.expression = expression;
	this.async = async;
}
