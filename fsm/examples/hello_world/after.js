		var newObj = { a: "HELLO", b: oldObj };
		oldObj.newProp = newObj;
		delete oldObj.deleteme;
		closure1 = function() {
			console.log("closure1 changed");
		}

		var closure2;
		(function() {
			var a = function(j) {
				console.log(j);
			};
			(function(m) {
			    var b = function(k) {
					console.log(k);
				};
				closure2 = function() {
					a(10);
					b(11);
					console.log(m);
				};
			})(50);
		})();

		var closure3;
		(function() {
		    var c = function(q) {
				console.log(q);
			}
			var d = closure2;
			closure3 = function() {
				c(12);
				d();
			}
		})();
		
		closure2.c2prop = "C2PROP";

