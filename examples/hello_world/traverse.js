// Install a key-input handler to hibernate the web page.
document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.keyCode===77) { // '77' stands for the 'm' key
        // TODO: The prefix for the output files is always "sample". We can use an uni-directional hash function for the given URL.
//        __Hibernation__.SaveState( "sample" ); 
//        __Hibernation__.wsFlag = false;
//        __Hibernation__.Execute( __Hibernation__.SaveState, "SaveState", "sample" ); 
		  __Hibernation__.serialize();
    } }, false);

window.addEventListener("load", function() {
	__Hibernation__.traverse();
}, false);

__Hibernation__.initialSet = {
	reference: new Array(),
	copiedObject: new Array(),
	path: new Array(),
	restorationCode: new Array(),
	checked: new Array(),
	type: new Array()  // "object" || "array" || "function" || "scope"
};

__Hibernation__.currentSet = new Array();

__Hibernation__.createdSet = {
	reference: new Array(),
	restorationCode: new Array(),
	type: new Array(),
	depList: new Array(),
	childList: new Array(),
	deepChildList: new Array()
};

// this is for global scope. '0' index of createdSet represents the global scope
__Hibernation__.createdSet.reference.push(window);
__Hibernation__.createdSet.restorationCode.push("");
__Hibernation__.createdSet.type.push("scope");
__Hibernation__.createdSet.depList.push(new Array());
__Hibernation__.createdSet.childList.push(new Array());
__Hibernation__.createdSet.deepChildList.push(new Array());

__Hibernation__.profile = {
	saveTime: 0,
	arraySearchTime: 0,
	initialChanged: 0,
	initialSize: 0,
	initialChangedSize: 0,
	createdSize: 0
};

__Hibernation__.report = function() {
	console.log("Array Search time: " + __Hibernation__.profile.arraySearchTime + " ms");
	console.log("Total Initial Objects [" + __Hibernation__.initialSet.reference.length + "]");
	console.log("Initial Objects Changed [" + __Hibernation__.profile.initialChanged + "]");
	console.log("Objects Created [" + __Hibernation__.createdSet.reference.length + "]");
	console.log("Total Initial Objects Size [" + __Hibernation__.profile.initialSize + "]");
	console.log("Initial Objects Changed Size [" + __Hibernation__.profile.initialChangedSize + "]");
	console.log("Objects Created Size [" + __Hibernation__.profile.createdSize + "]");
}

__Hibernation__.skipProps = function (current) {
	var skipProps = undefined;
	if ((current instanceof MimeTypeArray) ||
	    (current instanceof Plugin) ||
		(current instanceof PluginArray)) {
		skipProps = new Array();
		for (var i = 0, len = current.length; i < len; i++) {
			// push integers that are converted to string
			skipProps.push(i + "");
		}
	}
	else if (current instanceof Function) {
		skipProps = new Array();
		skipProps.push("arguments");
		skipProps.push("caller");
		skipProps.push("length");
		skipProps.push("name");
	}
	else if (current instanceof Location) {
		skipProps = new Array();
		skipProps.push("ancestorOrigins");
	}
	else if (current instanceof Performance) {
		skipProps = new Array();
		skipProps.push("memory");
	}
	else if (current instanceof CSSStyleSheet) {
		skipProps = new Array();
		skipProps.push("rules");
	}
	else if (current === window.console) {
		skipProps = new Array();
		skipProps.push("profiles");
		skipProps.push("memory");
	}
	else if (current === window.document) {
		skipProps = new Array();
		skipProps.push("all");
		skipProps.push("scripts");
		skipProps.push("activeElement");
	}
	else if (current === window) {
		skipProps = new Array();
		skipProps.push("__Hibernation__");
	}
	return skipProps;
}

__Hibernation__.checkString = function(val) {
	if (typeof val  === "string") {
		return "\"" + val + "\"";
	}
	return val;
}

__Hibernation__.getScopeChain = function(func) {
	var scopeDepth = func.__getScopeDepth__();
	var scopeChain = new Array();
	for (var i = 0; i < scopeDepth; i++) {
		scopeChain.push(func.__getScopeObject__(i));
	}
	return scopeChain;
}

__Hibernation__.searchPush = function(arr, element) {
	if (arr.indexOf(element) === -1) {
		arr.push(element);
	}
}

__Hibernation__.isDOMObject = function(obj) {
	return ( obj.nodeType !== undefined && obj.cloneNode !== undefined );
}

