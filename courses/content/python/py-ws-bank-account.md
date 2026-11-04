---
id: "py-ws-bank-account"
type: "workshop"
title: "Bank Account"
moduleId: "py-mod-09-object-oriented-programming"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 55
tags: ["python", "oop", "classes", "inheritance", "workshop"]
---

# Workshop Overview

You will build a small account hierarchy. The first step creates a `BankAccount` with deposits and withdrawals. The second step adds readable representation and value equality. The third step creates a `SavingsAccount` that adds interest. The fourth step creates a `CheckingAccount` that allows a limited overdraft.

Each step keeps the previous code. Tests call the classes directly, so the methods must return the values described.

---

## Step 1: Create the account

### Instructions
Define `BankAccount` with an `__init__(self, owner, balance=0)` that stores `owner` and `balance`.

Define `deposit(self, amount)` and `withdraw(self, amount)`. Both should raise `ValueError("amount must be positive")` when `amount` is zero or negative. `withdraw` should also raise `ValueError("insufficient funds")` when the amount is greater than the current balance. Both methods should update the balance and return the new balance.

Print the owner, a deposit result, and a withdrawal result.

### Hints
1. Store the two arguments on `self` inside `__init__`.
2. Check `amount <= 0` before changing the balance.
3. In `withdraw`, compare the amount with `self.balance` before subtracting.

### Starter State / Code
```python
# Define BankAccount below.
# Store owner and balance, then add deposit and withdraw methods.
```

### Solution State / Code
```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance


account = BankAccount("Ana", 100)
print(account.owner)
print(account.deposit(50))
print(account.withdraw(30))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "BankAccount(\"Ana\").balance", "expected": 0, "message": "The default balance should be zero", "required": true },
  { "type": "function-returns", "call": "BankAccount(\"Ana\", 100).owner", "expected": "Ana", "message": "The owner should be stored on the instance", "weight": 2, "required": true },
  { "type": "function-returns", "call": "BankAccount(\"Ana\", 100).deposit(50)", "expected": 150, "message": "deposit should add to the balance and return it", "weight": 2, "required": true },
  { "type": "function-returns", "call": "BankAccount(\"Ana\", 100).withdraw(40)", "expected": 60, "message": "withdraw should subtract from the balance and return it", "weight": 2, "required": true },
  { "type": "function-throws", "call": "BankAccount(\"Ana\", 100).withdraw(150)", "errorType": "ValueError", "message": "Withdrawing more than the balance should raise ValueError", "weight": 2, "required": true },
  { "type": "function-throws", "call": "BankAccount(\"Ana\", 100).deposit(0)", "errorType": "ValueError", "message": "A zero deposit should raise ValueError", "required": true },
  { "type": "function-throws", "call": "BankAccount(\"Ana\", 100).withdraw(-5)", "errorType": "ValueError", "message": "A negative withdrawal should raise ValueError", "required": true },
  { "type": "code-contains", "value": "class BankAccount", "message": "Define the BankAccount class", "required": true },
  { "type": "code-contains", "value": "def __init__(self, owner, balance=0)", "message": "Give BankAccount the requested initializer", "required": true },
  { "type": "code-contains", "value": "def deposit(self, amount)", "message": "Add the deposit method", "required": true },
  { "type": "code-contains", "value": "def withdraw(self, amount)", "message": "Add the withdraw method", "required": true }
]
```

---

## Step 2: Add representation and equality

### Instructions
Keep `BankAccount`. Add `__repr__(self)` so it returns `BankAccount('OWNER', BALANCE)`, with the owner in single quotes. Add `__eq__(self, other)` so two accounts are equal only when they have the same type, owner, and balance. Return `NotImplemented` for a different type.

Print `repr()` of an account and compare two equal accounts.

### Hints
1. Use an f-string such as `f"BankAccount('{self.owner}', {self.balance})"`.
2. Check `type(self) is not type(other)` before reading `other.owner`.
3. Compare both `owner` and `balance`, and return a boolean.

### Starter State / Code
```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

    # Add __repr__ and __eq__ here.


account = BankAccount("Ana", 100)
print(account.owner)
print(account.deposit(50))
print(account.withdraw(30))
```

