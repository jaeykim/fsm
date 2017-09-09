var oldObj = { deleteme: "deleteme" };

var closure1;
(function() {
	var a = 0;
	closure1 = function() {
		console.log("[" + a++ + "]");
		window.oldFunction();
	};
})();

function oldFunction() {
	console.log("old function");
}

function secondExecution() {
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
}

function invokeEvent() {
	closure1();
	closure3();
}
