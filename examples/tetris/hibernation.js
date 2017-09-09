"use strict";

//var __Hibernation__ = {};

// Install a key-input handler to hibernate the web page.
document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.keyCode===77) { // '77' stands for the 'm' key
        // todo: the prefix for the output files is always "sample". we can use an uni-directional hash function for the given url.
//        __hibernation__.savestate( "sample" ); 
        __Hibernation__.wsflag = false;
        __Hibernation__.Execute( __Hibernation__.SaveState, "SaveState", "sample" ); 
    } }, false);

document.addEventListener("keydown", function(e){
    if(e.ctrlKey && e.keyCode===75) { // '75' stands for the 'k' key
        // TODO: The prefix for the output files is always "sample". We can use an uni-directional hash function for the given URL.
//        __Hibernation__.SaveState( "sample" ); 
        //Send sample files using websocket
        __Hibernation__.wsFlag = true;
        __Hibernation__.Execute( __Hibernation__.SaveState, "SaveState", "sample" );
    } }, false);

// Instead of using global variables, the __Hibernation__ object contains global-scope variables.
__Hibernation__.InitializeGlobalVariables = function() {
    __Hibernation__.DOMObjectMap = []; // Automatically generated code to initialize a location of DOM objects.
    __Hibernation__.DOMObjectProperties = {}; // Some DOM objects contain properties.
    __Hibernation__.FunctionObjectProperties = {}; // Likewise the DOM objects, function object can contain properties. In fact, DOM objects and function objects can be regarded as JavaScript objects.
    __Hibernation__.EventHandlers = []; // This variable contains information of event handlers: the DOM element, eventName, and its event handler.
    __Hibernation__.TimeoutList = []; // setTimeoutHandler
    __Hibernation__.TimerIDList = new Array(); // setTimeout TimerID List (only for active timers)
    __Hibernation__.TimerIndexMap = [];
    __Hibernation__.TimeoutIdList = []; // JAEYKIM: To calculate dummy timer id
//    __Hibernation__.NativeFunctionList = { "NativeObjects": [], "ObjectPath": [] }; // Redefining native functions is impossible; so we keep information of the native functions such as Array.isArray, Math.cos, Math.sin, and so on. The number of native functions is usually up to 1,200.
    __Hibernation__.InitOrder = []; // To make sure the valid initialization order. InitOrder[n] = [m1,m2,...]; means that the initialization of obj_ref[n] requires obj_ref[m1], obj_ref[m2] and so on.
    __Hibernation__.uniqueDocumentName = ""; // The prefix of the output files.
    __Hibernation__.DomTree = []; // To assign the numeric index for the DOM elements.
    __Hibernation__.obj_ref = [];
    __Hibernation__.obj_ref_json = []; // JSON representations for the obj_ref elements.
    __Hibernation__.obj_ref_attributes = []; // Additional information for the obj_ref elements.
    __Hibernation__.obj_ref_wrapper = []; // wrapper object link
    __Hibernation__.timerid_ref = []; 
    __Hibernation__.VideoList = [];
    __Hibernation__.GetterSetter = [];
    __Hibernation__.maxScopeDepth = 0;
    // JWKWON: Array that holds scope information
    __Hibernation__.scopeTree = new Array();
    __Hibernation__.addedPropertiesOfBuiltInObj = [];
    // find scopeNode with given scopeID
    __Hibernation__.scopeTree.get = function(scopeID) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].scopeID === scopeID) {
                return this[i];
            }
        }
        return undefined;
    }
    // define globalObjectScope
    __Hibernation__.globalObjectScope = {
           scopeType: "GO",
           scopeID: 0,
//           indexArray: [],
           children: []
    };
    __Hibernation__.scopeTree.push(__Hibernation__.globalObjectScope);

    __Hibernation__.cssAnimationList = [];

    __Hibernation__.closureSearchTime = 0;

    __Hibernation__.collectDependencyTime = 0;

    __Hibernation__.timerLevel = 0;

    __Hibernation__.startTime = 0;
    __Hibernation__.endTime = 0;

    __Hibernation__.startTimer = function() {
        __Hibernation__.timerLevel++;
        
        if (__Hibernation__.timerLevel === 1) {
            __Hibernation__.startTime = new Date().getTime();
        }
    }

    __Hibernation__.collectScopeTime = 0;

    __Hibernation__.endTimer = function() {
        __Hibernation__.timerLevel--;

        if (__Hibernation__.timerLevel === 0) {
            __Hibernation__.closureSearchTime += (new Date().getTime() - __Hibernation__.startTime);
        }
    }
    // JWKWON END
};

/* Helper Functions
* ================ */

