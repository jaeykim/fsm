function Account(deposit) {
	var credit_count = 0;
	this.makeCredit = function() {
		credit_count++;
		return {
			getDeposit: function() {
				return deposit;
			},
			receive: function(money) {
				deposit += money;
				return deposit;
			}
		}
	}
}

var account1 = new Account(100);
var credit1 = account1.makeCredit();
var credit2 = account1.makeCredit();

var account2 = new Account(200);
var credit3 = account2.makeCredit();
var credit4 = account2.makeCredit();

console.log(credit1.getDeposit()); // 100
console.log(credit3.getDeposit()); // 200

credit1.receive(10);
credit4.receive(-10);

console.log(credit2.getDeposit()); // 110
console.log(credit3.getDeposit()); // 90






var account1 = new Account(100);
var credit1 = account1.makeCredit();
var credit2 = account1.makeCredit();

var account2 = new Account(200);
var credit3 = account2.makeCredit();
var credit4 = account2.makeCredit();

console.log(credit1.getDeposit());
console.log(credit2.getDeposit());
console.log(credit3.getDeposit());
console.log(credit4.getDeposit());

credit1.receive(10);
credit4.withdraw(10);

console.log(credit1.getDeposit());
console.log(credit2.getDeposit());
console.log(credit3.getDeposit());
console.log(credit4.getDeposit());

console.log(Object.getOwnPropertyNames(account1));
for (key in account1) {
	console.log(key);
	console.log(account1[key]);
}

console.log("--------------------");

data = 10;
function MyClass1() {
	this.data = 0;
}

MyClass1.prototype.method = function() {
	this.data = 20;
	data = 30;

	console.log("1. data1 = " + data);
	console.log("2. this.data = " + this.data);
	console.log("3. window.data = " + global.data);
}

var my1 = new MyClass1();
my1.method();

console.log("--------------------");

data = 10;
function MyClass2() {
	this.data = 0;
}

MyClass2.prototype.method = function() {
	function inner() {
		this.data = 20;
		data = 30;

		console.log("1. data1 = " + data);
		console.log("2. this.data = " + this.data);
		console.log("3. window.data = " + global.data);
	}
	inner();
}

var my2 = new MyClass2();
my2.method();
