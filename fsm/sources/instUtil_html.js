var fs = require("fs");
var instUtil = require("./instUtil.js");
var glob_jscode = "";
var glob_event_attribs = new Array();

var HtmlDomEvents = {
	includes : function (attrib){
		return this.MouseEvents.includes(attrib) ||
			this.KeyboardEvents.includes(attrib) ||
			this.FrameObjectEvents.includes(attrib) ||
			this.FormEvents.includes(attrib) ||
			this.DragEvents.includes(attrib) ||
			this.ClipboardEvents.includes(attrib) ||
			this.PrintEvents.includes(attrib) ||
			this.MediaEvents.includes(attrib) ||
			this.AnimationEvents.includes(attrib) ||
			this.TransitionEvents.includes(attrib) ||
			this.ServerSentEvents.includes(attrib) ||
			this.MiscEvents.includes(attrib) ||
			this.TouchEvents.includes(attrib);
	},
	MouseEvents : [ 
		"onclick",
		"oncontextmenu",
		"ondblclick",
		"onmousedown",
		"onmouseenter",
		"onmouseleave",
		"onmousemoe",
		"onmouseover",
		"onmouseout",
		"onmouseup",
	],
	KeyboardEvents : [
		"onkeydown",
		"onkeypress",
		"onkeyup"
	],
	FrameObjectEvents : [
		"onabort",
		"onbeforeunload",
		"onerror",
		"onhashchange",
		"onload",
		"onpageshow",
		"onpagehide",
		"onresize",
		"onscroll",
		"onunload"
	],
	FormEvents : [
		"onblur",
		"onchange",
		"onfocus",
		"onfocusin",
		"onfocusout",
		"oninput",
		"oninvalid",
		"onreset",
		"onsearch",
		"onselect",
		"onsubmit"
	],
	DragEvents : [
		"ondrag",
		"ondragend",
		"ondragenter",
		"ondragleave",
		"ondragover",
		"ondragstart",
		"ondrop"
	],
	ClipboardEvents : [
		"oncopy",
		"oncut",
		"onpaste"
	],
	PrintEvents : [
		"onafterprint",
		"onbeforeprint",
	],
	MediaEvents : [
		"onabort",
		"oncanplay",
		"oncanplaythrough",
		"ondurationchange",
		"onemptied",
		"onended",
		"onerror",
		"onloadeddata",
		"onloadedmetadata",
		"onloadstart",
		"onpause",
		"onplay",
		"onplaying",
		"onprogress",
		"onratechange",
		"onseeked",
		"onseeking",
		"onstalled",
		"onsuspend",
		"ontimeupdate",
		"onvolumechange",
		"onwaiting"
	],
	AnimationEvents : [
		"animationend",
		"animationiteration",
		"animationstart"
	],
	TransitionEvents : [
		"transitionend"
	],
	ServerSentEvents : [
		"onerror",
		"onmessage",
		"onopen"
	],
	MiscEvents : [
		"onmessage",
		"onmousewheel",
		"ononline",
		"onoffline",
		"onpopstate",
		"onshow",
		"onstorage",
		"ontoggle",
		"onwheel"		
	],
	TouchEvents : [
		"ontouchcancel",
		"ontouchend",
		"ontouchmove",
		"ontouchstart"
	]
};

main();
function main(){
	// Read raw HTML file to text
	if (  process.argv.length > 2 ) {
		fin = process.argv[2];
	}
	
	// rawHTML equal to new XMLSerializer().serializeToString(document)
	var rawHTML = fs.readFileSync(fin, "utf8");
	
	// remove whitespace
	// ref : https://stackoverflow.com/questions/12014441/remove-every-white-space-between-tags-using-javascript
	var regex = /(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g;
	var compressedHTML = rawHTML.replace(regex, "$1$3");

	// <script> ... </script> case..
	var instHTML = instScript(compressedHTML);
	//registerEventAttribs(instHTML);
	var script = getScript(instHTML);
	var source   = fin.substring(fin.lastIndexOf("/")).substring(0, fin.lastIndexOf(".")) + ".js";

	saveScript( "./domtree/", source, script);
	//saveScript( "./inst/", source, glob_jscode);

}

function registerEventAttribs( html ){
	// Event script, object, event, callback
	var DOMParser = require("dom-parser");
	var parser = new DOMParser();
	
	var doc = parser.parseFromString(html, "text/html");
	domTreeTraversal("document.head", doc.getElementsByTagName("head")[0]);
	domTreeTraversal("document.body", doc.getElementsByTagName("body")[0]);
	
	return html;

	function domTreeTraversal(path, node){
		var dtt = {
			checkAttribs : function(){
				var attribs = node.attributes;
				if( attribs == undefined ) return;
				for( var i = 0 ; i < attribs.length ; i++ ){
					var key   = attribs[i].name;
					var value = attribs[i].value;
					if( HtmlDomEvents.includes( key ) ){
						console.log(path, key, value);
						glob_event_attribs.push({
							"obj" : path,
							"event" : key.substr(2),
							"callback" : value
						});
					}
				}
			},
			traverseChild: function(){
				if( node.childNodes == undefined ) return;
				for( var i = 0 ; i < node.childNodes.length ; i++ ){
					domTreeTraversal(path + ".childNodes[" + i + "]", node.childNodes[i]);
				}
			}
		}
		
		if( node == undefined ) return;
		if( node.nodeName != "#text")
			dtt.checkAttribs();
		dtt.traverseChild();
	}
}

function instScript( html ){
	var regex = /(<(script)[^]+?<\/\2>)|(^|>)\s+|\s+(?=<|$)/g;
	var ret = html, src;
	for( var regex_res = regex.exec(html) ; regex_res ; regex_res = regex.exec(html) ){
		var scriptElem = regex_res[0];
		if( !scriptElem.startsWith("<script")) continue;
		
		var startTag = scriptElem.substring(0, scriptElem.indexOf(">") + 1);
		var innerHTML = scriptElem.substring(scriptElem.indexOf(">") + 1, regex_res[0].lastIndexOf("<"));
		var endTag = scriptElem.substring(regex_res[0].lastIndexOf("<"));
		
		var startTag_replace = startTag;
		var innerHTML_replace = innerHTML;

		var srcind = startTag.indexOf(" src=");
		if( srcind > 0 ){
			var srcstr = startTag.substr(srcind);
			srcstr = srcstr.substr(srcstr.indexOf("\"") + 1);
			var filename = srcstr.substr( 0, srcstr.indexOf("\""));
			var jscodeSrc = fs.readFileSync( filename, "utf8");
			
			// <script src="[filename len]">
			//  123456              7
			startTag_replace = startTag.substr(0, srcind) + startTag.substr(srcind + 7 + filename.length);
			innerHTML_replace = jscodeSrc + "\n" + innerHTML_replace;
		}
		glob_jscode += innerHTML_replace + "\n\n";

		ret = ret.replace( scriptElem,"");
	}
	return ret;
}

function getScript( rawHTML ){
	var script = 
		"// restore Dom object \n" + 
		"var rawHTML = " + JSON.stringify(rawHTML) + ";\n"+
		"$fsm.restoreDOM(rawHTML);\n\n" +
		"// traceInstrument of javascript code \n" + 
		instUtil.traceInstrument(glob_jscode) + "\n\n" +
		"// Event attributes re-register \n" + 
		"$fsm.registerEventAttribs()";
		
	return script;
}

function saveScript(path, filename, script){
	
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
	
	fs.writeFile(path + filename, script, function(err) {
		if( err ){
			return console.error(err);
		}
		else {
			console.log( "output : " + path + filename);
		}
	});
}

