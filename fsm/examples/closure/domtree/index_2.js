window.onload = function () { 
	var node_0 = document.createElement( "title" );
	var node_1 = document.createTextNode( "Sample Hello, World Application" );
	node_0.appendChild( node_1 );
	document.head.appendChild( node_0 );
	var node_2 = document.createElement( "p" );
	var node_3 = document.createElement( "b" );
	var node_4 = document.createElement( "tt" );
	var node_5 = document.createTextNode( "text" );
	node_4.appendChild( node_5 );
	node_3.appendChild( node_4 );
	var node_6 = document.createTextNode( "color" );
	node_3.appendChild( node_6 );
	node_2.appendChild( node_3 );
	document.body.appendChild( node_2 );
	};
