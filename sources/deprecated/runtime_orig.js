var JsonML = require('./jsonml/jsonml-dom.js');

var runtime = (function() {
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
			var ser = JSON.stringify(ref_table);
			var dom = JsonML.fromHTML(document);
			console.log('serialize time: ' + (new Date().getTime() - t0));
	
			// ADD ME: Symbol object serialization requires a special implementation
			//return JSON.stringify(ref_table);
		}
	};
})();

module.exports = runtime;
