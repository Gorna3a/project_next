---
id: "les-recursion"
type: "theory"
title: "Recursion and the Call Stack"
moduleId: "mod-06-functions"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 18
tags: ["javascript","functions","recursion"]
---

# Concept Overview

Recursion is a technique where a function calls itself to solve a smaller version of the same problem. Every recursive function needs a base case that stops the recursion and a recursive case that moves toward the base case. Each call is tracked on the call stack.

## Key Principles & Frameworks

The factorial of a number is the product of all positive integers up to that number. It has a natural recursive definition: factorial of 1 is 1, and factorial of n is n times factorial of n minus 1.

```js
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log(factorial(5));
```

This prints `120`. The base case `n <= 1` stops the recursion. The recursive case calls `factorial(n - 1)`, which is closer to the base case.

Each call waits for the next call to return. The engine tracks these waiting calls on the call stack. For `factorial(5)`, the stack grows through `factorial(4)`, `factorial(3)`, `factorial(2)`, and `factorial(1)`, then unwinds as each result is multiplied.

A recursive function without a base case, or with a base case that is never reached, calls itself forever until the engine throws a stack overflow error.

```js
function countdown(n) {
  if (n === 0) {
    return "done";
  }
  return countdown(n - 1);
}

console.log(countdown(3));
```

This prints `done`. Each call reduces `n` by one until the base case matches.

## Common Pitfalls & Anti-Patterns
- **Missing base case**: A recursive function with no stopping condition eventually throws a stack overflow error.
- **Base case never reached**: If the recursive call does not move toward the base case, recursion never ends. Check that each call changes the input.
- **Forgetting `return` in the recursive case**: Without `return`, the caller receives `undefined` even though the inner call computed a value.
- **Deep recursion**: Every waiting call uses stack space. Very deep recursion can overflow; iterative solutions may be safer for large inputs.

## Quick Summary
- Recursion solves a problem by calling the same function on a smaller input.
- A base case stops the recursion.
- The recursive case must move toward the base case.
- Every waiting call occupies space on the call stack.
