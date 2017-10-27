var fs = require("fs");

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
	rawHTML = rawHTML.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, "$1$3");
	console.log("#---- rawHTML --------------------------------------------");
	console.log(rawHTML)
	var script = getScript(rawHTML);
	saveScript(fin, script);
}

function getScript( rawHTML ){
	var script = 
	"var rawHTML = " + JSON.stringify(rawHTML) + ";\n"+
	"$fsm.dom = new DOMParser().parseFromString(rawHTML, \"text/html\"); \n" +
	"$fsm.restoreDOM();\n";
	console.log("#---- inst. script ---------------------------------------");
	console.log(script);
	return script
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