### Solution State / Code
```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

    def __repr__(self):
        return f"BankAccount('{self.owner}', {self.balance})"

    def __eq__(self, other):
        if type(self) is not type(other):
            return NotImplemented
        return self.owner == other.owner and self.balance == other.balance


account = BankAccount("Ana", 100)
print(account.owner)
print(account.deposit(50))
print(account.withdraw(30))
print(repr(account))
print(account == BankAccount("Ana", 120))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "repr(BankAccount(\"Ana\", 100))", "expected": "BankAccount('Ana', 100)", "message": "__repr__ should show the class, owner, and balance", "weight": 2, "required": true },
  { "type": "function-returns", "call": "BankAccount(\"Ana\", 100) == BankAccount(\"Ana\", 100)", "expected": true, "message": "Accounts with the same owner and balance should be equal", "weight": 2, "required": true },
  { "type": "function-returns", "call": "BankAccount(\"Ana\", 100) == BankAccount(\"Ben\", 100)", "expected": false, "message": "Different owners should not be equal", "required": true },
  { "type": "function-returns", "call": "BankAccount(\"Ana\", 100) == BankAccount(\"Ana\", 90)", "expected": false, "message": "Different balances should not be equal", "required": true },
  { "type": "function-returns", "call": "BankAccount(\"Ana\", 100) == \"account\"", "expected": false, "message": "Comparing with another type should return False, not raise", "required": true },
  { "type": "code-contains", "value": "def __repr__(self)", "message": "Define __repr__", "required": true },
  { "type": "code-contains", "value": "def __eq__(self, other)", "message": "Define __eq__", "required": true },
  { "type": "code-contains", "value": "NotImplemented", "message": "Return NotImplemented for an unsupported type", "required": true }
]
```

---

## Step 3: Add a savings account

### Instructions
Keep `BankAccount`. Define `SavingsAccount(BankAccount)` with `__init__(self, owner, balance=0, interest_rate=0.05)`. Call the parent initializer with `super().__init__(owner, balance)`, then store `interest_rate`.

Add `add_interest(self)` that multiplies the balance by `1 + interest_rate`, rounds the result to two decimal places, stores it, and returns it. Add `__repr__` that returns `SavingsAccount('OWNER', BALANCE, RATE)`.

Print the balance after adding interest and the representation.

### Hints
1. Call `super().__init__(owner, balance)` before assigning `self.interest_rate`.
2. Use `round(self.balance * (1 + self.interest_rate), 2)`.
3. Include the rate in the subclass representation, using the same single-quote format.

### Starter State / Code
```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

    def __repr__(self):
        return f"BankAccount('{self.owner}', {self.balance})"

    def __eq__(self, other):
        if type(self) is not type(other):
            return NotImplemented
        return self.owner == other.owner and self.balance == other.balance


# Define SavingsAccount below.


account = BankAccount("Ana", 100)
print(account.owner)
print(account.deposit(50))
print(account.withdraw(30))
print(repr(account))
print(account == BankAccount("Ana", 120))
```

### Solution State / Code
```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

    def __repr__(self):
        return f"BankAccount('{self.owner}', {self.balance})"

    def __eq__(self, other):
        if type(self) is not type(other):
            return NotImplemented
        return self.owner == other.owner and self.balance == other.balance


class SavingsAccount(BankAccount):
    def __init__(self, owner, balance=0, interest_rate=0.05):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        self.balance = round(self.balance * (1 + self.interest_rate), 2)
        return self.balance

    def __repr__(self):
        return f"SavingsAccount('{self.owner}', {self.balance}, {self.interest_rate})"


account = BankAccount("Ana", 100)
print(account.owner)
print(account.deposit(50))
print(account.withdraw(30))
print(repr(account))
print(account == BankAccount("Ana", 120))

savings = SavingsAccount("Ana", 100, 0.1)
print(savings.add_interest())
print(repr(savings))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "SavingsAccount(\"Ana\").interest_rate", "expected": 0.05, "message": "The default interest rate should be 0.05", "required": true },
  { "type": "function-returns", "call": "SavingsAccount(\"Ana\", 100, 0.1).add_interest()", "expected": 110.0, "message": "add_interest should apply the rate and return the new balance", "weight": 2, "required": true },
  { "type": "function-returns", "call": "SavingsAccount(\"Ana\", 100, 0.1).deposit(50)", "expected": 150, "message": "SavingsAccount should inherit deposit", "required": true },
  { "type": "function-returns", "call": "repr(SavingsAccount(\"Ana\", 100, 0.1))", "expected": "SavingsAccount('Ana', 100, 0.1)", "message": "The savings representation should include the rate", "weight": 2, "required": true },
  { "type": "function-returns", "call": "isinstance(SavingsAccount(\"Ana\"), BankAccount)", "expected": true, "message": "SavingsAccount should be a BankAccount", "required": true },
  { "type": "code-contains", "value": "class SavingsAccount(BankAccount)", "message": "Subclass BankAccount", "required": true },
  { "type": "code-contains", "value": "super().__init__(owner, balance)", "message": "Call the parent initializer with super()", "required": true },
  { "type": "code-contains", "value": "def add_interest(self)", "message": "Add the add_interest method", "required": true }
]
```

---

## Step 4: Add a checking account with overdraft

### Instructions
Keep the previous classes. Define `CheckingAccount(BankAccount)` with `__init__(self, owner, balance=0, overdraft=0)`. Call `super().__init__(owner, balance)` and store `overdraft`.

