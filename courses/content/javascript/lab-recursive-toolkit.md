---
id: "lab-recursive-toolkit"
type: "lab"
title: "Recursive Toolkit"
moduleId: "mod-06-functions"
order: 7
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 30
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["functions","recursion","algorithms"]
---

# Objective

Implement three recursive functions: `factorial`, `fibonacci`, and `sumDigits`. Each function must call itself and use a base case to stop. Do not use loops.

Definitions:
- `factorial(n)` returns the product of all integers from 1 through `n`; `factorial(0)` is 1.
- `fibonacci(n)` returns the nth Fibonacci number, where `fibonacci(0)` is 0 and `fibonacci(1)` is 1.
- `sumDigits(n)` returns the sum of the decimal digits of a non-negative integer; `sumDigits(0)` is 0.

## Requirements
- Use recursion in all three functions
- Do not use `for` or `while` loops
- Handle the base cases correctly
- Return a number from each function

## Starter State / Workspace
```js
// Implement factorial, fibonacci, and sumDigits below
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "factorial(0)", "expected": 1, "message": "factorial(0) should return 1", "weight": 2, "required": true },
  { "type": "function-returns", "call": "factorial(5)", "expected": 120, "message": "factorial(5) should return 120", "weight": 2, "required": true },
  { "type": "function-returns", "call": "fibonacci(0)", "expected": 0, "message": "fibonacci(0) should return 0", "weight": 2, "required": true },
  { "type": "function-returns", "call": "fibonacci(7)", "expected": 13, "message": "fibonacci(7) should return 13", "weight": 2, "required": true },
  { "type": "function-returns", "call": "sumDigits(1234)", "expected": 10, "message": "sumDigits(1234) should return 10", "weight": 2, "required": true },
  { "type": "function-returns", "call": "sumDigits(0)", "expected": 0, "message": "sumDigits(0) should return 0" },
  { "type": "code-not-contains", "value": "for (", "message": "Do not use a for loop; use recursion" },
  { "type": "code-not-contains", "value": "while (", "message": "Do not use a while loop; use recursion" }
]
```

## Hints
> [!TIP]
> **Hint 1:** Every recursive function needs a base case that returns immediately.

> [!TIP]
> **Hint 2:** For factorial, multiply `n` by `factorial(n - 1)`. For Fibonacci, add `fibonacci(n - 1)` and `fibonacci(n - 2)`. For the digit sum, take the last digit with `% 10` and recurse on `Math.floor(n / 10)`.

> [!TIP]
> **Hint 3:** Check that every recursive call uses a smaller number so it eventually reaches the base case.

## Reference Solution
```js
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

function fibonacci(n) {
  if (n <= 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function sumDigits(n) {
  if (n < 10) {
    return n;
  }
  return (n % 10) + sumDigits(Math.floor(n / 10));
}
```
