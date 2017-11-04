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

var $fsm = (function() {
	var dom;
	var ref_table = new Array();
	var event_table = new Array();
	var event_attrib_table = new Array();

	//var call_stack = new Array();
	//call_stack.push(new Object()); // global object
	//Object.prototype.$ref_table = ref_table;
	var ref_index = 0;
	var eh_index = 0;

	return {
		create: function(args) {
			//var symbol = Symbol(desc);
			var obj = new Object();
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
		get: function(key) {
			return ref_table[key];
		},
		getScopeObj : function(obj){
			return ref_table.indexOf(obj);
		},
		print: function() {
			// Only for debug
			console.log("print");
			//var symbols = Object.getOwnPropertySymbols(ref_table);
			//for (var i = 0; i < symbols.length; i++) {
			//	console.log(symbols[i], ref_table[symbols[i]]);
			//}

			for (var i = 0; i < ref_table.length; i++) {
				console.log('ref_table[' + i + ']');
				for (var key in ref_table) {
					console.log(key, ref_table[key]);
				}
			}
		},
		replace: function(rft) {
			ref_table = JSON.parse(JSON.stringify(rft));
		},
		serialize: function() {
			var t0 = new Date().getTime();
			//var ser = JSON.stringify(ref_table);
			//var ser = JSONfn.stringify(ref_table);
			//var dom = JsonML.fromHTML(document);

			var code = "";
			// [runtime] DOM tree recover code by Yoo Hyeongseok 2017.10.25
			code += "// Restore Dom Object \n";
			code += "var rawHTML = " + JSON.stringify(document.documentElement.outerHTML) + "\n";
			code += "$fsm.restoreDOM(rawHTML);\n\n";
			
			code += "// ref_table serialize code \n";
			// [runtime] serialize js code by Yoo Hyeongseok, 2017.09.26
			for( var i = 0 ; i < 1 ; i++ ){
				for( var key in ref_table[i] ) {
					var value;
					if( key.startsWith("fsm_")) continue;
					if( ref_table[i][key] instanceof Function || typeof ref_table[i][key] == 'function' ){
						value = ref_table[i][key].toString();
					}
					else {
						var value = JSON.stringify( ref_table[i][key] );
					}
				
					// if $scopeObj defined, it is instanceof Object
					if(  ref_table[i][key].$scopeObj != undefined ) { // ref_table[i][key].$scopeObj instanceof Object || typeof ref_table[i][key].$scopeObj == 'object'  ) {
						// has scope chain
						for ( var fsm in ref_table[i][key].$scopeObj ) {
							if( !fsm.startsWith("$fsm") ) continue;
							var refLine = 'var ' + fsm + ' = ' + JSON.stringify(ref_table[1]) + ';' // ' = ref_table[' + ref_table[i][key].$scopeObj[fsm] + '];';
							var insertInd = value.indexOf('{') + 1;
							var indent = '';
							var indentCur = insertInd;
							// auto indent
							while( ['\n', '\t', ' '].includes(value[indentCur])){
								indent += value[indentCur];
								indentCur++;
							}
							value = value.slice(0, insertInd) + indent + refLine + value.slice(insertInd);
						}
					}
					code += '$fsm' + i + "." + key + " = " + value + ';\n';
				}
			}

			// [runtime] Event handler
			code += "\n";
			for ( var i = 0; i < eh_index; i++){
				if (event_table[i].type == 0){
					if( $fsm.getScopeObj($fsm.event_table[i].obj) ){
						code += JSON.stringify($fsm.event_table[i].obj) + ".fsm_addEventListener(" + JSON.stringify(event_table[i].event) + ", " + event_table[i].callback.toString() + ");\n";
					}
					else {
						code += "$fsm" + $fsm.getScopeObj($fsm.event_table[i].obj) + ".fsm_addEventListener(" + JSON.stringify(event_table[i].event) + ", " + event_table[i].callback.toString() + ");\n";
					}
				}
				if (event_table[i].type == 1){
					var time_modify = event_table[i].time - t0;
					if( time_modify < 0 ) continue;
					if( $fsm.getScopeObj($fsm.event_table[i].obj) ){
						code += JSON.stringify($fsm.event_table[i].obj) + ".fsm_setTimeout(" + $fsm.event_table[i].callback.toString() + ", " + time_modify + ");\n";
					}
					else {
						code += "$fsm" + $fsm.getScopeObj($fsm.event_table[i].obj) + ".fsm_setTimeout(" + $fsm.event_table[i].callback.toString() + ", " + time_modify + ");\n";
					}
				}
			}

			code += "\n";
			code += "// Event attributes re-register \n";
			code += "$fsm.registerEventAttribs(); \n\n";

			console.log('serialize time: ' + (new Date().getTime() - t0));
			//console.log(code);
			return code;
		},
		addEventHandler: function(obj, event, callback) {
			var eh = {
				obj: obj,
				event: event,
				callback: callback,
				type : 0	// 11.02
			};
			event_table[eh_index] = eh;
			eh_index++;
		},
		setTime: function(obj, callback, time){
			var eh = {
				obj: obj,
				time: time,
				callback: callback,
				type: 1	// 11.02
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
								console.log( node, key, value );
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
		ref_table: ref_table,
		event_table: event_table
	};
})();

Object.prototype.fsm_addEventListener = function(event, callback){
	$fsm.addEventHandler(this, event, callback);
	this.addEventListener(event, callback);
};

// window. -> Object.prototype.
Object.prototype.fsm_setTimeout = function(callback, time){
	console.log(this);
	var startTime = new Date().getTime();
	$fsm.setTime(this, callback, startTime + time);
	var endTime = new Date().getTime();
	var delay = endTime - startTime;
	window.setTimeout(callback, time);          // this->window
};

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


//}(typeof exports === 'undefined' ? (window.JSONfn = {}) : exports));

/*
module.exports = {
  $fsm, $fsm0, JSONfn
}
*/
