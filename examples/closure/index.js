var foo = function() {
  var closure = new Object();
  closure.a = 10;
  var boo = function() {
    closure.a++;
    var k = closure.a + 10;
    console.log(k);
  }
  return boo;
}

var f = foo();
f();
