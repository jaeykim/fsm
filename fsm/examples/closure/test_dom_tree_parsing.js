var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var htmlparser = require('htmlparser');
var fs = require('fs');

// Read raw HTML file to text
var rawHTML = fs.readFileSync('./index_0.html', 'utf8');

// remove whitespace
// ref : https://stackoverflow.com/questions/12014441/remove-every-white-space-between-tags-using-javascript
rawHTML = rawHTML.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, '$1$3');
//console.log(rawHTML)

// HTML to DOM  using htmlparser
// npm install htmlparser
var time_start = new Date().getTime();
var handler = new htmlparser.DefaultHandler(function (error, dom) {
	if (error){
		console.log('ERROR : html handler');
	} else {
		console.log('# Try to parse file..');
	}
});
var time_end = new Date().getTime();
console.log( "# time for execution : " + (time_end - time_start) + 'ms' );
var parser = new htmlparser.Parser(handler);
parser.parseComplete(rawHTML);
var domObj = handler.dom;
//console.log(domObj);


// $fsm0.dom = domObj;
var outputScript = domTreeTraversal( '', domObj);
console.log( outputScript );


/**
 * Determine whether a node's text content is entirely whitespace.
 *
 * @param nod  A node implementing the |CharacterData| interface (i.e.,
 *             a |Text|, |Comment|, or |CDATASection| node
 * @return     True if all of the text content of |nod| is whitespace,
 *             otherwise false.
 */
function is_all_ws( nod ) {
	// Use ECMA-262 Edition 3 String and RegExp features
	return !(/[^\t\n\r ]/.test(nod));
  }

/**
 * DOM Tree traversal
 * @author goodseog
 *  
 * @param parent current node's parent in string type such as 'document', 'document.html'
 * @param tree   current node's child tree, parent.current_node = [{child1},{child2},...]
 * 
 * @return 		 instrumentation log.
 */ 
function domTreeTraversal(parent, tree){
	var log = '';
	for( var index in tree ){
		var childVal = tree[index];
		var childKey = parent + '.' + childVal.name;
		// console.log( childKey , '=>\n', childVal );

		// Setting atttribs
		if( childVal.attribs != undefined ){
			for(var key in childVal.attribs){
				log += (childKey + '.' + key + ' = ' + childVal.attribs[key] + '\n');
			}
		}
		
		if (childVal.type == 'tag' ){
			if (childVal.name == 'html'){
				log += domTreeTraversal( '$fsm0.dom' , childVal['children'] );
			} else if (childVal.name == 'br') {
				log += (parent + '.text' + ' += \"\\n\"\n');
			} else {
				log += domTreeTraversal( childKey , childVal['children'] );
			}			
		} else if (childVal.type == 'script'){
			log += domTreeTraversal( childKey , childVal['children'] );
		} else if (childVal.type == 'text') {
			if( !is_all_ws(childVal.data) ) {
				log += (parent + '.' + childVal.type + ' += \"' + childVal.data + '\"\n');
			}
		} else if (childVal.type == 'directive'){
			continue;
		} else {
			console.log( "#########################" );
			console.log( "DEBUG : new childVal type appeared!");
			console.log( childKey , '=>\n', childVal );	
		}
	}
	return log;
}
