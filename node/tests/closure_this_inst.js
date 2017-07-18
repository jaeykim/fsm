var $0 = runtime.create();
$0.data = 10;

function MyClass() {
	var $1 = runtime.create();
	$1.data = 0;
}

MyClass.prototype.method1 = function() {
	$1.data = 20;
	$0.data = 30;

	console.log("1. data = " + $0.data); // 30
	console.log("2. this.data= " + $1.data); // 20
	console.log("3. window.data = " + $0.data); // 30
}

var my1 = new MyClass();
my1.method1();
