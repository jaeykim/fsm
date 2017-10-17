$fsm0.foo = function () {
	var $fsm1 = new Object();
	$fsm1.closure = new Object();
	$fsm1.closure.a = 10;
	$fsm1.boo = function(){
		closure.a++;
		console.log("test");
	}
	$fsm1.boo.$scope_obj = new Object();
	$fsm1.boo.$scope_obj.$fsm1 = 1;
	return $fsm1.boo;
};
$fsm0.f = function (){
		var $fsm1 = ref_table[1];
		closure.a++;
		console.log("test");
	};
