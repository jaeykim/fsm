__Hibernation__.obj_ref = new Array();
__Hibernation__.timerid_ref = new Array();
(function(){var ind=[]; for (var i=0;i<ind.length;++i){ __Hibernation__.obj_ref[ind[i]]={};}} )();
/* 0 needs undefined, incomplete: false */
__Hibernation__.obj_ref[0]=function (e) {
    if(e.keyCode===72) { // '72' stands for the 'h' key
        // TODO: The prefix for the output files is always "sample". We can use an uni-directional hash function for the given URL.
        __Hibernation__.SaveState( "sample" ); 
    } };
// User defined global objects

// DOM Objects Mapping

__Hibernation__.DomTree[0].addEventListener("keydown",  __Hibernation__.obj_ref[0], false);
