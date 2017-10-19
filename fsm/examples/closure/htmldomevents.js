var Events = {
	MouseEvents : [ 
		"onclick",
		"oncontextmenu",
		"ondblclick",
		"onmousedown",
		"onmouseenter",
		"onmouseleave",
		"onmousemoe",
		"onmouseover",
		"onmouseout",
		"onmouseup",
	],
	KeyboardEvents : [
		"onkeydown",
		"onkeypress",
		"onkeyup"
	],
	FrameObjectEvents : [
		"onabort",
		"onbeforeunload",
		"onerror",
		"onhashchange",
		"onload",
		"onpageshow",
		"onpagehide",
		"onresize",
		"onscroll",
		"onunload"
	],
	FormEvents : [
		"onblur",
		"onchange",
		"onfocus",
		"onfocusin",
		"onfocusout",
		"oninput",
		"oninvalid",
		"onreset",
		"onsearch",
		"onselect",
		"onsubmit"
	],
	DragEvents : [
		"ondrag",
		"ondragend",
		"ondragenter",
		"ondragleave",
		"ondragover",
		"ondragstart",
		"ondrop"
	],
	ClipboardEvents : [
		"oncopy",
		"oncut",
		"onpaste"
	],
	PrintEvents : [
		"onafterprint",
		"onbeforeprint",
	],
	MediaEvents : [
		"onabort",
		"oncanplay",
		"oncanplaythrough",
		"ondurationchange",
		"onemptied",
		"onended",
		"onerror",
		"onloadeddata",
		"onloadedmetadata",
		"onloadstart",
		"onpause",
		"onplay",
		"onplaying",
		"onprogress",
		"onratechange",
		"onseeked",
		"onseeking",
		"onstalled",
		"onsuspend",
		"ontimeupdate",
		"onvolumechange",
		"onwaiting"
	],
	AnimationEvents : [
		"animationend",
		"animationiteration",
		"animationstart"
	],
	TransitionEvents : [
		"transitionend"
	],
	ServerSentEvents : [
		"onerror",
		"onmessage",
		"onopen"
	],
	MiscEvents : [
		"onmessage",
		"onmousewheel",
		"ononline",
		"onoffline",
		"onpopstate",
		"onshow",
		"onstorage",
		"ontoggle",
		"onwheel"		
	],
	TouchEvents : [
		"ontouchcancel",
		"ontouchend",
		"ontouchmove",
		"ontouchstart"
	]
};

exports.includes = function (attrib){
	return Events.MouseEvents.includes(attrib) ||
		Events.KeyboardEvents.includes(attrib) ||
		Events.FrameObjectEvents.includes(attrib) ||
		Events.FormEvents.includes(attrib) ||
		Events.DragEvents.includes(attrib) ||
		Events.ClipboardEvents.includes(attrib) ||
		Events.PrintEvents.includes(attrib) ||
		Events.MediaEvents.includes(attrib) ||
		Events.AnimationEvents.includes(attrib) ||
		Events.TransitionEvents.includes(attrib) ||
		Events.ServerSentEvents.includes(attrib) ||
		Events.MiscEvents.includes(attrib) ||
		Events.TouchEvents.includes(attrib);
}
