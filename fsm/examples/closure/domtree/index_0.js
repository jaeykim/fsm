window.onload = function () { 
	var node_0 = document.createElement( "title" );
	node_0.setAttribute( "id", "title" ) ;
	var node_1 = document.createTextNode( "Hello world app" );
	node_0.appendChild( node_1 );
	document.head.appendChild( node_0 );
	var node_2 = document.createElement( "h1" );
	var node_3 = document.createTextNode( "HEAD LINE" );
	node_2.appendChild( node_3 );
	document.body.appendChild( node_2 );
	var node_4 = document.createElement( "p" );
	var node_5 = document.createTextNode( "1. this is for 'br' test" );
	node_4.appendChild( node_5 );
	var node_6 = document.createElement( "br" );
	node_4.appendChild( node_6 );
	var node_7 = document.createTextNode( "2. it's really hard bro." );
	node_4.appendChild( node_7 );
	var node_8 = document.createElement( "br" );
	node_4.appendChild( node_8 );
	var node_9 = document.createTextNode( "3. last line." );
	node_4.appendChild( node_9 );
	document.body.appendChild( node_4 );
	var node_10 = document.createElement( "button" );
	node_10.addEventListener( "click", function () { alert('Hello, World!'); } ); 
	var node_11 = document.createTextNode( "CLICK!" );
	node_10.appendChild( node_11 );
	document.body.appendChild( node_10 );
	}