Override `withdraw(self, amount)`. Reject amounts that are zero or negative with `ValueError("amount must be positive")`. Reject withdrawals greater than `balance + overdraft` with `ValueError("insufficient funds")`. Otherwise subtract the amount, allow the balance to go negative, and return it.

Add `__repr__` that returns `CheckingAccount('OWNER', BALANCE, OVERDRAFT)`. Print a withdrawal and the representation.

### Hints
1. Call `super().__init__(owner, balance)` before storing the overdraft.
2. The available funds are `self.balance + self.overdraft`.
3. Override `withdraw` completely; do not call the parent version because it rejects amounts above the balance.

### Starter State / Code
```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

    def __repr__(self):
        return f"BankAccount('{self.owner}', {self.balance})"

    def __eq__(self, other):
        if type(self) is not type(other):
            return NotImplemented
        return self.owner == other.owner and self.balance == other.balance


class SavingsAccount(BankAccount):
    def __init__(self, owner, balance=0, interest_rate=0.05):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        self.balance = round(self.balance * (1 + self.interest_rate), 2)
        return self.balance

    def __repr__(self):
        return f"SavingsAccount('{self.owner}', {self.balance}, {self.interest_rate})"


# Define CheckingAccount below.


account = BankAccount("Ana", 100)
print(account.owner)
print(account.deposit(50))
print(account.withdraw(30))
print(repr(account))
print(account == BankAccount("Ana", 120))

savings = SavingsAccount("Ana", 100, 0.1)
print(savings.add_interest())
print(repr(savings))
```

### Solution State / Code
```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

    def __repr__(self):
        return f"BankAccount('{self.owner}', {self.balance})"

    def __eq__(self, other):
        if type(self) is not type(other):
            return NotImplemented
        return self.owner == other.owner and self.balance == other.balance


class SavingsAccount(BankAccount):
    def __init__(self, owner, balance=0, interest_rate=0.05):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        self.balance = round(self.balance * (1 + self.interest_rate), 2)
        return self.balance

    def __repr__(self):
        return f"SavingsAccount('{self.owner}', {self.balance}, {self.interest_rate})"


class CheckingAccount(BankAccount):
    def __init__(self, owner, balance=0, overdraft=0):
        super().__init__(owner, balance)
        self.overdraft = overdraft

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance + self.overdraft:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

    def __repr__(self):
        return f"CheckingAccount('{self.owner}', {self.balance}, {self.overdraft})"


account = BankAccount("Ana", 100)
print(account.owner)
print(account.deposit(50))
print(account.withdraw(30))
print(repr(account))
print(account == BankAccount("Ana", 120))

savings = SavingsAccount("Ana", 100, 0.1)
print(savings.add_interest())
print(repr(savings))

checking = CheckingAccount("Ana", 100, 50)
print(checking.withdraw(130))
print(repr(checking))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "CheckingAccount(\"Ana\", 100, 50).withdraw(130)", "expected": -30, "message": "The overdraft should allow the balance to go negative", "weight": 2, "required": true },
  { "type": "function-returns", "call": "CheckingAccount(\"Ana\", 100, 50).withdraw(50)", "expected": 50, "message": "A normal withdrawal should still work", "required": true },
  { "type": "function-throws", "call": "CheckingAccount(\"Ana\", 100, 50).withdraw(151)", "errorType": "ValueError", "message": "Withdrawing beyond balance plus overdraft should raise ValueError", "weight": 2, "required": true },
  { "type": "function-throws", "call": "CheckingAccount(\"Ana\", 100, 50).withdraw(0)", "errorType": "ValueError", "message": "A zero withdrawal should raise ValueError", "required": true },
  { "type": "function-returns", "call": "CheckingAccount(\"Ana\", 100, 50).deposit(20)", "expected": 120, "message": "CheckingAccount should inherit deposit", "required": true },
  { "type": "function-returns", "call": "repr(CheckingAccount(\"Ana\", 100, 50))", "expected": "CheckingAccount('Ana', 100, 50)", "message": "The checking representation should include the overdraft", "required": true },
  { "type": "function-returns", "call": "issubclass(CheckingAccount, BankAccount)", "expected": true, "message": "CheckingAccount should subclass BankAccount", "required": true },
  { "type": "code-contains", "value": "class CheckingAccount(BankAccount)", "message": "Subclass BankAccount", "required": true },
  { "type": "code-contains", "value": "super().__init__(owner, balance)", "message": "Call the parent initializer with super()", "required": true },
  { "type": "code-contains", "value": "def withdraw(self, amount)", "message": "Override withdraw", "required": true },
  { "type": "code-contains", "value": "self.balance + self.overdraft", "message": "Include the overdraft in the available funds", "required": true }
]
```
