"use strict";

// Instead of using global variables, the __Hibernation__ object contains global-scope variables.
__Hibernation__.InitializeNativeFunctionList = function() {
    __Hibernation__.NativeFunctionList = { "NativeObjects": [], "ObjectPath": [] }; // Redefining native functions is impossible; so we keep information of the native functions such as Array.isArray, Math.cos, Math.sin, and so on. The number of native functions is usually up to 1,200.
};

/* Helper Functions
* ================ */
__Hibernation__.isArray = Array.isArray || function(val) {
    return (val instanceof Array);
};

__Hibernation__.isFunction = function(it) {
    return Object.prototype.toString.call(it) === "[object Function]";
};

__Hibernation__.isTimer = function(it) {
    //return (typeof it === "object" && !isNaN(it) && it.__registerTime__ !== undefined);
    return (typeof it === "object" && it.__registerTime__ !== undefined);
};

__Hibernation__.isNativeFunction = function(it) {
    return ( __Hibernation__.isFunction( it ) && Function.prototype.toString.call( it ).indexOf( "[native code]" ) > -1 );
};

__Hibernation__.isDOMObject = function(it){ 
    // To check whether the given object is a DOM object or not,
    // We assumed that an object that has nodeType and cloneType properties is a DOM object,
    // FIXME: However, an object that is not a DOM object can also have the nodeType and cloneNode properties.
    return ( it.nodeType !== undefined && it.cloneNode !== undefined );
};

__Hibernation__.isString = function(it) {
    return (typeof it === "string" || it instanceof String);
};

//////////////////////////////////////////////
// Log functions
__Hibernation__.Exception = function(msg){
    console.log("[Hibernation:Exception] " + msg);
    throw new Error(msg); // Cannot be recovered, raise an exception
};

__Hibernation__.Error = function(msg){
    console.log("[Hibernation:Error] " + msg); // Can be recovered, but it is serious matter.
};

__Hibernation__.Warning = function(msg){
    console.log("[Hibernation:Warning] " + msg); // Can be recovered, it is trivial matter.
};

__Hibernation__.Info = function(msg){
    console.log("[Hibernation:Info] " + msg); // Print an information message
};

__Hibernation__.visitedNodeList = [];

__Hibernation__.visitedNodesPath = [];

__Hibernation__.isWindowProperty = function( object ) {
    var names = Object.getOwnPropertyNames(window);

    for( var i = 0; i < names.length; i++ ){
        var name = names[i];
        if( window[name] instanceof Object || typeof window[name] === "object" ) {
            if( window[name] !== null && ( window[name] === object || window[name].prototype === object ) )
                return true;
        }
    }

    return false;
}

