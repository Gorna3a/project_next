---
id: "ws-counter-and-bank-account"
type: "workshop"
title: "Counter and Bank Account: Closures to Classes"
moduleId: "mod-09-closures-this-classes"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 60
tags: ["closures","classes","private-state"]
---

# Workshop Overview

You will solve the same two problems twice. First you will use closures to keep private state, then you will rebuild each one with a class and a private field. Comparing the two approaches shows what closures and classes share, and where each one fits.

---

## Step 1: A closure-based counter

### Instructions
Write a function named `makeCounter` that returns an object with three methods: `increment`, `decrement`, and `value`. Keep the count in a closure so it cannot be changed directly from outside.

### Hints
1. Declare `let count = 0` inside `makeCounter`.
2. Return an object whose methods update and read `count`.

### Starter State / Code
```js
// Define makeCounter below
```

### Solution State / Code
```js
function makeCounter() {
  let count = 0;

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    value() {
      return count;
    },
  };
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "makeCounter().value()", "expected": 0, "message": "A new counter should start at 0", "required": true },
  { "type": "function-returns", "call": "makeCounter().increment()", "expected": 1, "message": "increment should return the new count", "required": true },
  { "type": "function-returns", "call": "(() => { const counter = makeCounter(); counter.increment(); counter.increment(); return counter.value(); })()", "expected": 2, "message": "The counter should remember state between calls", "required": true }
]
```

---

## Step 2: A class-based counter

### Instructions
Write a class named `Counter` with a private field `#count` that starts at `0`. Give it `increment`, `decrement`, and `value` methods with the same behavior as Step 1.

### Hints
1. Declare the private field at the top of the class body: `#count = 0;`.
2. Use `this.#count` inside the methods.

### Starter State / Code
```js
function makeCounter() {
  let count = 0;

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    value() {
      return count;
    },
  };
}
```

### Solution State / Code
```js
function makeCounter() {
  let count = 0;

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    value() {
      return count;
    },
  };
}

class Counter {
  #count = 0;

  increment() {
    this.#count += 1;
    return this.#count;
  }

  decrement() {
    this.#count -= 1;
    return this.#count;
  }

  value() {
    return this.#count;
  }
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "new Counter().value()", "expected": 0, "message": "A new Counter should start at 0", "required": true },
  { "type": "function-returns", "call": "new Counter().increment()", "expected": 1, "message": "increment should return the new count", "required": true },
  { "type": "function-returns", "call": "(() => { const counter = new Counter(); counter.increment(); counter.increment(); return counter.value(); })()", "expected": 2, "message": "The Counter should remember state between calls", "required": true },
  { "type": "code-contains", "value": "#count", "message": "Use a private field for the count" }
]
```

---

## Step 3: A closure-based bank account

### Instructions
Write a function named `makeBankAccount` that takes an initial balance and returns an object with `deposit`, `withdraw`, and `getBalance` methods. Keep the balance in a closure. Reject non-positive amounts and withdrawals larger than the balance with `Error` objects.

### Hints
1. Store `let balance = initial` inside `makeBankAccount`.
2. Validate each amount before changing `balance`.
3. Throw `new Error(...)` for invalid operations.

### Starter State / Code
```js
class Counter {
  #count = 0;

  increment() {
    this.#count += 1;
    return this.#count;
  }

  decrement() {
    this.#count -= 1;
    return this.#count;
  }

  value() {
    return this.#count;
  }
}
```

### Solution State / Code
```js
class Counter {
  #count = 0;

  increment() {
    this.#count += 1;
    return this.#count;
  }

  decrement() {
    this.#count -= 1;
    return this.#count;
  }

  value() {
    return this.#count;
  }
}

function makeBankAccount(initial) {
  let balance = initial;

  return {
    deposit(amount) {
      if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Deposit must be a positive number");
      }
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Withdrawal must be a positive number");
      }
      if (amount > balance) {
        throw new Error("Insufficient funds");
      }
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "makeBankAccount(100).getBalance()", "expected": 100, "message": "A new account should keep the initial balance", "required": true },
  { "type": "function-returns", "call": "makeBankAccount(100).deposit(50)", "expected": 150, "message": "deposit should return the new balance", "required": true },
  { "type": "function-returns", "call": "(() => { const account = makeBankAccount(100); account.withdraw(30); return account.getBalance(); })()", "expected": 70, "message": "withdraw should update the closed-over balance", "required": true },
  { "type": "function-throws", "call": "makeBankAccount(100).withdraw(200)", "errorType": "Error", "message": "A withdrawal larger than the balance should throw" }
]
```

---

## Step 4: A class-based bank account

### Instructions
Write a class named `BankAccount` with a private field `#balance`. The constructor takes the initial balance. Add `deposit` and `withdraw` methods with the same validation as Step 3, plus a `balance` getter that returns the current balance.

### Hints
1. Declare `#balance` in the class body and assign it in the constructor.
2. Use `get balance()` to expose the private field as a read-only property.
3. Reuse the validation rules from `makeBankAccount`.

### Starter State / Code
```js
function makeBankAccount(initial) {
  let balance = initial;

  return {
    deposit(amount) {
      if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Deposit must be a positive number");
      }
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Withdrawal must be a positive number");
      }
      if (amount > balance) {
        throw new Error("Insufficient funds");
      }
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}
```

### Solution State / Code
```js
function makeBankAccount(initial) {
  let balance = initial;

  return {
    deposit(amount) {
      if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Deposit must be a positive number");
      }
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Withdrawal must be a positive number");
      }
      if (amount > balance) {
        throw new Error("Insufficient funds");
      }
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}

class BankAccount {
  #balance;

  constructor(initial) {
    this.#balance = initial;
  }

  deposit(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Deposit must be a positive number");
    }
    this.#balance += amount;
    return this.#balance;
  }

  withdraw(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Withdrawal must be a positive number");
    }
    if (amount > this.#balance) {
      throw new Error("Insufficient funds");
    }
    this.#balance -= amount;
    return this.#balance;
  }

  get balance() {
    return this.#balance;
  }
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "new BankAccount(100).balance", "expected": 100, "message": "The balance getter should return the initial balance", "required": true },
  { "type": "function-returns", "call": "new BankAccount(100).deposit(50)", "expected": 150, "message": "deposit should return the new balance", "required": true },
  { "type": "function-returns", "call": "(() => { const account = new BankAccount(100); account.withdraw(30); return account.balance; })()", "expected": 70, "message": "withdraw should update the private balance", "required": true },
  { "type": "function-throws", "call": "new BankAccount(100).withdraw(200)", "errorType": "Error", "message": "A withdrawal larger than the balance should throw" },
  { "type": "code-contains", "value": "#balance", "message": "Use a private field for the balance" }
]
```
