var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

// Define prototype
Array.prototype.getScopeStmt = function (name) {
	var scopeId = this.length - 1;
	var argId = -1;
	//console.log("find name: " + name);
	for (var i = scopeId; i >= 0; i--) {
		//console.log(this[i]);
		if (this[i].indexOf(name) != -1) {
			scopeId = i;
			break;
		} else if (this[i].args) {
			argId = this[i].args.indexOf(name);
			if (argId != -1) {
				scopeId = i;
				break;
			}
		}
	}
	//console.log('scopeId: ' + scopeId + ', argId: ' + argId);
	
	// OPT ME: This is not a syntax tree
	//return argId != -1 ? ('$' + scopeId + '.$arguments[' + argId + ']') : ('$' + scopeId + '.' + name);
	if (argId == -1) {
		var id = '$' + scopeId;
		if (scopeId == (this.length - 1)) {
			id += '.' + name;
		}
		return id;
	} else {
		return '$' + scopeId + '.$arguments[' + argId + ']';
	}
};


// Util functions
function isNewScope(node) {
	return node.type === 'FunctionDeclaration' ||
		node.type === 'FunctionExpression' ||
		node.type === 'Program';
}

function isStatement(node) {
	return node.type === 'ExpressionStatement' ||
		node.type === 'ReturnStatement';
}

function printScope(scope, node){
	var varsDisplay = scope.join(', ');
	if (node.type === 'Program') {
		console.log('Variables declared in the global scope:', 
				varsDisplay);
	} else {
		if (node.id && node.id.name) {
			console.log('Variables declared in the function ' + node.id.name + '():',
					varsDisplay);
		} else {
			console.log('Variables declared in anonymous function:',
					varsDisplay);
		}
	}
}

function traceInstrument(code) {
	var ast = esprima.parse(code);
	var scope_num = -1;
	var ref_num = -1;
	var scopeChain = [];

	estraverse.traverse(ast, {
		enter: function (node, parent) {
			//console.log(node);
			if (isNewScope(node)){
				// Instrument a creation code
				scope_num++;
				ref_num++;

				// Make new scope to the scope chain
				var scope = new Array();
				//console.log(node);
				if (node.params) {
					scope.args = new Array();
					for (var i = 0; i < node.params.length; i++) {
						scope.args.push(node.params[i].name);
					}
				}
				scopeChain.push(scope);
			}
			if (node.type === 'VariableDeclarator') {
				var currentScope = scopeChain[scopeChain.length - 1];
				currentScope.push(node.id.name);
			}	
			if (node.type === 'VariableDeclaration') {
				var exps = new Array();
				for (var i = 0; i < node.declarations.length; i++) {
					var varDecl = node.declarations[i];
					var name = scopeChain.getScopeStmt(varDecl.id.name);
					var exp = new ExpressionStatement(new VarDecl_to_AssignExp(varDecl, new Identifier(name)));
					exps.push(exp);
					//console.log(escodegen.generate(VarDecl_to_ExpStmt(varDecl)));
				}
				parent.body.splice(parent.body.indexOf(node), 1, ...exps);	
				//console.log(parent.body);
			}
		}, leave: function(node, parent) {
			if (isNewScope(node)) {
				// scope chain
				var currentScope = scopeChain.pop();
				//printScope(currentScope, node);
				
				// insert $# = runtime.create(arguments);
				var signature = '$' + ref_num + ' = runtime.create(arguments)'; // OPT ME: scope_num can be used
				signature = esprima.parse(signature).body[0];
				var shifting_body = node.body;
				while(shifting_body.type) {
					shifting_body = shifting_body.body;
				}
				shifting_body.unshift(signature);
				scope_num--;
			}
			// Replace assignment code
			if (node.type === 'AssignmentExpression') {
				// left
				var object = node.left;
				var father = object;
				console.log('start');
				console.log(object);
				if (object.type === 'MemberExpression') {
					object = object.object;
					console.log(object);
					while (object.type != 'Identifier') {
						console.log(object.type);
						if (object.type === 'ThisExpression') {
							father = father.property;
							break;
						}
						father = object;
						object = object.object;
					}
				}
				object.name = scopeChain.getScopeStmt(object.name);
				var object = node.right;
				if (object.type === 'MemberExpression') {
					object = object.object;
					while (object.type != 'Identifier') {
						object = object.object;
					}
				}
				object.name = scopeChain.getScopeStmt(object.name);
			}
		}
	});
	//console.log(ast.body[1].body.body[1].expression);
	return escodegen.generate(ast);
}

module.exports = {
	traceInstrument: traceInstrument
}
// FunctionDeclaration
// FunctionExpression
// ObjectExpression


// Expression
function Identifier(name) {
	this.type = 'Identifier';
	this.name = name;
}

function StaticMemberExpression(computed, object, property) {
	this.type = 'MemberExpression';
	this.computed = computed;
	this.object = object;
	this.property = property;
}

function AssignmentExpression(operator, left, right) {
	this.type = 'AssignmentExpression';
	this.operator = operator;
	this.left = left;
	this.right = right;
}

function VarDecl_to_AssignExp (node, object) {
	//var exps = new Array();
	//for (varDecl in node.declarations) {
	
	var id = node.id;
	if (object) {
		id = new StaticMemberExpression(false, object, id);
	}
	return new AssignmentExpression('=', id, node.init); 
	//}
}

// Statement
function ExpressionStatement(expression) {
	this.type = 'ExpressionStatement';
	this.expression = expression;
			//directive?: string;
}
