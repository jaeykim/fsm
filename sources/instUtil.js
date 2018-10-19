var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var FileAPI = require('file-api');
var FileReader = FileAPI.FileReader;
var File = FileAPI.File;
var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

function print(str){
	console.log(str);
}

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

var scopeList = [];

function scopeTree() {
	var scopeRoot = {
		type: "window",
		name: "window",
		val: {},
		thisList: ["this"],
		depth: 0
	};
	var currentScope = scopeRoot;
	var anonymous = 0;
	var depth = 0;
	function createElement(type, name, curScope){
		if(type == "function")depth++;
		return {
			type: type,
			name: name,
			val: {},
			thisList: ["this"],
			isClosure: false,
			isReturnFunction: false,
			depth: depth,
			parent: (curScope ? curScope : currentScope)
		}
	}
	function findVarScope(name){
		var temp = currentScope;
		while(temp){
			if(temp.type != 'object'){
				for(var _name in temp.val){
					if(_name == name)return temp;
				}
			}
			temp = temp.parent;
		}
		for(var index = scopeList.length-1; index >= 0; index--){
			var temp = scopeList[index];
			while(temp){
				for(var _name in temp.val){
					if(_name == name)return temp;
				}
				temp = temp.parent;
			}
		}
		if(name == 'window')return scopeRoot;
		return null;
	}
	function findVar(name){
		var found = currentScope;
		var temp_name = name[0];
		while(found){
			for(var prop in found.val){
				if(prop == name[0]){
					temp_name = name[0];
					name.splice(0, 1);
					found = found.val[temp_name];
					break;
				}
			}
			found = found.parent;
		}
		if(name.length == 0){
			name.push(temp_name);
			return found;
		}
		if(!found)return found;
		while(name.length){
			var error = true;
			for(var prop in found.val){
				if(prop == name[0]){
					temp_name = name[0];
					name.splice(0, 1);
					found = found.val[temp_name];
					error = false;
					break;
				}
			}
			if(error){
				console.log('findVar error');
				return null;
			}
		}
		name.push(temp_name);
		return found;
	}
	return {
		findVarScope: findVarScope,
		getScopeRoot: function() {
			return scopeRoot;
		},
		getCurrentScope: function() {
			return currentScope;
		},
		setCurrentScope: function(scope) {
			currentScope = scope;
			//depth = currentScope.depth;
		},
		pushVar: function(type, name, isThis){	
			if(isThis){
				currentScope.thisList.push(name);
				return;
			}
			if(name == 'anonymous')name = anonymous++;
			if(currentScope.val[name] != undefined && !(currentScope.val[name].toString().includes("[native code]")))return;
			if(type == 'object' || type == 'function' || type == 'variable' || type == 'undefined' || type == 'parameter'){
				currentScope.val[name] = createElement(type, name);
				if(type == "function")currentScope.val[name].val["prototype"] = createElement(type, name, currentScope.val[name]);
			}
			else{
				var findScope = findVar(type.split('.'));
				if(findScope)currentScope.val[name] = findScope;
				else currentScope.val[name] = createElement('variable', name);
			}
			return name;
		},
		pushScope: function(name){
			if(!currentScope.val.hasOwnProperty(name))currentScope.val[name] = createElement('object', name);
			currentScope = currentScope.val[name];
		},
		popScope: function(){
			var temp = currentScope
			currentScope = currentScope.parent;
			return temp.name;
		},
		accessVar: function(name, traverse){
			var varScope = findVarScope(name);
			var isThis = false;
			var thisList = [];
			for(var temp = currentScope; temp; temp = temp.parent){
				thisList = thisList.concat(temp.thisList);
			}
			if(typeof currentScope.name == 'string' && varScope){
				isThis = thisList.includes(currentScope.name.split('.')[0]);
				//isThis = currentScope.name.startsWith('this.');
			}
			if(traverse && varScope && varScope != scopeRoot && varScope != currentScope && varScope.type == 'function' && (currentScope.isReturnFunction || isThis || varScope.val[name].type == "function" || currentScope.parent.type == 'object')){
				varScope.isClosure = true;
			}
			return varScope;
		},
		setEventHandler: function(name){
			var varScope = findVarScope(name);
			if(varScope && varScope != scopeRoot){
				varScope.isClosure = true;
			}
			return varScope;
		},
		assignVar: function(type, name){
			var thisList = [];
			for(var temp = currentScope; temp; temp = temp.parent){
				thisList = thisList.concat(temp.thisList);
			}
			if(thisList.includes(name.split('.')[0])){
				var varScope = currentScope;
				if(type == 'object' || type == 'function' || type == 'variable' || type == 'undefined' || type == 'parameter'){
					varScope.val[name] = createElement(type, name, varScope);
					if(type == "function")varScope.val[name].val["prototype"] = createElement(type, name, varScope.val[name]);
				}
				else{
					var findScope = findVar(type.split('.'));
					if(findScope)varScope.val[name] = findScope;
					else varScope.val[name] = createElement('variable', name, varScope);
				}
				return;
			}
			else{
				var varScope = findVarScope(name.split('.')[0]);
			}
			if(!varScope){
				scopeRoot.val[name] = createElement(type, name, varScope);
			}
			else{
				var _name = name.split('.').slice(0, -1);
				if(_name[0] == 'window')_name = _name.slice(1);
				if(_name[0] == 'document')return;
				while(_name.length){
					varScope = varScope.val[_name[0]];
					if(!varScope)return;
					_name = _name.splice(1);
				}
				if(!varScope)return;
				name = name.split('.')[name.split('.').length - 1];
				if(type == 'object' || type == 'function' || type == 'variable' || type == 'undefined' || type == 'parameter'){
					if(varScope.val[name] != undefined && !(varScope.val[name].toString().includes("[native code]")))return;
					varScope.val[name] = createElement(type, name, varScope);
					if(type == "function")varScope.val[name].val["prototype"] = createElement(type, name, varScope.val[name]);
				}
				else{
					var findScope = findVar(type.split('.'));
					if(findScope)varScope.val[name] = findScope;
					else if(varScope.val[name] != undefined && !(varScope.val[name].toString().includes("[native code]")))return;
					else varScope.val[name] = createElement('variable', name, varScope);
				}
			}
		},
		setReturnFunction: function(name){
			var varScope = findVarScope(name);
			if(varScope && varScope.val[name].type == 'function')varScope.val[name].isReturnFunction = true;
		},
		getDepth: function() {
			return depth;
		}
	}
}

