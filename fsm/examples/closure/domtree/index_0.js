// node instUtil_html.js index_0.js
var rawHTML = "<html><head><title id=\"title\">Hello world app</title><script src=\"index_0.js\"></script></head><body><h1>HEAD LINE</h1><p>1. this is for 'br' test<br>2. it's really hard bro.<br>3. last line.</p><p>Clicks :<a id=\"clicks\">0</a></p><button onclick=\"myFunction()\">CLICK!</button></body></html>"
$fsm.dom = new DOMParser().parseFromString(rawHTML, "text/html"); 
$fsm.restoreDOM();

// node instUtil.js index_0.js
$fsm0.clicks = 8;
$fsm0.myFunction = function myFunction() {
    var $fsm1 = $fsm.create(arguments);
    $fsm0.clicks++;
	document.getElementById('clicks').innerHTML = $fsm0.clicks;
	$fsm.dom.getElementById('clicks').innerHTML = $fsm0.clicks;
};
$fsm0.serialize = function serialize() {
    var $fsm1 = $fsm.create(arguments);
    console.log('serialize');
};