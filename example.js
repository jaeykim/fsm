function foo(a) {
	account = new Object();
	this.deposit = a;
	account.change = function (c) {
		this.deposit += c;
		console.log("deposit: " + this.deposit);
	}
	return account.change;
}

var boo = function (a) {
	console.log(a + 10);
}

//var coo = new foo(10);
