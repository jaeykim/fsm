function Account(deposit) {
	var $0 = runtime.create(arguments);
	$0.credit_count = 0; // credit_count: stateful
	this.makeCredit = function() {
		$0.credit_count++;
		return {
			getDeposit: function() {
				return $0.$arguments[0];
			},
			receive: function(money) {
				$0.$arguments[0] += money; // money: stateless
				return $0.$arguments[0];
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
