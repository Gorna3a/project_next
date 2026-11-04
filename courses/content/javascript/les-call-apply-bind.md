---
id: "les-call-apply-bind"
type: "theory"
title: "call, apply, and bind"
moduleId: "mod-09-closures-this-classes"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","this","call","apply","bind"]
---

# Concept Overview

JavaScript functions are objects, and they have methods for controlling `this`. `call` and `apply` run a function immediately with an explicit `this` value. `bind` returns a new function with `this` fixed. These methods make function borrowing and partial application possible.

## Key Principles & Frameworks

`call` takes the `this` value followed by arguments one by one.

```js
function greet(greeting) {
  return greeting + ", " + this.name;
}

const alice = { name: "Alice" };
console.log(greet.call(alice, "Hello"));
```

This prints `Hello, Alice`. The function runs immediately and uses `alice` as `this`.

`apply` does the same thing but takes arguments as an array.

```js
const bob = { name: "Bob" };
console.log(greet.apply(bob, ["Hi"]));
```

This prints `Hi, Bob`. Use `apply` when your arguments are already in an array; use `call` when you have individual values.

`bind` does not run the function. It returns a new function with `this` locked in. You can also pre-fill arguments.

```js
const greetAlice = greet.bind(alice, "Hey");
console.log(greetAlice());

function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
console.log(double(5));
```

This prints `Hey, Alice` and `10`. The first bind fixes both `this` and the first argument; the second bind only pre-fills `a`, so `double(5)` supplies `b`.

Function borrowing uses a method from one object with another object, as long as the method only depends on `this` and its arguments.

```js
const accountant = {
  name: "Priya",
  report() {
    return this.name + " is reviewing the numbers";
  },
};

const manager = { name: "Marco" };
console.log(accountant.report.call(manager));
```

This prints `Marco is reviewing the numbers`. The method came from `accountant` but executed with `manager` as `this`.

## Common Pitfalls & Anti-Patterns
- **Forgetting to call a bound function**: `bind` returns a function. `greet.bind(alice);` creates a function and discards it.
- **Trying to rebind a bound function**: Once a function is bound, later `call`, `apply`, or `bind` cannot change its `this`.
- **Using `call` with an array**: `call` spreads its arguments, so pass items individually. Use `apply` for an array.
- **Expecting arrows to respect `thisArg`**: Arrow functions ignore the `this` argument passed to `call`, `apply`, or `bind`.

## Quick Summary
- `fn.call(thisArg, ...args)` runs immediately with explicit `this`.
- `fn.apply(thisArg, argsArray)` runs immediately with arguments from an array.
- `fn.bind(thisArg, ...args)` returns a new function with `this` fixed and optional partial arguments.
- Use these methods for function borrowing and callbacks that need a specific `this`.
- Arrow functions ignore explicit `this` binding.
