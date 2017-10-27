$fsm0.clicks = 0;
$fsm0.myFunction = function myFunction() {
    var $fsm1 = $fsm.create(arguments);
    $fsm0.clicks++;
    document.getElementById('clicks').innerHTML = $fsm0.clicks;
};
$fsm0.serialize = function serialize() {
    var $fsm1 = $fsm.create(arguments);
    console.log($fsm0.serialize());
};