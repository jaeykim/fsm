var init_func = function (){
  var click = 0;
  return function() {
    click++;
    document.getElementById('clicks').innerHTML = click;
  }
};

var myFunction = init_func();

setTimeout(function(){alert("Hello, World!");},10000);


