$fsm = require('./fsm.js');
$fsm0 = $fsm.create();

$fsm.ref_table[1] = {
  closure:{a: 11},
  boo: function() {
    var $fsm2 = $fsm.create();
    $fsm1.closure.a++;
    $fsm2.k = $fsm1.closure.a + 10;
    console.log($fsm2.k);
  },
  scope_obj: {$fsm1: 2}};

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
  $fsm1.boo.scope_obj = new Object();
  $fsm1.boo.scope_obj.$fsm1 = $fsm.ref_table.indexOf($fsm1);
  return $fsm1.boo();
}

$fsm0.f = function() {
  var $fsm1 = $fsm.ref_table[1];
  var $fsm2 = $fsm.create();
  $fsm1.closure.a++;
  $fsm2.k = $fsm1.closure.a + 10;
  console.log($fsm2.k);
}

$fsm0.f();
