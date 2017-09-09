var DEBUG = false;
var level = 0;

var start = new Date().getTime();
var log = function (e, l = 0) { if (DEBUG && l >= level) console.log(e); }
var now = function (e) { if (DEBUG) console.log(e + ": " + (new Date().getTime() - start)); }

module.exports = {
	log,
	now
}
