var FSM = require('./fsm.js');
var $fsm = FSM.$fsm;
var $fsm0 = FSM.$fsm0;
var JSONfn = FSM.JSONfn;

$fsm0.foo = function() {
  var $fsm1 = $fsm.create();
  $fsm1.closure = new Object();
  $fsm1.closure.a = 10;
  $fsm1.boo = function() {
    var $fsm2 = $fsm.create();
    $fsm1.closure.a++;
    $fsm2.k = $fsm1.closure.a + 10;
    console.log($fsm2.k);
  }
  return $fsm1.boo;
}

$fsm0.f = $fsm0.foo();
$fsm0.f();

console.log(JSONfn.stringify($fsm.ref_table));
console.log(JSONfn.stringify($fsm0.f));