__Hibernation__.initialTraverse = function (current, path) {
	if (__Hibernation__.initialSet.reference.indexOf(current) !== -1) {
		return;
	}

	if (__Hibernation__.isDOMObject(current)) {
		return;
	}

	// Step 1: push current reference
	__Hibernation__.initialSet.reference.push(current);
	__Hibernation__.initialSet.restorationCode.push(new Array());
		
	// Step 2: duplicate current object
	var copiedObject = new Object();

	// even though the object is empty, we push it now because this ensures the object order
	__Hibernation__.initialSet.copiedObject.push(copiedObject);

	// Step 3: copy path
	__Hibernation__.initialSet.path.push(path.slice(0));

	// Step 4: set checked as false
	__Hibernation__.initialSet.checked.push(false);

	// Step 5-1: if it is a function object, then traverse its scope chain
	if (current instanceof Function) {
		__Hibernation__.initialSet.type.push("function");

		var scopeChain = __Hibernation__.getScopeChain(current);

		for (var i = 0, len = scopeChain.length; i < len; i++) {
			path.push("__getScopeObject__(" + i + ")");
			__Hibernation__.initialTraverse(scopeChain[i], path);
			path.pop();
		}
	}
	else if (current instanceof Array) {
		__Hibernation__.initialSet.type.push("array");
	}
	else if (current instanceof Object) {
		__Hibernation__.initialSet.type.push("object");
	}
	else {   // else means that this is scope object (scope is not instanceof Object)
		__Hibernation__.initialSet.type.push("scope");
	}

	// Step 5-2: traverse child objects
	var prop = Object.getOwnPropertyNames(current);

	var skipProps = __Hibernation__.skipProps(current);

	for (var i = 0, len = prop.length; i < len; i++) {
		var val = prop[i];

		if ((skipProps) && (skipProps.indexOf(val) !== -1)) {
			continue;
		}

		// copy each variables
		copiedObject[val] = current[val];

		// traverse Object|Function|Array objects
		if (current[val] instanceof Object) {
			path.push(val);
			__Hibernation__.initialTraverse(current[val], path);
			path.pop();
		}
	};
}

