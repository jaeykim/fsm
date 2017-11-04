$fsm0.init_func = function () {
    var $fsm1 = $fsm.create(arguments);
    $fsm1.click = 0;
    return function () {
        var $fsm2 = $fsm.create(arguments);
        $fsm1.click++;
        document.getElementById('clicks').innerHTML = $fsm1.click;
    };
};
$fsm0.myFunction = $fsm0.init_func();
$fsm0.fsm_setTimeout(function () {
    var $fsm3 = $fsm.create(arguments);
    alert('Hello, World!');
}, 10000);