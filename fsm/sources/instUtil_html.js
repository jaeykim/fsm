var fs = require("fs");
var instUtil = require("./instUtil.js");
var glob_jscode = "";

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

	var script = getScript(instHTML);
	saveScript(fin, script);
}

function instScript( html ){
	var regex = /(<(script)[^]+?<\/\2>)|(^|>)\s+|\s+(?=<|$)/g;
	var ret = html, src;
	for( var regex_res = regex.exec(html) ; regex_res ; regex_res = regex.exec(html) ){
		var scriptElem = regex_res[0];
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

			// < src="[filename len]">
			//  123456              7
			startTag_replace = startTag.substr(0, srcind) + startTag.substr(srcind + 7 + filename.length);
			innerHTML_replace = jscodeSrc + "\n" + innerHTML_replace;
		}

		glob_jscode += innerHTML_replace + "\n";

		//innerHTML_replace = instUtil.traceInstrument(innerHTML_replace);

		var scriptElem_replace = startTag_replace + innerHTML_replace + endTag;
		ret = ret.replace( scriptElem,"");
		//console.log( "orig : ", JSON.stringify(scriptElem));
		//console.log( "repl : ", JSON.stringify(scriptElem_replace));
	}
	return ret;
}

function getScript( rawHTML ){
	var script = 
		"// traceInstrument of javascript code \n" + 
		instUtil.traceInstrument(glob_jscode) + "\n\n" +
		"// restore Dom object \n" + 
		"var rawHTML = " + JSON.stringify(rawHTML) + ";\n"+
		"window.onload = $fsm.restoreDOM(rawHTML);\n";
	return script;
}

function saveScript(fin, script){
	var save_dir = "./domtree/";
	var source   = fin.substring(0, fin.lastIndexOf(".")) + ".js";
	
	if (!fs.existsSync(save_dir)) {
		fs.mkdirSync(save_dir);
	}
	
	fs.writeFile(save_dir + source, script, function(err) {
		if( err ){
			return console.error(err);
		}
		else {
			console.log( "convert : " + fin);
			console.log( "source : " + save_dir + source);
		}
	});
}