__Hibernation__.TraverseWindowObject = function( actions ) {
    // For the purpose of debugging,
    var countForEntireObject = 0;
    var countForSkippedObjects = 0;
    var countForMarkedObject = 0; // Marked Object = Visited Object

    var countPropertyDeleted = 0;
    var countPropertyNotDeleted = 0;
    
    var countForExecutedAction = 0;

    //var notWindowPrototype = [];

    // FIXME: We could not find a formal way to decide the given object is a prototype or not
    // We used the flag argument 'isPrototype' which is set manually with.
    var dfs = function( it, objectPath, isPrototype, visitedNodeList ){
//        console.log("[dfs]" + JSON.stringify(objectPath));
        countForEntireObject++;
        if ( it === null ) {
            return;
        }
        if ( it === __Hibernation__ ){
            return;
        }
        /*
         * In the previous implementation, we tried to record every visited object into an array so we can check whether the object is visited by searching the same instance in the array.
         * But we were confronted with the weird behavior of some objects such as 'mimeTypes' and 'plugins'. When we access one of those properties, the child object is newly created at that time. As a result, the traversal becomes an infinite loop. 
         * To solve this problem, a reserved property name '__marked_visited__' will be used for marking a visited object.
         * If the given object has the property '__marked_visited__', it is a visited object.
         * After we complete the traversal of entire object, the inserted property should be wiped out.
         */
        
        var own = Object.hasOwnProperty;
        if ( own.call( it, "__marked_visited__" ) ) {
            return; // If the object is already visited, we don't have to visit the object again.
        }
        else {
            // We need to prevent inserting the marking property into a prototype object.
            // If we add the property into a prototype of the JavaScript function object, every function would be marked as visited.
            if ( isPrototype === false ) {
                it.__marked_visited__ = true;
                countForMarkedObject++;
                visitedNodeList.push( it );
            }
        }

        for ( var i = 0; i < actions.length; ++i ){
            var action = actions[i];
            action( it, objectPath );
            countForExecutedAction++;
        }

        // There are two strategies for traversing the child objects:
        // (1) By default, a property list of the given object will be utilized to access its child objects.
        // However, the DOM object has the 'nextElementSibiling' property that can access the next DOM element.
        // This property causes a chain of calling this function until it reaches the end of a HTML document.
        // (2) For a DOM object, we will use the 'children' property to enumerate every child object.
        if ( __Hibernation__.isDOMObject( it ) === false ) {
            // case (1)
            var names = Object.getOwnPropertyNames( it );

            if ( it.__proto__ != undefined && !( __Hibernation__.isWindowProperty( it.__proto__ ) ) ){
                names.push("__proto__");
                //notWindowPrototype.push(objectPath.slice(0));
            }

            for ( var i = 0; i < names.length; ++i ) {
                var name = names[i];

                // 'arguments' and 'caller' are special properties that can be referenced only inside the context of calling function.
                if ( name === "arguments" || name === "caller" ){
                    countForSkippedObjects++;
                    continue;
                }

                if ( it[name] instanceof Object || typeof it[name] === "object" ) {
                    // Since 'enabledPlugin' has a weird behavior that creates an object when we traverse its children.
                    // We suffered from an unintended infinite loop. Unlike the 'arguments' property, this avoidance is only a trick.
                    if ( name === "enabledPlugin" ){
                        countForSkippedObjects++;
                        continue;
                    }
                    else{
                        objectPath.push( name );
                        dfs( it[ name ], objectPath, name === "prototype" /* this is also a trick */ , visitedNodeList );
                        objectPath.pop();

                    }
                }
            }
        }
        else {
            // case (2)
            for ( var i = 0; i < it.childNodes.length; ++i ) {
                objectPath.push( "childNodes[" + i + "]" );
                dfs( it.childNodes[i], objectPath, false, visitedNodeList );
                objectPath.pop();
            }
        }
    }; // end of 'dfs'

    var visitedNodeList = [];
//    dfs( window, [ "window" ], false, visitedNodeList );
    // JWKWON: invoke dfs over windows properties, only for non-enum properties because a user defined global variable might be pointing a native function,
    // which we do not want to check
    var enum_and_nonenum = Object.getOwnPropertyNames( window );
    var enum_only = Object.keys( window );
    var nonenum_only = enum_and_nonenum.filter(function(key) {
            var indexInEnum = enum_only.indexOf(key);
            if (indexInEnum == -1) {
                // not found in enum_only keys mean the key is non-enumerable,
                // so return true so we keep this in the filter
//                console.log("[NOSKIP][" + key + "]");
                return true;
            } else {
//                console.log("[SKIP][" + key + "]");
                return false;
            }
        }
    );

    visitedNodeList.push(window);
    window.__marked_visited__ = true;

    for ( var i = 0; i < enum_and_nonenum.length; ++i ) {
        var name = enum_and_nonenum[i];
//        console.log("[nonenum][" + name + "]");
        if ( window[name] instanceof Object || typeof window[name] === "object" ) {
            var propertyDescriptor = Object.getOwnPropertyDescriptor(window, name);
            var attributes = ( propertyDescriptor !== undefined ) ? propertyDescriptor.__attributes__ : 0;
            if( ( attributes & 64 ) === 64 ) { // The property is pre-defined.
                // FIXME: What if a property holds the other DOM object?
                dfs( window[name], [ "window", name ], false, visitedNodeList );
            }
        }
    }

    // JWKWON: window.Browser is enumerable browser object that has native function in it
//    dfs( window["Element"], [ "window", "Element" ], false, visitedNodeList );


    // Clean up the '__marked_visited__' property.
    for ( var i=0; i < visitedNodeList.length; ++i ){
        try{
            delete visitedNodeList[i].__marked_visited__;
        }
        catch(e){
            console.log(visitedNodeList[i]);
            countPropertyNotDeleted++;
        }
    }

    __Hibernation__.Info( "A traverse is finished, entire object: " + countForEntireObject +
        ", marked objects: " + countForMarkedObject +
        ", deleted properties: " + countPropertyDeleted +
        ", not deleted properties: " + countPropertyNotDeleted +
        ", skipped objects: " + countForSkippedObjects +
    ", executed actions: " + countForExecutedAction );
};