function getName(node){
	if(node.type == Syntax.Identifier)return node.name;
	else if(node.type == Syntax.ThisExpression)return "this";
	else if(node.type == Syntax.CallExpression || node.type == Syntax.NewExpression){
		var name = getName(node.callee) + "(";
		if(node.arguments.length > 0){
			name += getName(node.arguments[0]);
		}
		for(var i = 1; i < node.arguments.length; i++){
			name += ", " + getName(node.arguments[i]);
		}
		name += ")";
		return name;
	}
	else if(node.type == Syntax.Literal)return node.raw;
	else if(node.type == Syntax.MemberExpression)return getName(node.object) + "." + getName(node.property);
	else return "undefined";
}

function traceInstrument(code) {
	var ast = esprima.parse(code);
	var ScopeTree = scopeTree();
	var builtInList = ["Object", "Array", "Function", "Number", "Boolean", "Symbol", "Error", "Math", "Date", "String", "RegExp"];

	var anonymous = 0;
	var poppedScope;
	estraverse.traverse(ast, {
		enter: function(node, parent){
			//console.log('enter===');
			//console.log(node);
			//print(ScopeTree.getCurrentScope());
			//console.log('========');
			//console.log();
			if(node.type == Syntax.CallExpression && builtInList.includes(getName(node.callee).split('.')[0]))this.skip();
			if(node.type == Syntax.VariableDeclarator){
				if(!(node.init)){
					ScopeTree.pushVar('undefined', node.id.name);
				}
				else{
					var isCallExpression = (function(){
						var temp = node.init;
						while(temp){
							if(temp.type == Syntax.CallExpression)return true;
							temp = temp.object;
						}
						return false;
					})();
					if(isCallExpression){
						ScopeTree.pushVar('variable', node.id.name);
					}
					else{
						switch (node.init.type){
							case Syntax.ObjectExpression:
								ScopeTree.pushVar('object', node.id.name);
								break;
							case Syntax.FunctionExpression:
								ScopeTree.pushVar('function', node.id.name);
								break;
							case Syntax.Identifier:
							case Syntax.MemberExpression:
								ScopeTree.pushVar(getName(node.init), node.id.name);
								break;
							case Syntax.ThisExpression:
								ScopeTree.pushVar('variable', node.id.name, true);
								break;
							case Syntax.NewExpression:
								if(node.init.callee.name == "Object")
									ScopeTree.pushVar('object', node.id.name);
								else
									ScopeTree.pushVar('variable', node.id.name);
								break;
							default:
								ScopeTree.pushVar('variable', node.id.name);
						}
					}
				}
			}
			else if(node.type == Syntax.AssignmentExpression){
				if(builtInList.includes(getName(node.left).split('.')[0])){
					this.skip();
				}
				var isCallExpression = (function(){
					var temp = node.right;
					while(temp){
						if(temp.type == Syntax.CallExpression)return true;
						temp = temp.object;
					}
					return false;
				})();
				if(isCallExpression){
					ScopeTree.assignVar('variable', getName(node.left));
				}
				else{
					switch (node.right.type){
						case Syntax.ObjectExpression:
							ScopeTree.assignVar('object', getName(node.left));
							break;
						case Syntax.FunctionExpression:
							ScopeTree.assignVar('function', getName(node.left));
							break;
						case Syntax.Identifier:
						case Syntax.MemberExpression:
							ScopeTree.assignVar(getName(node.right), getName(node.left));
							break;
						case Syntax.NewExpression:
							if(node.right.callee.name == "Object")
								ScopeTree.pushVar('object', getName(node.left));
							else
								ScopeTree.pushVar('variable', getName(node.left));
							break;
						default:
							ScopeTree.assignVar('variable', getName(node.left));
					}
				}
			}
			if(node.type == Syntax.FunctionDeclaration){
				ScopeTree.pushVar('function', node.id.name);
				scopeList.push(ScopeTree.getCurrentScope());
				ScopeTree.pushScope(node.id.name);
				for(var param_index = 0; param_index < node.params.length; param_index++){
					ScopeTree.pushVar('parameter', node.params[param_index].name);
				}
			}
			else if(node.type == Syntax.FunctionExpression && parent.type != Syntax.LogicalExpression){
				scopeList.push(ScopeTree.getCurrentScope());
				if(parent.id)ScopeTree.pushScope(getName(parent.id));
				else if(parent.left){
					var thisList = [];
					for(var temp = ScopeTree.getCurrentScope(); temp; temp = temp.parent){
						thisList = thisList.concat(temp.thisList);
					}
					var name = (getName(parent.left)).split('.');
					if(thisList.includes(name[0]))ScopeTree.pushScope(name.join('.'));
					else{ 
						if(name[0] == 'window')ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]));
						else ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]).val[name[0]]);
						for(var _name = 1; _name < name.length; _name++){
							if(!ScopeTree.getCurrentScope().hasOwnProperty(name[_name]))ScopeTree.pushVar('object', name[_name]);
							ScopeTree.pushScope(name[_name]);
						}
					}
					//ScopeTree.pushScope(getName(parent.left));
				}
				else if(parent.key)ScopeTree.pushScope(getName(parent.key));
				else{
					ScopeTree.pushScope(ScopeTree.pushVar('function', 'anonymous'));
					anonymous++;
				}
				for(var param_index = 0; param_index < node.params.length; param_index++){
					ScopeTree.pushVar('parameter', node.params[param_index].name);
				}
			}
			else if(node.type == Syntax.ObjectExpression && parent.type != Syntax.LogicalExpression){
				scopeList.push(ScopeTree.getCurrentScope());
				if(parent.id)ScopeTree.pushScope(getName(parent.id));
				else if(parent.left){
					var thisList = []
					for(var temp = ScopeTree.getCurrentScope(); temp; temp = temp.parent){
						thisList = thisList.concat(temp.thisList);
					}
					var name = getName(parent.left).split('.');
					if(thisList.includes(name[0]))ScopeTree.pushScope(name.join('.'));
					else{
						if(name[0] == 'window')ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]));
						else ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]).val[name[0]]);
						for(var i = 1; i < name.length; i++){
							if(!ScopeTree.getCurrentScope().hasOwnProperty(name[i]))ScopeTree.pushVar('object', name[i]);
							ScopeTree.pushScope(name[i]);
						}
					}
				}
				else{
					ScopeTree.pushScope(ScopeTree.pushVar('object', 'anonymous'));
					anonymous++;
				}
				for(var prop_index = 0; prop_index < node.properties.length; prop_index++){
					switch (node.properties[prop_index].value.type){
						case Syntax.ObjectExpression:
							ScopeTree.pushVar('object', getName(node.properties[prop_index].key));
							break;
						case Syntax.FunctionExpression:
							ScopeTree.pushVar('function', getName(node.properties[prop_index].key));
							break;
						default:
							ScopeTree.pushVar('variable', getName(node.properties[prop_index].key));
					}
				}
			}
			if(node.type == Syntax.ReturnStatement){
				if(node.argument && node.argument.name)ScopeTree.setReturnFunction(node.argument.name);
			}
		},
		leave: function(node, parent){
			//console.log('leave===');
			//console.log(node);
			//print(ScopeTree.getCurrentScope());
			//console.log('========');
			//console.log();
			if(node.type == Syntax.ReturnStatement){
				if(node.argument && node.argument.type == Syntax.FunctionExpression)ScopeTree.setReturnFunction(poppedScope);
			}
			if(node.type == Syntax.FunctionDeclaration){
				poppedScope = ScopeTree.popScope();
				ScopeTree.setCurrentScope(scopeList.pop());
			}
			else if(node.type == Syntax.FunctionExpression && parent.type != Syntax.LogicalExpression){
				if(parent.id)poppedScope = ScopeTree.popScope();
				else if(parent.left){
					var name = (getName(parent.left)).split('.');
					if(name[0] == "this")poppedScope = ScopeTree.popScope();
					else{ 
						for(var _name = (name[0] == 'window' ? 1 : 0); _name < name.length; _name++){
							poppedScope = ScopeTree.popScope();
						}
					}
					//ScopeTree.pushScope(getName(parent.left));
				}
				else if(parent.key)poppedScope = ScopeTree.popScope();
				else{
					poppedScope = ScopeTree.popScope();
				}
				ScopeTree.setCurrentScope(scopeList.pop());
			}
			//if(node.type == Syntax.FunctionDeclaration || node.type == Syntax.FunctionExpression){
			//	poppedScope = ScopeTree.popScope();
			//}
			else if(node.type == Syntax.ObjectExpression && parent.type != Syntax.LogicalExpression){
				if(parent.id)poppedScope = ScopeTree.popScope();
				else if(parent.left){
					var name = getName(parent.left).split('.');
					if(name[0] == "this")poppedScope = ScopeTree.popScope();
					else{
						for(var i = (name[0] == 'window' ? 1 : 0); i < name.length; i++){
							poppedScope = ScopeTree.popScope();
						}
					}
				}
				else{
					poppedScope = ScopeTree.popScope();
				}
				ScopeTree.setCurrentScope(scopeList.pop());
			}
		}
	});
	anonymous = 0;

	estraverse.traverse(ast, {
		enter: function(node, parent){
			if(node.type == Syntax.CallExpression && builtInList.includes(getName(node.callee).split('.')[0]))this.skip();
			if(node.type == Syntax.AssignmentExpression){
				if(builtInList.includes(getName(node.left).split('.')[0])){
					this.skip();
				}
			}
			if(node.type == Syntax.FunctionDeclaration){
				scopeList.push(ScopeTree.getCurrentScope());
				ScopeTree.pushScope(node.id.name);
			}
			else if(node.type == Syntax.FunctionExpression && parent.type != Syntax.LogicalExpression){
				scopeList.push(ScopeTree.getCurrentScope());
				if(parent.id)ScopeTree.pushScope(getName(parent.id));
				else if(parent.left){
					var thisList = []
					for(var temp = ScopeTree.getCurrentScope(); temp; temp = temp.parent){
						thisList = thisList.concat(temp.thisList);
					}
					var name = (getName(parent.left)).split('.');
					if(thisList.includes(name[0]))ScopeTree.pushScope(name.join('.'));
					else{ 
						if(name[0] == 'window')ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]));
						else ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]).val[name[0]]);
						for(var _name = 1; _name < name.length; _name++){
							ScopeTree.pushScope(name[_name]);
						}
					}
					//ScopeTree.pushScope(getName(parent.left));
				}
				else if(parent.key)ScopeTree.pushScope(getName(parent.key));
				else{
					ScopeTree.pushScope(anonymous++);
				}
				//if(parent.id)ScopeTree.pushScope(getName(parent.id));
				//else if(parent.key)ScopeTree.pushScope(getName(parent.key));
				//else{
				//	ScopeTree.pushScope(anonymous++);
				//}
			}
			else if(node.type == Syntax.ObjectExpression && parent.type != Syntax.LogicalExpression){
				scopeList.push(ScopeTree.getCurrentScope());
				if(parent.id)ScopeTree.pushScope(getName(parent.id));
				else if(parent.left){
					var thisList = []
					for(var temp = ScopeTree.getCurrentScope(); temp; temp = temp.parent){
						thisList = thisList.concat(temp.thisList);
					}
					var name = getName(parent.left).split('.');
					if(thisList.includes(name[0]))ScopeTree.pushScope(name.join('.'));
					else{
						if(name[0] == 'window')ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]));
						else ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]).val[name[0]]);
						for(var i = 1; i < name.length; i++){
							ScopeTree.pushScope(name[i]);
						}
					}
				}
				else{
					ScopeTree.pushScope(anonymous++);
				}
			}
			if(node.type == Syntax.CallExpression){
				var evtList = ["setTimeout", "addEventListener", "attachEvent", "onclick", "onchange", "onmouseover", "onmouseout", "onkeydown", "onload", "setInterval"];
				if(node.callee.type == Syntax.Identifier && evtList.indexOf(node.callee.name) > -1){
					var args = node.arguments;
					for(var arg = 0; arg < args.length; arg++){
						if(args[arg].type == Syntax.Identifier){
							ScopeTree.setEventHandler(args[arg].name);
						}
					}
				}
				else if(node.callee.type == Syntax.MemberExpression && evtList.indexOf(node.callee.property.name) > -1){
					var args = node.arguments;
					for(var arg = 0; arg < args.length; arg++){
						if(args[arg].type == Syntax.Identifier){
							ScopeTree.setEventHandler(args[arg].name);
						}
					}
				}
			}
			if(node.type == Syntax.Identifier && parent.type != Syntax.FunctionDeclaration){
				ScopeTree.accessVar(node.name, true);
			}
		},
		leave: function(node, parent){
			if(node.type == Syntax.FunctionDeclaration){
				poppedScope = ScopeTree.popScope();
				ScopeTree.setCurrentScope(scopeList.pop());
			}
			else if(node.type == Syntax.FunctionExpression && parent.type != Syntax.LogicalExpression){
				if(parent.id)poppedScope = ScopeTree.popScope();
				else if(parent.left){
					var name = (getName(parent.left)).split('.');
					if(name[0] == "this")poppedScope = ScopeTree.popScope();
					else{ 
						for(var _name = (name[0] == 'window' ? 1 : 0); _name < name.length; _name++){
							poppedScope = ScopeTree.popScope();
						}
					}
					//ScopeTree.pushScope(getName(parent.left));
				}
				else if(parent.key)poppedScope = ScopeTree.popScope();
				else{
					poppedScope = ScopeTree.popScope();
				}
				ScopeTree.setCurrentScope(scopeList.pop());
			}
			//if(node.type == Syntax.FunctionDeclaration || node.type == Syntax.FunctionExpression){
			//	poppedScope = ScopeTree.popScope();
			//}
			else if(node.type == Syntax.ObjectExpression && parent.type != Syntax.LogicalExpression){
				if(parent.id)poppedScope = ScopeTree.popScope();
				else if(parent.left){
					var name = getName(parent.left).split('.');
					if(name[0] == "this")poppedScope = ScopeTree.popScope();
					else{
						for(var i = (name[0] == 'window' ? 1 : 0); i < name.length; i++){
							poppedScope = ScopeTree.popScope();
						}
					}
				}
				else{
					poppedScope = ScopeTree.popScope();
				}
				ScopeTree.setCurrentScope(scopeList.pop());
			}
		}
	});

	function createFSM(){
		var currentDepth = ScopeTree.getCurrentScope().depth;
		return new VariableDeclaration(
				[new VariableDeclarator(
					new Identifier(
						"$fsm" + currentDepth
						),
					new CallExpression(
						new MemberExpression(
							false,
							new Identifier(
								"$fsm"
								),
							new Identifier(
								"create"
								)
							),
						[
						new Identifier(
							"arguments"
							)
						]
						)
					)],
					'var'
						);
	}
	anonymous = 0;

	var fsm_access_indices = [];

	estraverse.replace(ast, {
		enter: function (node, parent) {
			if(node.type == Syntax.CallExpression && builtInList.includes(getName(node.callee).split('.')[0])){
				for(var i = 0; i < node.arguments.length; i++){
					estraverse.replace(node, {
						enter: function(node, parent){
						},
						leave: function(node, parent){
							if(node.type == Syntax.Identifier){
								var scope_of_id = ScopeTree.accessVar(node.name);
								if(parent.type == Syntax.MemberExpression && parent.object == node){
									if(scope_of_id && scope_of_id.isClosure && !(parent.type == Syntax.MemberExpression && parent.object.type == Syntax.ThisExpression) && parent.type != Syntax.FunctionDeclaration && parent.type != Syntax.FunctionExpression){
										if(parent.type != Syntax.FunctionDeclaration){
											if(!(fsm_access_indices.includes(scope_of_id.depth)))fsm_access_indices.push(scope_of_id.depth);
											return new MemberExpression(
													false,
													new Identifier(
														"$fsm" + scope_of_id.depth
														),
													node
													);
										}
									}
								}
								else if(parent.type != Syntax.MemberExpression || (parent.type == Syntax.MemberExpression && parent.property == node && parent.computed == true)){
									if(scope_of_id && scope_of_id.isClosure && !(parent.type == Syntax.MemberExpression && parent.object.type == Syntax.ThisExpression) && parent.type != Syntax.FunctionDeclaration && parent.type != Syntax.FunctionExpression){
										if(parent.type != Syntax.FunctionDeclaration){
											if(!(fsm_access_indices.includes(scope_of_id.depth)))fsm_access_indices.push(scope_of_id.depth);
											return new MemberExpression(
													false,
													new Identifier(
														"$fsm" + scope_of_id.depth
														),
													node
													);
										}
									}
								}
							}
						}
					});
				}
				this.skip();
			}
			if(node.type == Syntax.AssignmentExpression){
				if(builtInList.includes(getName(node.left).split('.')[0])){
					this.skip();
				}
			}
			if(node.type == Syntax.FunctionDeclaration){
				scopeList.push(ScopeTree.getCurrentScope());
				ScopeTree.pushScope(node.id.name);
			}
			else if(node.type == Syntax.FunctionExpression && parent.type != Syntax.LogicalExpression){
				scopeList.push(ScopeTree.getCurrentScope());
				if(parent.id){
					if(parent.id.type == Syntax.MemberExpression)ScopeTree.pushScope(getName(parent.id.property))
					else ScopeTree.pushScope(getName(parent.id));
				}
				else if(parent.left){
					var thisList = []
					for(var temp = ScopeTree.getCurrentScope(); temp; temp = temp.parent){
						thisList = thisList.concat(temp.thisList);
					}
					var name = (getName(parent.left)).split('.');
					if(name[0].startsWith("$fsm"))name = name.slice(1);
					if(thisList.includes(name[0]))ScopeTree.pushScope(name.join('.'));
					else{ 
						if(name[0] == 'window')ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]));
						else ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]).val[name[0]]);
						for(var _name = 1; _name < name.length; _name++){
							ScopeTree.pushScope(name[_name]);
						}
					}
					//ScopeTree.pushScope(getName(parent.left));
				}
				else if(parent.key){
					if(parent.key.type == Syntax.MemberExpression)ScopeTree.pushScope(getName(parent.key.property));
					else ScopeTree.pushScope(getName(parent.key));
				}
				else{
					ScopeTree.pushScope(anonymous++);
				}

				//if(parent.id){
				//	if(parent.id.type == Syntax.MemberExpression)ScopeTree.pushScope(getName(parent.id.property))
				//	else ScopeTree.pushScope(getName(parent.id));
				//}
				//else if(parent.key){
				//	if(parent.key.type == Syntax.MemberExpression)ScopeTree.pushScope(getName(parent.key.property));
				//	else ScopeTree.pushScope(getName(parent.key));
				//}
				//else{
				//	ScopeTree.pushScope(anonymous++);
				//}
			}
			else if(node.type == Syntax.ObjectExpression && parent.type != Syntax.LogicalExpression){
				scopeList.push(ScopeTree.getCurrentScope());
				if(parent.id){
					if(parent.id.type == Syntax.MemberExpression)ScopeTree.pushScope(getName(parent.id.property));
					else ScopeTree.pushScope(getName(parent.id));
				}
				else if(parent.left){
					var thisList = []
					for(var temp = ScopeTree.getCurrentScope(); temp; temp = temp.parent){
						thisList = thisList.concat(temp.thisList);
					}
					var name = getName(parent.left).split('.');
					if(name[0].startsWith("$fsm"))name = name.slice(1);
					if(thisList.includes(name[0]))ScopeTree.pushScope(name.join('.'));
					else{
						if(name[0] == 'window')ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]));
						else ScopeTree.setCurrentScope(ScopeTree.findVarScope(name[0]).val[name[0]]);
						for(var i = 1; i < name.length; i++){
							ScopeTree.pushScope(name[i]);
						}
					}
				}
				else{
					ScopeTree.pushScope(anonymous++);
				}
			}
			//if(node.type == Syntax.FunctionDeclaration){
			//	ScopeTree.pushScope(node.id.name);
			//}
			//else if(node.type == Syntax.FunctionExpression || (node.type == Syntax.ObjectExpression && parent.type != Syntax.CallExpression)){
			//	if(parent.id){
			//		if(parent.id.name)ScopeTree.pushScope(parent.id.name);
			//		else ScopeTree.pushScope(parent.id.property.name);
			//	}
			//	else if(parent.key){
			//		if(parent.key.name)ScopeTree.pushScope(parent.key.name);
			//		else ScopeTree.pushScope(parent.key.property.name);
			//	}
			//	else ScopeTree.pushScope(anonymous++);
			//}
		},
		leave: function(node, parent) {
			if(node.type == Syntax.FunctionDeclaration || node.type == Syntax.FunctionExpression || (node.type == Syntax.ObjectExpression)){
				if(node.type != Syntax.ObjectExpression && ScopeTree.getCurrentScope().isClosure){
					for(var param = node.params.length - 1; param > -1; param--){
						node.body.body.unshift(
								new ExpressionStatement(
									new AssignmentExpression(
										"=",
										new MemberExpression(
											false,
											new Identifier("$fsm" + ScopeTree.getCurrentScope().depth),
											node.params[param]
											),
										node.params[param]
										)
									)
								);
					}
					for(var index = 0; index < fsm_access_indices.length; index++){
						node.body.body.unshift(
								new ExpressionStatement(
									new AssignmentExpression(
										"=",
										new MemberExpression(
											false,
											new MemberExpression(
												false,
												new Identifier("$fsm" + ScopeTree.getCurrentScope().depth),
												new Identifier("$scopes")
											),
											new Identifier("$fsm" + fsm_access_indices[index])
										),
										new MemberExpression(
											false,
											new Identifier("$fsm" + fsm_access_indices[index]),
											new Identifier("$ref_index")
										)
									)
								)
							);
					}
					node.body.body.unshift(
							new ExpressionStatement(
								new AssignmentExpression(
									"=",
									new MemberExpression(
										false,
										new ThisExpression(),
										new Identifier("$fsm_index")
									),
									new ArrayExpression(
										[
										new Literal(ScopeTree.getCurrentScope().depth),
										new MemberExpression(
											false,
											new Identifier("$fsm" + ScopeTree.getCurrentScope().depth),
											new Identifier("$ref_index")
											)
										]
										)
									)
								)
							);
					node.body.body.unshift(createFSM());
					fsm_access_indices = [];
				}
				//poppedScope = ScopeTree.popScope();
				//if(node.type == Syntax.FunctionDeclaration || node.type == Syntax.FunctionExpression){
				//	poppedScope = ScopeTree.popScope();
				//}
				if(node.type == Syntax.FunctionDeclaration){
					poppedScope = ScopeTree.popScope();
					ScopeTree.setCurrentScope(scopeList.pop());
				}
				else if(node.type == Syntax.FunctionExpression && parent.type != Syntax.LogicalExpression){
					if(parent.id)poppedScope = ScopeTree.popScope();
					else if(parent.left){
						var name = (getName(parent.left)).split('.');
						if(name[0] == "this")poppedScope = ScopeTree.popScope();
						else{ 
							for(var _name = (name[0] == 'window' ? 1 : 0); _name < name.length; _name++){
								poppedScope = ScopeTree.popScope();
							}
						}
						//ScopeTree.pushScope(getName(parent.left));
					}
					else if(parent.key)poppedScope = ScopeTree.popScope();
					else{
						poppedScope = ScopeTree.popScope();
					}
					ScopeTree.setCurrentScope(scopeList.pop());
				}
				else if(node.type == Syntax.ObjectExpression && parent.type != Syntax.LogicalExpression){
					if(parent.id)poppedScope = ScopeTree.popScope();
					else if(parent.left){
						var name = getName(parent.left).split('.');
						if(name[0] == "this")poppedScope = ScopeTree.popScope();
						else{
							for(var i = (name[0] == 'window' ? 1 : 0); i < name.length; i++){
								poppedScope = ScopeTree.popScope();
							}
						}
					}
					else{
						poppedScope = ScopeTree.popScope();
					}
					ScopeTree.setCurrentScope(scopeList.pop());
				}
			}
			if(node.type == Syntax.FunctionDeclaration){
				var scope_of_func = ScopeTree.accessVar(node.id.name);
				if(scope_of_func && scope_of_func.isClosure){
					if(!(fsm_access_indices.includes(scope_of_func.depth)))fsm_access_indices.push(scope_of_func.depth);
					return new ExpressionStatement(
							new AssignmentExpression(
								"=",
								new MemberExpression(
									false,
									new Identifier(
										"$fsm" + scope_of_func.depth
										),
									new Identifier(
										node.id.name
										)
									),
								new FunctionExpression(
									node.id,
									node.params,
									node.body,
									node.generator,
									node.expression,
									node.async
									)
								)
							);
				}
			}
			if(node.type == Syntax.VariableDeclaration){
				if(ScopeTree.getCurrentScope().isClosure){
					var decl_list = [];
					for(var decl = 0; decl < node.declarations.length; decl++){
						if(parent.type == Syntax.ForInStatement){
							decl_list.push(
									node.declarations[decl].id
									);
							continue;
						}
						decl_list.push(
								new AssignmentExpression(
									"=",
									node.declarations[decl].id,
									(node.declarations[decl].init ? node.declarations[decl].init : new Identifier("undefined"))
									)
								);
					}
					if(parent.type == Syntax.ForStatement || parent.type == Syntax.ForInStatement)return new SequenceExpression(decl_list);
					return new ExpressionStatement(
							new SequenceExpression(decl_list)
							);
				}
			}
			if(node.type == Syntax.Identifier && (parent.type != Syntax.Property || (parent.type == Syntax.Property && parent.key != node))){
				//var evtList = ["setTimeout", "addEventListener", "attachEvent", "onclick", "onchange", "onmouseover", "onmouseout", "onkeydown", "onload", "setInterval"];
				//if(evtList.includes(node.name))node.name = "fsm_" + node.name;
				var scope_of_id = ScopeTree.accessVar(node.name);
				var thisList = [];
				var thisDepth = [];
				var isClosureList = [];
				for(var temp = ScopeTree.getCurrentScope(); temp; temp = temp.parent){
					thisList = thisList.concat(temp.thisList);
					var temp_depth = new Array(temp.thisList.length);
					temp_depth.fill(temp.depth);
					thisDepth = thisDepth.concat(temp_depth);
					var temp_closure = new Array(temp.thisList.length);
					temp_closure.fill(temp.isClosure);
					isClosureList = isClosureList.concat(temp_closure);
				}
				var thisIndex = thisList.indexOf(node.name);
				if(thisIndex > -1 && isClosureList[thisIndex]){
					return new MemberExpression(
							false,
							new Identifier(
								"$fsm" + thisDepth[thisIndex]
								),
							node);
				}
				if(parent.type == Syntax.MemberExpression && parent.object == node){
					if(scope_of_id && scope_of_id.isClosure && !(parent.type == Syntax.MemberExpression && parent.object.type == Syntax.ThisExpression) && parent.type != Syntax.FunctionDeclaration && parent.type != Syntax.FunctionExpression){
						if(parent.type != Syntax.FunctionDeclaration){
							if(!(fsm_access_indices.includes(scope_of_id.depth)))fsm_access_indices.push(scope_of_id.depth);
							return new MemberExpression(
									false,
									new Identifier(
										"$fsm" + scope_of_id.depth
										),
									node
									);
						}
					}
				}
				//}
				//else if(parent.type == Syntax.CallExpression){
				else if(parent.type != Syntax.MemberExpression || (parent.type == Syntax.MemberExpression && parent.property == node && parent.computed == true)){
					if(scope_of_id && scope_of_id.isClosure && !(parent.type == Syntax.MemberExpression && parent.object.type == Syntax.ThisExpression) && parent.type != Syntax.FunctionDeclaration && parent.type != Syntax.FunctionExpression){
						if(parent.type != Syntax.FunctionDeclaration){
							if(!(fsm_access_indices.includes(scope_of_id.depth)))fsm_access_indices.push(scope_of_id.depth);
							return new MemberExpression(
									false,
									new Identifier(
										"$fsm" + scope_of_id.depth
										),
									node
									);
						}
					}
				}
				//else if(scope_of_id && scope_of_id.isClosure){
				//	if(scope_of_id && scope_of_id.isClosure && !(parent.type == Syntax.MemberExpression && parent.object.type == Syntax.ThisExpression) && parent.type != Syntax.FunctionDeclaration && parent.type != Syntax.FunctionExpression){
				//		if(!(fsm_access_indices.includes(scope_of_id.depth)))fsm_access_indices.push(scope_of_id.depth);
				//		return new MemberExpression(
				//				false,
				//				new Identifier(
				//					"$fsm" + scope_of_id.depth
				//					),
				//				node
				//				);
				//	}
				//}
			}
			if(node.type == Syntax.CallExpression){
				var evtList = ["setTimeout", "addEventListener", "attachEvent", "onclick", "onchange", "onmouseover", "onmouseout", "onkeydown", "onload", "setInterval"];
				if(node.callee.type == Syntax.Identifier && evtList.includes(node.callee.name)){
					node.callee.name = "fsm_" + node.callee.name;
					var args = node.arguments;
					var fsm_index = new Identifier("undefined");
					for(var arg = 0; arg < args.length; arg++){
						if(args[arg].type == Syntax.FunctionExpression){
							var temp = args[arg];
							var names = [];
							estraverse.traverse(temp, {
								enter: function(node, parent){
									if(node.type == Syntax.Identifier){
										var matched = node.name.match(/\$fsm[0-9]+/);
										if(matched && !names.includes(matched[0])){
											var num = matched[0].slice(4);
											names.push(
													new ArrayExpression(
														[
														new Literal(
															parseInt(num)
														),
														new MemberExpression(
															false,
															new Identifier(matched[0]),
															new Identifier("$ref_index")
															)
														]
														)
												);
										}
									}
								},
								leave: function(node, parent){
								}
							});
							fsm_index = new ArrayExpression(names);
						}
						if(args[arg].type == Syntax.MemberExpression){
							var temp = args[arg];
							while(temp){
								if(temp.type == Syntax.Identifier && temp.name.startsWith("$fsm")){
									fsm_index = new MemberExpression(
											false,
											temp,
											new Identifier("$ref_index")
									);
									break;
								}
								temp = temp.object;
							}
							if(fsm_index.type == Syntax.MemberExpression)break;
						}
					}
					args.unshift(fsm_index);
				}
				else if(node.callee.type == Syntax.Identifier){
					var scope_of_id = ScopeTree.accessVar(node.callee.name);
					if(scope_of_id && scope_of_id.isClosure){
						return new CallExpression(
								new MemberExpression(
									false,
									new Identifier(
										"$fsm" + scope_of_id.depth
										),
									node.callee
									),
								node.arguments
								);
					}
				}
				else if(node.callee.type == Syntax.MemberExpression && evtList.includes(node.callee.property.name)){
					node.callee.property.name = "fsm_" + node.callee.property.name;
					var args = node.arguments;
					var fsm_index = new Identifier("undefined");
					for(var arg = 0; arg < args.length; arg++){
						if(args[arg].type == Syntax.FunctionExpression){
							var temp = args[arg];
							var names = [];
							var removeList = [];
							estraverse.traverse(temp, {
								enter: function(node, parent){
									if(node.type == Syntax.Identifier){
										var matched = node.name.match(/\$fsm[0-9]+/);
										if(matched && !names.includes(matched[0])){
											var num = matched[0].slice(4);
											if(parent.type == Syntax.VariableDeclarator && parent.init && parent.init.type == Syntax.CallExpression && parent.init.callee.type == Syntax.MemberExpression && parent.init.callee.property.name == 'create'){
												removeList.push(num);
											}
											else{
												if(!removeList.includes(num)){
													for(var index = 0; index < names.length; index++){
														if(names[index].elements[0].value == num)break;
													}
													if(index >= names.length){
														names.push(
																new ArrayExpression(
																	[
																	new Literal(
																		parseInt(num)
																		),
																	new MemberExpression(
																		false,
																		new Identifier(matched[0]),
																		new Identifier("$ref_index")
																		)
																	]
																	)
																);
													}
												}
											}
										}
									}
								},
								leave: function(node, parent){
								}
							});
							fsm_index = new ArrayExpression(names);
						}
						if(args[arg].type == Syntax.MemberExpression){
							var temp = args[arg];
							while(temp){
								if(temp.type == Syntax.Identifier && temp.name.startsWith("$fsm")){
									fsm_index = new MemberExpression(
											false,
											temp,
											new Identifier("$ref_index")
									);
									break;
								}
								temp = temp.object;
							}
							if(fsm_index.type == Syntax.MemberExpression)break;
						}
					}
					args.unshift(fsm_index);
				}
			}
			
			if(node.type == Syntax.ReturnStatement && node.argument){
				var arg = node.argument, name = getName(node.argument);
				var _name = name.split('.')[0].match(/\$fsm[0-9]+/);
				if(node.argument.type == Syntax.FunctionExpression)_name = ["$fsm" + ScopeTree.getCurrentScope().depth];
				if(_name && _name[0] == ("$fsm" + ScopeTree.getCurrentScope().depth)){
					ScopeTree.getCurrentScope().isClosure = true;
					return new ReturnStatement(
							new AssignmentExpression(
								"=",
								new MemberExpression(
									false,
									new Identifier(_name[0]),
									new Identifier("$ret_func")
									),
								arg
								)
							);
				}
			}
		}
	});
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

function StaticMemberExpression(computed, object, property) {
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

function FunctionExpression(id, params, body, generator, expression, async){
	this.type = Syntax.FunctionExpression;
	this.id = id;
	this.params = params;
	this.body = body;
	this.generator = generator;
	this.expression = expression;
	this.async = async;
}

function ReturnStatement(argument){
	this.type = Syntax.ReturnStatement;
	this.argument = argument;
}

function CallExpression(callee, arguments){
	this.type = Syntax.CallExpression;
	this.callee = callee;
	this.arguments = arguments;
}

function SequenceExpression(expressions){
	this.type = Syntax.SequenceExpression;
	this.expressions = expressions;
}

function ThisExpression(){
	this.type = Syntax.ThisExpression;
}

function ArrayExpression(elements){
	this.type = Syntax.ArrayExpression;
	this.elements = elements;
}

function Literal(value){
	this.type = Syntax.Literal;
	this.value = value;
	this.raw = value.toString();
}