__Hibernation__.serializeScope = function (scope, funcIndex, depList, direct, idxOfChildScope) {
	var tic = new Date().getTime();
	var idxOfScope = __Hibernation__.createdSet.reference.indexOf(scope);
	__Hibernation__.profile.arraySearchTime += new Date().getTime() - tic;
	// if idx is found, then it means that it is already handled before
	// Therefore, we only need to update child and dep info
	if (idxOfScope !== -1) {
		var free = false;
		
		var prop = Object.getOwnPropertyNames(scope);

		for (var i = 0; i < prop.length; i++) {
			if (scope[prop[i]] === __Hibernation__.createdSet.reference[funcIndex]) {
				free = true;
			}
		}

		// save only if the function is direct child and is not free variable in this scope
		if ((direct) && !(free)) {
			__Hibernation__.searchPush(__Hibernation__.createdSet.childList[idxOfScope], funcIndex);
		}
		if (idxOfChildScope !== -1) {
			__Hibernation__.searchPush(__Hibernation__.createdSet.childList[idxOfScope], idxOfChildScope);
		}
		__Hibernation__.searchPush(__Hibernation__.createdSet.deepChildList[idxOfScope], funcIndex);

		for (var i = 0; i < depList.length; i++) {
			__Hibernation__.searchPush(__Hibernation__.createdSet.depList[idxOfScope], depList[i]);
		}
		return idxOfScope;
	}

	// insert and initialize the scope in the createdSet
	idxOfScope = __Hibernation__.createdSet.reference.push(scope) - 1;
	             __Hibernation__.createdSet.restorationCode.push(new Array());
	             __Hibernation__.createdSet.type.push("scope");
	             __Hibernation__.createdSet.depList[idxOfScope] = depList.slice(0);
	             __Hibernation__.createdSet.childList[idxOfScope] = new Array();
	             __Hibernation__.createdSet.deepChildList[idxOfScope] = new Array();
	
	// properties are free variables in this scope 
	var prop = Object.getOwnPropertyNames(scope);

	// update childList, deepChildList
	for (var i = 0; i < prop.length; i++) {
		if (scope[prop[i]] === __Hibernation__.createdSet.reference[funcIndex]) {
			free = true;
		}
	}

	// save only if the function is direct child and is not free variable in this scope
	if ((direct) && !(free)) {
		__Hibernation__.searchPush(__Hibernation__.createdSet.childList[idxOfScope], funcIndex);
	}
	if (idxOfChildScope !== -1) {
		__Hibernation__.searchPush(__Hibernation__.createdSet.childList[idxOfScope], idxOfChildScope);
	}
	__Hibernation__.searchPush(__Hibernation__.createdSet.deepChildList[idxOfScope], funcIndex);
	
	for (var i = 0, len = prop.length; i < len; i++) {
		var val = prop[i];

		if (val === "arguments") {
			continue;
		}

		if (scope[val] instanceof Object) {
	var tic = new Date().getTime();
			var idxOfInitialSet = __Hibernation__.initialSet.reference.indexOf(scope[val]);
	__Hibernation__.profile.arraySearchTime += new Date().getTime() - tic;
			// not in the initial set
			if (idxOfInitialSet === -1) {
	var tic = new Date().getTime();
				var idxOfCreatedSet = __Hibernation__.createdSet.reference.indexOf(scope[val]);
	__Hibernation__.profile.arraySearchTime += new Date().getTime() - tic;
				// not in the scope created set
				if (idxOfCreatedSet === -1) {
					// push and set index number
					idxOfCreatedSet = __Hibernation__.createdSet.reference.push(scope[val]) - 1;
									  __Hibernation__.createdSet.restorationCode.push(new Array());
					if (scope[val] instanceof Function) {
									  __Hibernation__.createdSet.type.push("function");
					}
					else if (scope[val] instanceof Array) {
									  __Hibernation__.createdSet.type.push("array");
					}
					else {
									  __Hibernation__.createdSet.type.push("object");
					}
				}
				// check if this variable is actually a function defined in this scope
				if ((scope[val] instanceof Function) && (scope === scope[val].__getScopeObject__(0))) {
					__Hibernation__.createdSet.restorationCode[idxOfScope].push("var " + val + " = __Hibernation__.cObj[" + idxOfCreatedSet + "] = " + scope[val].toString() + ";\n");
				}
				else {
					__Hibernation__.createdSet.restorationCode[idxOfScope].push("var " + val + " = __Hibernation__.cObj[" + idxOfCreatedSet + "];\n");
				}
			}
			else {    // exists in the initial set
				__Hibernation__.createdSet.restorationCode[idxOfScope].push("var " + val + " = " + __Hibernation__.initialSet.path[idxOfInitialSet].join('.') + ";\n");
			}
		}
		else {
			var checkedString = __Hibernation__.checkString(scope[val]);
			__Hibernation__.createdSet.restorationCode[idxOfScope].push("var " + val + " = " + checkedString + ";\n");
		}

		if (scope[val] instanceof Object) {
			var depNumber = __Hibernation__.serializeTraverse(scope[val]);
			if (depNumber != -1) {
				__Hibernation__.searchPush(__Hibernation__.createdSet.depList[idxOfScope], depNumber);
			}
		}
	}

	return idxOfScope;
}

