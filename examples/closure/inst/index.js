$fsm0.foo = function () {
    var $fsm1 = $fsm.create(arguments);
    $fsm1.closure = new Object();
    $fsm1.closure.a = 10;
    {
        $fsm1.a = 10;
        $fsm1.b = 20;
    }
    {
        $fsm1.boo = function () {
            var $fsm2 = $fsm.create(arguments);
            $fsm1.closure.a++;
            $fsm2.k = $fsm1.closure.a + 10;
            {
                $fsm2.bboo = function () {
                    var $fsm3 = $fsm.create(arguments);
                    $fsm1.closure.a++;
                    $fsm3.j = $fsm2.k++;
                };
                $fsm2.bboo.$scopeObj = new Object();
                $fsm2.bboo.$scopeObj.$fsm1 = $fsm.getScopeObj($fsm1);
                $fsm2.bboo.$scopeObj.$fsm2 = $fsm.getScopeObj($fsm2);
            }
            console.log($fsm2.k);
        };
        $fsm1.boo.$scopeObj = new Object();
        $fsm1.boo.$scopeObj.$fsm1 = $fsm.getScopeObj($fsm1);
    }
    {
        $fsm1.koo = function () {
            var $fsm2 = $fsm.create(arguments);
            $fsm1.closure.a++;
            $fsm2.k = $fsm1.closure.a + 10;
        };
        $fsm1.koo.$scopeObj = new Object();
        $fsm1.koo.$scopeObj.$fsm1 = $fsm.getScopeObj($fsm1);
    }
    return $fsm1.boo;
};
$fsm0.f = $fsm0.foo();
$fsm0.f();
