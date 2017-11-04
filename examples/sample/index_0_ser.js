var rawHTML = "<html><head><title id=\"title\">Hello world app</title></head><body><h1>HEAD LINE</h1><p>1. this is for 'br' test<br>2. it's really hard bro.<br>3. last line.</p><p>Clicks :<a id=\"clicks\">5</a></p><button onclick=\"$fsm0.myFunction()\">CLICK!</button></body></html>"
$fsm.restoreDOM(rawHTML);

// ref_table serialize code 
$fsm0 = new Object();
$fsm0.myFunction = function () {
    $fsm1.click++;
    document.getElementById('clicks').innerHTML = $fsm1.click;
};
$fsm1 = new Object();
$fsm1.$arguments = [];
$fsm1.click = 5;

$fsm0.fsm_setTimeout(function () {
    var $fsm1 = $fsm.create(arguments);
    alert('Hello, World!');
}, 5658);

// Event attributes re-register 
$fsm.registerEventAttribs(); 