__Hibernation__.serializeTraverse = function (current) {
	// First, check if the traverse is not duplicated
	if (__Hibernation__.currentSet.indexOf(current) !== -1) {
		if (current instanceof Function) {
			return __Hibernation__.createdSet.reference.indexOf(current);
		}
		else {
			return -1;
		}
	}

	if (__Hibernation__.isDOMObject(current)) {
		return -1;
	}

	// push current reference
	__Hibernation__.currentSet.push(current);
		
	// check if the reference of current object exists in the initial set
	var tic = new Date().getTime();
	var idxOfInitialReference = __Hibernation__.initialSet.reference.indexOf(current);
	__Hibernation__.profile.arraySearchTime += new Date().getTime() - tic;

	// we check if current object is a special object that needs a care
	var skipProps = __Hibernation__.skipProps(current);

	// if found, we mark it and find the copied object
	var copiedObject = undefined;
	var copiedProp = undefined;
	var idxOfReference = undefined;
	var initialOrCreatedSet = undefined;
	var currentPath = "";

	// if it is in the initial set, we prepare for comparison
	if (idxOfInitialReference !== -1) {
		__Hibernation__.initialSet.checked[idxOfInitialReference] = true;
		copiedObject = __Hibernation__.initialSet.copiedObject[idxOfInitialReference];
		copiedProp = Object.getOwnPropertyNames(copiedObject);
		idxOfReference = idxOfInitialReference;
		initialOrCreatedSet = __Hibernation__.initialSet;
		currentPath = __Hibernation__.initialSet.path[idxOfInitialReference].join('.');
	}
	// if it is not in the initial set, we prepare for creation
	// this object should have been created ahead of this step, so we search for it in the created set
	else {
	var tic = new Date().getTime();
		idxOfReference = __Hibernation__.createdSet.reference.indexOf(current);
	__Hibernation__.profile.arraySearchTime += new Date().getTime() - tic;
		if (idxOfReference === -1) {
			console.log("ERROR CANT HAPPEN");
			debugger;
		}
		initialOrCreatedSet = __Hibernation__.createdSet;
		currentPath = "__Hibernation__.cObj[" + idxOfReference + "]";
	}

	// Compare properties
	var prop = Object.getOwnPropertyNames(current);

	for (var i = 0, len = prop.length; i < len; i++) {
		var val = prop[i];

		if ((skipProps) && (skipProps.indexOf(val) !== -1)) {
			continue;
		}

		// if the property didn't exist before, or if the property is modified, we save it
		if ((idxOfInitialReference === -1) ||
		    (copiedProp.indexOf(val) === -1 || copiedObject[val] !== current[val])) {
			// if the property's value is object type, there are three possibilities:
			// 1) the object is not in the initial set, and the object has never been created
			// 2) the object is not in the initial set, but it was traversed and restored
			// 3) the object is in the initial set

			if (current[val] instanceof Object) {
	var tic = new Date().getTime();
				var idxOfInitialSet = __Hibernation__.initialSet.reference.indexOf(current[val]);
	__Hibernation__.profile.arraySearchTime += new Date().getTime() - tic;
				// not in the initial set
				if (idxOfInitialSet === -1) {
	var tic = new Date().getTime();
					var idxOfCreatedSet = __Hibernation__.createdSet.reference.indexOf(current[val]);
	__Hibernation__.profile.arraySearchTime += new Date().getTime() - tic;
					// not in the current created set
					if (idxOfCreatedSet === -1) {
						// push and set index number
						idxOfCreatedSet = __Hibernation__.createdSet.reference.push(current[val]) - 1;
										  __Hibernation__.createdSet.restorationCode.push(new Array());
						if (current[val] instanceof Function) {
										  __Hibernation__.createdSet.type.push("function");
						}
						else if (current[val] instanceof Array) {
										  __Hibernation__.createdSet.type.push("array");
						}
						else {
										  __Hibernation__.createdSet.type.push("object");
						}
					}
					initialOrCreatedSet.restorationCode[idxOfReference].push(currentPath + "[\"" + val + "\"]" + " = __Hibernation__.cObj[" + idxOfCreatedSet + "];\n");
				}
				else {    // exists in the initial set
					initialOrCreatedSet.restorationCode[idxOfReference].push(currentPath + "[\"" + val + "\"]" + " = " + __Hibernation__.initialSet.path[idxOfInitialSet].join('.') + ";\n");
				}
			}
			else {
				var checkedString = __Hibernation__.checkString(current[val]);
				initialOrCreatedSet.restorationCode[idxOfReference].push(currentPath + "[\"" + val + "\"]" + " = " + checkedString + ";\n");
			}
		}

		// traverse Object|Function|Array objects
		if (current[val] instanceof Object) {
			__Hibernation__.serializeTraverse(current[val]);
		}
	}

	// If found, we check if prop has been changed for both properties and scopes
	if (idxOfInitialReference !== -1) {
		for (var i = 0, len = copiedProp.length; i < len; i++) {
			var val = copiedProp[i];

			if ((skipProps) && (skipProps.indexOf(val) !== -1)) {
				continue;
			}

			// if the property does not exist now, it is deleted
			// current.hasOwnProperty is not working, because the result from hasOwnProperty and the result from getOwnPropertyNames are different
			if (prop.indexOf(val) === -1) {
				__Hibernation__.initialSet.restorationCode[idxOfInitialReference].push("delete " + __Hibernation__.initialSet.path[idxOfInitialReference].join('.') + "[" + val + "];\n");
			}
		}

		// Compare Scopes (only for functions)
		if (current instanceof Function) {
			var scopeChain = __Hibernation__.getScopeChain(current);

			for (var i = 0, len = scopeChain.length; i < len; i++) {
				__Hibernation__.serializeTraverse(scopeChain[i]);
			}

			return __Hibernation__.createdSet.reference.indexOf(current);
		}
	}
	else {   // This object is newly created, so we need to save scopes if this object is function type
		if (current instanceof Function) {
			var scopeChain = __Hibernation__.getScopeChain(current);

			var depList = new Array();
			var idxOfCreatedScope = -1;

			// if length is more than 1, current function is a closure (at least 1 scope, because there is a global scope)
			for (var i = 0, len = scopeChain.length; i < len; i++) {
				// direct means that it is the first scope object (current function should be direct child of this scope)
				var direct = (i === 0) ? true : false;
				// scope, funcIndex (number type), depList (array type), direct (boolean), idxOfchildScope
				idxOfCreatedScope = __Hibernation__.serializeScope(scopeChain[i], idxOfReference, depList, direct, idxOfCreatedScope);
				depList = __Hibernation__.createdSet.depList[idxOfCreatedScope];
			}

			// push last scope to the childList of the global scope
			if (idxOfCreatedScope !== -1) {
				__Hibernation__.searchPush(__Hibernation__.createdSet.childList[0], idxOfCreatedScope);
//				debugger;
			}
			else {   	// else means it is just plain function (no scope), so push to the global scope
				__Hibernation__.searchPush(__Hibernation__.createdSet.childList[0], idxOfReference);
//				debugger;
			}

			return __Hibernation__.createdSet.reference.indexOf(current);
		}
	}
}

