export default class FastBigInt {

  // Initialise a new instance of FastBigInt with a main number, an exponent and a remainder.
  // For instance, you can define 145003 using either new FastBigInt(145, 1, 3) or new FastBigInt(0, 0, 145003)
  // Usually you can just initialise using only the remainder, unless you need to initialise to a number bigger than Number.MAX_SAFE_INTEGER
	constructor(main = 0, exponent = 0, remainder = 0) {
		this.main = main;
		this.exponent = exponent;
		this.remainder = remainder;
		this.readjust();
	}

  // You don't need to call this method, it is usually called automatically
	readjust() {
		this._readjust_balance();
		this._readjust_exponent();
		this._readjust_clamp();
	}

	_readjust_clamp() {
		if (this.main < 0) {
			this.main = 0;
			this.remainder = 0;
			this.exponent = 0;
		}
		if (this.main >= 1000 && this.exponent === FastBigInt.maxExponent) {
			this.main = 999;
			this.remainder = Math.pow(10, 3 * this.exponent) - 1;
		}
	}

	_readjust_exponent() {
		while (this.remainder < 0 && this.exponent > 0) {
			this.decrementExponent();
		}
		while (this.main === 0 && this.exponent > 0) {
			this.decrementExponent();
		}
		while (this.main >= 1000 && this.exponent < FastBigInt.maxExponent) {
			this.incrementExponent();
		}

		if (this.exponent === 0) {
			this.main += this.remainder;
			this.remainder = 0;
		}

		while (this.remainder >= Math.pow(10, 3 * this.exponent) 
			   && this.exponent < FastBigInt.maxExponent) {
			this.incrementExponent();
		}
	}

	_readjust_balance() {
		if (this.remainder >= Math.pow(10, 3 * this.exponent)) {
			let remainder = this.remainder % Math.pow(10, this.exponent * 3);
			let remToAddToMain = (this.remainder - remainder) / Math.pow(10, this.exponent * 3);
			this.main += remToAddToMain;
			this.remainder = remainder;
		}

		if (this.remainder < 0) {
			let mainRem = this.main % 1000;
			this.main = (this.main - mainRem)/1000;
			mainRem = mainRem * Math.pow(10, this.exponent * 3);
			this.remainder += mainRem;
		}
	}

  // You usually don't need to call this, but basically it increments the exponent. So 100K becomes 0.1M
	incrementExponent() {
		if (this.exponent === FastBigInt.maxExponent)
			return;
		let main = this.main;
		let mainRem = this.main % 1000;
		this.main = (main - mainRem)/1000;
		mainRem = mainRem * Math.pow(10, this.exponent * 3);
		this.exponent++;
		this.remainder += mainRem;
	}

  // You usually don't need to call this, but basically it decrements the exponent. So 0.1M becomes 100K
	decrementExponent() {
		if (this.exponent === 0)
			return;
		this.main = this.main * 1000;
		this.exponent--;
		let remainder = this.remainder % Math.pow(10, this.exponent * 3);
		let remToAddToMain = (this.remainder - remainder) / Math.pow(10, this.exponent * 3);
		this.main += remToAddToMain;
		this.remainder = remainder;
	}

  // Addition. Can take a Number or another FastBigInt as an argument.
	add(other) {
		if (typeof other === "number") {
			this.remainder += other;
		} 
		else if (other instanceof FastBigInt) {
			while (other.exponent < this.exponent) {
				other.incrementExponent();
			}
			while (other.exponent > this.exponent) {
				other.decrementExponent();
			}
			this.remainder += other.remainder;
			this.main += other.main;
		}
		else {
			throw new Error("Cannot add anything that is not a number of a FastBigInt");
		}
		this.readjust();
	}

  // Subtraction. Can take a Number or another FastBigInt as an argument.
	subtract(other) {
		if (typeof other === "number") {
			this.remainder -= other;
		} 
		else if (other instanceof FastBigInt) {
			while (other.exponent < this.exponent) {
				other.incrementExponent();
			}
			while (other.exponent > this.exponent) {
				other.decrementExponent();
			}
			this.remainder -= other.remainder;
			this.main -= other.main;
		}
		else {
			throw new Error("Cannot subtract anything that is not a number of a FastBigInt");
		}
		this.readjust();
	}

  // Comparison. Compares the current value to either a Number or another FastBigInt. Returns 0 if equal, 1 if superior and -1 if inferior
	compare(other) {
		if (typeof other === "number") {
			return this.compare(new FastBigInt(0, 0, other));
		}
		if (other instanceof FastBigInt) {
			this.readjust();
			other.readjust();
			if (this.exponent > other.exponent) {
				return 1;
			}
			if (this.exponent < other.exponent) {
				return -1;
			}
			if (this.main > other.main) {
				return 1;
			}
			if (this.main < other.main) {
				return -1;
			}
			if (this.remainder > other.remainder) {
				return 1;
			}
			if (this.remainder < other.remainder) {
				return -1;
			}
			return 0;
		}
		else {
			throw new Error("Cannot subtract anything that is not a number of a FastBigInt");
		}
	}

  // Set the value. Can take a Number or another FastBigInt
	setValue(other) {
		if (typeof other === "number") {
			this.remainder = other;
			this.main = 0;
			this.exponent = 0;
		} 
		else if (other instanceof FastBigInt) {
			this.remainder = other.remainder;
			this.main = other.main;
			this.exponent = other.exponent;
		}
		else {
			throw new Error("Cannot set value to anything that is not a number of a FastBigInt");
		}
		this.readjust();
	}

  // Formats the remainder to a string with all the leading zeroes necessary for it to print properly
  // Aka (new FastBigInt(1, 2, 3)).formatedRemainder returns '000003'
	get formatedRemainder() {
		let res = this.remainder.toString().padStart(this.exponent * 3, '0');
		return res.slice(Math.max(0, res.length - this.exponent * 3), res.length);
	}

  // Stringifies the number to the shortened value. (new FastBigInt(1, 1, 234)).toString() returns 1.23K 
	toString() {
		let nb = this.main.toString();
		let rem = this.formatedRemainder;
		if (nb.length == 2 && rem.length > 0 && rem[0] != '0') nb += "," + rem.toString()[0]
		if (nb.length == 1 && rem.length > 0 && (rem[0] != '0' || rem[1] != '0')) nb += "," + rem.toString()[0] + rem.toString()[1]
		return `${nb}${FastBigInt.exponentShorthands[this.exponent]}`
	}

  // Stringifies the number to the full value. (new FastBigInt(1, 1, 234)).toString() returns 1234 
	fullNumber() {
		return `${this.main}${this.formatedRemainder}`
	}
	
  // Saves the state of the FastBigInt object to a JSON object
	saveToJson() {
		return {
			main: this.main,
			exponent: this.exponent,
			remainder: this.remainder
		}
	}
	
  // Loads the state of the FastBigInt object from a JSON object
	loadFromJson(o) {
		this.main = o.main;
		this.exponent = o.exponent;
		this.remainder = o.remainder;
	}
}

// The maximum exponent the FastBigInt class supports. You can extend this when needed
Object.defineProperty(FastBigInt, 'maxExponent', {
	value: 5,
	writable : false,
	enumerable : true,
	configurable : false
});

// The exponent shorthands the FastBigInt class supports. You can extend this when needed
Object.defineProperty(FastBigInt, 'exponentShorthands', {
	value: Object.freeze(['', 'K', 'M', 'B', 't', 'q']),
	writable : false,
	enumerable : true,
	configurable : false
});