__Hibernation__.GenerateAccessCode = function( objectPath ){
    // Basically, each element represents an object name or a property name so they can be concatenated by '.' operator.
    // // Besides, a numeric element is considered as an array index operator regardless of the type of parent.
    // // This is because the object (not an array) can have numeric properties and they work like an array.
    // // I removed a reserved keyword '#Array' which was used to denote that the type of an object is an array.
    var generatedCode = "";
    for ( var i = 0; i < objectPath.length; ++i ) {
        if ( i !== 0 ) {
            if ( isNaN( Number( objectPath[i] ) ) ) {
//                generatedCode += "." + objectPath[i];
                if( objectPath[i].indexOf("\"") !== -1 )
                    generatedCode += "[\'" + objectPath[i] + "\']";
                else
                    generatedCode += "[\"" + objectPath[i] + "\"]";
            }
            else {
                generatedCode += "[" + objectPath[i] + "]";
            }
        }
        else {
            generatedCode += objectPath[i];
        }
    }

    return generatedCode;
};

//jic : mark __builtin__ at builtin object 
__Hibernation__.checkBuiltinObj = function(it, objectPath){
    var own = Object.hasOwnProperty;
    // skip prototype object
    if ( objectPath[objectPath.length - 1] == "prototype" ){
        return;
    }
    else if ( objectPath.indexOf("clientInformation") != -1 || objectPath.indexOf("navigator") != -1 ) {
        it.__builtin__ = true;
        return;
    }
    else if ( own.call( it, "__builtin__" ) ) {
        return;
    }
    else{
        it.__builtin__ = true;
        __Hibernation__.visitedNodeList.push( it );
        __Hibernation__.visitedNodesPath.push(objectPath.slice(0));
    }
};
//jic end

(function () {
    __Hibernation__.InitializeNativeFunctionList();

    if (__Hibernation__.nativeFunctionPathToString === undefined) {
        console.log("GENERATE");
        var getNativeFunctionList = function( it, objectPath ){
            if ( __Hibernation__.isNativeFunction( it ) ){
                __Hibernation__.NativeFunctionList.NativeObjects.push( it );
                var path = __Hibernation__.GenerateAccessCode( objectPath );
                __Hibernation__.NativeFunctionList.ObjectPath.push( path );
            }
        };

        var tTime = new Date().getTime();
        __Hibernation__.TraverseWindowObject( [ getNativeFunctionList, __Hibernation__.checkBuiltinObj ] );
        var bTime = new Date().getTime() - tTime;
        console.log("Traversing Window Object Time : " + bTime + "ms");

        var nativeFunctionPathToString = "__Hibernation__.nativeFunctionPathToString = JSON.parse(" + JSON.stringify(__Hibernation__.NativeFunctionList.ObjectPath) + ");";

        __Hibernation__.SaveTo("nativeFunctionPath.js", nativeFunctionPathToString);
    }
    else {
        console.log("LOAD");
    }

})();