__Hibernation__.escapeString = function(str) {
    return ("\"" + str.replace(/(["'\\])/g, "\\$1") + "\"").
    replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
    replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r");
};

__Hibernation__.escapeStringForKey = function(str) {
    return ("\"" + str.replace(/(["'\\])/g, "\\$1") + "\"").
    replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
    replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r");
};

__Hibernation__.getParts = function(arr, obj, cb) {
    return [
        (typeof arr === "string") ? arr.split("") : arr,
        obj || this,
        (typeof cb === "string") ? new Function("item", "index", "array", cb) :cb
    ];
};

__Hibernation__.map = function(arr, callback, thisObject) {
    var _p = __Hibernation__.getParts(arr, thisObject, callback); arr = _p[0];
    var outArr = (arguments[3] ? (new arguments[3]()) : []);
    for(var i=0, l=arr.length; i<l; ++i) {
        outArr.push(_p[2].call(_p[1], arr[i], i, arr));
    }
    return outArr;
};

// JWKWON
// function that helps indentation
__Hibernation__.indentation = function (generatedCode, level) {
    for (var i = 0; i < level; i++) {
        generatedCode += "\t";
    }
    return generatedCode;
}

// order ID refers to unique ID of scope or function to use it when re-ordering
__Hibernation__.orderID = 0;

__Hibernation__.getOrderID = function() {
    return __Hibernation__.orderID++;
}

// constructor function for function wrapper
__Hibernation__.FunctionWrapper = function(index) {
    // "FW" stands for function wrapper
    this.scopeType = "FW";
    this.orderID = __Hibernation__.getOrderID();
    this.index = index;
}


// constructor function for closure variable information
//__Hibernation__.VarInfo = function(name, object, isself) {
__Hibernation__.VarInfo = function(name, object) {
    this.varName = name;
    this.varObject = object;
//    this.isSelf = isself;
    this.varString = "";
}

__Hibernation__.searchPush = function(arr, element){
    if( arr.indexOf(element) === -1)
        arr.push(element);
}

// constructor function for single scope node
// ScopeNode properties
// scopeAddress: scope address of node
// varInfo: information of variable this scope should create
// index: function/objects this scope should create
// children: array of child scopes
// parentScope: parent scope node
// level: depth in scope tree
// validOrder: array of wrapper object (ScopeWrapper or ObjectWrapper) that contains value and dependency information
__Hibernation__.ScopeNode = function(address) {
    function searchPush (element) {
        if (this.indexOf(element) === -1) {    // this means that this element doesn't exist in this array
            this.push(element);
            return true;
        }
        return false;
    }
    this.scopeAddress = address;
    this.varInfo = new Array();
    this.varInfo.insertVarInfo = function (info) {
        for (var iter = 0; iter < this.length; iter++) {
            if ((this[iter].varName   === info.varName  ) &&
                (this[iter].varObject === info.varObject)) {
                return false;
            }
        }
        this.push(info);
        return true;
    }
    this.index = new Array();
    this.index.searchPush = searchPush;
    this.dependentOf = new Array();
    this.dependentOf.pushFromIndex = function (index) {
        if (__Hibernation__.InitOrder[index] === undefined) {
//            console.log("InitOrderUndefined");
            return;
        }
        var initOrderLength = __Hibernation__.InitOrder[index].length;
        for (var iter = 0; iter < initOrderLength; iter++) {
            if (this.indexOf(__Hibernation__.InitOrder[index][iter]) === -1) {    // this means that this element doesn't exist in this array
                this.push(__Hibernation__.InitOrder[index][iter]);
            }
        }
    }
    this.dependentOf.pushFromArray = function (arr) {
        var initOrderLength = arr.length;
        if (initOrderLength === 0) {
            console.log("NoInitOrder");
            return;
        }
        for (var iter = 0; iter < initOrderLength; iter++) {
            if (this.indexOf(arr[iter]) === -1) {    // this means that this element doesn't exist in this array
                this.push(arr[iter]);
            }
        }
    }
    this.dependentOf.searchPush = searchPush;
    this.children = new Array();
    this.insertChild = function (scopeNode) {
        for (var iter = 0; iter < this.children.length; iter++) {
            if (this.children[iter].scopeAddress === scopeNode.scopeAddress) {
                return false;
            }
        }
        this.children.push(scopeNode);
        return true;
    }
    this.parentScope = undefined;
    this.level = -1;
    this.validOrder = new Array();
}

// NEW Implementation
__Hibernation__.insertScopeNode = function (addressArray) {
    var returnNode = {};
    var parentNode = undefined;
    var childNode = undefined;
    var foundNode = undefined;

    var scopeTreeLength = __Hibernation__.scopeTree.length;

    var addIter = 0;
    for ( ; addIter < addressArray.length; addIter++) {
        for (var treeIter = 0; treeIter < scopeTreeLength; treeIter++) {
            // node found
            if (__Hibernation__.scopeTree[treeIter].scopeAddress === addressArray[addIter]) {

                foundNode = __Hibernation__.scopeTree[treeIter];

                if (addIter === 0) {
                    returnNode.first = foundNode;
                }
                if (addIter === addressArray.length-1) {
                    returnNode.last = foundNode;
                }

                while (foundNode.parentScope !== undefined) {
                    foundNode = foundNode.parentScope;
                    addIter++;
                }

                returnNode.last = foundNode;

                // remaining nodes doesn't exist, create new
                addIter++;

                parentNode = foundNode;

                while (addIter < addressArray.length) {

                    var newScopeNode = new __Hibernation__.ScopeNode(addressArray[addIter]);
            
                    __Hibernation__.scopeTree.push(newScopeNode);
        
                    if (addIter === 0) {
                        returnNode.first = newScopeNode;
                    }
                    if (addIter === addressArray.length-1) {
                        returnNode.last = newScopeNode;
                    }

                    childNode = parentNode;

                    parentNode = newScopeNode;

                    if (childNode !== undefined) {
                        childNode.parentScope = parentNode;
                        parentNode.insertChild(childNode);
                    }

                    addIter++;
                }
                return returnNode;
            }
        }

        // this node doesn't exist, create new

        var newScopeNode = new __Hibernation__.ScopeNode(addressArray[addIter]);

        __Hibernation__.scopeTree.push(newScopeNode);

        if (addIter === 0) {
            returnNode.first = newScopeNode;
        }
        if (addIter === addressArray.length-1) {
            returnNode.last = newScopeNode;
        }

        childNode = parentNode;

        parentNode = newScopeNode;

        if (childNode !== undefined) {
            childNode.parentScope = parentNode;
            parentNode.insertChild(childNode);
        }
    }

    return returnNode;
}

__Hibernation__.printScopeInfo = function () {
    for (var iter = 0; iter < __Hibernation__.scopeTree.length; iter++) {
        var currentScope = __Hibernation__.scopeTree[iter];
        //console.log("[scopeAddress]");
        //console.log(currentScope.scopeAddress);
        //console.log("[varInfo]");
        for (var nameIter = 0; nameIter < currentScope.varInfo.length; nameIter++) {
            console.log(currentScope.varInfo[nameIter].varName);
        }
        console.log("[functions]");
        for (var indexIter = 0; indexIter < currentScope.index.length; indexIter++) {
            console.log(currentScope.index[indexIter]);
        }
        console.log("[dependentOf]");
        for (var depIter = 0; depIter < currentScope.dependentOf.length; depIter++) {
            console.log(currentScope.dependentOf[depIter]);
        }
        console.log("[children]");
        for (var childIter = 0; childIter < currentScope.children.length; childIter++) {
            console.log(currentScope.children[childIter].scopeAddress);
        }
        console.log("[parent]");
        if (currentScope.parentScope !== undefined) {
            console.log(currentScope.parentScope.scopeAddress);
        }
    }
}

// Performance check
__Hibernation__.Execute = function( action, name, arg ) {
    if ( __Hibernation__.isFunction( action ) ) {
        if ( __Hibernation__.wsFlag ){
            if ('WebSocket' in window) {
                // Create WebSocket
                __Hibernation__.ws = new WebSocket('ws://147.46.116.216:9996');
                //__Hibernation__.ws = new WebSocket('ws://canopus.snu.ac.kr:9997');
                __Hibernation__.ws.onopen = function() {
                    console.log("WebSocket Open!");
                    var tic = new Date().getTime();
                    __Hibernation__.Info( "(" + name + ") " );
                    action(arg);
                    var toc = new Date().getTime();
                    __Hibernation__.Info( "(" + name + ") elapsed time: " + (toc - tic).toString() + " ms" );
                };
            }
            else {
                __Hibernation__.Error("WebSocket not supported");
            }
        }
        else {
            var tic = new Date().getTime();
            __Hibernation__.Info( "(" + name + ") " );
            action(arg);
            var toc = new Date().getTime();
            __Hibernation__.Info( "(" + name + ") elapsed time: " + (toc - tic).toString() + " ms" );
        }
    }
    else {
        __Hibernation__.Error( "The 'action' parameter must be a function." );
    }
};

/*
__Hibernation__.visitedNodesPathToString = new Array();

for (var i = 0; i < __Hibernation__.visitedNodesPath.length; i++) {
    __Hibernation__.visitedNodesPathToString.push(__Hibernation__.GenerateAccessCode(__Hibernation__.visitedNodesPath));
}

__Hibernation__.traverseWindowObjectCheck = function(obj, objString) {

    var dfs = function( it, objectPath, isPrototype, visitedNodeList ) {
        if ( it === null ) {
            return;
        }

        var currentPropertyName = objectPath[objectPath.length-1];

        if ( currentPropertyName === "enabledPlugin" ) {
            return;
        }
        
        var own = Object.hasOwnProperty;
        if ( own.call( it, "__framework_visited__" ) ) {
            return;
        }
        else {
            if ( isPrototype === false ) {
                it.__framework_visited__ = true;
                visitedNodeList.push( it );
            }
        }

        // Check if this object(it)'s path exists in FOP table
        var path = __Hibernation__.GenerateAccessCode(objectPath);

        var indexInFOP = __Hibernation__.visitedNodesPathToString.indexOf(path);

        if ( indexInFOP !== -1 ) {     // found
            if ( it !== __Hibernation__.visitedNodeList[indexInFOP] ) {    // path is same, but content is different: we save it
                console.log("[MODIFIED]" + __Hibernation__.visitedNodesPathToString[indexInFOP] + "\n");
                return;
            }
        }
        else {     // not found, means that this path is newly added
            console.log("[ADDED]" + path + "\n");
            return;
        }

        // Traverse child properties
        var names = Object.getOwnPropertyNames( it );

        for ( var i = 0; i < names.length; i++ ) {
            var name = names[i];

            if (name === "arguments" || name === "caller") {
                continue;
            }


            if ( it[name] instanceof Object || typeof it[name] === "object" ) {
                objectPath.push( name );
                dfs( it[ name ], objectPath, name === "prototype" , visitedNodeList );
                objectPath.pop();
            }
        }
    } // end of 'dfs'

    var visitedNodeList = [];
    dfs( obj, [objString], false, visitedNodeList );

    // Clean up the '__framework_visited__' property.
    for ( var i=0; i < visitedNodeList.length; ++i ){
        try{
            delete visitedNodeList[i].__framework_visited__;
        }
        catch(e){
            console.log(visitedNodeList[i] + " not deleted");
        }
    }
};
*/

__Hibernation__.GetUserDefinedProperties = function(it){
    var result = [];
    var propertyNames = Object.getOwnPropertyNames(it);
    for ( var i = 0; i < propertyNames.length; ++i ) {
        var propertyName = propertyNames[i];
        //var temp = it[propertyName];
        try{
            var propertyDescriptor = Object.getOwnPropertyDescriptor(it, propertyName);
            var attributes = ( propertyDescriptor !== undefined ) ? propertyDescriptor.__attributes__ : 0;
            if( ( attributes & 64 ) !== 64 ) { // The property is not pre-defined.
                // FIXME: What if a property holds the other DOM object?
                result.push( propertyName );
            }
        }
        catch(err) {
          console.log(err);
        }
    }
    return result;
}

__Hibernation__.toJson = function (it /*Object*/, objectPath, isLazyInit, refIndex ) {
    // For trivial cases,
    if (it === null) {
        return "null";
    }
    else if (it === undefined) {
        return "undefined";
    }
    else if ( it === window ) {
        return "window"; // To prevent a window object from being recursively serialized. (window is just a window!)
    }
    else if ( it === window.performance ) {
        return "window.performance";
    }
    else if ( it === __Hibernation__ ) {
        return "__Hibernation__";
    }

    var objtype = typeof it;

    if (__Hibernation__.isTimer(it)) {
        var index = __Hibernation__.TimerIndexMap.indexOf(it.__registerTime__);
        if (index !== -1) {
            var accessCode = __Hibernation__.GenerateAccessCode(objectPath);
            __Hibernation__.TimerIDList[index] = accessCode;
        }
        return "undefined /* lazy init */";
    }

    if (objtype === "number" || objtype === "boolean") {
        return it + "";
    }

    if (__Hibernation__.isString(it)) {
              if( it == encodeURI(it) )
            return __Hibernation__.escapeString(it);
        else
            return "decodeURI(" + __Hibernation__.escapeString(encodeURI(it)) + ")";
    }

    if ( __Hibernation__.isDOMObject( it ) ) {
        // An 'isolated' DOM element, which is not attached to the document element.
        
        if ( ! __Hibernation__.HasDocumentAncestor( it ) && it !== window.document ){
            var path = __Hibernation__.GenerateAccessCode( objectPath );
            console.log('Isolated event: ' + path);
            console.log(it);
            __Hibernation__.GetEventListenerInfo( it, path, __Hibernation__.EventHandlers );
        }

        // A DOM object is also a JavaScript object so it can have JavaScript properties.
        // We have to check whether the given object has an user-defined property or not.
        var userDefinedProperties = __Hibernation__.GetUserDefinedProperties( it );
        var tmpObjectPropertyMap = [];
        for ( var i = 0; i < userDefinedProperties.length; ++i ) {
            var propertyName = userDefinedProperties[i];
            if( propertyName === "__builtin__" )
                continue;
            var toJsonResult = __Hibernation__.toJson( it[propertyName], objectPath, true, null );
            tmpObjectPropertyMap.push( { "name": propertyName, "value": toJsonResult } );
        }

        // We can't locate DOM objects while JSON data is loading because a DOM tree is not constructed yet.
        // After running the 'DOMObjectMap' code, DOM objects in the 'obj_ref' will be located correctly.
        var index = __Hibernation__.DomTree.indexOf(it);

//        var animationNames = __getAnimationNames__(it);
//        for( var i = 0; i < animationNames; i++ ){
//            var animationName = animationNames[i];
//            var progressTime = __getAnimationKey__(it, animationName);
//            var toResultString = "__Hibernation__.DomTree[" + index + "].style.WebkitAnimationDelay = -" + progressTime + "s";
//            __Hibernation__.cssAnimationList.push(toResultString);
//        }

        var accessCode;
        var isEmptyObjectPath = ( objectPath.length === 0 );
        if ( isEmptyObjectPath ) {
            var propertyPath = [ "__Hibernation__.DomTree[" + index + "]"];
            accessCode = __Hibernation__.GenerateAccessCode( propertyPath );
        }
        else {
            accessCode = __Hibernation__.GenerateAccessCode( objectPath );
        }

        var ret = ""; // return value of the 'toJson' function

        if ( index === -1 ){
            var jml = JSON.stringify( JsonML.fromHTML( it ) );
            // substring at prototype tetris
            //jml = (jml.substring(1, jml.length-1)).replace(/\\\"/g, '"').replace(/\\\\n/g, '\\n');
            var restoreCode = "JsonML.toHTML( " + jml + " )";
            if ( tmpObjectPropertyMap.length > 0 ) {
                restoreCode = "(function(){ var a = " + restoreCode + ";";
                for ( var i = 0; i < tmpObjectPropertyMap.length; ++i ) {
                    var propertyName = tmpObjectPropertyMap[i].name;
                    var toJsonResult = tmpObjectPropertyMap[i].value;
                    restoreCode += propertyName + " = " + toJsonResult + ";";
                }
                restoreCode += "return a;})()";
            }
            if ( isLazyInit === true ) {
                __Hibernation__.DOMObjectMap.push( accessCode + " = " + restoreCode + ";" );
                ret = "undefined /* lazy init */";
            }
            else {
                ret = restoreCode;
            }
        }
        else {
            if ( isLazyInit === true ) {
                __Hibernation__.DOMObjectMap.push( accessCode + " = __Hibernation__.DomTree[" + index + "];" );
                ret = "undefined /* lazy init */";
            }
            else {
                ret = "__Hibernation__.DomTree[" + index + "]";
            }

            for ( var i = 0; i < tmpObjectPropertyMap.length; ++i ) {
                var name = tmpObjectPropertyMap[i].name;
                var value = tmpObjectPropertyMap[i].value;

                if ( __Hibernation__.DOMObjectProperties[index] === undefined ) {
                    __Hibernation__.DOMObjectProperties[index] = {};
                }

                if ( __Hibernation__.DOMObjectProperties[index][name] === undefined) {
                    __Hibernation__.DOMObjectProperties[index][name] = value;
                }
            }
        }

        return ret;
    }

    var index = __Hibernation__.obj_ref.indexOf(it);
    if (index === -1) {
        index = __Hibernation__.obj_ref.push(it) - 1;

        var isEmptyObjectPath = ( objectPath.length === 0 );
        if ( isEmptyObjectPath ) {
            objectPath = [ "__Hibernation__.obj_ref[" + index + "]" ];
        }

        {
            // array
            /*
            if ( __Hibernation__.isArray( it ) ) {
                // In the previous implementation, the 'dojo.map' function is used. 
                // But there is no way to increase the array index in the 'dojo.map' function,
                // so I used a simple for-loop.
                var needRefIndex = [];
                var res = [];
                for ( var i = 0; i < it.length; ++i ){
                    objectPath.push( i );
                    var val;
                    if ( it[i] === window.jQuery ) {
                        val = "window.jQuery";
                    }
                    else {
                        val = __Hibernation__.toJson( it[i], objectPath, true, needRefIndex );
                    }
                    if ( typeof val !== "string" ) {
                        val = "undefined";
                    }
                    //val = "\n" + val;
                    res[i] = val;
                    objectPath.pop( i );
                }
                if ( needRefIndex.length > 0 ) {
                    __Hibernation__.InitOrder[ index ] = needRefIndex;
                }
                __Hibernation__.obj_ref_json[index] = "[" + res.join(",") + "]";
                __Hibernation__.obj_ref_attributes[index] = {"type":"array"};
            }
            */
            if (objtype === "function") {
              if ( __Hibernation__.isNativeFunction( it ) ){
                    var nativeFunctionIndex = __Hibernation__.NativeFunctionList.NativeObjects.indexOf( it );
                    if ( nativeFunctionIndex === -1 ){
                        if ( it.name === "" ){
                          // JAEYKIM: confirm the function is bound function and if it is, convert it to function.bind (argument)
                          var isBoundFunction = it.__isBoundFunction__();
                          if (it.__isBoundFunction__ ()) {
                            var targetIndex = -1;
                            var thisIndex = -1;
                            for (var i = 0; i < __Hibernation__.obj_ref.length; i++)
                            {
                              if (it.__getTargetFunction__().localeCompare (__Hibernation__.obj_ref[i]) == 0)
                                targetIndex = i;
                              if (JSON.stringify (it.__getBoundThis__()).localeCompare (__Hibernation__.obj_ref[i]) == 0)
                                thisIndex = i;
                            }
                            var argCode = "";
                            var getBoundArgs = it.__getBoundArgs__();
                            if (getBoundArgs.length > 0)
                            {
                              for (var i = 0; i < getBoundArgs.length; i++)
                              {
                                var arg = getBoundArgs[i];
                                var argType = typeof arg;
                                // console.log ("JAEYKIM] type: " + argType);
                                if (argType == "function" || argType == "object")
                                {
                                  var argIndex = __Hibernation__.obj_ref.indexOf(arg);
                                  if (argIndex == -1)
                                  {
                                    // console.log ("JAEYKIM] argIndex == -1");
                                    argCode += ", " + __Hibernation__.toJson(arg, [], true, null);
                                  } else
                                  {
                                    // console.log ("JAEYKIM] argIndex != -1");
                                    argCode += ", __Hibernation__.obj_ref[" + argIndex + "]";
                                  }
                                } else if (argType == "string")
                                {
                                  argCode += ", \"" + arg + "\""; 
                                } else
                                {
                                  argCode += ", " + arg;
                                }
                              }
                            }
                            if (thisIndex == -1)
                            {
                              var newObjPath = __Hibernation__.toJson(it.__getBoundThis__(), [], true, null);
                              __Hibernation__.obj_ref_json[ index ] = "__Hibernation__.obj_ref[" + targetIndex + "].bind(" + newObjPath + argCode + ")";
                            } else {
                              __Hibernation__.obj_ref_json[ index ] = "__Hibernation__.obj_ref[" + targetIndex + "].bind(__Hibernation__.obj_ref[" + thisIndex + "]" + args + " )";
                            }
                          } else {
                            // In the sample page, I found out that the handler function of the 'webkitfullscreenchange' event is a native function but without name.
                            __Hibernation__.Warning( "An empty native function is ignored." );
                            __Hibernation__.obj_ref_json[ index ] = "function(){}";
                          }
                          __Hibernation__.obj_ref_attributes[index] = {"type":"function"};
                          __Hibernation__.obj_ref_wrapper[index] = new __Hibernation__.FunctionWrapper(index);
                          __Hibernation__.globalObjectScope.children.push(__Hibernation__.obj_ref_wrapper[index]);
                        }
                        else {
                            //console.log( it );
                            __Hibernation__.Exception( "Unidentified native function, objectPath : " + JSON.stringify( objectPath ) );
                        }
                    }
                    else {
                        // An object path for retrieving a native function
                        var objectPath = __Hibernation__.NativeFunctionList.ObjectPath[ nativeFunctionIndex ]; 
                        //__Hibernation__.Info( "Native function: " + objectPath );
                        __Hibernation__.obj_ref_json[ index ] = objectPath;
                        __Hibernation__.obj_ref_attributes[index] = {"type":"function"};
                        __Hibernation__.obj_ref_wrapper[index] = new __Hibernation__.FunctionWrapper(index);
                        __Hibernation__.globalObjectScope.children.push(__Hibernation__.obj_ref_wrapper[index]);

                    }
                }
                else {
                    // For an ordinary JavaScript function,
                    // A JavaScript function can have closure variables so we try to enumerate every closure variables in the given function object.
                    var generatedCode = "";
                    var hasClosureVar = false;

                    // NEW IMPLEMENTATION (Scope creation)
                    var scopeDepth = it.__getScopeDepth__();
                    //console.log("scopeDepth : " + scopeDepth);

//                    console.log("|" + it + "|");

                    if (scopeDepth) {
                        __Hibernation__.maxScopeDepth = Math.max( __Hibernation__.maxScopeDepth, scopeDepth );
                        var currentScope = undefined;
                        var previousScope = undefined;

                        for (var scopeIter = 0; scopeIter < scopeDepth; scopeIter++) {
                            var needRefIndex = [];

                            var scopeID = it.__getScopeID__(scopeIter);
                            var scopeObject = __Hibernation__.scopeTree.get(scopeID);
                            var exists = true;
                            if (!scopeObject) {
                                //scopeObject = it.__getLexicalVariablesInScope__(scopeIter);
                                scopeObject = it.__getSymbolTableInScope__(scopeIter);
                                scopeObject.orderID = __Hibernation__.getOrderID();
                                scopeObject.orderIDArray = [];
                                scopeObject.orderIDArray.push(scopeObject.orderID);
                                exists = false;
                                //console.log(it.toString());
                                //for( var i = 0; i < scopeObject.varArray.length; i++ ){
                                    //console.log(scopeObject.varArray[i].varName);
                                //}
                            }

                            if (scopeIter === 0) {
                                // if it is first scope, it should contain this function to generate code
                                generatedCode = it.toString();
                                __Hibernation__.obj_ref_wrapper[index] = new __Hibernation__.FunctionWrapper(index);
                                scopeObject.children.push(__Hibernation__.obj_ref_wrapper[index]);
                                scopeObject.orderIDArray.push(__Hibernation__.obj_ref_wrapper[index].orderID);
                                //__Hibernation__.scopeTree.push(__Hibernation__.obj_ref_wrapper[index]);
                            }

                            // set link
                            previousScope = currentScope;
                            currentScope = scopeObject;
                            if (previousScope) {
                                previousScope.parentScope = currentScope;
                                currentScope.children.push(previousScope);
                                currentScope.orderIDArray = currentScope.orderIDArray.concat(previousScope.orderIDArray);
                                currentScope.dependentArray = currentScope.dependentArray.concat(previousScope.dependentArray);
                            }

                            if (scopeIter === scopeDepth - 1) {
                                // if it is last scope, its parent scope should be global object scope
                                currentScope.parentScope = __Hibernation__.globalObjectScope;
                                __Hibernation__.searchPush(__Hibernation__.globalObjectScope.children, currentScope);
                            }

                            if (exists) {
                                // found
                                // if this scope already exists, its parents are already saved previously, so abort
                                while( currentScope.parentScope !== undefined && currentScope.parentScope != __Hibernation__.globalObjectScope){
                                    if( previousScope !== undefined ){
                                        currentScope.parentScope.orderIDArray = currentScope.parentScope.orderIDArray.concat(previousScope.orderIDArray);
                                    }
                                    else{
                                        currentScope.parentScope.orderIDArray.push(__Hibernation__.obj_ref_wrapper[index].orderID);
                                    }
                                    currentScope = currentScope.parentScope;
                                }
                                break;
                            }
                            else {
                                // not found, so create new one
                                //console.log(scopeObject.scopeID);
                                __Hibernation__.scopeTree.push(scopeObject);
                                switch(scopeObject.scopeType) {
                                    // VO: Variable Object and Activation Object
                                    case "VO":
                                        //console.log(scopeObject.scopeType);
                                        for (var varIter = 0; varIter < scopeObject.varArray.length; varIter++) {
                                            scopeObject.varArray[varIter].varString = __Hibernation__.toJson( scopeObject.varArray[varIter].varObject, [], false, needRefIndex );
                                            //console.log(scopeObject.varArray[varIter].varString);
                                        }
                                        break;
                                    // WS: With Scope
                                    case "WS":
                                        //console.log(scopeObject.scopeType);
                                        scopeObject.thisString = __Hibernation__.toJson( scopeObject.thisObject, [], false, needRefIndex );
                                        //console.log(scopeObject.thisString);
                                        break;
                                    // GO: Global Object
                                    case "GO":
                                        __Hibernation__.Error("[GO should not be reached]");
                                        break;
                                    default: 
                                        __Hibernation__.Error("[Unrecognizable scope type]");
                                        break;
                                }

                                //__Hibernation__.scopeTree.push(scopeObject);
                            }

                            // insert dependent information of this function to scope object
                            for (var depIter = 0; depIter < needRefIndex.length; depIter++) {
                                var depIndex = needRefIndex[depIter];
                                if( __Hibernation__.obj_ref_wrapper[depIndex] == undefined )
                                    continue;
                                var depWrapperOrderID = __Hibernation__.obj_ref_wrapper[depIndex].orderID;
                                __Hibernation__.searchPush(scopeObject.dependentArray, depWrapperOrderID);
                            }

                            // insert dependency Information
                            if( __Hibernation__.InitOrder[index] === undefined )
                                __Hibernation__.InitOrder[index] = [];
                            __Hibernation__.InitOrder[index] = __Hibernation__.InitOrder[index].concat(needRefIndex);
                        }
                    }
                    else { // when the function does not have outer scope
                        generatedCode = it.toString();
                        __Hibernation__.obj_ref_wrapper[index] = new __Hibernation__.FunctionWrapper(index);
                        __Hibernation__.globalObjectScope.children.push(__Hibernation__.obj_ref_wrapper[index]);
                    }

                    __Hibernation__.obj_ref_json[ index ] = generatedCode;
                    // JWKWON
                    __Hibernation__.obj_ref_attributes[ index ] = { "type":"function", 
                                                                    "hasClosureVar": hasClosureVar, 
                                                                    "printed": false };
                }

                var userDefinedProperties = __Hibernation__.GetUserDefinedProperties(it);
                // JWKWON: include prototype so it can be saved
                userDefinedProperties.push("prototype");
                for ( var i = 0; i < userDefinedProperties.length; ++i ) {
                    var propertyName = userDefinedProperties[i];

                    if ( propertyName === "__builtin__" )
                        continue;
                    if ( __Hibernation__.FunctionObjectProperties[index] === undefined ) { 
                        __Hibernation__.FunctionObjectProperties[index] = {};
                    }
                    if ( __Hibernation__.FunctionObjectProperties[index][propertyName] === undefined ) {
                        var toJsonResult;
                        var propertyDescriptor = Object.getOwnPropertyDescriptor(it, propertyName);
                        if ( propertyDescriptor !== undefined && ( propertyDescriptor.get !== undefined || propertyDescriptor.set !== undefined ) ){
                            if ( propertyDescriptor.get !== undefined ){
                                var getterFunction = __Hibernation__.toJson( propertyDescriptor.get, [], true, null );
                                toJsonResult = "__Hibernation__.obj_ref[" + index + "].__defineGetter__(\"" + propertyName + "\", " + getterFunction + ");"
                                __Hibernation__.GetterSetter.push(toJsonResult);
                            }
                            if ( propertyDescriptor.set !== undefined ){
                               var setterFunction = __Hibernation__.toJson( propertyDescriptor.set, [], true, null );
                               toJsonResult = "__Hibernation__.obj_ref[" + index + "].__defineSetter__(\"" + propertyName + "\", " + setterFunction + ");"
                                __Hibernation__.GetterSetter.push(toJsonResult);
                            }
                            continue;
                        }
                        else{
                            var propertyPath = [ "__Hibernation__.obj_ref[" + index + "]", propertyName ];
                            if( propertyName != encodeURI(userDefinedProperties[i]) )
                                propertyPath = [ "__Hibernation__.obj_ref[" + index + "]", "decodURI(\"" + encodeURI(propertyName) + "\")" ];
                            toJsonResult = __Hibernation__.toJson( it[propertyName], propertyPath, true, null );
                        }
                        __Hibernation__.FunctionObjectProperties[index][propertyName] = toJsonResult;
                    }
                }
                // MOVED PART END
            }
            else if ( objtype === "object" && it instanceof RegExp) {
                // JWKWON: check if object is regular expression object
                __Hibernation__.obj_ref_json[index] = "__Hibernation__.obj_ref[" + index + "] = " + it.toString() + ";"; // String
                __Hibernation__.obj_ref_attributes[index] = {"type":"regExp"}; //{"type":"object"};
                // JWKWON END
            }
            else if ( objtype === "object" ) {
                // generic object code path
//                var output = [], key;
                var output = [];
                var needRefIndex = [];

                // JWKWON: moved Array part here, because codes are nearly same except Array should be created with new Array

                // JWKWON: substitute (for .. in) with getOwnPropertyNames().forEach to disclude prototype's properties
                // JWKWON: FIXME: getOwnPropertyNames finds all propertys INCLUDING enumerable=false property, so has potential hazard
                //console.log(objectPath);
                window.Object.getOwnPropertyNames(it).forEach(function(val, idx, arr) {
//                        if ( val !== "constructor" &&
//                             window.Object.getOwnPropertyDescriptor(it, val).enumerable === false ) {
//                            return;
//                        }
                        
                        if ( val === "__builtin__" )
                            return;
                        
                        if ( val === "enabledPlugin" )
                            return;

                        var keyStr, valString;
                        if (typeof val === "number") {
                            keyStr = "\'" + val + "\'";
                        } 
                        else if (typeof val === "string") {
                            if( val == encodeURI(val) )
                                keyStr = "\"" + val + "\"";
                            else
                                keyStr = "decodeURI(\"" + encodeURI(val) + "\")";
                        } 
                        else {
                            // skip non-string or number keys
                            return;
                        }
                        
                        var propertyDescriptor = Object.getOwnPropertyDescriptor(it, val);
                        if ( propertyDescriptor !== undefined && ( propertyDescriptor.get !== undefined || propertyDescriptor.set !== undefined ) ){
                            if ( propertyDescriptor.get !== undefined ){
                                var getterFunction = __Hibernation__.toJson( propertyDescriptor.get, [], true, needRefIndex );
                                valString = "__Hibernation__.obj_ref[" + index + "].__defineGetter__(\"" + val + "\", " + getterFunction + ");"
                                __Hibernation__.GetterSetter.push(valString);
                            }

                            if ( propertyDescriptor.set !== undefined ){
                                var setterFunction = __Hibernation__.toJson( propertyDescriptor.set, [], true, needRefIndex );
                                valString = "__Hibernation__.obj_ref[" + index + "].__defineSetter__(\"" + val + "\", " + setterFunction + ");"
                                __Hibernation__.GetterSetter.push(valString);
                            }
                            return;
                        }
                        else{
                            objectPath.push(val);
                            valString = __Hibernation__.toJson(it[val], objectPath, true, needRefIndex);
                            objectPath.pop();
                        }

                        output.push("__Hibernation__.obj_ref[" + index + "][" + keyStr + "] = " + valString + ";");

                        // if it is constructor, make its enumerable to be false
                        if (val === "constructor") {
                            output.push("Object.defineProperty(__Hibernation__.obj_ref[" + index + "], " + keyStr + ", { enumerable: false });");
                        }
                    }
                );

                // JWKWON: instructions for __proto__ recreation
                if ( it.__proto__ !== window.Object.prototype &&
                     it.__proto__ !== window.Array.prototype
                   ) {
                    var valString = __Hibernation__.toJson(it.__proto__, objectPath, true, needRefIndex);
                    output.push("__Hibernation__.obj_ref[" + index + "][\"__proto__\"] = " + valString + ";");
                }

                if ( needRefIndex.length > 0 ) {
                    __Hibernation__.InitOrder[ index ] = needRefIndex;
                }
//                __Hibernation__.obj_ref_json[index] = "{" + output.join(",") + "}"; // String
                __Hibernation__.obj_ref_json[index] = output.join("\n"); // String
                if ( __Hibernation__.isArray( it ) ) {
                    __Hibernation__.obj_ref_attributes[index] = {"type":"array"};
                }
                else {
                    __Hibernation__.obj_ref_attributes[index] = {"type":"object"};
                }
            }
        }

        if ( isEmptyObjectPath ) {
            objectPath = [];
        }
    }

    if ( __Hibernation__.isArray( refIndex ) ) {
        refIndex.push( index );
    }

    var attribute = __Hibernation__.obj_ref_attributes[ index ];
// JWKWON
//    if ( attribute !== undefined && attribute.hasClosureVar === true ) {
//        return "__Hibernation__.obj_ref[" + index + "]()";
//    }
//    else{
//        return "__Hibernation__.obj_ref[" + index + "]";
//    }
        return "__Hibernation__.obj_ref[" + index + "]";
// JWKWON END
};

__Hibernation__.CreateDOMTree = function(){
    __Hibernation__.DomTree = [];

    // Since some objects can have the document node,
    __Hibernation__.DomTree.push( document );

    var dfs = function( it /* object */, domTree ) {
        if ( it !== null && it !== undefined ) {
            __Hibernation__.DomTree.push( it );
            var index = __Hibernation__.DomTree.length - 1;
            var children = it.children;
            var removeChildren = [];

            var animationNames = __getAnimationNames__(it);
            if( animationNames.length !== 0 ){
                var toResultString = "__Hibernation__.DomTree[" + index + "].style.WebkitAnimationDelay = [";
                for( var i = 0; i < animationNames.length; i++ ){
                    var animationName = animationNames[i];
                    var progressTime = __getAnimationElapsedTime__(it, animationName);
                    if( i !== 0 )
                        toResultString += ", ";
                    toResultString += "\"" + progressTime + "s\"";
                    //var toResultString = "__setAnimationDelay__(__Hibernation__.DomTree[" + index + "], \"" + animationName + "\", " + progressTime + ");";
                    //var toResultString = "__Hibernation__.DomTree[" + index + "].style.WebkitAnimationDelay = \"" + progressTime + "s\"";
                }
                toResultString += "];";
                __Hibernation__.cssAnimationList.push(toResultString);
            }

            //jfix
            if(children !== undefined){
                for ( var i = 0; i < children.length; ++i ) {
                    var child = children[i];
                    if( child.nodeName === "SCRIPT" ){
                        removeChildren.push( child );
                    }
                    else {
                        dfs( child, __Hibernation__.DomTree );
                    }
                }
                
                for( var i = 0; i < removeChildren.length; i++ ){
                    it.removeChild( removeChildren[i] );
                }
            }
        }
        else {
            __Hibernation__.Exception( "Object is " + it.toString() );
        }
    };

    // Some objects can have a DOM element like 'LINK element' that is attached to the HEAD tag.
    dfs( document.head, __Hibernation__.DomTree );
    dfs( document.body, __Hibernation__.DomTree );
};

__Hibernation__.DomtoJson = function (it /*Object*/ ){
    // DOM Indexing, look __Hibernation__.DomTree, output is not used 
    if (it === null) {
        __Hibernation__.Exception("Object is null.");
    }

    __Hibernation__.DomTree.push(it); // DomTree is for indexing

    var children = it.children;
    for (var i = 0; i < children.length; i++) {
        var val = __Hibernation__.DomtoJson(children[i]);
    }
};

__Hibernation__.MakeJson = function ( hibernationTime ) {
    var startTime;
    // To collect user-defined global objects,
    var userDefinedGlobalObjects = [];
    var keyNames = Object.getOwnPropertyNames( window );
    for ( var i = 0; i < keyNames.length; ++i ) {
        var key = keyNames[i];

        // It's okay to skip saving the 'JsonML' object because its definitions are present in the third-party scripts. (thirdparty/json-*.js)
        if ( key === "JsonML" ) {
            continue;
        }

        var propertyDescriptor = Object.getOwnPropertyDescriptor( window, key );
        var attributes = propertyDescriptor !== undefined ? propertyDescriptor.__attributes__ : 0;
        if ( ( attributes & 64 ) !== 64 ) { // Browser's default properties of the window object will not be considered.
            startTime = new Date().getTime();
            var data = __Hibernation__.toJson( window[ key ], [ "window", key ], true, null );
            __Hibernation__.collectScopeTime += new Date().getTime() - startTime;
            userDefinedGlobalObjects.push( "var " + key + " = " + data + ";" );
        }
    }

    // jic: Added properties of Built-in Object
    var tTime = new Date().getTime();
    for( var i = 0; i < __Hibernation__.visitedNodeList.length; i++ ){
        var visitedNode = __Hibernation__.visitedNodeList[i];
        var objectPath = __Hibernation__.visitedNodesPath[i];

        var own = Object.hasOwnProperty;
        if( __Hibernation__.isDOMObject( visitedNode ) === false ){
            var names = Object.getOwnPropertyNames( visitedNode );
            for( var j = 0; j < names.length; j++){
                var name = names[j];
                
                if( name === "arguments" || name === "caller" || name === "enabledPlugin" || name === "__builtin__"){
                    continue;
                }
               
                if( visitedNode[name] == null ){
                    continue;
                }

                objectPath.push(name);
                if( name === "prototype"){
                    var proto_names = Object.getOwnPropertyNames( visitedNode[name] );
                    for( var k = 0; k < proto_names.length; k++ ){
                        var proto_name = proto_names[k];
                        if( proto_name === "__proto__" || proto_name === "constructor"){
                            continue;
                        }
                        objectPath.push(proto_name);
                        if( visitedNode[name][proto_name] instanceof Object || typeof visitedNode[name][proto_name] === "object" ) {
                            if (( own.call( visitedNode[name][proto_name], "__builtin__" ) === false ) &&
                                ( own.call( visitedNode[name][proto_name], "__userFramework__" ) === true )) {
                                startTime = new Date().getTime();
                                var data = __Hibernation__.toJson( visitedNode[name][proto_name], objectPath, true, null );
                                __Hibernation__.collectScopeTime += new Date().getTime() - startTime;
                                __Hibernation__.addedPropertiesOfBuiltInObj.push(__Hibernation__.GenerateAccessCode(objectPath) + " = " + data + ";" );
                            }
                            else {
                                var idx = __Hibernation__.visitedNodeList.indexOf(visitedNode[name][proto_name]);
                                if( idx !== -1 ){
                                    var originPath = __Hibernation__.visitedNodesPath[idx];
                                    if( originPath[originPath.length -1] !== proto_name ){
                                        startTime = new Date().getTime();
                                        var data = __Hibernation__.toJson( visitedNode[name][proto_name], objectPath, true, null );
                                        __Hibernation__.collectScopeTime += new Date().getTime() - startTime;
                                        __Hibernation__.addedPropertiesOfBuiltInObj.push(__Hibernation__.GenerateAccessCode(objectPath) + " = " + data + ";" );
                                    }
                                }
                            }
                        } else {
//                            var propertyDescriptor = Object.getOwnPropertyDescriptor( visitedNode[name], proto_name );
//                            var attributes = propertyDescriptor !== undefined ? propertyDescriptor.__attributes__ : 0;
//                            if ( ( attributes & 64 ) !== 64 ) { // Browser's default properties of the window object will not be considered.
//                                var data = __Hibernation__.toJson( visitedNode[name][proto_name], objectPath, true, null );
//                                __Hibernation__.addedPropertiesOfBuiltInObj.push(__Hibernation__.GenerateAccessCode(objectPath) + " = " + data + ";" );
//                            }
                        }
                        objectPath.pop();
                    }
                }
                else if( visitedNode[name] instanceof Object || typeof visitedNode[name] === "object" ) {
                    if( own.call( visitedNode[name], "__builtin__" ) === false ){
                        startTime = new Date().getTime();
                        var data = __Hibernation__.toJson( visitedNode[name], objectPath, true, null );
                        __Hibernation__.collectScopeTime += new Date().getTime() - startTime;
                        __Hibernation__.addedPropertiesOfBuiltInObj.push(__Hibernation__.GenerateAccessCode(objectPath) + " = " + data + ";" );
                    }
                    else{
                        var idx = __Hibernation__.visitedNodeList.indexOf(visitedNode[name]);
                        if( idx !== -1 ){
                            var originPath = __Hibernation__.visitedNodesPath[idx]
                            if( originPath[originPath.length -1] !== name ){
                                startTime = new Date().getTime();
                                var data = __Hibernation__.toJson( visitedNode[name], objectPath, true, null );
                                __Hibernation__.collectScopeTime += new Date().getTime() - startTime;
                                __Hibernation__.addedPropertiesOfBuiltInObj.push(__Hibernation__.GenerateAccessCode(objectPath) + " = " + data + ";" );
                            }
                        }
                    }
                }else{
//                    var propertyDescriptor = Object.getOwnPropertyDescriptor( visitedNode, name );
//                    var attributes = propertyDescriptor !== undefined ? propertyDescriptor.__attributes__ : 0;
//                    if ( ( attributes & 64 ) !== 64 ) { // Browser's default properties of the window object will not be considered.
//                        var data = __Hibernation__.toJson( visitedNode[name], objectPath, true, null );
//                        __Hibernation__.addedPropertiesOfBuiltInObj.push(__Hibernation__.GenerateAccessCode(objectPath) + " = " + data + ";" );
//                    }
                }
                objectPath.pop();
            }
        }
    }
    // jic end
    var bTime = new Date().getTime() - tTime;
    console.log("Built-In Object Check Time : " + bTime + "ms");
    
    ///////////////////////////////////////////////////////////////////////////////////////////
    // Since the array 'obj_ref' will be generated in this function 'MakeJson', we must replace the function object itself in the 'TimeoutList'
    // and the 'EventHandlers' to the instance in the 'obj_ref' array. Code for restoration of setTimeout handlers and DOMEvent handlers will be
    // generated in the 'MakeDOM' function but they will use the instance in the 'obj_ref' array, not in the object itself.
    for (var i = 0; i < __Hibernation__.TimeoutList.length; i++) {
        var item = __Hibernation__.TimeoutList[i];
        startTime = new Date().getTime();
        item[0] = __Hibernation__.toJson( item[0], [], true, null ); // Calling the 'toJson' function will add the function into the 'obj_ref' array automatically.
        __Hibernation__.collectScopeTime += new Date().getTime() - startTime;
    }

    for ( var i = 0; i < __Hibernation__.EventHandlers.length; ++i ) {
        var item = __Hibernation__.EventHandlers[i];
        startTime = new Date().getTime();
        item[2] = __Hibernation__.toJson( item[2], [], true, null );
        __Hibernation__.collectScopeTime += new Date().getTime() - startTime;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////


    // While executing the 'toJson' function, we collected init. dependency relationship in the 'InitOrder' array.
    // For example, InitOrder[0] = [ 1, 103, 104, ... ] says that initialization of #1, #103, #104 is required to initialize #0.

    var collectDependency = function(head){
        var findScope = function(scope, orderID){
            for(var i = 0; i < scope.children.length; i++){
                if( scope.children[i].orderID === orderID )
                    return scope.children[i];
                if( scope.children[i].orderIDArray !== undefined && scope.children[i].orderIDArray.indexOf(orderID) !== -1 )
                    return scope.children[i];
            }
            return null;
        }

        var arrangeChildInsert = function(scope, child, arr){
            if( child.scopeType === "VO" ){
                for( var i = 0; i < child.dependentArray.length; i++ ){
                    if( child.orderIDArray.indexOf(child.dependentArray[i]) !== -1 )
                        continue;

                    var dependentScope = findScope(scope, child.dependentArray[i]);
                    if( dependentScope !== null && arr.indexOf(dependentScope) === -1 ){
                        arrangeChildInsert(scope, dependentScope, arr);
                    }
                }
            }
            __Hibernation__.searchPush(arr, child);
        }

        var sortChildren = function(scope){
            var arrangeChildren = [];
            for(var i = 0; i < scope.children.length; i++){
                if( arrangeChildren.indexOf(scope.children[i]) === -1 ){
                    arrangeChildInsert(scope, scope.children[i], arrangeChildren);
                }
                if( scope.children[i].scopeType === "VO" ){
                    sortChildren(scope.children[i]);
                }
            }
            scope.children = arrangeChildren;
        }
        
        sortChildren(head);
    }

    startTime = new Date().getTime();
    collectDependency(__Hibernation__.scopeTree[0]);
    var checkDependencyTime = new Date().getTime() - startTime;

    var scopeLevel = 0;

    var findChild = function(scope, index){
        for( var i = 0; i < scope.children.length; i++){
            if(scope.children[i].index === index)
                return scope.children[i];
        }
        return null;
    }

    var generateCodeWithWrapper = function(scope){
        var indentation = "";
        for( var i = 0; i < scopeLevel; i++){
            indentation += "\t";
        }

        switch(scope.scopeType){
            case "GO":
                for( var i = 0; i < scope.children.length; i++){
                        generateCodeWithWrapper(scope.children[i]);
                }
                break;
            case "VO":
                generatedCode += indentation + "(function() {\n";

                // phase 1: generate variables
                var commentPrinted = false;

                // phase 2: recursively call generateCodeWithWrapper over child scopes
                for ( var i = 0; i < scope.children.length; i++ ) {
                    scopeLevel++;
                    generateCodeWithWrapper(scope.children[i]);
                    scopeLevel--;
                }
                // phase 3: generate variables
                for (var nameIter = 0; nameIter < scope.varArray.length; nameIter++) {
                    var closureVarObjRef = scope.varArray[nameIter].varString;
                    if (( scope.varArray.length ) && ( !commentPrinted )) {
                        generatedCode += indentation + "\t// CLOSURE VARIABLES\n";
                        commentPrinted = true;
                    }

                    if (!scope.varArray[nameIter].isSelf) {
                        generatedCode += indentation + "\tvar " + scope.varArray[nameIter].varName + " = " + closureVarObjRef + ";\n";
                    }
                }

                generatedCode += indentation + "})();\n";
                break;
            case "WS":
                if( __Hibernation__.isDOMObject(scope.thisObject) ){
                    for ( var i = 0; i < scope.children.length; i++ ) {
                        generateCodeWithWrapper(scope.children[i]);
                    }  
                }
                else{
                    generatedCode += indentation + "with(" + scope.thisString + "){\n";
                
                    for ( var i = 0; i < scope.children.length; i++ ) {
                        scopeLevel++;
                        generateCodeWithWrapper(scope.children[i]);
                        scopeLevel--;
                    }

                    generatedCode += indentation + "}\n";
                }
                break;
            case "FW":
                generatedCode += indentation;
                if (__Hibernation__.obj_ref_attributes[scope.index].funcName !== undefined) {
                    generatedCode += "var " + __Hibernation__.obj_ref_attributes[scope.index].funcName + " = ";
                }
                generatedCode += "__Hibernation__.obj_ref[" + scope.index + "] = " + __Hibernation__.obj_ref_json[scope.index] + ";\n";
                break;
            default :
                console.log("Not scope");
                break;
        }
    }

    startTime = new Date().getTime();

    var generatedCode = "";
    generatedCode += "__Hibernation__.obj_ref = new Array();\n";
    generatedCode += "__Hibernation__.timerid_ref = new Array();\n";

    // Prepare the empty object instance:
    generatedCode += "(function() {\n";
    generatedCode += "\tvar objectIndex = [";
    for ( var i = 0; i < __Hibernation__.obj_ref.length; ++i ) {
        if ( __Hibernation__.obj_ref_attributes[i].type === "object" ) {
            generatedCode += i + ",";
        }
    }
    generatedCode += "];\n";
    generatedCode += "\tvar arrayIndex=[";
    for ( var i = 0; i < __Hibernation__.obj_ref.length; ++i ) {
        if ( __Hibernation__.obj_ref_attributes[i].type === "array" ) {
            generatedCode += i + ",";
        }
    }
    generatedCode += "];\n";
    generatedCode += "\tfor (var i=0; i < objectIndex.length; ++i){\n";
    generatedCode += "\t\t__Hibernation__.obj_ref[objectIndex[i]] = {};\n";
    generatedCode += "\t}\n";
    generatedCode += "\tfor (var i=0; i < arrayIndex.length; ++i){\n";
    generatedCode += "\t\t__Hibernation__.obj_ref[arrayIndex[i]] = new Array();\n";
    generatedCode += "\t}\n";
    generatedCode += "})();\n";

    // print regExps
    for ( var index = 0; index < __Hibernation__.obj_ref.length; ++index ) {
        if (__Hibernation__.obj_ref_attributes[index].type === "regExp") {
            generatedCode += __Hibernation__.obj_ref_json[index] + "\n";
        }
    }

    // print functions
    generateCodeWithWrapper(__Hibernation__.scopeTree[0]);

    // print objects and arrays
    for ( var index = 0; index < __Hibernation__.obj_ref.length; ++index ) {
        if ((__Hibernation__.obj_ref_attributes[index].type === "object") ||
            (__Hibernation__.obj_ref_attributes[index].type === "array" )) {
            generatedCode += __Hibernation__.obj_ref_json[index] + "\n";
        }
    }

    // Function Object Property
    generatedCode += "// Function Object Properties Mapping\n";
    for ( var index in __Hibernation__.FunctionObjectProperties ) {
        var propertyInfo = __Hibernation__.FunctionObjectProperties[ index ];
        for ( var name in propertyInfo ) {
            generatedCode += "__Hibernation__.obj_ref[" + index + "][\"" + name + "\"] = " + propertyInfo[name] + ";\n";
        }
    }
    
    generatedCode += "// Restore Getter or Setter function\n"; // Comments
    generatedCode += __Hibernation__.GetterSetter.join("\n") + "\n";

    generatedCode += "// User defined global objects\n"; // Comments
    generatedCode += userDefinedGlobalObjects.join("\n") + "\n";

    //jic
    generatedCode += "// User added Properties of BuiltIn Objects\n";
    generatedCode += __Hibernation__.addedPropertiesOfBuiltInObj.join("\n") + "\n";
    //jic end


    
    generatedCode += "// DOM Objects Mapping\n";
    generatedCode += __Hibernation__.DOMObjectMap.join( "\n" ) + "\n";

    // DOM Tree Property
    generatedCode += "// DOM Object Properties Mapping\n";
    for ( var index in __Hibernation__.DOMObjectProperties ) {
        var propertyInfo = __Hibernation__.DOMObjectProperties[ index ];
        for ( var name in propertyInfo ) {
            generatedCode += "__Hibernation__.DomTree[" + index + '][\"' + name + '\"] = ' + propertyInfo[name] + ";\n";
        }
    }

    // CSS Animation
    generatedCode += "// CSS Animation\n";
    generatedCode += __Hibernation__.cssAnimationList.join("\n") + "\n";

    // Make Timer Event code
    generatedCode += "// Timer Event code:[" + __Hibernation__.TimeoutList.length + "]\n";
    generatedCode += "// Hibernation Time:[" + hibernationTime + "]\n";

    // JAEYKIM
    var timeoutId = 2;
    for (var i = 0; i < __Hibernation__.TimeoutList.length; i++) {
        if (timeoutId++ < __Hibernation__.TimeoutIdList[i])
        {
          generatedCode += "setTimeout(function(){}, 0); // dummy timeout\n";
          i--;
          continue;
        }
        var item = __Hibernation__.TimeoutList[i];
        generatedCode += "// [" + item + "]\n";
        if ( item[3] ) {      // if SingleShot is true, this event is repeated once, so generate setTimeout
            var time = item[1] * 1000 + item[2] - hibernationTime;
            if (time > 0) {
                var accessCode = __Hibernation__.TimerIDList[i];
                if (accessCode !== undefined && accessCode.length !== 0) {
                    generatedCode += __Hibernation__.TimerIDList[i] + "=";
                }
                generatedCode += "setTimeout(" + item[0] + ", " + time + ");\n";
            }
        }
        else {           // SingleShot is false, so generate setInterval with first execution set with setTimeout
            var time = item[1] * 1000 + item[2] - hibernationTime;
            while (time < 0) {
                time += item[2];
            }
            generatedCode += "setTimeout(function() {" + item[0] + "(); setInterval(" + item[0] + ", " + item[2] + ");}, " + time + ");\n";
        }
    }

    // Generate code for DOM events
    generatedCode += "// DOM Event code\n";
    for ( var i = 0; i < __Hibernation__.EventHandlers.length; ++i ) {
        var item = __Hibernation__.EventHandlers[i];
        var eventName = item[1];

        if( item[0] === "" )
            continue;
        
        // FIXME: we assume that an 'onload' event handler is already called.
        if ( eventName === "load" ) {
            continue;
        }

        if (window.addEventListener) {
            generatedCode += item[0] + ".addEventListener(\"" + eventName + "\",  " + item[2] + ", false);\n";
        } 
        else {
            generatedCode += item[0] + ".attachEvent('on' + \"" + eventName + "\", " + item[2] + ");\n";
        }
    }

    // For Video Element Recovery
    for (var i = 0; i < __Hibernation__.VideoList.length; i++) {
        var item = __Hibernation__.VideoList[i];
        var parameter = item[0] + " ," + item[1] + " ," + item[2];
        generatedCode += "__Hibernation__.InitializeVideo(" + parameter + ");\n";
    }

    // Send JSON File
    if( __Hibernation__.wsFlag ){
        __Hibernation__.Info("Send JSON File");
        var tac = new Date().getTime();
        __Hibernation__.ws.send("1" + tac.toString() + generatedCode);
    }
    else {
        __Hibernation__.SaveTo( __Hibernation__.uniqueDocumentName + "_json.js", generatedCode );
    }
    
    var codeGenTime = new Date().getTime() - startTime;

    __Hibernation__.Info("toJson Time : " + __Hibernation__.collectScopeTime + "ms");
    __Hibernation__.Info("Checking Dependency Time : " + checkDependencyTime + "ms");
    __Hibernation__.Info("Code Generateing Time : " + codeGenTime + "ms");
};

__Hibernation__.MakeDOM = function () {
    var jmlHead = JSON.stringify( JsonML.fromHTML( document.head ) );
    var jmlBody = JSON.stringify( JsonML.fromHTML( document.body ) );

    var generatedCode = "";
    generatedCode += "// Restore the previous HEAD element and BODY element\n";
    generatedCode += "(function() {";
    generatedCode += "var jmlHead = " + jmlHead + ";\n";
    generatedCode += "var jmlBody = " + jmlBody + ";\n";
    generatedCode += "var headToHTML = JsonML.toHTML( jmlHead );\n"
    generatedCode += "var bodyToHTML = JsonML.toHTML( jmlBody );\n"
    generatedCode += "document.head.innerHTML = headToHTML.innerHTML;\n"
    generatedCode += "document.head.outerHTML = headToHTML.outerHTML;\n"
    generatedCode += "document.body.innerHTML = bodyToHTML.innerHTML;\n"
    generatedCode += "document.body.outerHTML = bodyToHTML.outerHTML;\n"
    generatedCode += "__Hibernation__.CreateDOMTree();\n";
    generatedCode += "}());\n";

    // Send DOM File
    if( __Hibernation__.wsFlag ){
        __Hibernation__.Info("Send DOM File");
        var tac = new Date().getTime();
        __Hibernation__.ws.send("2" + tac.toString() + generatedCode);
    }
    else {
        __Hibernation__.SaveTo(__Hibernation__.uniqueDocumentName + "_dom.js", generatedCode);
    }
};


__Hibernation__.SetTimerInfo = function () {
    if (__Hibernation__.TimeoutList.length !== 0 && __Hibernation__.TimerIndexMap.length !== 0) {
            __Hibernation__.Exception("TimerList is not initialized.");
    }

    var timeoutIdList = __getTimerList__(); // Get the ID of active timers

    // JAEYKIM
    timeoutIdList.sort (function (a, b){ return a - b; });
    __Hibernation__.TimeoutIdList = timeoutIdList;
    // JAEYKIM END
     
    for ( var i = 0; i < timeoutIdList.length; ++i ) {
        var item = __getTimerInfo__( timeoutIdList[i] );
        /*
         * 0: function, 1: registered time, 2: interval, 3: isSingleShot
         */
        __Hibernation__.TimeoutList.push( [ item[0], item[1], item[2], item[3] ]);
        __Hibernation__.TimerIndexMap.push( item[1] );
    }
};

__Hibernation__.InitializeVideo = function (index, paused, playTime) {
    var restorePlaybackPos = function()
    {
        __Hibernation__.DomTree[index].currentTime = playTime;
        if (!paused) {
            __Hibernation__.DomTree[index].play();
        }
    };
    if (window.addEventListener) {
        __Hibernation__.DomTree[index].addEventListener( "loadeddata", restorePlaybackPos );
    } 
    else {
        __Hibernation__.DomTree[index].attachEvent( "onloadeddata", restorePlaybackPos );
    }
};

__Hibernation__.GetEventListenerInfo = function( it, path, result ){
    // it: a DOM element which can have an event handler.
    // This function returns a list of pairs <eventName, eventListener(handler)>
    var nameOfEventListeners = __getNameOfEventListeners__( it );
    if ( __Hibernation__.isArray( nameOfEventListeners ) && nameOfEventListeners.length > 0 ) { // not empty
        for ( var i = 0; i < nameOfEventListeners.length; ++i ) {
            var eventName = nameOfEventListeners[i];
            var eventListeners = __getEventListeners__( it, eventName );
            if ( __Hibernation__.isArray( eventListeners ) && eventListeners.length > 0 ) { // not empty
                for ( var j = 0; j < eventListeners.length; ++j ) {
                    result.push( [ path, eventName, eventListeners[j] ] );
                }
            }
        }
    }
    return undefined; // 'result' is an output parameter
};

__Hibernation__.HasDocumentAncestor = function( domElement ) {
    if ( domElement.parentNode === undefined ) return false; // maybe this is not a DOM element.
    var curElement = domElement.parentNode; 
    while( curElement !== undefined && curElement !== null ){
        if ( curElement === window.document ){
            return true;
        }
        if ( curElement.parentNode === undefined ) return false;
        curElement = curElement.parentNode;
    }
    return false;
};

__Hibernation__.MakeHTML = function() {
    // Required JavaScript files to restore the previous state
    var frameworkScripts = [ "hibernation.js", "thirdparty/jsonml-dom.js", "thirdparty/jsonml-html.js", __Hibernation__.uniqueDocumentName + "_dom.js", __Hibernation__.uniqueDocumentName + "_json.js" ];

    var scriptHTML = "";
    for ( var i = 0; i < frameworkScripts.length; ++i ) {
        scriptHTML += "<script type=\"text/javascript\" src=\"" + frameworkScripts[i] + "\"></script>\n";
    }
    var generatedHTML = "<html>\n<head></head>\n" + "<body>\n" + scriptHTML + "</body>\n</html>";

    // Send HTML file
    if( __Hibernation__.wsFlag ){
        __Hibernation__.Info("Send HTML File");
        var tac = new Date().getTime();
        __Hibernation__.ws.send("3" + tac.toString() + generatedHTML);
    }
    else {
        __Hibernation__.SaveTo( __Hibernation__.uniqueDocumentName + "_html.html", generatedHTML );
    }
};

__Hibernation__.SaveState = function (uniqueDocumentName) {
    // JWKWON: moved this value up for exact value (more exact if this is evaluated as fast as possible)
    var hibernationTime = new Date().getTime();

    __Hibernation__.InitializeGlobalVariables();

    __Hibernation__.Info( "Started, uniqueDocumentName = " + uniqueDocumentName );
    __Hibernation__.uniqueDocumentName = "__" + uniqueDocumentName;

    // We assume that any script in the HEAD element or the BODY element is executed immediately.
    // As a result of executing the script, it will affect the DOM tree, global variables, and the related event handlers.
    // Since the hibernation framework save these contexts, we don't need to preserve script tags in these elements.
    // If we do not remove the script tags, the saved document will be confronted with redefining the JavaScript objects.
//    var removingScriptTags = [];
//    var getScriptTags = function( it, objectPath ) {
//        if ( __Hibernation__.isDOMObject( it ) ) {
//            if ( it.nodeName === "SCRIPT" ) {
//                console.log("Delete SCRIPT");
//                console.log(objectPath);
//                removingScriptTags.push( it );
//            }
//        }
//    };

//    var getNativeFunctionList = function( it, objectPath ){
//        if ( __Hibernation__.isNativeFunction( it ) ){
//            __Hibernation__.NativeFunctionList.NativeObjects.push( it );
//            var path = __Hibernation__.GenerateAccessCode( objectPath );
//            __Hibernation__.NativeFunctionList.ObjectPath.push( path );
//        }
//    };

//    var getEventHandlerOfIsolatedDOMElement = function( it, objectPath ){
//        if ( __Hibernation__.isDOMObject( it ) ){
//            if ( ! __Hibernation__.HasDocumentAncestor( it ) && it !== window.document ){
                // an 'isolated' DOM element, which is not attached to the document element.
//                var path = __Hibernation__.GenerateAccessCode( objectPath );
//                console.log('Isolated event: ' + path);
//                __Hibernation__.GetEventListenerInfo( it, path, __Hibernation__.EventHandlers );
//            }
//        }
//    };

//    __Hibernation__.TraverseWindowObject( [ getNativeFunctionList, getEventHandlerOfIsolatedDOMElement, getScriptTags ] );
//    var startTime = new Date().getTime();
//    __Hibernation__.TraverseWindowObject( [ getScriptTags ] );
//    var windowTraverseTime = new Date().getTime() - startTime;
//    __Hibernation__.Info("Window Traverse Time : " + windowTraverseTime + "ms");

    // Debug : Print out the number of native functions
//    __Hibernation__.Info( "The number of native functions: " + __Hibernation__.NativeFunctionList.ObjectPath.length );

    // To remove the script tags
//    __Hibernation__.Info( "The number of script tags to be removed: " + removingScriptTags.length );
//    for ( var i = 0; i < removingScriptTags.length; ++i ) {
//        var currentNode = removingScriptTags[i];
//        var parentNode = currentNode.parentNode;
//        if ( parentNode !== undefined ) {
//            parentNode.removeChild( currentNode );
//       }
//        else {
//            __Hibernation__.Error( "The script tag(index:" + i + ") is isolated." );
//        }
//    }

    var startTime = new Date().getTime();
    __Hibernation__.CreateDOMTree();
    var createDomTime = new Date().getTime() - startTime;
    __Hibernation__.Info("Create DOM Tree Time : " + createDomTime + "ms");

    // Traverse every DOM element in the 'DOMTree' array and extract the information of event handlers.
    for ( var i = 0; i < __Hibernation__.DomTree.length; ++i ) {
        var item = __Hibernation__.DomTree[i];
        __Hibernation__.GetEventListenerInfo( item, "__Hibernation__.DomTree[" + i + "]", __Hibernation__.EventHandlers );

        // To gather related information to play the video (play/paused status, current time)
        if ( item.tagName === "VIDEO" ) {
            __Hibernation__.VideoList.push( [ i, item.paused, item.currentTime ] );
        }
    }

    __Hibernation__.SetTimerInfo();
//    __Hibernation__.Info( "TimeoutList: " + JSON.stringify( __Hibernation__.TimeoutList ) );

    startTime = new Date().getTime();
    __Hibernation__.MakeJson( hibernationTime );
    var jsonTime = new Date().getTime() - startTime;
    __Hibernation__.Info("MakeJson Time : " + jsonTime + "ms");
    startTime = new Date().getTime();
    __Hibernation__.MakeDOM();
    var domTime = new Date().getTime() - startTime;
    __Hibernation__.Info("MakeDOM Time : " + domTime + "ms");
    startTime = new Date().getTime();
    __Hibernation__.MakeHTML();
    var htmlTime = new Date().getTime() - startTime;
    __Hibernation__.Info("MakeHTML Time : " + htmlTime + "ms");

    __Hibernation__.Info( "max Scope Depth : " + __Hibernation__.maxScopeDepth );
    __Hibernation__.Info( "number of Scope Object : " + ( __Hibernation__.scopeTree.length - 1 ) );
//    __Hibernation__.Info( "closureSearchTime: " + __Hibernation__.closureSearchTime + "ms" );
//    __Hibernation__.Info( "collectDependencyTime: " + __Hibernation__.collectDependencyTime + "ms" );

    __Hibernation__.Info( "Ended" );
};

