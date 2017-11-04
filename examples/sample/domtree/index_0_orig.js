// restore Dom object 
var rawHTML = "<html><head><title id=\"title\">Hello world app</title></head><body><h1>HEAD LINE</h1><p>1. this is for 'br' test<br>2. it's really hard bro.<br>3. last line.</p><p>Clicks :<a id=\"clicks\">0</a></p><button onclick=\"myFunction()\">CLICK!</button></body></html>";
$fsm.restoreDOM(rawHTML);

// traceInstrument of javascript code 
$fsm0.init_func = function () {
    var $fsm2 = $fsm.create(arguments);
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

// Event attributes re-register 
$fsm.registerEventAttribs()