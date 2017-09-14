__Hibernation__.obj_ref = new Array();
__Hibernation__.timerid_ref = new Array();
(function() {
	var objectIndex = [1,3,5,7,8,9,12,14,15,18,19,20,21,22,23,25,26,27,28,29,30,31,34,35,41,43,45,47,49,51,];
	var arrayIndex=[40,];
	for (var i=0; i < objectIndex.length; ++i){
		__Hibernation__.obj_ref[objectIndex[i]] = {};
	}
	for (var i=0; i < arrayIndex.length; ++i){
		__Hibernation__.obj_ref[arrayIndex[i]] = new Array();
	}
})();
/*
__Hibernation__.obj_ref[0] = function secondExecution() {
	window.newObj = { a: "HELLO", b: oldObj };
	oldObj.newProp = newObj;
//	delete oldObj.deleteme;

	closure1();

	oldFunction = function() {
		console.log("new function");
	}

	window.closure2;
	(function() {
		var x = 0;
		var a = function(j) {
			console.log(j);
		};
		(function() {
		 	var y = 0;
			var b = function(k) {
				console.log(k);
			};
			closure2 = function() {
				a(x++);
				b(y++);
				console.log(window.closure2.c2prop);
				document.getElementById("hello").innerHTML = "Hello, World" + x + y;
			};
		})();
	})();

	window.closure3;
	(function() {
	    var x = 0;
		var c = function() {
			console.log(x++);
		}
		var d = closure2;
		closure3 = function() {
			c();
			d();
		}
	})();

	closure2.c2prop = "C2PROP";
};
(function() {
	__Hibernation__.obj_ref[2] = function () {
		console.log("[" + a++ + "]");
		window.oldFunction();
	};
	// CLOSURE VARIABLES
	var a = 5;
})();
__Hibernation__.obj_ref[4] = function invokeEvent() {
	closure1();
	closure3();
};
__Hibernation__.obj_ref[6] = function () {
		console.log("new function");
	};
(function() {
	(function() {
		__Hibernation__.obj_ref[10] = function () {
				a(x++);
				b(y++);
				console.log(window.closure2.c2prop);
				document.getElementById("hello").innerHTML = "Hello, World" + x + y;
			};
		__Hibernation__.obj_ref[11] = function (k) {
				console.log(k);
			};
		// CLOSURE VARIABLES
		var b = __Hibernation__.obj_ref[11];
		var y = 4;
	})();
	__Hibernation__.obj_ref[13] = function (j) {
			console.log(j);
		};
	// CLOSURE VARIABLES
	var x = 4;
	var a = __Hibernation__.obj_ref[13];
})();
(function() {
	__Hibernation__.obj_ref[16] = function () {
			c();
			d();
		};
	__Hibernation__.obj_ref[17] = function () {
			console.log(x++);
		};
	// CLOSURE VARIABLES
	var x = 4;
	var c = __Hibernation__.obj_ref[17];
	var d = __Hibernation__.obj_ref[10];
})();
__Hibernation__.obj_ref[24] = window["Performance"]["prototype"]["now"];
__Hibernation__.obj_ref[32] = window["DOMStringList"]["prototype"]["contains"];
__Hibernation__.obj_ref[33] = window["DOMStringList"]["prototype"]["item"];
__Hibernation__.obj_ref[36] = window["Location"]["prototype"]["assign"];
__Hibernation__.obj_ref[37] = window["Location"]["prototype"]["reload"];
__Hibernation__.obj_ref[38] = window["Location"]["prototype"]["replace"];
__Hibernation__.obj_ref[39] = window["Location"]["prototype"]["toString"];
__Hibernation__.obj_ref[42] = function (e) {
    if(e.ctrlKey && e.keyCode===77) { // '77' stands for the 'm' key
        // TODO: The prefix for the output files is always "sample". We can use an uni-directional hash function for the given URL.
//        __Hibernation__.SaveState( "sample" ); 
        __Hibernation__.wsFlag = false;
        __Hibernation__.Execute( __Hibernation__.SaveState, "SaveState", "sample" ); 
    } };
__Hibernation__.obj_ref[44] = function (e) {
    if(e.ctrlKey && e.keyCode===75) { // '75' stands for the 'k' key
        // TODO: The prefix for the output files is always "sample". We can use an uni-directional hash function for the given URL.
//        __Hibernation__.SaveState( "sample" ); 
        //Send sample files using websocket
        __Hibernation__.wsFlag = true;
        __Hibernation__.Execute( __Hibernation__.SaveState, "SaveState", "sample" );
    } };
__Hibernation__.obj_ref[46] = function (e) {
    if(e.ctrlKey && e.keyCode===77) { // '77' stands for the 'm' key
        // TODO: The prefix for the output files is always "sample". We can use an uni-directional hash function for the given URL.
//        __Hibernation__.SaveState( "sample" ); 
//        __Hibernation__.wsFlag = false;
//        __Hibernation__.Execute( __Hibernation__.SaveState, "SaveState", "sample" ); 
		  __Hibernation__.serialize();
    } };
*/
__Hibernation__.obj_ref[48] = function onclick(event) { secondExecution();
};
__Hibernation__.obj_ref[50] = function onclick(event) { invokeEvent();
};
/*
__Hibernation__.obj_ref[1]["constructor"] = __Hibernation__.obj_ref[0];
Object.defineProperty(__Hibernation__.obj_ref[1], "constructor", { enumerable: false });
__Hibernation__.obj_ref[3]["constructor"] = __Hibernation__.obj_ref[2];
Object.defineProperty(__Hibernation__.obj_ref[3], "constructor", { enumerable: false });
__Hibernation__.obj_ref[5]["constructor"] = __Hibernation__.obj_ref[4];
Object.defineProperty(__Hibernation__.obj_ref[5], "constructor", { enumerable: false });
__Hibernation__.obj_ref[7]["constructor"] = __Hibernation__.obj_ref[6];
Object.defineProperty(__Hibernation__.obj_ref[7], "constructor", { enumerable: false });
__Hibernation__.obj_ref[8]["deleteme"] = "deleteme";
__Hibernation__.obj_ref[8]["newProp"] = __Hibernation__.obj_ref[9];
__Hibernation__.obj_ref[9]["a"] = "HELLO";
__Hibernation__.obj_ref[9]["b"] = __Hibernation__.obj_ref[8];
__Hibernation__.obj_ref[12]["constructor"] = __Hibernation__.obj_ref[11];
Object.defineProperty(__Hibernation__.obj_ref[12], "constructor", { enumerable: false });
__Hibernation__.obj_ref[14]["constructor"] = __Hibernation__.obj_ref[13];
Object.defineProperty(__Hibernation__.obj_ref[14], "constructor", { enumerable: false });
__Hibernation__.obj_ref[15]["constructor"] = __Hibernation__.obj_ref[10];
Object.defineProperty(__Hibernation__.obj_ref[15], "constructor", { enumerable: false });
__Hibernation__.obj_ref[18]["constructor"] = __Hibernation__.obj_ref[17];
Object.defineProperty(__Hibernation__.obj_ref[18], "constructor", { enumerable: false });
__Hibernation__.obj_ref[19]["constructor"] = __Hibernation__.obj_ref[16];
Object.defineProperty(__Hibernation__.obj_ref[19], "constructor", { enumerable: false });
__Hibernation__.obj_ref[20]["prototype"] = __Hibernation__.obj_ref[21];
__Hibernation__.obj_ref[20]["length"] = 0;

__Hibernation__.obj_ref[22]["prototype"] = __Hibernation__.obj_ref[23];
__Hibernation__.obj_ref[22]["length"] = 0;
__Hibernation__.obj_ref[23]["now"] = __Hibernation__.obj_ref[24];
__Hibernation__.obj_ref[25]["jsHeapSizeLimit"] = undefined;
__Hibernation__.obj_ref[25]["usedJSHeapSize"] = 10000000;
__Hibernation__.obj_ref[25]["totalJSHeapSize"] = 23100000;
__Hibernation__.obj_ref[25]["__proto__"] = __Hibernation__.obj_ref[26];

__Hibernation__.obj_ref[27]["prototype"] = __Hibernation__.obj_ref[28];
__Hibernation__.obj_ref[27]["length"] = 0;

__Hibernation__.obj_ref[29]["length"] = 0;
__Hibernation__.obj_ref[29]["constructor"] = __Hibernation__.obj_ref[30];
Object.defineProperty(__Hibernation__.obj_ref[29], "constructor", { enumerable: false });
__Hibernation__.obj_ref[29]["__proto__"] = __Hibernation__.obj_ref[31];
__Hibernation__.obj_ref[30]["prototype"] = __Hibernation__.obj_ref[31];
__Hibernation__.obj_ref[30]["length"] = 0;
__Hibernation__.obj_ref[31]["contains"] = __Hibernation__.obj_ref[32];
__Hibernation__.obj_ref[31]["item"] = __Hibernation__.obj_ref[33];
__Hibernation__.obj_ref[34]["prototype"] = __Hibernation__.obj_ref[35];
__Hibernation__.obj_ref[34]["length"] = 0;
__Hibernation__.obj_ref[35]["assign"] = __Hibernation__.obj_ref[36];
__Hibernation__.obj_ref[35]["reload"] = __Hibernation__.obj_ref[37];
__Hibernation__.obj_ref[35]["replace"] = __Hibernation__.obj_ref[38];
__Hibernation__.obj_ref[35]["toString"] = __Hibernation__.obj_ref[39];
__Hibernation__.obj_ref[40]["length"] = 0;
__Hibernation__.obj_ref[41]["jsHeapSizeLimit"] = undefined;
__Hibernation__.obj_ref[41]["usedJSHeapSize"] = 10000000;
__Hibernation__.obj_ref[41]["totalJSHeapSize"] = 23100000;
__Hibernation__.obj_ref[41]["__proto__"] = __Hibernation__.obj_ref[26];
__Hibernation__.obj_ref[43]["constructor"] = __Hibernation__.obj_ref[42];
Object.defineProperty(__Hibernation__.obj_ref[43], "constructor", { enumerable: false });
__Hibernation__.obj_ref[45]["constructor"] = __Hibernation__.obj_ref[44];
Object.defineProperty(__Hibernation__.obj_ref[45], "constructor", { enumerable: false });
__Hibernation__.obj_ref[47]["constructor"] = __Hibernation__.obj_ref[46];
Object.defineProperty(__Hibernation__.obj_ref[47], "constructor", { enumerable: false });
__Hibernation__.obj_ref[49]["constructor"] = __Hibernation__.obj_ref[48];
Object.defineProperty(__Hibernation__.obj_ref[49], "constructor", { enumerable: false });
__Hibernation__.obj_ref[51]["constructor"] = __Hibernation__.obj_ref[50];
Object.defineProperty(__Hibernation__.obj_ref[51], "constructor", { enumerable: false });
// Function Object Properties Mapping
__Hibernation__.obj_ref[0]["prototype"] = __Hibernation__.obj_ref[1];
__Hibernation__.obj_ref[2]["prototype"] = __Hibernation__.obj_ref[3];
__Hibernation__.obj_ref[4]["prototype"] = __Hibernation__.obj_ref[5];
__Hibernation__.obj_ref[6]["prototype"] = __Hibernation__.obj_ref[7];
__Hibernation__.obj_ref[10]["c2prop"] = "C2PROP";
__Hibernation__.obj_ref[10]["prototype"] = __Hibernation__.obj_ref[15];
__Hibernation__.obj_ref[11]["prototype"] = __Hibernation__.obj_ref[12];
__Hibernation__.obj_ref[13]["prototype"] = __Hibernation__.obj_ref[14];
__Hibernation__.obj_ref[16]["prototype"] = __Hibernation__.obj_ref[19];
__Hibernation__.obj_ref[17]["prototype"] = __Hibernation__.obj_ref[18];
__Hibernation__.obj_ref[24]["prototype"] = undefined;
__Hibernation__.obj_ref[32]["prototype"] = undefined;
__Hibernation__.obj_ref[33]["prototype"] = undefined;
__Hibernation__.obj_ref[36]["prototype"] = undefined;
__Hibernation__.obj_ref[37]["prototype"] = undefined;
__Hibernation__.obj_ref[38]["prototype"] = undefined;
__Hibernation__.obj_ref[39]["prototype"] = undefined;
__Hibernation__.obj_ref[42]["prototype"] = __Hibernation__.obj_ref[43];
__Hibernation__.obj_ref[44]["prototype"] = __Hibernation__.obj_ref[45];
__Hibernation__.obj_ref[46]["prototype"] = __Hibernation__.obj_ref[47];
__Hibernation__.obj_ref[48]["prototype"] = __Hibernation__.obj_ref[49];
__Hibernation__.obj_ref[50]["prototype"] = __Hibernation__.obj_ref[51];
// Restore Getter or Setter function

// User defined global objects
var secondExecution = __Hibernation__.obj_ref[0];
var closure1 = __Hibernation__.obj_ref[2];
var invokeEvent = __Hibernation__.obj_ref[4];
var oldFunction = __Hibernation__.obj_ref[6];
var oldObj = __Hibernation__.obj_ref[8];
var newObj = __Hibernation__.obj_ref[9];
var closure2 = __Hibernation__.obj_ref[10];
var closure3 = __Hibernation__.obj_ref[16];
// User added Properties of BuiltIn Objects
window["personalbar"]["constructor"] = __Hibernation__.obj_ref[20];
window["menubar"]["constructor"] = __Hibernation__.obj_ref[20];
window["statusbar"]["constructor"] = __Hibernation__.obj_ref[20];
window["performance"]["constructor"] = __Hibernation__.obj_ref[22];
window["performance"]["memory"] = __Hibernation__.obj_ref[25];
window["performance"]["timing"]["constructor"] = __Hibernation__.obj_ref[27];
window["locationbar"]["constructor"] = __Hibernation__.obj_ref[20];
window["location"]["ancestorOrigins"] = __Hibernation__.obj_ref[29];
window["location"]["constructor"] = __Hibernation__.obj_ref[34];
window["location"]["ancestorOrigins"]["constructor"] = __Hibernation__.obj_ref[30];
window["scrollbars"]["constructor"] = __Hibernation__.obj_ref[20];
window["toolbar"]["constructor"] = __Hibernation__.obj_ref[20];
window["console"]["profiles"] = __Hibernation__.obj_ref[40];
window["console"]["memory"] = __Hibernation__.obj_ref[41];
*/
// DOM Objects Mapping

// DOM Object Properties Mapping
// CSS Animation

// Timer Event code:[0]
// Hibernation Time:[1501311906375]
// DOM Event code
//__Hibernation__.DomTree[0].addEventListener("keydown",  __Hibernation__.obj_ref[42], false);
//__Hibernation__.DomTree[0].addEventListener("keydown",  __Hibernation__.obj_ref[44], false);
//__Hibernation__.DomTree[0].addEventListener("keydown",  __Hibernation__.obj_ref[46], false);
__Hibernation__.DomTree[4].addEventListener("click",  __Hibernation__.obj_ref[48], false);
__Hibernation__.DomTree[5].addEventListener("click",  __Hibernation__.obj_ref[50], false);
