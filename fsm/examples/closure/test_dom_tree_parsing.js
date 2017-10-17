var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var htmlparser = require("htmlparser");
var HtmlDomEvents = require("./htmldomevents.js");
var fs = require("fs");

console.log( process.argv.length );

var fin = "./index_0.html";
// Read raw HTML file to text
if (  process.argv.length > 2 ) {
	fin = process.argv[2];
}
var rawHTML = fs.readFileSync(fin, "utf8");


// remove whitespace
// ref : https://stackoverflow.com/questions/12014441/remove-every-white-space-between-tags-using-javascript
rawHTML = rawHTML.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, "$1$3");
console.log("---------------------------------");
console.log(rawHTML)
console.log("---------------------------------");

// HTML to DOM  using htmlparser
// npm install htmlparser
var time_start = new Date().getTime();
var handler = new htmlparser.DefaultHandler(function (error, dom) {
	if (error){
		console.log("ERROR : html handler");
	} else {
		console.log("# Success to parse HTML file!");
	}
});
var time_end = new Date().getTime();
var parser = new htmlparser.Parser(handler);
parser.parseComplete(rawHTML);
console.log( "# time for execution : " + (time_end - time_start) + "ms" );

var domObj = handler.dom;
var htmlObj = getHtmlObj(domObj);
var headObj = htmlObj.children[0]; // CHECK : is <head> fixed in 0??
var bodyObj = htmlObj.children[1]; // CHECK : is <body> fixed in 1??
//console.log(headObj);
//console.log(bodyObj);

/// document.head setting..
var glob_cnt = 0;
var headscript = domTreeTraversal_171010( "document", headObj);
var bodyscript = domTreeTraversal_171010( "document", bodyObj);

var script = ("window.onload = function () { \n" + headscript + bodyscript +	"};").replace(/\n/g, "\n\t") + "\n";
console.log("---------------------- OUTPUT ----------------------------");
console.log(script);


var save_dir = "./domtree/";
var source   = fin.substring(0, fin.lastIndexOf(".")) + ".js";

if (!fs.existsSync(save_dir)) {
	fs.mkdirSync(save_dir);
}

fs.writeFile(save_dir + source, script, function(err) {
  return console.error(err);
});

/** 
 * getHtmlObj
*/
function getHtmlObj(domObj){
	for( ind in domObj ){
		if( domObj[ind].name == "html" )
			return domObj[ind];
	}
}

/**
 * DOM Tree traversal _ update_171010
 * @author goodseog
 *  
 * @param parent current node"s parent in string type such as "document", "document.html"
 * @param tree   current node"s child tree, parent.current_node = [{child1},{child2},...]
 * 
 * @return 		 instrumentation log.
 */ 

function domTreeTraversal_171010(parent, node){
	var dtt = {

		// 1. var elem = document.createElement(node)
		createElement : function(){
			return "var " + this.elemName +  " = document.createElement( \"" + node.name   + "\" );\n";
		}, 
		createTextNode : function(){
			return "var " + this.elemName +  " = document.createTextNode( \"" + node.data + "\" );\n";
		},
		// 2. elem.setAttribute(name, value)
		setAttribs : function(){
			ret = "";
			if( node.attribs != undefined ){
				for(var key in node.attribs){
					if( HtmlDomEvents.includes( key ) ){
						// TODO : 2017-10-17
						// setAttribs has "[instrumentation] Event Handler" issue.
						// if $fsm includes func value, func change to $fsm0.func
						// else, func is global function such as "abort()", so do not need parents.
						// elemName.addEventListener( "click", $fsm0.func(or global function) );
						// Note: Do not use the "on" prefix. For example, use "click" instead of "onclick".
						// {this.elemName}.addEventListener( {event.removeOn()}, { fsm.includes(func) ? "$fsm0." + func : func });
						ret += ( this.elemName + ".addEventListener( \"" + key.substr(2) + "\", function () { " /* + $fsm.includes(node.attribs[key])*/ + node.attribs[key] + " } ); \n" );	
						// EXCEPTION FOUND : <button onclick="getElementById('demo').innerHTML = Date()">What is the time?</button>
						// I think we just use $fsm.include( function )..
					} else {
						ret += ( this.elemName + ".setAttribute( \"" + key + "\", \"" + node.attribs[key] + "\" ) ;\n");
					}
				}
			}
			return ret;
		},
		// 3. elem.appendChild(childnode);
		appendChildtoNode: function(){
			var ret = "";
			for( var key in node.children ){
				ret += domTreeTraversal_171010(this.elemName, node.children[key]);
			}
			return ret;
		},
		appendChildtoParent: function(){
			return parent + ".appendChild( " + this.elemName + " );\n";
		}
	}
	
	var script = "";
	if( parent == "document" ){
		dtt.elemName = parent + "." + node.name;
		script += dtt.setAttribs();
		script += dtt.appendChildtoNode();
	} else {
		dtt.elemName = "node_" + glob_cnt++;
		if( node.type == "text" ) {
			script += dtt.createTextNode();
			script += dtt.appendChildtoParent();
		} else {
			script += dtt.createElement();
			script += dtt.setAttribs();
			script += dtt.appendChildtoNode();
			script += dtt.appendChildtoParent();
		}
	}
	return script;
}


/**
 * @deprecated 
 * DOM Tree traversal
 * @author goodseog
 *  
 * @param parent current node"s parent in string type such as "document", "document.html"
 * @param tree   current node"s child tree, parent.current_node = [{child1},{child2},...]
 * 
 * @return 		 instrumentation log.
 */ 

// function domTreeTraversal(parent, tree){
// 	var log = "";
// 	for( var index in tree ){
// 		var childVal = tree[index];
// 		var childKey = parent + "." + childVal.name;
// 		// console.log( childKey , "=>\n", childVal );

// 		// Setting atttribs
// 		if( childVal.attribs != undefined ){
// 			for(var key in childVal.attribs){
// 				log += (childKey + "." + key + " = \"" + childVal.attribs[key] + "\"\n");
// 			}
// 		}
		
// 		if (childVal.type == "tag" ){
// 			if (childVal.name == "html"){
// 				log += domTreeTraversal( "$fsm0.dom" , childVal["children"] );
// 			} else {
// 				log += domTreeTraversal( childKey , childVal["children"] );
// 			}			
// 		} else if (childVal.type == "script"){
// 			log += domTreeTraversal( childKey , childVal["children"] );
// 		} else if (childVal.type == "text") {
// 			log += (parent + "." + childVal.type + " = \"" + childVal.data + "\"\n");
// 		} else if (childVal.type == "directive"){
// 			continue;
// 		} else {
// 			console.log( "#########################" );
// 			console.log( "DEBUG : new childVal type appeared!");
// 			console.log( childKey , "=>\n", childVal );	
// 		}
// 	}
// 	return log;
// }


