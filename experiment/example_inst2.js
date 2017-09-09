var runtime = require('./runtime.js');

function foo(deposit) {
	var $$ = runtime.create(arguments);
	$$.account = new Object();
	$$.account.change = function (c) {
		$$ = runtime.create(arguments);
		// $$'s parent is referenced with call stack
		$$.$arguments[0] += $$.parent.$arguments[0];
		//console.log("deposit: " + $0.$arguments[0]);
	}
	return $$.account.change;
}

var boo = function(a) {
	var $2 = runtime.create(arguments);
	$2.x = 10;
	y = 10;

	//console.log($$.$arguments[0] + 10);
}

var t0 = new Date().getTime();
/*
var arr = new Array();
for (var i = 0; i < 100000; i++) {
	arr.push(foo(i));
}
for (var i = 0; i < 100000; i++) {
	arr[i](i);
}
*/
var f = foo(100);
for (var i = 0; i < 10000; i++) {
	f(i);
}
var t1 = new Date().getTime();
console.log(t1 - t0);
