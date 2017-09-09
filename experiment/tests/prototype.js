function MyPoint(x, y) {
	this.x = x;
	this.y = y;
}

MyPoint.prototype.distance = function (p) {
	var xd = this.x - p.x,
			yd = this.y - p.y;
	return Math.sqrt(xd*xd + yd*yd);
}

var p = new MyPoint(2013, 11);
console.log(p.distance({x: 19, y: 19}));

for (proto in MyPoint.prototype) {
	console.log(proto);
}

console.log("--------------------");

Object.prototype.$ref = new Object();
Object.prototype.$ref.$name = 'ref';

function foo(x) {
	this.name = $ref.$name;
	return this.name;
}

console.log(foo());
