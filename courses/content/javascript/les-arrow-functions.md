---
id: "les-arrow-functions"
type: "theory"
title: "Arrow Functions and Implicit Return"
moduleId: "mod-06-functions"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","functions","arrow-functions"]
---

# Concept Overview

Arrow functions are a shorter way to write function expressions. They use the `=>` syntax and are especially common when passing a small function to another function. Arrow functions support both a block body with an explicit `return` and a concise body with an implicit return.

## Key Principles & Frameworks

A block-body arrow function uses braces and needs an explicit `return`.

```js
const add = (a, b) => {
  return a + b;
};

console.log(add(2, 3));
```

A concise-body arrow function has no braces, and the expression is returned automatically.

```js
const multiply = (a, b) => a * b;

console.log(multiply(4, 5));
```

This prints `20` without writing `return`.

When an arrow function has exactly one parameter, the parentheses around the parameter are optional. With zero or two or more parameters, parentheses are required.

```js
const double = n => n * 2;
const getAnswer = () => 42;

console.log(double(5));     // 10
console.log(getAnswer());   // 42
```

To return an object literal from a concise body, wrap the object in parentheses. Otherwise the braces are read as a block body.

```js
const makeUser = (name) => ({ name: name, active: true });

console.log(makeUser("Sam"));
```

Arrow functions are expressions assigned to variables, so they follow the same hoisting rules as other expressions. They are not available before the assignment line.

```js
// console.log(triple(3)); // ReferenceError before the assignment
const triple = (n) => n * 3;
```

## Common Pitfalls & Anti-Patterns
- **Mixing braces and implicit return**: `(a, b) => { a + b }` returns `undefined`. Use `(a, b) => a + b` or add `return` inside the braces.
- **Returning an object without parentheses**: `() => { name: "Sam" }` is parsed as a block, not an object. Wrap it: `() => ({ name: "Sam" })`.
- **Assuming arrow functions are hoisted**: They behave like function expressions, not declarations. Define them before calling them.
- **Overusing concise bodies**: If the logic needs several statements, use a block body for readability.

## Quick Summary
- Arrow functions use `=>` and are stored in variables.
- A concise body returns its expression automatically.
- A block body needs an explicit `return`.
- Wrap object literals in parentheses when returning them directly.
- Arrow functions are not hoisted like function declarations.
