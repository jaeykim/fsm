var jsonfn = require('json-fn');

var ref_table = new Array();
var runtime = {
	create: function() {
		var scope_obj = new Object();
		ref_table.push(scope_obj);
		return scope_obj;
	}
}

$0 = new Object();
/*
function foo() {
	var closure = new object();
	closure.a = 10;
	return function() {
		closure.a++;
		var k = closure.a + 10;
		console.log(k);
	}
}
var f = foo();
f();
*/

function foo() {
	var $1 = runtime.create();
	$1.closure = new Object();
	$1.closure.a = 10;
	$1.func = function() {
		var $2 = runtime.create();
		$1.closure.a++;
		$2.k = $1.closure.a + 10;
	}
	$1.func.scope_objects = new Object();
	$1.func.scope_objects.$1 = $1;
	return $1.func;
}
$0.f = foo();
console.log($0.f);
console.log("ref:");
console.log(ref_table.indexOf($0.f.scope_objects.$1));
$0.f();
console.log('after f()');
console.log(ref_table[0]);
$0.f();
console.log('after f()');
console.log(ref_table[0]);

var ser = jsonfn.stringify($0.f);
console.log(ser);


ref_table[0].f = function() {
	var $1 = ref_table[3];
	var $2 = runtime.create();
	$1.closure.a++;
	$2.k = $1.closure.a + 10;
	console.log($2.k);
}



