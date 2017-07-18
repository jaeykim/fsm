console.log('WEB: ' + WEB);

if (!WEB) {
	XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
	FileAPI = require('file-api');
	FileReader = FileAPI.FileReader;
	File = FileAPI.File;
}
var debug = require('./debug.js');
var instUtil = require('./instUtil.js');

var scope = (function() {
	return function() {
		var runtime = require('./runtime.js');
	};
})();

var fsm = {
	queue: [],
	sources: [],
	addSource: function(source) {
		this.sources.push(source);
	},
	parse: function () {
		// OPT ME: revise regex to cover '//...'
		var regex = new RegExp("^(http|https)://", "i");
		var reader = new FileReader();
		var indirectEval = eval;
		//console.log("queue: " + this.queue);
		if (this.queue.length == 0) return;
		var source = this.queue[0];
		this.queue.shift();
		//console.log(source);

		if (!WEB) {
			reader.onload = function(e) {
				//console.log(e.target.result);
				//fsm.addSource(e.target.result);
				var code = instUtil.traceInstrument(e.target.result);
				console.log(code);
				with (scope) {
					//eval(code);
				}
				//indirectEval(code);
				debug.now("timestamp[" + source + "]");
				fsm.parse();
			}
		}
		var isWebSource = WEB ? true : regex.test(source);
		if (isWebSource) {
			var req = new XMLHttpRequest();
			req.open("GET", source, false);
			req.onreadystatechange = function() {
				if (req.readyState == 4 && req.status == 200) {
					//console.log(req.responseText);
					//fsm.addSource(req.responseText);
					var code = instUtil.traceInstrument(req.responseText);
					console.log(code);
					with (scope) {
						//eval(code);
					}
					//indirectEval(code);
					debug.now("timestamp[" + source + "]");
					fsm.parse();
				}
			}
			req.send();
		} else {
			reader.readAsText(new File({path: source}));
		}
	},
	include: function() {
		//console.log("include " + source);
		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i]) this.queue.push(arguments[i]);
		}
		//this.queue.push(source);
	},
	load: function() {
		debug.now("timestamp loaded");
		this.parse();
		debug.now("timestamp finish");
	},
	print: function() {
		for (source in this.sources) {
			console.log(source);
		}
	}
}

module.exports = fsm;

//module.exports.include = fsm.include;
//module.exports.load = fsm.load;
