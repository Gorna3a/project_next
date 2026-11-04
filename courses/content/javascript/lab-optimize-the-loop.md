---
id: "lab-optimize-the-loop"
type: "lab"
title: "Optimize the Loop"
moduleId: "mod-12-under-the-hood"
order: 5
difficulty: "advanced"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 40
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["performance","set","optimization","algorithms"]
---

# Objective

Speed up three functions without changing their results. The starter implementations scan arrays repeatedly. Replace those scans with `Set` lookups and a closed-form calculation.

Definitions:
- `uniqueValues(items)` returns the unique values in first-seen order.
- `sumTo(n)` returns the sum of every integer from `1` through `n`.
- `findCommon(a, b)` returns the unique values that appear in both arrays, in the order they first appear in `a`.

## Requirements
- Keep the same return values for every input
- Do not use `Array.prototype.includes` or `Array.prototype.indexOf`
- Use `Set` for membership checks
- Use the arithmetic series formula for `sumTo`
- Keep the functions readable

## Starter State / Workspace
```js
function uniqueValues(items) {
  const result = [];

  for (const item of items) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }

  return result;
}

function sumTo(n) {
  let total = 0;

  for (let i = 1; i <= n; i += 1) {
    total += i;
  }

  return total;
}

function findCommon(a, b) {
  const result = [];

  for (const item of a) {
    if (b.includes(item) && !result.includes(item)) {
      result.push(item);
    }
  }

  return result;
}
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "uniqueValues([1, 2, 2, 3, 1])", "expected": [1, 2, 3], "message": "uniqueValues should remove duplicates and keep first-seen order", "weight": 2, "required": true },
  { "type": "function-returns", "call": "uniqueValues([\"a\", \"b\", \"a\"])", "expected": ["a", "b"], "message": "uniqueValues should work with strings", "required": true },
  { "type": "function-returns", "call": "sumTo(10)", "expected": 55, "message": "sumTo(10) should return 55", "weight": 2, "required": true },
  { "type": "function-returns", "call": "sumTo(1000000)", "expected": 500000500000, "message": "sumTo should handle a large n without a loop", "weight": 2, "required": true },
  { "type": "function-returns", "call": "findCommon([1, 2, 3, 4], [2, 4, 6])", "expected": [2, 4], "message": "findCommon should return shared unique values", "weight": 2, "required": true },
  { "type": "function-returns", "call": "findCommon([\"a\", \"b\", \"b\"], [\"b\", \"c\"])", "expected": ["b"], "message": "findCommon should not repeat values", "required": true },
  { "type": "code-not-contains", "value": ".includes(", "message": "Replace repeated includes scans" },
  { "type": "code-not-contains", "value": ".indexOf(", "message": "Do not use indexOf for membership checks" }
]
```

## Hints
> [!TIP]
> **Hint 1:** `new Set(items)` removes duplicates and preserves insertion order. Spread it back into an array with `[...set]`.

> [!TIP]
> **Hint 2:** The sum of `1` through `n` is `(n * (n + 1)) / 2`. It does not need a loop.

> [!TIP]
> **Hint 3:** Build one `Set` from `b`, then filter the unique values of `a` with `set.has(item)`.

## Reference Solution
```js
function uniqueValues(items) {
  return [...new Set(items)];
}

function sumTo(n) {
  return (n * (n + 1)) / 2;
}

function findCommon(a, b) {
  const valuesB = new Set(b);
  return [...new Set(a)].filter((item) => valuesB.has(item));
}
```
