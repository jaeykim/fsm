// Restore the previous HEAD element and BODY element
(function() {var jmlHead = ["HEAD","\n\t","\n\t","\n\t","\n\t","\n\t","\n\t","\n\t","\n"];
var jmlBody = ["BODY","\n\t",["P",{"id":"hello"},"Hello, World44"],"\n\t",["BUTTON",{"onclick":"secondExecution()"},"Second Execution"],"\n\t",["BUTTON",{"onclick":"invokeEvent()"},"Invoke Event"],"\n\n\n"];
var headToHTML = JsonML.toHTML( jmlHead );
var bodyToHTML = JsonML.toHTML( jmlBody );
document.head.innerHTML = headToHTML.innerHTML;
document.head.outerHTML = headToHTML.outerHTML;
document.body.innerHTML = bodyToHTML.innerHTML;
document.body.outerHTML = bodyToHTML.outerHTML;
__Hibernation__.CreateDOMTree();
}());
