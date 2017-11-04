$fsm0.clicks = 0;
$fsm0.myFunction = function myFunction() {
    var $fsm1 = $fsm.create(arguments);
    $fsm0.clicks++;
    document.getElementById('clicks').innerHTML = $fsm0.clicks;
};
$fsm0.foo = function () {
    var $fsm1 = $fsm.create(arguments);
    $fsm1.closure = new Object();
    $fsm1.closure.a = 10;
    {
        $fsm1.boo = function () {
            var $fsm2 = $fsm.create(arguments);
            $fsm1.closure.a++;
            $fsm2.k = $fsm1.closure.a + 10;
            console.log($fsm2.k);
        };
        $fsm1.boo.$scopeObj = new Object();
        $fsm1.boo.$scopeObj.$fsm1 = $fsm.getScopeObj($fsm1);
    }
    return $fsm1.boo;
};
$fsm0.f = $fsm0.foo();
$fsm0.f();
$fsm0.fsm_setTimeout(function () {
    var $fsm1 = $fsm.create(arguments);
    alert('Hello, World!');
}, 10000);