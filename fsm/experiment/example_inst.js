var runtime = require('./runtime.js');

function foo(deposit) {
	var $0 = runtime.create(arguments);
	$0.account = new Object();
	$0.account.change = function (c) {
		$1 = runtime.create(arguments);
		$0.$arguments[0] += $1.$arguments[0];
		//console.log("deposit: " + $0.$arguments[0]);
	}
	return $0.account.change;
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
for (var i = 0; i < 1; i++) {
	f(i);
}
var t1 = new Date().getTime();
console.log(t1 - t0);

runtime.print();
