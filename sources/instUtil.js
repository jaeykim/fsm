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


var Singleton = (function() {
	var scopeChain;

	return {
		getScopeChain: function() {
			if (!scopeChain) {
				scopeChain = [new Array()];
			}
			return scopeChain;
		}
	}
})();

//var g = window; // node: global
var g = global;
g['document'] = undefined;
g['window'] = undefined;
g['performance'] = undefined;
var referencedGlobals = [];

var statementScope = {
	ForStatement: []
};

// Define prototype
Array.prototype.getScopeStatement = function (name) {
	var scopeId = this.length - 1;
	var argId = -1;
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
	debug.log('[getScopeStatement] $fsm' + this[scopeId].ref_num + '.' + name);
	if (argId == -1) {
		//if (scopeId < this.length) {
		if (scopeId > 0) {
			debug.log('[getScopeStatement] local variable declaration in the scope');
			return new MemberExpression(false,
					new Identifier('$fsm' + this[scopeId].ref_num),
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
		//return new MemberExpression(true, ('$fsm' + scopeId), 
		return new Identifier('$fsm' + this[scopeId].ref_num + '.$arguments' + argId);
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

function traceInstrument(code) {
	var ast = esprima.parse(code);
	var ref_num = 0;
	var scope_num = 0;
	//var scopeChain = [];
	var scopeChain = Singleton.getScopeChain();

	estraverse.replace(ast, {
		enter: function (node, parent) {
			if (node.type == Syntax.FunctionExpression) {
			//node.type == Syntax.Program ||
				// Instrument a creation code
				ref_num++;
				scope_num++;

				// Make new scope to the scope chain
				var scope = new Array();
				if (node.params) {
					scope.args = new Array();
					for (var i = 0; i < node.params.length; i++) {
						scope.args.push(node.params[i].name);
					}
				}
				scope.ref_num = ref_num;
				scopeChain.push(scope);
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
					currentScope.push(node.declarations[i].id.name);
					debug.log('[VariableDeclarator] ' + node.declarations[i].id.name);
					debug.log(node.declarations[i]);
					debug.log('[scopeChain]');
					debug.log(scopeChain);
					var replaced = undefined;
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
									new MemberExpression(false,
										new Identifier('$fsm' + scopeChain[scopeId].ref_num),
										new Identifier(node.declarations[i].id.name)
										),
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
			// Pop the current scope
			if (isNewScope(node)) {
				
				// Insert $# = runtime.create(arguments);
				/*
				var signature = '';
				for (var i = 1; i < scope_num; i++) {
					signature += '$fsm' + i + ' = runtime.get(JSON.stringify($' + i + '.key));';
				}
				*/
				signature = '$fsm' + scopeChain[scope_num].ref_num + ' = fsm.create(arguments)'; // OPT ME: conver to AST node
				signature = esprima.parse(signature).body[0];

				// Interleave signature
				var shifting_body = node.body;
				// Find real code body
				while(shifting_body.type) {
					shifting_body = shifting_body.body;
				}
				shifting_body.unshift(signature); // Interleave at the first line
				//printScope(currentScope, node);

				// scope chain
				//var currentScope = scopeChain.pop();
				scopeChain.pop();
				
				scope_num--;
			}

			// type: Identifier
			if (node.type == Syntax.Identifier) {
				debug.log('[Identifier] ' + node.name);
				debug.log('[Identifier] parent:');
				debug.log(parent);
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
				if (parent.type != Syntax.MemberExpression ||
					parent.object == node) {
					// a.b.c -> $n.a.b.c
					debug.log('[Identifier] !MemberExpression || parent.object = node');
					var replaced = scopeChain.getScopeStatement(node.name);
					return replaced;
				}
				if (parent.type == Syntax.MemberExpression && parent.computed == true && parent.property == node) {
					debug.log('[Identifier] MemberExpression && parent.computed = true && parent.property = node');
					var replaced = scopeChain.getScopeStatement(node.name);
					return replaced;
				}
			}

			if (STATELESS) {
				// Flags
				if (node.type == Syntax.ForStatement) {
					statementScope.ForStatement.pop();
				}
			}
		}
	});
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
