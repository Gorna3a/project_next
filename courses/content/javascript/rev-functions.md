---
id: "rev-functions"
type: "review"
title: "Functions Quick Reference"
moduleId: "mod-06-functions"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-function-basics","les-arrow-functions","les-default-and-rest-parameters","les-recursion","les-iifes-and-arguments","ws-utility-library","lab-recursive-toolkit"]
tags: ["javascript","functions","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Function declaration | `function name(params) { ... }` | Hoisted, can be called early |
| Function expression | `const name = function (params) { ... }` | Stored in a variable |
| Parameter | Name in the function definition | `function add(a, b)` |
| Argument | Actual value in a call | `add(2, 3)` |
| `return` | Sends a value back and exits | `return a + b;` |
| Arrow function | `(params) => expression` | Short callbacks and utilities |
| Implicit return | Concise arrow body returns automatically | `n => n * 2` |
| Default parameter | `name = "friend"` | Fallback for `undefined` |
| Rest parameter | `...values` | Collect extra arguments |
| Spread | `...list` in a call | Expand values into arguments |
| Recursion | Function calls itself | Factorial, Fibonacci, digit sum |
| Base case | Condition that stops recursion | `if (n <= 1) return 1;` |
| IIFE | `(function () { ... })()` | Run once in a private scope |
| `arguments` | Array-like object in regular functions | Access all passed values |

## Key Concepts Comparison
- **Declaration vs expression**: Declarations are hoisted; expressions assigned to `const` are not available before the assignment line.
- **Rest vs spread**: Rest collects arguments in a definition; spread expands a list in a call.
- **`arguments` vs rest**: `arguments` is array-like and only exists in regular functions; rest parameters create a real list and work in arrow functions.

## Critical Syntax / Templates
```js
// Declaration
function add(a, b = 0) {
  return a + b;
}

// Expression
const multiply = function (a, b) {
  return a * b;
};

// Arrow with concise body
const double = n => n * 2;

// Arrow returning an object
const makeUser = (name) => ({ name, active: true });

// Rest and spread
function sumAll(...numbers) {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  return total;
}
console.log(Math.max(...[4, 9, 2]));

// Recursion
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// IIFE
(function () {
  const privateValue = 42;
  console.log(privateValue);
})();
```
