---
id: "ws-utility-library"
type: "workshop"
title: "Build a Utility Library"
moduleId: "mod-06-functions"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 40
tags: ["functions","parameters","utilities"]
---

# Workshop Overview

You will build a small library of four reusable functions: `double`, `isEven`, `greet`, and `sumAll`. Each step adds one function and verifies its behavior with automated tests.

---

## Step 1: Double a number

### Instructions
Write a function named `double` that takes a number and returns it multiplied by 2. Call `double(4)` and print the result.

### Hints
1. A function needs a `return` statement to send a value back to the caller.
2. Multiply the parameter by 2 inside the return expression.

### Starter State / Code
```js
// Define double below
```

### Solution State / Code
```js
function double(n) {
  return n * 2;
}

console.log(double(4));
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "double(4)", "expected": 8, "message": "double(4) should return 8", "required": true },
  { "type": "function-returns", "call": "double(-3)", "expected": -6, "message": "double(-3) should return -6" }
]
```

---

## Step 2: Check for even numbers

### Instructions
Add a function named `isEven` that takes a number and returns `true` when it is even, otherwise `false`. Print `isEven(4)` to check it.

### Hints
1. The remainder operator `%` tells you what is left after division.
2. An even number has a remainder of 0 when divided by 2.

### Starter State / Code
```js
function double(n) {
  return n * 2;
}

console.log(double(4));
```

### Solution State / Code
```js
function double(n) {
  return n * 2;
}

function isEven(n) {
  return n % 2 === 0;
}

console.log(double(4));
console.log(isEven(4));
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "isEven(4)", "expected": true, "message": "isEven(4) should return true", "required": true },
  { "type": "function-returns", "call": "isEven(7)", "expected": false, "message": "isEven(7) should return false" }
]
```

---

## Step 3: Greet with a default

### Instructions
Add a function named `greet` that takes an optional name and returns `Hello, <name>!`. When no name is given, it should use `friend`. Print `greet()` and `greet("Sam")`.

### Hints
1. A default parameter supplies a value when the argument is `undefined`.
2. Build the result with string concatenation or a template literal.

### Starter State / Code
```js
function double(n) {
  return n * 2;
}

function isEven(n) {
  return n % 2 === 0;
}

console.log(double(4));
console.log(isEven(4));
```

### Solution State / Code
```js
function double(n) {
  return n * 2;
}

function isEven(n) {
  return n % 2 === 0;
}

function greet(name = "friend") {
  return "Hello, " + name + "!";
}

console.log(double(4));
console.log(isEven(4));
console.log(greet());
console.log(greet("Sam"));
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "greet()", "expected": "Hello, friend!", "message": "greet() should return Hello, friend!", "required": true },
  { "type": "function-returns", "call": "greet(\"Sam\")", "expected": "Hello, Sam!", "message": "greet(\"Sam\") should return Hello, Sam!" }
]
```

---

## Step 4: Sum any number of arguments

### Instructions
Add a function named `sumAll` that accepts any number of numeric arguments and returns their sum. Use a rest parameter. Print `sumAll(1, 2, 3)`.

### Hints
1. A rest parameter collects the extra arguments into a list.
2. Start a total at 0 and loop over the list, adding each value.

### Starter State / Code
```js
function double(n) {
  return n * 2;
}

function isEven(n) {
  return n % 2 === 0;
}

function greet(name = "friend") {
  return "Hello, " + name + "!";
}

console.log(double(4));
console.log(isEven(4));
console.log(greet());
console.log(greet("Sam"));
```

### Solution State / Code
```js
function double(n) {
  return n * 2;
}

function isEven(n) {
  return n % 2 === 0;
}

function greet(name = "friend") {
  return "Hello, " + name + "!";
}

function sumAll(...numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}

console.log(double(4));
console.log(isEven(4));
console.log(greet());
console.log(greet("Sam"));
console.log(sumAll(1, 2, 3));
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "sumAll(1, 2, 3)", "expected": 6, "message": "sumAll(1, 2, 3) should return 6", "required": true },
  { "type": "function-returns", "call": "sumAll()", "expected": 0, "message": "sumAll() should return 0 when there are no arguments" },
  { "type": "code-contains", "value": "...", "message": "Use a rest parameter to collect the arguments" }
]
```
