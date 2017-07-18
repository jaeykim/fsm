var data = 10;

function MyClass() {
	this.data = 0;
}

MyClass.prototype.method1 = function() {
	this.data = 20;
	data = 30;

	console.log("1. data = " + data); // 30
	console.log("2. this.data= " + this.data); // 20
	console.log("3. window.data = " + window.data); // 30
}

var my1 = new MyClass();
my1.method();
