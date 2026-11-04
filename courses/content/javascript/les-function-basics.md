---
id: "les-function-basics"
type: "theory"
title: "Function Basics: Declarations, Expressions, and return"
moduleId: "mod-06-functions"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 18
tags: ["javascript","functions","basics"]
---

# Concept Overview

A function is a reusable block of code with a name. You define it once, then call it whenever you need that behavior. Functions can accept input through parameters and send a result back with `return`. JavaScript has two common forms: function declarations and function expressions.

## Key Principles & Frameworks

A function declaration starts with the `function` keyword, followed by a name, a parameter list, and a body.

```js
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Sam"));
```

The code above prints `Hello, Sam!`. `name` is a parameter, and `"Sam"` is the argument passed in the call. Inside the function, `return` sends a value back to the caller and stops the function immediately.

A function expression stores a function in a variable. The function itself may be anonymous.

```js
const add = function (a, b) {
  return a + b;
};

console.log(add(2, 3));
```

This prints `5`. The variable `add` holds the function, so you call it with `add(2, 3)`.

Function declarations are hoisted: you can call them before the line where they appear. Function expressions are not hoisted as functions, so calling the variable before assignment fails.

```js
console.log(square(4));   // 16

function square(n) {
  return n * n;
}
```

If a function reaches the end without a `return`, it returns `undefined`.

```js
function logOnly(message) {
  console.log(message);
}

console.log(logOnly("hi"));
```

This prints `hi` once from inside the function, then `undefined` from the outer `console.log`.

## Common Pitfalls & Anti-Patterns
- **Forgetting `return`**: A function that computes a value but never returns it gives the caller `undefined`. Return the result instead of only logging it.
- **Confusing parameters and arguments**: Parameters are the names in the definition; arguments are the actual values in the call. A function with two parameters needs two arguments unless defaults are provided.
- **Mutating inputs**: Changing an object or array parameter changes the caller's value. Prefer returning a new value instead of modifying the input.
- **Calling a function expression too early**: Function declarations are hoisted, but `const` function expressions are not available before their assignment.

## Quick Summary
- Use `function name(parameters) { ... }` for declarations and `const name = function (...) { ... }` for expressions.
- `return` sends a value back and exits the function.
- Without `return`, a function returns `undefined`.
- Declarations are hoisted; function expressions assigned with `const` are not.
