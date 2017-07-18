function foo(deposit) {
	var account = new Object();
	account.change = function (c) {
		deposit += c;
		//console.log("deposit: " + deposit);
	}
	return account.change;
}

var boo = function(a) {
	//console.log(a + 10);
	this.x = 10;
	y = 10;
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
