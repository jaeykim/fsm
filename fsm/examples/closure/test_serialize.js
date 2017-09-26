var fs = require('fs');

/* Test case #1
var ref_table = new Array();
ref_table.push( new Object() );
ref_table.push( new Object() );

var $fsm0 = ref_table[0];
$fsm0.foo = function() {
	var $fsm1 = ref_table[1];
	$fsm1.closure = new Object();
	$fsm1.closure.a = 10;
	$fsm1.boo = function(){
		closure.a++;
		console.log("test");
	}
	$fsm1.boo.$scope_obj = new Object();
	$fsm1.boo.$scope_obj.$fsm1 = 1;
	return $fsm1.boo;
};
$fsm0.f = $fsm0.foo();
*/

var ref_table = new Array();
ref_table.push( new Object() );
ref_table.push( new Object() );
ref_table.push( new Object() );

var $fsm0 = ref_table[0];
$fsm0.foo = function() {
  var $fsm1 = ref_table[1];
  $fsm1.closure= new Object();  $fsm1.foo = function(){
    var $fsm2 = ref_table[2];
    $fsm1.closure.a++;
    $fsm2.foo = function(){
      console.log('halo\n');
    }
    return fsm2.foo;
  }
	return $fsm1.foo;
};
$fsm0.f = $fsm0.foo();

// if ( typeof function.$scope_obj == undefined ) { there is no scope_obj. }
// else  { for( var scope in function.scope_obj ) var "scope" = ref_table["function.scope_obj[scope]"]}  // scope = { $fsm1 : 1 }
//console.log( typeof($fsm0.f.$scope_obj) );

//ref_table.push( $fsm0 );
//ref_table.push( $fsm1 );

console.log( ref_table) ;
var code = '';

for( var i = 0 ; i < 1 /*ref_table.length*/ ; i++ ) {
  // about ref_table[i]
  for( var key in ref_table[i] ) {
    var value;
    if( ref_table[i][key] instanceof Function || typeof ref_table[i][key] == 'function' ){
      value = ref_table[i][key].toString();
    }
    else {
      var value = JSON.stringify( ref_table[i][key] );
    }

    // if $scope_obj defined, it is instanceof Object
    if( ref_table[i][key].$scope_obj instanceof Object || typeof ref_table[i][key].$scope_obj == 'object'  ) {
      // has scope chain
      for ( var fsm in ref_table[i][key].$scope_obj ) {
        var refLine = 'var ' + fsm + ' = ref_table[' + ref_table[i][key].$scope_obj[fsm] + '];';
        var insertInd = value.indexOf('{') + 1;
        var indent = '';
        var indentCur = insertInd;
        // auto indent
        while( value[indentCur] == '\n' || value[indentCur] == '\t' || value[indentCur] == ' ' ){
          indent += value[indentCur];
          indentCur++;
        }
        value = value.slice(0, insertInd) + indent + refLine + value.slice(insertInd);
      }
    }

    code += '$fsm' + i + "." + key + " = " + value + ';\n';
  }
}

console.log('//----------------------------------------');
console.log( code );
console.log('//----------------------------------------');

var save_dir = './ser/';
var source   = 'index.js'

if (!fs.existsSync(save_dir)) {
	fs.mkdirSync(save_dir);
}

fs.writeFile(save_dir + source, code, function(err) {
  return console.error(err);
});