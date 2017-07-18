function foo(deposit) {
	var account = new Object();
	account.change = function (c) {
		deposit += c;
		console.log("deposit: " + deposit);
	}
	return account.change;
}

var boo = function (a) {
	console.log(a + 10);
}

var coo = new foo(10);

var doo = {
	a: 10,
	b: function (arg) { console.log(arg); }
}
