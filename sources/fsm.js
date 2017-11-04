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


//var esprima = require('frameworks/esprima.js');
//var estraverse = require('frameworks/estraverse.browser.js');

var $fsm = (function() {
	var ref_table = new Array();
	//var call_stack = new Array();
	//call_stack.push(new Object()); // global object
	Object.prototype.$ref_table = ref_table;
	var ref_index = 0;

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
			var ser = JSONfn.stringify(ref_table);
			//var dom = JsonML.fromHTML(document);
			console.log('serialize time: ' + (new Date().getTime() - t0));
			console.log(ser);
			// ADD ME: Symbol object serialization requires a special implementation
		}
	};
})();

$fsm0 = $fsm.create();

(function (exports) {
"use strict";

  exports.stringify = function (obj) {

    return JSON.stringify(obj, function (key, value) {
      var fnBody;
      if (value instanceof Function || typeof value == 'function') {

	// Inject scope Objects
	var ast = esprima.parse(obj);
	console.log(ast);

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

}(typeof exports === 'undefined' ? (window.JSONfn = {}) : exports));
