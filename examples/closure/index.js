var foo = function() {
  var closure = new Object();
  closure.a = 10;
  var a = 10, b = 20;
  var boo = function() {
    closure.a++;
    var k = closure.a + 10;
    var bboo = function() {
      closure.a++;
      var j = k++;
    }
    console.log(k);
    return bboo;
  }
  var koo = function() {
    closure.a++;
    var k = closure.a + 10;
  }
  return boo;
}

var f = foo;
f();
