$fsm0.foo = function () {
    $fsm1 = fsm.create(arguments);
    $fsm1.closure = new Object();
    $fsm1.closure.a = 10;
    $fsm1.boo = function () {
        $fsm2 = fsm.create(arguments);
        $fsm1.closure.a++;
        $fsm2.k = $fsm1.closure.a + 10;
        console.log($fsm2.k);
    };
    return $fsm1.boo;
};
$fsm0.f = $fsm0.foo();
$fsm0.f();