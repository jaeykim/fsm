// Register dom_obj
var dom_obj = new Array();
dom_obj[0] = document.createElement("title" );
dom_obj[0].setAttribute("id", "title") ;
dom_obj[1] = document.createTextNode("Hello world app");
dom_obj[2] = document.createElement("script" );
dom_obj[2].setAttribute("src", "index_0.js") ;
dom_obj[3] = document.createElement("h1" );
dom_obj[4] = document.createTextNode("HEAD LINE");
dom_obj[5] = document.createElement("p" );
dom_obj[6] = document.createTextNode("1. this is for 'br' test");
dom_obj[7] = document.createElement("br" );
dom_obj[8] = document.createTextNode("2. it's really hard bro.");
dom_obj[9] = document.createElement("br" );
dom_obj[10] = document.createTextNode("3. last line.");
dom_obj[11] = document.createElement("p" );
dom_obj[12] = document.createTextNode("Clicks :");
dom_obj[13] = document.createElement("a" );
dom_obj[13].setAttribute("id", "clicks") ;
dom_obj[14] = document.createTextNode("0");
dom_obj[15] = document.createElement("button" );
dom_obj[15].addEventListener("click", function () {
	var func = "myFunction()";
	var func_name = func.substr( 0, func.indexOf("(")).trim();
	var fsm = $fsm.includes( func_name ) ? "$fsm0."  : ""
	eval( fsm + func ) 
}); 
dom_obj[16] = document.createTextNode("CLICK!");


// DOM tree rendering source
window.onload = function () { 
	dom_obj[0].appendChild( dom_obj[1] );
	document.head.appendChild( dom_obj[0] );
	document.head.appendChild( dom_obj[2] );
	dom_obj[3].appendChild( dom_obj[4] );
	document.body.appendChild( dom_obj[3] );
	dom_obj[5].appendChild( dom_obj[6] );
	dom_obj[5].appendChild( dom_obj[7] );
	dom_obj[5].appendChild( dom_obj[8] );
	dom_obj[5].appendChild( dom_obj[9] );
	dom_obj[5].appendChild( dom_obj[10] );
	document.body.appendChild( dom_obj[5] );
	dom_obj[11].appendChild( dom_obj[12] );
	dom_obj[13].appendChild( dom_obj[14] );
	dom_obj[11].appendChild( dom_obj[13] );
	document.body.appendChild( dom_obj[11] );
	dom_obj[15].appendChild( dom_obj[16] );
	document.body.appendChild( dom_obj[15] );
	var serialize = document.createElement("button");
	serialize.addEventListener( "click", function(e){
		var ser = $fsm.serialize();
		console.log(ser);
	});
	serialize.appendChild(document.createTextNode("Serialize"));document.body.appendChild(serialize);
	};

// ref_table serialize
$fsm0.dom = [{"raw":"html","data":"html","type":"tag","name":"html","children":[{"raw":"head","data":"head","type":"tag","name":"head","children":[{"raw":"title id=\"title\"","data":"title id=\"title\"","type":"tag","name":"title","attribs":{"id":"title"},"children":[{"raw":"Hello world app","data":"Hello world app","type":"text"}]},{"raw":"script src=\"index_0.js\"","data":"script src=\"index_0.js\"","type":"script","name":"script","attribs":{"src":"index_0.js"}}]},{"raw":"body","data":"body","type":"tag","name":"body","children":[{"raw":"h1","data":"h1","type":"tag","name":"h1","children":[{"raw":"HEAD LINE","data":"HEAD LINE","type":"text"}]},{"raw":"p","data":"p","type":"tag","name":"p","children":[{"raw":"1. this is for 'br' test","data":"1. this is for 'br' test","type":"text"},{"raw":"br","data":"br","type":"tag","name":"br"},{"raw":"2. it's really hard bro.","data":"2. it's really hard bro.","type":"text"},{"raw":"br","data":"br","type":"tag","name":"br"},{"raw":"3. last line.","data":"3. last line.","type":"text"}]},{"raw":"p","data":"p","type":"tag","name":"p","children":[{"raw":"Clicks :","data":"Clicks :","type":"text"},{"raw":"a id=\"clicks\"","data":"a id=\"clicks\"","type":"tag","name":"a","attribs":{"id":"clicks"},"children":[{"raw":"0","data":"0","type":"text"}]}]},{"raw":"button onclick=\"myFunction()\"","data":"button onclick=\"myFunction()\"","type":"tag","name":"button","attribs":{"onclick":"myFunction()"},"children":[{"raw":"CLICK!","data":"CLICK!","type":"text"}]}]}]}];
$fsm0.clicks = 6;
$fsm0.myFunction = function myFunction() {
    var $fsm1 = $fsm.create(arguments);
    $fsm0.clicks++;
    document.getElementById('clicks').innerHTML = $fsm0.clicks;
};
$fsm0.serialize = function serialize() {
    var $fsm1 = $fsm.create(arguments);
    console.log($fsm0.serialize());
};
