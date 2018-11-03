//Send the proper header information along with the request
/*
var http = new XMLHttpRequest();
var url = 'http://aiur.snu.ac.kr:3001';
var params = "lorem=ipsum&name=binny";
http.open("POST", url, true);
http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

http.onreadystatechange = function() {//Call a function when the state changes.
	if(http.readyState == 4 && http.status == 200) {
		alert(http.responseText);
	}
}
http.send(params);
*/


//var esprima = require('./frameworks/esprima.js');
//var estraverse = require('./frameworks/estraverse.browser.js');

document.addEventListener("keydown", function(e){
	if(e.ctrlKey && e.keyCode == 77) { // '77' stands for the 'm' key
		var stringified = $fsm.serialize();
		var ws = new WebSocket('ws://localhost:9876');
		ws.onopen = function(){
			ws.send(stringified);
		}
		ws.onmessage = function(event){
			alert('Serialize Complete');
		}
	}
}, false);

// WeakMap functions
function indexOfWeakMap(wm, obj) {
    for (let key in Object.keys(wm)) {
        console.log(`key: ${key}, value: ${wm[key]}`);
        if (wm[key] == obj) return key;
    }
    return -1;
}

function lengthOfWeakMap(wm) {
	return Object.keys(wm).length;
}

var $fsm = (function() {
	var dom;
	//var ref_table = new Array();
	var ref_table = new WeakMap();
	var event_table = new Array();
	var event_attrib_table = new Array();
	var initial_global = Array.prototype.slice.call(Object.keys(window));
	var global_objects = ["Array"];

	//var call_stack = new Array();
	//call_stack.push(new Object()); // global object
	//Object.prototype.$ref_table = ref_table;
	var ref_index = 0;
	var eh_index = 0;

	var __proto__List = [];
	var __proto__NameList = [];

	return {
		getEventTable: function(){
			console.log(eh_index);
			return event_table;
		},
		create: function(args) {
			//var symbol = Symbol(desc);
			var obj = new Object();
			obj.$ref_index = ref_index;
			obj.$scopes = {};
			if (args) {
				obj.$arguments = new Array();
				for (var arg in args) {
					obj.$arguments[arg] = args[arg];
				}
			}
			//obj.key = ref_index;
			ref_table[ref_index] = obj;
			return ref_table[ref_index++];
		},
		getScopeObj : function(obj){
			//return ref_table.indexOf(obj);
            return indexOfWeakMap(ref_table, obj);
		},
		get_ref: function(index){
			return ref_table[index];
		},
		print: function() {
			// Only for debug
			console.log("print");
			//var symbols = Object.getOwnPropertySymbols(ref_table);
			//for (var i = 0; i < symbols.length; i++) {
			//	console.log(symbols[i], ref_table[symbols[i]]);
			//}

			//for (var i = 0; i < ref_table.length; i++) {
			for (var i = 0; i < lengthOfWeakMap(ref_table); i++) {
				console.log('ref_table[' + i + ']');
				//for (var key in ref_table) {
				for (let key in Object.keys(ref_table)) {
					console.log(key, ref_table[key]);
				}
			}
		},
		replace: function(rft) {
			ref_table = JSON.parse(JSON.stringify(rft));
		},
		serializeDOMObj: function(obj) {
			if(!obj.parentElement)return "document.children[0]";
			for(var i = 0; i < obj.parentElement.childElementCount; i++){
				if(obj.parentElement.children[i] == obj){
					var serialized = ".children[" + i + "]";
					break;
				}
			}
			return this.serializeDOMObj(obj.parentElement) + serialized;
		},
		serialize: function() {
			var t0 = new Date().getTime();

			var builtInList = ["Object", "Array", "Function", "Number", "Boolean", "Symbol", "Error", "Math", "Date", "String", "RegExp"];

			var cssWeakMap = new WeakMap();

			function getHTMLElementPath(node, name){
				if(name){
					/*
					if(node.isRestored && node.hasOwnProperty('isRestored')){
						return node.isRestored + ";\n";
					}
					*/
					if(node.toString().indexOf("HTMLImageElement") > -1){
						var str = "new Image();\n";
						str += name + ".src = \"" + node.src + "\";\n";
						str += name + ".width = " + node.width + ";\n";
						str += name + ".height = " + node.height + ";\n";
						str += name + ".__proto__ = HTMLImageElement.prototype;\n";
						return str;
					}
					else if(node.toString().indexOf("CanvasRenderingContext2D") > -1){
						if(document.contains(node.canvas))
							var str = getHTMLElementPath(node.canvas) + ".getContext(\'2d\');\n";
						else
							var str = "document.createElement(\"" + (node.canvas.nodeName) + "\").getContext(\'2d\');\n";
						for(var prop in node){
							if(node.__lookupSetter__(prop)){
								if(prop == "canvas")continue;
								if(!node[prop])continue;
								str += name + "." + prop + " = " + JSON.stringify(node[prop]) + ";\n";
							}
						}
						var imageData = node.getImageData(0, 0, node.canvas.width, node.canvas.height);
						str += "(function(){\n";
						str += "\tvar " + name + "_imageData = " + JSON.stringify(Array.from(imageData.data)) + ";\n";
						str += "\t" + name + "_imageData = new ImageData(new Uint8ClampedArray(" + name + "_imageData), " + name + ".canvas.width, " + name + ".canvas.height);\n";
						str += "\t" + name + ".putImageData(" + name + "_imageData, 0, 0);\n";
						str += "})();\n";
						return str;
					}
					else if(node.toString().indexOf("CSSStyleDeclaration") > -1){
						//var str = "{};\n";
						var str = "";
						for(var style in node){
							if(!node[style] || node[style] instanceof Function || style == "isRestored")continue;
							str += name + "[\"" + style + "\"] = " + JSON.stringify(node[style]) + ";\n";
						}
						cssWeakMap.set(node, name);
						//str += name + ".__proto__ = CSSStyleDeclaration.prototype;\n";
						return str;
					}
					else if(node instanceof NodeList){
						var str = "document.createDocumentFragment();\n";
						for(var n = 0; n < node.length; n++){
							if(document.contains(node[n])){
								str += "var temp = " + getHTMLElementPath(node[n]) + ";\n";
								for(var prop in node[n]){
									if(node[n].__lookupSetter__(prop) && !(node[n][prop] instanceof Object)){
										if(prop.includes("HTML") || prop == "innerText" || prop == "outerText" || prop == "textContent")continue;
										if(!node[n][prop] || node[n][prop] < 0)continue;
										str += "temp." + prop + " = " + JSON.stringify(node[n][prop]) + ";\n";
									}
									else if(prop == 'style'){
										str += "temp." + prop + " = " + getHTMLElementPath(node[n][prop], name + "[" + n + "][\"" + prop + "\"]");
									}
								}
								str += name + ".appendChild(temp);\n";
							}
							else{
								str += "var temp = document.createElement(\"" + (node[n].nodeName) + "\");\n";
								for(var prop in node[n]){
									if(node[n].__lookupSetter__(prop) && !(node[n][prop] instanceof Object)){
										if(prop.includes("HTML") || prop == "innerText" || prop == "outerText" || prop == "textContent")continue;
										if(!node[n][prop] || node[n][prop] < 0)continue;
										str += "temp." + prop + " = " + JSON.stringify(node[n][prop]) + ";\n";
									}
									else if(prop == 'style'){
										str += "temp." + prop + " = " + getHTMLElementPath(node[n][prop], name + "[" + n + "][\"" + prop + "\"]");
									}
								}
								str += name + ".appendChild(temp);\n";
							}
						}
					}
					else if(node instanceof Event){
						var str = "new Event(\"" + node.type + "\");\n";
						for(var prop in node){
							if(node.__lookupSetter__(prop) && !(node[prop] instanceof Object)){
								if(prop.includes("HTML") || prop == "innerText" || prop == "outerText" || prop == "textContent")continue;
								if(!node[prop] || node[prop] < 0)continue;
								str += name + "." + prop + " = " + JSON.stringify(node[prop]) + ";\n";
							}
							else if(prop == 'style'){
								//str += name + "." + prop + " = " + getHTMLElementPath(node[prop], name + "[\"" + prop + "\"]");
								str += getHTMLElementPath(node[prop], name + "[\"" + prop + "\"]");
							}
						}
					}
					else{
						if(document.contains(node))
							var str = getHTMLElementPath(node) + ";\n";
						else
							var str = "document.createElement(\"" + (node.nodeName) + "\");\n";
						for(var prop in node){
							if(node.__lookupSetter__(prop) && !(node[prop] instanceof Object)){
								if(prop.includes("HTML") || prop == "innerText" || prop == "outerText" || prop == "textContent")continue;
								if(!node[prop] || node[prop] < 0)continue;
								str += name + "." + prop + " = " + JSON.stringify(node[prop]) + ";\n";
							}
							else if(prop == 'style'){
								//str += name + "." + prop + " = " + getHTMLElementPath(node[prop], name + "[\"" + prop + "\"]");
								str += getHTMLElementPath(node[prop], name + "[\"" + prop + "\"]");
							}
						}
						return str;
					}
				}
				if(!(node.parentElement))return "document.children[0]";
				var index;
				for(index = 0; index < node.parentElement.children.length; index++){
					if(node.parentElement.children[index] == node)break;
				}
				return getHTMLElementPath(node.parentElement) + ".children[" + index + "]";
			}

			function iterativeStringify(obj, name, is_fsm){
				function lookupEventTable(obj){
					for(var i = 0; i < event_table.length; i++){
						if(event_table[i].callback == obj)return event_table[i].ref_index;
					}
					return -1;
				}
				var stringified = "";
				var workList = [[obj, name]];
				var $scopes;
				var $fsm_index = [];
				if(is_fsm)var fsm_start = true;
				if(is_fsm)var fsm_object = obj;
				while(workList.length){
					var work = workList.pop();
					var currentObj = work[0];
					var currentName = work[1];
					var $ref = [];
					if(currentObj == window){
						stringified += currentName + " = window;\n";
						continue;
					}
					else if(currentObj == $fsm){
						stringified += currentName + " = $fsm;\n";
						continue;
					}
					else if(currentObj == $fsm0){
						stringified += currentName + " = $fsm0;\n";
						continue;
					}
					if(currentObj && currentObj.$fsm_index){
						$fsm_index[currentObj.$fsm_index[0]] = currentObj.$fsm_index[1];
						var ref_table_index = currentObj.$fsm_index[1];
						for(var scope in ref_table[ref_table_index].$scopes){
							var scope_num = parseInt(scope.slice(4));
							$fsm_index[scope_num] = ref_table[ref_table_index].$scopes[scope];
						}
					}
					if(currentObj && currentObj.$scopes){
						$scopes = currentObj.$scopes;
						for(var scope in currentObj.$scopes){
							var scope_num = parseInt(scope.slice(4));
							$fsm_index[scope_num] = currentObj.$scopes[scope];
						}
					}
					if(!is_fsm && (currentObj instanceof Function || currentObj instanceof Array || currentObj instanceof Object))var fsm_index = lookup(currentObj);
					if(currentObj instanceof Object){
						for(var i = 0; i < builtInList.length; i++){
							if(window[builtInList[i]].prototype == currentObj){
								//stringified += currentName + " = " + builtInList[i] + ".prototype;\n";
								break;
							}
						}
					}
					if(currentObj instanceof Object && i < builtInList.length)continue;
					//if(currentObj === undefined)continue;
					if(currentObj && currentObj.isRestored && (!(currentObj.__proto__) || currentObj.isRestored != currentObj.__proto__.isRestored)){
						stringified += currentName + " = " + currentObj.isRestored + ";\n";
					}
					else if(fsm_index > -1){
						stringified += currentName + " = $fsm.get_ref(" + fsm_index + ");\n";
					}
					else if(currentObj instanceof Function){
						var temp_stringified = currentName + " = " + currentObj.fsm_toString() + ";\n";
						for(var i in $fsm_index){
							if(!temp_stringified.includes("$fsm" + i + " = $fsm.create"))temp_stringified = temp_stringified.substr(0, temp_stringified.indexOf(" function ")) + replaceAll(temp_stringified.substr(temp_stringified.indexOf(" function ")), "$fsm" + i, "($fsm.get_ref(" + $fsm_index[i] + "))");
						}
						for(var i in $scopes){
							if(!temp_stringified.includes(i + " = $fsm.create")){
								temp_stringified = temp_stringified.substr(0, temp_stringified.indexOf(" function ")) + replaceAll(temp_stringified.substr(temp_stringified.indexOf(" function ")), i, "($fsm.get_ref(" + $scopes[i] + "))");
							}
						}
						if(is_fsm){
							var event_index = lookupEventTable(currentObj);
							if(event_index > -1){
								temp_stringified = temp_stringified.substr(0, temp_stringified.indexOf(" function ")) + temp_stringified.substr(temp_stringified.indexOf(" function ")).replace(/\$fsm[0-9]+/g, '($fsm.get_ref(' + event_index + '))');
							}
						}
						stringified += temp_stringified;
						workList.push([currentObj.prototype, currentName + ".prototype"]);
                        if (Object.keys(currentObj.__proto__).length > 0)
                            workList.push([currentObj.__proto__, currentName + ".__proto__"]);
						for(var prop in currentObj){
							if(currentObj.hasOwnProperty(prop))workList.push([currentObj[prop], currentName + "[\"" + prop + "\"]"]);
						}
					}
					else if(currentObj instanceof Array){
                        stringified += currentName + " = [];\n";
                        if (Object.keys(currentObj.__proto__).length > 0)
						    workList.push([currentObj.__proto__, currentName + ".__proto__"]);
						for(var prop in currentObj){
							if(currentObj.hasOwnProperty(prop))workList.push([currentObj[prop], currentName + "[\"" + prop + "\"]"]);
						}
					}
					else if(currentObj instanceof Object){
						try{
							for(var prop in currentObj){
								currentObj[prop];
							}
						}catch(e){
							continue;
						}
						var reg = /\[object\ .*\]/;
						var object_string = "[object Object]";
						if(currentObj instanceof Date){
							stringified += currentName + " = new Date( " + JSON.stringify(currentObj) + ");\n";
							continue;
						}
						if(currentObj.fsm_toString().match(reg)[0] != object_string){
							var isCSS = (currentObj.fsm_toString().indexOf("CSSStyleDeclaration") > -1);
							if(isCSS){
								if(cssWeakMap.get(currentObj) == undefined){
									workList.unshift([currentObj, currentName]);
								}
								else{
									stringified += currentName + " = " + cssWeakMap.get(currentObj) + ";\n";
									cssWeakMap.delete(currentObj);
								}
								continue;
							}
							stringified += currentName + " = " + getHTMLElementPath(currentObj, currentName) + ";\n";
							if(currentObj){
								currentObj.isRestored = currentName.replace(/(\$fsm)([0-9]+)/, function(match, p1, p2, offset, string){
									return "($fsm.get_ref(" + p2 + "))";
								});
							}
							continue;
						}
						/*
						if(currentObj.fsm_toString().indexOf("HTML") > -1){
							stringified += currentName + " = " + getHTMLElementPath(currentObj, currentName) + ";\n";
							continue;
						}
						else if(currentObj.fsm_toString().indexOf("Canvas") > -1){
							stringified += currentName + " = " + getHTMLElementPath(currentObj, currentName) + ";\n";
							continue;
						}
						*/
						if(!fsm_start){
							var currentNames = currentName.split('.');
							if(currentNames[currentNames.length - 1] != 'prototype')
								stringified += currentName + " = {};\n";
						}
                        else fsm_start = false;
                        if (Object.keys(currentObj.__proto__).length > 0)
						    workList.push([currentObj.__proto__, currentName + ".__proto__"]);
						for(var prop in currentObj){
							if(currentObj.hasOwnProperty(prop)){
								workList.push([currentObj[prop], currentName + "[\"" + prop + "\"]"]);
							}
						}
					}
					else{
						stringified += currentName + " = " + JSON.stringify(currentObj) + ";\n";
					}
					if(currentObj){
						currentObj.isRestored = currentName.replace(/(\$fsm)([0-9]+)/, function(match, p1, p2, offset, string){
							return "($fsm.get_ref(" + p2 + "))";
						});
					}
				}
				return stringified;
			}

			function stringify(obj, name){
				if(obj instanceof Function){
					var str = obj.fsm_toString() + "\n";
					// Property Traverse
					for(var i in obj){
						var index = lookupGlobal(obj[i]);
						if(index){
							if(index[1])str += name + "." + i + " = " + index[0] + ";\n";
							else {
								//str += obj.name + "." + i + " = " + stringify(obj[i], name) + ";\n";
								str += name + "." + i + " = " + stringify(obj[i], name + "." + i) + ";\n";
								window[index[0]].isRestored = true;
							}
							//str += obj.name + "." + i + " = " + global_array[index] + ";\n";
							continue;
						}
						//str += obj.name + "." + i + " = " + stringify(obj[i], name) + ";\n";
						str += name + "." + i + " = " + stringify(obj[i], name + "." + i) + ";\n";
					}
					// Prototype Traverse
					//for(var i in obj.prototype){
					//	var index = lookupGlobal(obj.prototype[i]);
					//	if(index){
					//		if(index[1])str += name + ".prototype." + i + " = " + index[0] + ";\n";
					//		else {
					//			//str += obj.name + ".prototype." + i + " = " + stringify(obj[i], name) + ";\n";
					//			str += name + ".prototype." + i + " = " + stringify(obj.prototype[i], name + "." + i) + ";\n";
					//			window[index[0]].isRestored = true;
					//		}
					//		continue;
					//	}
					//	//str += obj.name + ".prototype." + i + " = " + stringify(obj.prototype[i], name) + ";\n";
					//	str += name + ".prototype." + i + " = " + stringify(obj.prototype[i], name + "." + i) + ";\n";
					//}
					return str;
				}
				else if(obj instanceof Array){
					var stringified = "[";
					for(var i=0; i<obj.length; i++){
						var index = lookupGlobal(obj[i]);
						if(index){
							if(index[1])stringified += index[0] + ", ";
							else{
								//stringified += (stringify(obj[i], name) + ", ");
								stringified += (stringify(obj[i], name + "[" + i + "]") + ", ");
								window[index[0]].isRestored = true;
							}
							continue;
						}
						//stringified += (stringify(obj[i], name) + ", ");
						stringified += (stringify(obj[i], name + "[" + i + "]") + ", ");
					}
					return stringified + "]";
				}
				else if(obj instanceof Object){
					if(obj.fsm_toString().indexOf("HTML") > -1)return getHTMLElementPath(obj);
					var $ref = obj.$fsm_index;
					var stringified = "{";
					for(var i in obj){
						if(obj.hasOwnProperty(i)){
							var index = lookupGlobal(obj[i]);
							if(index){
								if(index[1])stringified += i + ":" + index[0] + ",";
								else{
									//stringified += i + ":" + stringify(obj[i], name) + ",";
									stringified += i + ":" + stringify(obj[i], name + "." + i) + ",";
									window[index[0]].isRestored = true;
								}
								continue;
							}
							//stringified += i + ":" + stringify(obj[i], name) + ",";
							stringified += i + ":" + stringify(obj[i], name + "." + i) + ",";
						}
					}
					// Check prototype is built-in-object's prototype
					for(var builtInIndex = 0; builtInIndex < builtInList.length; builtInIndex++){
						if(obj.__proto__ == window[builtInList[builtInIndex]].prototype)break;
					}
					if(builtInIndex < builtInList.length){
						stringified += "__proto__:" + builtInList[builtInIndex] + ".prototype";
					}
					else{
						var __proto__Index = __proto__List.indexOf(obj.__proto__);
						if(__proto__Index > -1){
							stringified += "__proto__:" + __proto__NameList[__proto__Index] + ".__proto__";
						}
						else{
							__proto__NameList.push(name);
							__proto__List.push(obj.__proto__);
							stringified += "__proto__:" + stringify(obj.__proto__);
						}
					}
					//stringified += "__proto__:" + obj.constructor.name + ".prototype";
					//stringified += "__proto__:" + stringify(obj.__proto__);
					stringified += "}\n";
					if($ref){
						stringified = replaceAll(stringified, "$fsm" + $ref[0], "($fsm.get_ref(" + $ref[1] + "))");
					}
					return stringified;
					for(var i in obj.__proto__){
						//stringified += name + ".__proto__." + i + " = " + stringify(obj.__proto__[i], name) + "\n";
						stringified += name + ".__proto__." + i + " = " + stringify(obj.__proto__[i], name + "." + i) + "\n";
					}
					return stringified;
				}
				else{
					return JSON.stringify(obj);
				}
			}
			
			function stringifyPrototype(obj, name){
				if(obj instanceof Function){
					var str = "";
					// Property Traverse
					for(var i in obj){
						str += stringifyPrototype(obj[i], name + "." + i);
					}
					// Prototype Traverse
					for(var i in obj.prototype){
						var index = lookupGlobal(obj.prototype[i]);
						if(index){
							if(index[1]){
								str += name + ".prototype." + i + " = " + index[0] + ";\n";
								continue;
							}
						}
						str += name + ".prototype." + i + " = " + stringify(obj.prototype[i], name + "." + i) + ";\n";
						str += stringifyPrototype(obj.prototype[i], name + "." + i) + ";\n";
					}
					return str;
				}
				else if(obj instanceof Array){
					var stringified = "";
					for(var i=0; i<obj.length; i++){
						stringified += stringifyPrototype(obj[i], name + "[" + i + "]");
					}
					return stringified;
				}
				else if(obj instanceof Object){
					var stringified = "";
					if(obj.fsm_toString().indexOf("HTML") > -1)return stringified;
					for(var i in obj){
						if(obj.hasOwnProperty(i)){
							stringified += stringifyPrototype(obj[i], name + "." + i);
						}
					}
					return stringified;
				}
				else{
					return "";
				}
			}

			function replaceAll(str, searchStr, replaceStr){
				var searchArray = str.split(searchStr);
				var newArray = [];
				for(var i = 0; i < searchArray.length; i++){
					if(searchArray[i][searchArray[i].length - 1] != '.'){
						newArray.push(searchArray[i]);
					}
					else if(i < searchArray.length - 1){
						searchArray[i+1] = searchArray[i] + searchStr + searchArray[i+1];
					}
				}
				return newArray.join(replaceStr);
				return str.split(searchStr).join(replaceStr);
			}

			function lookup(obj){
				//for(var i = 0; i < ref_table.length; i++){
				for (let i = 0; i < lengthOfWeakMap(ref_table); i++) {
					if(obj == ref_table[i]) return i;
				}
				return -1;
			}

			function lookupFunction(func, evt){
				if(evt == "evt"){
					//for(var i = 0; i < ref_table.length; i++){
                    for (let i = 0; i < lengthOfWeakMap(ref_table); i++) {
						var index = -1;
						if(ref_table[i].$evt_func)index = ref_table[i].$evt_func.indexOf(func);
						if(index > -1)return [i, "$evt_func", index];
						//if(func == ref_table[i].$evt_func)return [i, "$evt_func"];
						for(var j in ref_table[i]){
							if(func == ref_table[i][j])return [i, j];
						}
					}
					return [-1];
				}
				//for(var i = 0; i < ref_table.length; i++){
                for (let i = 0; i < lengthOfWeakMap(ref_table); i++) {
					if(func == ref_table[i].$ret_func)return [i, "$ret_func"];
					for(var j in ref_table[i]){
						if(func === ref_table[i][j])return [i, j];
					}
				}
				return [-1];
			}

			function lookupGlobal(obj){
				if(!global_array || !obj)return false;
				for(var global_index = 0; global_index < global_array.length; global_index++){
					if(obj == window[global_array[global_index]]){
						if(window[global_array[global_index]].isRestored)return [global_array[global_index], true];
						else return [global_array[global_index], false];
					}
				}
				return false;
			}

			var code = "";
			// [runtime] DOM tree recover code by Yoo Hyeongseok 2017.10.25
			code += "// Restore Dom Object \n";
			code += "var rawHTML = " + JSON.stringify(document.documentElement.outerHTML) + ";\n";
			code += "$fsm.restoreDOM(rawHTML);\n\n";

			code += "\n// Restore Prototype \n";
			var builtInList = ["Object", "Array", "Function", "Number", "Boolean", "Symbol", "Error", "Math", "Date", "String", "RegExp"];
			for(var builtInIndex = 0; builtInIndex < builtInList.length; builtInIndex++){
				for(var i in window[builtInList[builtInIndex]]){
					if(i != "isRestored")code += iterativeStringify(window[builtInList[builtInIndex]][i], builtInList[builtInIndex] + "[\"" + i + "\"]") + ";\n";
				}
				for(var i in window[builtInList[builtInIndex]].prototype){
					if(i != "isRestored")code += iterativeStringify(window[builtInList[builtInIndex]].prototype[i], builtInList[builtInIndex] + ".prototype." + i) + ";\n";
				}
			}

			// [runtime] Reference table recover code
			code += "// Restore Reference Table \n";

			code += "(function(){\n";
			//for(var i = 1; i < ref_table.length; i++){
            for (let i = 1; i < lengthOfWeakMap(ref_table); i++) {
				var new_fsm = "$fsm" + i;
				code += "\tvar " + new_fsm + " = $fsm.create();\n";
				code += "\t" + iterativeStringify(ref_table[i], new_fsm, true) + ";\n";
				continue;
				for(var prop in ref_table[i]){
					if(prop == "isRestored")continue;
					if(ref_table[i].hasOwnProperty(prop)){
						if(prop == "$evt_func"){
							code += "\t" + new_fsm + "." + prop + " = [\n";
							for(var len = 0; len < ref_table[i][prop].length; len++){
								if(ref_table[i][prop][len].isRestored){
									code += "\t" + "($fsm.get_ref(" + ref_table[i][prop][len].isRestored[0] + "))." + ref_table[i][prop][len].isRestored[1] + ";\n";
									continue;
								}
								var code_seg = ref_table[i][prop].fsm_toString();
								var matches = code_seg.match(/\$fsm[0-9]+/g);
								if(matches){
									var passes = code_seg.match(/\$fsm[0-9]+ = \$fsm.create/g);
									for(var pass = 0; passes && pass < passes.length; pass++){
										passes[pass] = passes[pass].slice(0, passes[pass].indexOf(' '));
										matches = matches.filter(function(a){return a !== passes[0]});
									}
									code_seg = (function patch_code(code_seg, matches){
										if(matches.length == 0)return code_seg;
										var index = matches.shift();
										if(code_seg.indexOf(index) > 0 && code_seg[code_seg.indexOf(index) - 1] != '.'){
											return code_seg.substr(0, code_seg.indexOf(index)) + "($fsm.get_ref(" + ref_table[i].$scopes[index] + "))" + patch_code(code_seg.substr(code_seg.indexOf(index) + index.length), matches);
										}
										return code_seg.substr(0, code_seg.indexOf(index)) + index + patch_code(code_seg.substr(code_seg.indexOf(index) + index.length), matches);
									})(code_seg, matches);
								}
								code += "\t" + code_seg + ",\n";
								ref_table[i][prop][len].isRestored = [i, prop];
							}
							code += "]\n";
							continue;
						}
						if(ref_table[i][prop] && ref_table[i][prop].isRestored){
							code += "\t" + new_fsm + "." + prop + " = " + "($fsm.get_ref(" + ref_table[i][prop].isRestored[0] + "))." + ref_table[i][prop].isRestored[1] + ";\n";
							continue;
						}
						if(ref_table[i][prop] instanceof Function){
							var code_seg = ref_table[i][prop].fsm_toString();
							//if(prop == "$ret_func" || prop == "$evt_func"){
							var matches = code_seg.match(/\$fsm[0-9]+/g);
							var passes = code_seg.match(/\$fsm[0-9]+ = \$fsm.create/g);
							for(var pass = 0; passes && pass < passes.length; pass++){
								passes[pass] = passes[pass].slice(0, passes[pass].indexOf(' '));
								matches = matches.filter(function(a){return a !== passes[0]});
							}
							if(matches){
								code_seg = (function patch_code(code_seg, matches){
									if(matches.length == 0)return code_seg;
									var index = matches.shift();
									if(code_seg.indexOf(index) > 0 && code_seg[code_seg.indexOf(index) - 1] != '.'){
										return code_seg.substr(0, code_seg.indexOf(index)) + "($fsm.get_ref(" + ref_table[i].$scopes[index] + "))" + patch_code(code_seg.substr(code_seg.indexOf(index) + index.length), matches);
										//return code_seg.substr(0, code_seg.indexOf(index)) + "$fsm" + ref_table[i].$scopes[index] + patch_code(code_seg.substr(code_seg.indexOf(index) + index.length), matches);
									}
									return code_seg.substr(0, code_seg.indexOf(index)) + index + patch_code(code_seg.substr(code_seg.indexOf(index) + index.length), matches);
								})(code_seg, matches);
							}
							//}
							code += "\t" + new_fsm + "." + prop + " = " + code_seg + ";\n";
						}
						else{
							//code += "\t" + new_fsm + "." + prop + " = " + stringify(ref_table[i][prop], prop) + ";\n";
							code += "\t" + new_fsm + "." + prop + " = " + iterativeStringify(ref_table[i][prop], prop) + ";\n";
							//code += "\t" + new_fsm + "." + prop + " = " + stringifyPrototype(ref_table[i][prop], prop) + ";\n";
						}
					}
					if(ref_table[i][prop])ref_table[i][prop].isRestored = [i, prop];
				}
			}
			code += "})();\n\n";
			//for(var i = 1; i < ref_table.length; i++){
            for (let i = 1; i < lengthOfWeakMap(ref_table); i++) {
				for(var prop in ref_table[i]){
					if(ref_table[i][prop])delete ref_table[i][prop].isRestored;
				}
			}

			// [runtime] Global variables recover code
			code += "// Restore Global Variables \n";

			/*
			var global_array = Object.keys(window).slice(initial_global.length);
			for(var global_index = 0; global_index < global_array.length; global_index++){
				var ref_table_index = lookupFunction(window[global_array[global_index]]);
				if(!window[global_array[global_index]]){
					code += "var " + global_array[global_index] + ";\n";
				}
				else if(ref_table_index[0] > -1){
					if(ref_table_index[1] == "$ret_func")
						code += "var " + global_array[global_index] + " = $fsm.get_ref(" + ref_table_index[0] + ").$ret_func;\n";
					else
						code += "var " + global_array[global_index] + " = $fsm.get_ref(" + ref_table_index[0] + ")." + ref_table_index[1] + ";\n";
				}
				else{
					if(window[global_array[global_index]] instanceof Array){
						code += "var " + global_array[global_index] + " = [];\n";
					}
					else if(typeof window[global_array[global_index]] == "object"){
						code += "var " + global_array[global_index] + " = {};\n";
					}
					else{
						code += "var " + global_array[global_index] + " = " + JSON.stringify(window[global_array[global_index]]) + ";\n";
					}
				}
				if(window[global_array[global_index]])window[global_array[global_index]].isRestored = global_index;
			}

			for(var global_index = 0; global_index < global_array.length; global_index++){
				
			}
			*/
			var global_array = Object.keys(window).slice(initial_global.length);
			for(var global_index = 0; global_index < global_array.length; global_index++){
				if(global_array[global_index] == "rawHTML")continue;
				if(global_array[global_index].startsWith("$fsm_index"))continue;
				if(window[global_array[global_index]] === undefined){
					code += "var " + global_array[global_index] + ";\n";
					continue;
				}
				var ref_table_index = lookupFunction(window[global_array[global_index]]);
				if(ref_table_index[0] > -1){
					//if(window[global_array[global_index]] && window[global_array[global_index]].isRestored){
					//	code += "var " + global_array[global_index] + " = " + global_array[window[global_array[global_index].isRestored]] + ";\n";
					//	continue;
					//}
					if(ref_table_index[1] == "$ret_func")
						code += "var " + global_array[global_index] + " = ($fsm.get_ref(" + ref_table_index[0] + ")).$ret_func;\n";
					else
						code += "var " + global_array[global_index] + " = ($fsm.get_ref(" + ref_table_index[0] + "))." + ref_table_index[1] + ";\n";
				}
				else{
					//if(window[global_array[global_index].isRestored]){
					//	code += "var " + global_array[global_index] + " = " + global_array[window[global_array[global_index].isRestored]] + ";\n";
					//	continue;
					//}
					//if(!(window[global_array[global_index]] instanceof Function))code += "var " + global_array[global_index] + " = ";
					if(!(window[global_array[global_index]] instanceof Function))code += "var ";
					else{
						var func_string = window[global_array[global_index]].fsm_toString();
						var match = func_string.match(/function\ *\(/);
						//if(match && match.index == 0)code += "var " + global_array[global_index] + " = ";
						if(match && match.index == 0)code += "var ";
					}
					code += iterativeStringify(window[global_array[global_index]], global_array[global_index]) + ";\n";
					//code += stringify(window[global_array[global_index]], global_array[global_index]) + ";\n";
					//code += stringifyPrototype(window[global_array[global_index]], global_array[global_index]) + ";\n";
					//code += "var " + global_array[global_index] + " = " + stringify(window[global_array[global_index]], global_array[global_index]) + ";\n";
				}
				//if(window[global_array[global_index]])window[global_array[global_index]].isRestored = global_index;
			}
			for(var global_index = 0; global_index < global_array.length; global_index++){
				if(window[global_array[global_index]])delete window[global_array[global_index]].isRestored;
			}

			//code += "\n// Restore Prototype \n";
			//for(var global_object_index = 0; global_object_index < global_objects.length; global_object_index++){
			//	for(var i in window[global_objects[global_object_index]].prototype){
			//		code += global_objects[global_object_index] + ".prototype." + i + " = " + stringify(window[global_objects[global_object_index]].prototype[i], i) + ";\n";
			//	}
			//}

			// [runtime] Event handler
			code += "\n// Restore Event Handlers \n";

			for ( var i = 0; i < eh_index; i++){
				if (event_table[i].type == 0){ // addEventListener
					if(event_table[i].event == "DOMContentLoaded")continue;
					var ScopeInd = $fsm.getScopeObj(event_table[i].obj);
					var event = JSON.stringify(event_table[i].event);
					var callback = event_table[i].callback.fsm_toString();
					if(event_table[i].ref_index){
						if(event_table[i].ref_index instanceof Array){
							for(var ref in event_table[i].ref_index){
								callback = replaceAll(callback, "$fsm" + event_table[i].ref_index[ref][0], "($fsm.get_ref(" + event_table[i].ref_index[ref][1] + "))");
							}
						}
						else{
							for(var j in ref_table[event_table[i].ref_index]){
								if(ref_table[event_table[i].ref_index][j] == event_table[i].callback){
									callback = "($fsm.get_ref(" + event_table[i].ref_index + "))." + j;
								}
							}
						}
					}
					//var ref_table_index = lookupFunction(event_table[i].callback, "evt");
					//if(ref_table_index[0] > -1){
					//	if(ref_table_index[1] == "$evt_func")callback = "$fsm.get_ref(" + ref_table_index[0] + ").$evt_func[" + ref_table_index[2] + "]";
					//	else callback = "$fsm.get_ref(" + ref_table_index[0] + ")." + ref_table_index[1];
					//}
					if( ScopeInd > -1 ){ // in ref_table
						code += "$fsm_ref" + ScopeInd + ".fsm_addEventListener(" + JSON.stringify(event_table[i].ref_index) + ", " + event + ", " + callback + ");\n";
					} else if( event_table[i].obj == window ){ // obj == window
						code += "window.fsm_addEventListener(" + JSON.stringify(event_table[i].ref_index) + ", " + event + ", " + callback + ");\n";
					} else if ( event_table[i].obj == document ) { // obj == document
						code += "document.fsm_addEventListener(" + JSON.stringify(event_table[i].ref_index) + ", " + event + ", " + callback + ");\n"; 
					} else { // obj == document's child var obj_str = $fsm.getRootPath(event_table[i].obj); code += obj_str + ".fsm_addEventListener(" + event + ", " + callback + ");\n";
						var str = event_table[i].obj.fsm_toString();
						if(str.includes("[object HTML")){
							str = getHTMLElementPath(event_table[i].obj);
							code += str + ".fsm_addEventListener(" + JSON.stringify(event_table[i].ref_index) + ", " + event + ", " + callback + ");\n";
						}
					}
				}
				else if (event_table[i].type == 1){ // setTimeout
					var time_modify = t0 - event_table[i].startTime;
					if(time_modify > event_table[i].time) continue;
					var ref_table_index = lookupFunction(event_table[i].callback, "evt");
					var callback = event_table[i].callback.fsm_toString();
					if(event_table[i].ref_index){
						if(event_table[i].ref_index instanceof Array){
							for(var ref in event_table[i].ref_index){
								callback = replaceAll(callback, "$fsm" + event_table[i].ref_index[ref][0], "($fsm.get_ref(" + event_table[i].ref_index[ref][1] + "))");
							}
						}
						else{
							for(var j in ref_table[event_table[i].ref_index]){
								if(ref_table[event_table[i].ref_index][j] == event_table[i].callback){
									callback = "($fsm.get_ref(" + event_table[i].ref_index + "))." + j;
								}
							}
						}
					}
					var global_lookup_index = lookupGlobal(event_table[i].callback);
					if(global_lookup_index){
						callback = global_lookup_index[0];
					}
					code += "fsm_setTimeout(" + JSON.stringify(event_table[i].ref_index) + ", " + callback + ", " + time_modify + ");\n";
				}
				else if (event_table[i].type == 2) { // setInterval
					var time_modify = event_table[i].interval - (t0 - event_table[i].time) % event_table[i].interval;
					//var callback_str = event_table[i].callback.fsm_toString();
					//var append_str = "$fsm_ref0.fsm_setInterval( " + callback_str + ", " + event_table[i].interval + ");"
					//callback_str = callback_str.slice(0,callback_str.lastIndexOf("}")) + append_str + callback_str.slice(callback_str.lastIndexOf("}"));
					//code += "$fsm_ref0.fsm_setTimeout( " + callback_str + ", " + remain_time + ");\n";
					var ref_table_index = lookupFunction(event_table[i].callback, "evt");
					var callback = event_table[i].callback.fsm_toString();
					if(event_table[i].ref_index){
						if(event_table[i].ref_index instanceof Array){
							for(var ref in event_table[i].ref_index){
								callback = replaceAll(callback, "$fsm" + event_table[i].ref_index[ref][0], "($fsm.get_ref(" + event_table[i].ref_index[ref][1] + "))");
							}
						}
						else{
							for(var j in ref_table[event_table[i].ref_index]){
								if(ref_table[event_table[i].ref_index][j] == event_table[i].callback){
									callback = "($fsm.get_ref(" + event_table[i].ref_index + "))." + j;
								}
							}
						}
					}
					var global_lookup_index = lookupGlobal(event_table[i].callback);
					if(global_lookup_index){
						callback = global_lookup_index[0];
					}
					code += "fsm_setTimeout(" + JSON.stringify(event_table[i].ref_index) + ", " + callback + ", " + time_modify + ");\n";
					code += "fsm_setTimeout(" + JSON.stringify(event_table[i].ref_index) + ", " + "fsm_setInterval(" + JSON.stringify(event_table[i].ref_index) + ", " + callback + ", " + event_table[i].interval + "), " + (time_modify + event_table[i].interval) + ");\n";
				}
			}

			code += "\n";
			code += "// Event attributes re-register \n";
			code += "$fsm.registerEventAttribs(); \n\n";

			ser_time = new Date().getTime() - t0;
			console.log('serialize time: ' + (new Date().getTime() - t0));
			//alert('serialize time: ' + (new Date().getTime() - t0) + "\nref_table size: " + ref_table.length + "\nevt_table size: " + eh_index);
			//console.log(code);
			return code;
		},
		addEventHandler: function(obj, event, callback, ref_index, evtCapturing) {
			var eh = {
				ref_index: ref_index,
				obj: obj,
				event: event,
				callback: callback,
				evtCapturing: evtCapturing,
				type : 0	// 11.02
			};
			event_table[eh_index] = eh;
			eh_index++;
		},
		setTime: function(obj, callback, time, startTime, ref_index){
			var eh = {
				ref_index: ref_index,
				obj: obj,
				time: time,
				callback: callback,
				startTime: startTime,
				type: 1	// 11.02
			};
			//this.removeFinishedEvent();
			event_table[eh_index] = eh;
			var _eh_index = eh_index;
			setTimeout(function(){
				var index = event_table.indexOf(eh);
				event_table.splice(index, 1);
				eh_index--;
			}, time + 50);
			eh_index++;
		},
		setInterval: function(obj, callback, interval, time, ref_index){
			var eh = {
				ref_index: ref_index,
				obj: obj,
				interval: interval,
				time : time,
				callback: callback,
				type: 2	// 11.02
			};
			event_table[eh_index] = eh;
			eh_index++;
		},
		restoreDOM : function(rawHTML){
			// [runtime] DOM tree recover code by Yoo Hyeongseok 2017.10.25
			document.documentElement.innerHTML = rawHTML;

			// [runtime] replace event Attributes to global(ref_table)
			domTreeTraversal(document.head);
			domTreeTraversal(document.body);

			function domTreeTraversal(node){
				var dtt = {
					checkAttribs : function(){
						var attribs = node.attributes;
						if( attribs == undefined ) return;
						for( var i = 0 ; i < attribs.length ; i++ ){
							var key   = attribs[i].name;
							var value = attribs[i].value;
							if( HtmlDomEvents.includes( key ) ){
								//console.log( node, key, value );
								event_attrib_table.push( { "obj" : node, "event" : key, "callback" : value });
							}
						}
					},
					traverseChild: function(){
						for( var i = 0 ; i < node.childNodes.length ; i++ ){
							domTreeTraversal(node.childNodes[i]);
						}
					}
				}
				
				if( node == undefined ) return;
				if( parent != "document" && node.nodeName != "#text")
					dtt.checkAttribs();
				dtt.traverseChild();
			}
		},
		registerEventAttribs : function(){
			for( var i = 0 ; i < event_attrib_table.length ; i++ ) {
				var event_attrib = event_attrib_table[i];
				var htmlElem = event_attrib["obj"]
				var event    = event_attrib["event"];
				var callback = event_attrib["callback"];
				var callback_replace = callback;
				var funcname = callback.substr(0, callback.indexOf("(")).trim();
				if( funcname in ref_table[0] )
					callback_replace = '$fsm0.' + callback.trim();
				
				if( htmlElem.getAttribute(event) == callback ) {
					htmlElem.removeAttribute( event );
					htmlElem.setAttribute( event, callback_replace );
				}
			}
		},
		getRootPath : function(target){
			queue = [];
			root = new Object();
			root.path = "document.documentElement";
			root.node = document.documentElement;
			queue.push(root);
			while( queue.length > 0 ){
				var cur = queue.shift();
				if( cur.node == target ) return cur.path;
				for( var i = 0 ; i < cur.node.childNodes.length ; i++ ){
					var child = new Object();
					child.path = cur.path + ".childNodes[" + i + "]";
					child.node = cur.node.childNodes[i];
					queue.push(child);
				}
			}
			return null;
		},
		ref_table: ref_table,
		initial_global: initial_global,
		event_table: event_table
	};
})();

// [runtime] getElemnts method, register $argument
Object.prototype.fsm_getElementById = function(id){
	var ret = this.getElementById(id);
	ret.$method = ".fsm_getElementById(" + JSON.stringify(id) + ")";
	return ret;
}

Object.defineProperty(Object.prototype, 'fsm_getElementById', {
	enumerable: false,
	writable: true,
	configurable: true 
});

Object.prototype.fsm_getElementsByName = function(id){
	var ret = this.getElementsByName(id);
	ret.$obj    = this;
	ret.$method = ".fsm_getElementsByName(" + JSON.stringify(id) + ")";
	return ret;
}

Object.defineProperty(Object.prototype, 'fsm_getElementsByName', {
	enumerable: false,
	writable: true,
	configurable: true 
});

Object.prototype.fsm_getElementsByTagName = function(id){
	var ret = this.getElementsByTagName(id);
	ret.$obj    = this;
	ret.$method = ".fsm_getElementsByTagName(" + JSON.stringify(id) + ")";
	return ret;
}

Object.defineProperty(Object.prototype, 'fsm_getElementsByTagName', {
	enumerable: false,
	writable: true,
	configurable: true 
});

Object.prototype.fsm_getElementsByClassName = function(id){
	var ret = this.getElementsByClassName(id);
	ret.$obj    = this;
	ret.$method = ".fsm_getElementsByClassName(" + JSON.stringify(id) + ")";
	return ret;
}

Object.defineProperty(Object.prototype, 'fsm_getElementsByClassName', {
	enumerable: false,
	writable: true,
	configurable: true 
});

Object.prototype.fsm_addEventListener = function(ref_index, event, callback, evtCapturing){
	$fsm.addEventHandler(this, event, callback, ref_index, evtCapturing);
	this.addEventListener(event, callback, evtCapturing);
};

Object.defineProperty(Object.prototype, 'fsm_addEventListener', {
	enumerable: false,
	writable: true,
	configurable: true 
});

// window. -> Object.prototype.
Object.prototype.fsm_setTimeout = function(ref_index, callback, interval){
	var startTime = new Date().getTime();
	$fsm.setTime(this, callback, interval, startTime, ref_index);
	window.setTimeout(callback, interval);          // this->window
};
/*
Object.prototype.fsm_setTimeout = function(callback, time){
	var startTime = new Date().getTime();
	$fsm.setTime(this, callback, startTime + time);
	var endTime = new Date().getTime();
	var delay = endTime - startTime;
	window.setTimeout(callback, time);          // this->window
};
*/

Object.defineProperty(Object.prototype, 'fsm_setTimeout', {
	enumerable: false,
	writable: true,
	configurable: true 
});

Object.prototype.fsm_setInterval = function(ref_index, callback, time){
	var startTime = new Date().getTime();
	$fsm.setInterval(this, callback, time, startTime, ref_index);
	var endTime = new Date().getTime();
	var delay = endTime - startTime;
	window.setInterval(callback, time);          // this->window
};

Object.defineProperty(Object.prototype, 'fsm_setInterval', {
	enumerable: false,
	writable: true,
	configurable: true 
});

Object.prototype.fsm_toString = Object.prototype.toString;

Object.defineProperty(Object.prototype, 'fsm_toString', {
	enumerable: false,
	writable: true,
	configurable: true 
});

Function.prototype.fsm_toString = Function.prototype.toString;

Object.defineProperty(Function.prototype, 'fsm_toString', {
	enumerable: false,
	writable: true,
	configurable: true 
});

var $fsm0 = $fsm.create();


var JSONfn = new Object();
(function (exports) {
"use strict";

  exports.stringify = function (obj) {

    return JSON.stringify(obj, function (key, value) {
      var fnBody;
      if (value instanceof Function || typeof value == 'function') {

	// Inject scope Objects
	//var ast = esprima.parse(obj);
	//console.log(ast);

        fnBody = value.toString();

        if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { //this is ES6 Arrow Function
          return '_NuFrRa_' + fnBody;
        }
        return fnBody;
      }
      if (value instanceof RegExp) {
        return '_PxEgEr_' + value;
      }
      return value;
    });
  };

  exports.parse = function (str, date2obj) {

    var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;

    return JSON.parse(str, function (key, value) {
      var prefix;

      if (typeof value != 'string') {
        return value;
      }
      if (value.length < 8) {
        return value;
      }

      prefix = value.substring(0, 8);

      if (iso8061 && value.match(iso8061)) {
        return new Date(value);
      }
      if (prefix === 'function') {
        return eval('(' + value + ')');
      }
      if (prefix === '_PxEgEr_') {
        return eval(value.slice(8));
      }
      if (prefix === '_NuFrRa_') {
        return eval(value.slice(8));
      }

      return value;
    });
  };

  exports.clone = function (obj, date2obj) {
    return exports.parse(exports.stringify(obj), date2obj);
  };
}(JSONfn));

var HtmlDomEvents = {
	includes : function (attrib){
		return this.MouseEvents.includes(attrib) ||
			this.KeyboardEvents.includes(attrib) ||
			this.FrameObjectEvents.includes(attrib) ||
			this.FormEvents.includes(attrib) ||
			this.DragEvents.includes(attrib) ||
			this.ClipboardEvents.includes(attrib) ||
			this.PrintEvents.includes(attrib) ||
			this.MediaEvents.includes(attrib) ||
			this.AnimationEvents.includes(attrib) ||
			this.TransitionEvents.includes(attrib) ||
			this.ServerSentEvents.includes(attrib) ||
			this.MiscEvents.includes(attrib) ||
			this.TouchEvents.includes(attrib);
	},
	MouseEvents : [ 
		"onclick",
		"oncontextmenu",
		"ondblclick",
		"onmousedown",
		"onmouseenter",
		"onmouseleave",
		"onmousemoe",
		"onmouseover",
		"onmouseout",
		"onmouseup",
	],
	KeyboardEvents : [
		"onkeydown",
		"onkeypress",
		"onkeyup"
	],
	FrameObjectEvents : [
		"onabort",
		"onbeforeunload",
		"onerror",
		"onhashchange",
		"onload",
		"onpageshow",
		"onpagehide",
		"onresize",
		"onscroll",
		"onunload"
	],
	FormEvents : [
		"onblur",
		"onchange",
		"onfocus",
		"onfocusin",
		"onfocusout",
		"oninput",
		"oninvalid",
		"onreset",
		"onsearch",
		"onselect",
		"onsubmit"
	],
	DragEvents : [
		"ondrag",
		"ondragend",
		"ondragenter",
		"ondragleave",
		"ondragover",
		"ondragstart",
		"ondrop"
	],
	ClipboardEvents : [
		"oncopy",
		"oncut",
		"onpaste"
	],
	PrintEvents : [
		"onafterprint",
		"onbeforeprint",
	],
	MediaEvents : [
		"onabort",
		"oncanplay",
		"oncanplaythrough",
		"ondurationchange",
		"onemptied",
		"onended",
		"onerror",
		"onloadeddata",
		"onloadedmetadata",
		"onloadstart",
		"onpause",
		"onplay",
		"onplaying",
		"onprogress",
		"onratechange",
		"onseeked",
		"onseeking",
		"onstalled",
		"onsuspend",
		"ontimeupdate",
		"onvolumechange",
		"onwaiting"
	],
	AnimationEvents : [
		"animationend",
		"animationiteration",
		"animationstart"
	],
	TransitionEvents : [
		"transitionend"
	],
	ServerSentEvents : [
		"onerror",
		"onmessage",
		"onopen"
	],
	MiscEvents : [
		"onmessage",
		"onmousewheel",
		"ononline",
		"onoffline",
		"onpopstate",
		"onshow",
		"onstorage",
		"ontoggle",
		"onwheel"		
	],
	TouchEvents : [
		"ontouchcancel",
		"ontouchend",
		"ontouchmove",
		"ontouchstart"
	]
};

/*
function toJSON(node) {
	node = node || this;
	var obj = {
		nodeType: node.nodeType
	};
	if (node.tagName) {
		obj.tagName = node.tagName.toLowerCase();
	} else
		if (node.nodeName) {
			obj.nodeName = node.nodeName;
		}
	if (node.nodeValue) {
		obj.nodeValue = node.nodeValue;
	}
	var attrs = node.attributes;
	if (attrs) {
		var length = attrs.length;
		var arr = obj.attributes = new Array(length);
		for (var i = 0; i < length; i++) {
			attr = attrs[i];
			arr[i] = [attr.nodeName, attr.nodeValue];
		}
	}
	var childNodes = node.childNodes;
	if (childNodes) {
		length = childNodes.length;
		arr = obj.childNodes = new Array(length);
		for (i = 0; i < length; i++) {
			arr[i] = toJSON(childNodes[i]);
		}
	}
	return obj;
}

function toDOM(obj) {
	if (typeof obj == 'string') {
		obj = JSON.parse(obj);
	}
	var node, nodeType = obj.nodeType;
	switch (nodeType) {
		case 1: //ELEMENT_NODE
			node = document.createElement(obj.tagName);
			var attributes = obj.attributes || [];
			for (var i = 0, len = attributes.length; i < len; i++) {
				var attr = attributes[i];
				node.setAttribute(attr[0], attr[1]);
			}
			break;
		case 3: //TEXT_NODE
			node = document.createTextNode(obj.nodeValue);
			break;
		case 8: //COMMENT_NODE
			node = document.createComment(obj.nodeValue);
			break;
		case 9: //DOCUMENT_NODE
			node = document.implementation.createDocument();
			break;
		case 10: //DOCUMENT_TYPE_NODE
			node = document.implementation.createDocumentType(obj.nodeName);
			break;
		case 11: //DOCUMENT_FRAGMENT_NODE
			node = document.createDocumentFragment();
			break;
		default:
			return node;
	}
	if (nodeType == 1 || nodeType == 11) {
		var childNodes = obj.childNodes || [];
		for (i = 0, len = childNodes.length; i < len; i++) {
			node.appendChild(toDOM(childNodes[i]));
		}
	}
	return node;
}
*/

//}(typeof exports === 'undefined' ? (window.JSONfn = {}) : exports));

/*
module.exports = {
  $fsm, $fsm0, JSONfn
}
*/