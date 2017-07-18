function foo(deposit) {
	var $0 = runtime.create(arguments);
	$0.account = new Object();
	$0.account.change = function (c) {
		var $1 = runtime.create(arguments);
		$0.$arguments[0] += $1.$arguments[0];
		console.log("deposit: " + $0.$arguments[0]);
	}
	return $0.account.change;
}

var boo = function(a) {
	var $$ = runtime.create('boo', arguments);
	console.log($$.$arguments[0] + 10);
}
