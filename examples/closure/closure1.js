// Closure implementation
function Pixel(x, y) {
	this.x = x;
	this.y = y;
	this.getX = function() {
		return this.x;
	}
	this.getY = function() {
		return this.y;
	}
	this.setX = function(value) {
		this.x = value;
	}
	this.setY = function(value) {
		this.y = value;
	}
}

const cycles = 2000000;


function TestPerformance() {
	// Testing Instance
	var closureStartDateTime = new Date();
	for (var i = 0; i < cycles; i++) {
		var x = new Pixel(i, i);
	}
	var closureEndDateTime = new Date();

	var closureTime = closureEndDateTime.getTime() - closureStartDateTime.getTime();
	console.log("Instance Benchmark");
	console.log("Closure time: " + closureTime);

	// Testing Execution
	var closureExecStartDateTime, closureExecEndDateTime
	function getTimeClosure(){
		var cl1 = new Pixel(1, 1000);
		closureExecStartDateTime = new Date();
		for (var i = 0; i < cycles; i++) {
			cl1.setX('hola');
		}
		closureExecEndDateTime = new Date();
	}
	getTimeClosure();

	var closureExecTime = closureExecEndDateTime.getTime() - closureExecStartDateTime.getTime();
	console.log("Execution Benchmark");
	console.log("Execution time: " + closureExecTime);
}

TestPerformance();
