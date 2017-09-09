// Restore the previous HEAD element and BODY element
(function() {var jmlHead = ["HEAD","\n\t","\n\t","\n\t","\n\t","\n    ","\n    ",["META",{"charset":"utf-8"}],"\n    ",["TITLE"],"\n \n    ","\n"];
var jmlBody = ["BODY","Hello World"];
document.head.innerHTML = JsonML.toHTML( jmlHead ).innerHTML;
document.body.innerHTML = JsonML.toHTML( jmlBody ).innerHTML;
__Hibernation__.CreateDOMTree();
}());