__Hibernation__.traverse = function() {
	var tic = new Date().getTime();
	__Hibernation__.initialTraverse(window, ["window"]);
	var toc = new Date().getTime();
	console.log("Traverse time: " + (toc-tic) + " ms");
}

__Hibernation__.serialize = function() {
	var tic = new Date().getTime();
	__Hibernation__.serializeTraverse(window, ["window"]);

	console.log("serializeTraverse Time: " + (new Date().getTime()-tic) + " ms");

	var code = "";

	code += "__Hibernation__.cObj = new Array();\n";

    // Prepare the empty object instance:
    code += "(function() {\n";
    code += "\tvar objectIndex = [";
    for ( var i = 0; i < __Hibernation__.createdSet.reference.length; ++i ) {
        if ( __Hibernation__.createdSet.type[i] === "object" ) {
            code += i + ",";
        }
    }
    code += "];\n";
    code += "\tvar arrayIndex=[";
    for ( var i = 0; i < __Hibernation__.createdSet.reference.length; ++i ) {
        if ( __Hibernation__.createdSet.type[i] === "array" ) {
            code += i + ",";
        }
    }
    code += "];\n";
    code += "\tfor (var i=0; i < objectIndex.length; ++i){\n";
    code += "\t\t__Hibernation__.cObj[objectIndex[i]] = {};\n";
    code += "\t}\n";
    code += "\tfor (var i=0; i < arrayIndex.length; ++i){\n";
    code += "\t\t__Hibernation__.cObj[arrayIndex[i]] = new Array();\n";
    code += "\t}\n";
    code += "})();\n\n";
	
	// change the order of children according to the dependency
	function alignChildren(index) {
		var alignedChildList = new Array();
		var childList = __Hibernation__.createdSet.childList[index];
		for (var i = 0, ilen = childList.length; i < ilen; i++) {
			var childIdx = childList[i];

			// if the alignedChildList is empty, we only need to push the first element
			if (i === 0) {
				alignedChildList.push(childIdx);
				continue;
			}

			var type = __Hibernation__.createdSet.type[childIdx];

			// if type is function, it is not dependent to anything, so we push at the front
			if (type === "function") {
				alignedChildList.splice(0, 0, childIdx);
				continue;
			}

			var gChildList = __Hibernation__.createdSet.childList[childIdx];
			var depList = __Hibernation__.createdSet.depList[childIdx];

			for (var j = 0, jlen = alignedChildList.length; j < jlen; j++) {
				var targetType = __Hibernation__.createdSet.type[alignedChildList[j]];

				// if target in the alignedChildList is function, we are sure that current scope is after the current function
				if (targetType === "function") {
					if (j === jlen - 1) {  // there is nothing else to compare
						alignedChildList.push(childList[i]);
						break;
					}
					else {
						continue;
					}
				}

				var targetDeepChildList = __Hibernation__.createdSet.deepChildList[alignedChildList[j]];
				if (targetDeepChildList === undefined) {
					debugger;
				}
				var found = false;

				// check if nothing in this scope is dependent of every child in the target
				for (var k = 0, klen = depList.length; k < klen; k++) {
					if (targetDeepChildList.indexOf(depList[k]) !== -1) {
						found = true;
						break;
					}
				}

				if (!found) {
					alignedChildList.splice(j, 0, childList[i]);
					break;
				}

				if (j === jlen - 1) {
					alignedChildList.push(childList[i]);
				}
			}

			alignChildren(childList[i]);

		}
		__Hibernation__.createdSet.childList[index] = alignedChildList;
	}

	// align all the scope nodes, starting from the global scope, which is the index zero
	alignChildren(0);

	// generate code
	var scopeLevel = 0;

	function generateCodeForScope(index) {
		var indentation = "";
		for (var i = 0; i < scopeLevel; i++) {
			indentation += "\t";
		}

		var restorationCode = __Hibernation__.createdSet.restorationCode[index];
		var type = __Hibernation__.createdSet.type[index];
		var childList = __Hibernation__.createdSet.childList[index];

		if (type === "scope") {
			code += indentation + "(function() {\n";
			for (var i = 0; i < restorationCode.length; i++) {
				code += indentation + "\t" + restorationCode[i];
			}
			for (var i = 0; i < childList.length; i++) {
				scopeLevel++;
				generateCodeForScope(childList[i]);
				scopeLevel--;
			}
			code += indentation + "})();\n\n";
		}
		else if (type === "function") {
			code += indentation + "__Hibernation__.cObj[" + index + "] = " + __Hibernation__.createdSet.reference[index].toString() + ";\n";
		}
	};

	// generate scopes and functions
	var globalChildList = __Hibernation__.createdSet.childList[0];
	for (var i = 0, len = globalChildList.length; i < len; i++) {
		generateCodeForScope(globalChildList[i]);
	}

	/*
	for (var i = 0, len = __Hibernation__.createdSet.reference.length; i < len; i++) {
		if (__Hibernation__.createdSet.type[i] === "function") {
			code += "__Hibernation__.cObj[" + i + "] = " + __Hibernation__.createdSet.reference[i].toString() + ";\n";
		}

		if (__Hibernation__.createdSet.type[i] === "scope") {
			code += "scope[" + i + "]\n";
			code += __Hibernation__.createdSet.restorationCode[i] + "\n";
			code += "depList = [";
			for (var j = 0; j < __Hibernation__.createdSet.depList[i].length; j++) {
				code += __Hibernation__.createdSet.depList[i][j] + ", ";
			}
			code += "]\n";
			code += "childList = [";
			for (var j = 0; j < __Hibernation__.createdSet.childList[i].length; j++) {
				code += __Hibernation__.createdSet.childList[i][j] + ", ";
			}
			code += "]\n";
			code += "deepChildList = [";
			for (var j = 0; j < __Hibernation__.createdSet.deepChildList[i].length; j++) {
				code += __Hibernation__.createdSet.deepChildList[i][j] + ", ";
			}
			code += "]\n";
		}
	}
	*/

	// generate properties of objects and arrays
	for (var i = 0, len = __Hibernation__.createdSet.restorationCode.length; i < len; i++) {
		if (__Hibernation__.createdSet.type[i] !== "scope") {
			var restorationCode = __Hibernation__.createdSet.restorationCode[i];
			for (var j = 0; j < restorationCode.length; j++) {
				code += restorationCode[j];
				__Hibernation__.profile.createdSize++;
			}
			code += "\n";
		}
	}

	for (var i = 0, len = __Hibernation__.initialSet.reference.length; i < len; i++) {
		// not checked means that the object is deleted
		__Hibernation__.profile.initialSize += Object.getOwnPropertyNames(__Hibernation__.initialSet.reference[i]).length;
		if (!__Hibernation__.initialSet.checked[i]) {
			// code += "delete " + __Hibernation__.initialSet.path[i].join('.') + ";" + "\n";
		}
		else {
			var restorationCode = __Hibernation__.initialSet.restorationCode[i];
			var generated = false;
			for (var j = 0; j < restorationCode.length; j++) {
				if (restorationCode[j] !== "") {
					code += restorationCode[j];
					generated = true;
					__Hibernation__.profile.initialChangedSize++;
				}
			}
			if (generated) {
				code += "\n";
				__Hibernation__.profile.initialChanged++;
			}
		}
	}

//	console.log(code);
	__Hibernation__.report();
	__Hibernation__.SaveTo("update_js.js", code);
	var toc = new Date().getTime();
	console.log("Save time: " + (toc-tic) + " ms");
}
