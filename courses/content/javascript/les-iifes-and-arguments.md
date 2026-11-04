---
id: "les-iifes-and-arguments"
type: "theory"
title: "IIFEs, the arguments Object, and Built-in Functions"
moduleId: "mod-06-functions"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","functions","iife"]
---

# Concept Overview

An immediately invoked function expression (IIFE) is a function that runs as soon as it is defined. The `arguments` object gives a regular function access to all values passed to it, even when no parameters are declared. JavaScript also provides many built-in functions for common tasks.

## Key Principles & Frameworks

An IIFE wraps a function expression in parentheses and then calls it immediately.

```js
(function () {
  console.log("This runs once");
})();
```

The inner function runs right away. Wrapping the function in parentheses makes it an expression, and the final `()` calls it. IIFEs create a private scope, so variables declared inside do not leak into the surrounding scope.

Arrow functions can also be used as IIFEs.

```js
(() => {
  const message = "Private value";
  console.log(message);
})();
```

The `arguments` object is available inside regular functions. It holds every argument passed to the call, whether or not the function declares parameters.

```js
function showArguments() {
  for (let i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}

showArguments("a", "b");
```

This prints `a` and `b`. The `arguments` object is array-like but not a real array, and it is not available in arrow functions.

JavaScript ships with many built-in functions. Common examples include `Math.max`, `Math.floor`, `parseInt`, `parseFloat`, `Number`, `String`, and `Boolean`.

```js
console.log(Math.max(3, 7, 2));
console.log(Math.floor(4.9));
console.log(parseInt("42px", 10));
```

This prints `7`, `4`, and `42`. Built-in functions are ordinary values that you can call, pass around, or store in variables.

## Common Pitfalls & Anti-Patterns
- **Forgetting the wrapping parentheses**: `function () { ... }()` is a syntax error. Wrap the function expression first: `(function () { ... })()`.
- **Treating `arguments` as an array**: It has `length` and indexed values but lacks array methods. Use rest parameters when you need a real list.
- **Using `arguments` in an arrow function**: Arrow functions do not have their own `arguments` object. Use rest parameters instead.
- **Shadowing built-ins**: Naming a variable `Math` or `Number` hides the built-in. Choose different names.

## Quick Summary
- An IIFE runs immediately and keeps its variables private.
- `arguments` holds all arguments in a regular function but is not a real array.
- Arrow functions do not have their own `arguments` object.
- Built-in functions such as `Math.max` and `parseInt` are reusable tools available everywhere.
