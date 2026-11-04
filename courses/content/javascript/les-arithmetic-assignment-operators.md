---
id: "les-arithmetic-assignment-operators"
type: "theory"
title: "Arithmetic and Assignment Operators"
moduleId: "mod-04-operators-and-comparison"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","operators","arithmetic"]
---

# Concept Overview

Operators are symbols that act on values, called operands. Arithmetic operators combine numbers: addition, subtraction, multiplication, division, remainder, and exponentiation. Assignment operators store a value in a variable, and compound forms update a variable in place. Increment and decrement operators add or subtract one.

## Key Principles & Frameworks

The basic arithmetic operators are `+`, `-`, `*`, `/`, `%`, and `**`. Division in JavaScript always produces a floating-point result: `5 / 2` is `2.5`, not `2`. Use `Math.floor` when you need integer division. The remainder operator `%` returns what is left after division: `10 % 3` is `1`. The exponentiation operator `**` raises the left operand to the power of the right: `2 ** 3` is `8`.

```js
let total = 10;
console.log(total + 5, total - 2, total * 3, total / 4, total % 3, total ** 2);
```

The line above prints `15 8 30 2.5 1 100`.

Compound assignment operators combine an operation with assignment. `+=`, `-=`, `*=`, `/=`, `%=`, and `**=` all read the current value, apply the operation, and store the result back.

```js
let score = 100;
score += 10;
score -= 5;
score *= 2;
score /= 4;
console.log(score);
```

The final value is `52.5`: 100 plus 10 is 110, minus 5 is 105, times 2 is 210, divided by 4 is 52.5.

The increment operator `++` and decrement operator `--` add or subtract one. Used before a variable (prefix), the change happens first and the new value is returned. Used after (postfix), the old value is returned and the change happens afterward.

```js
let count = 0;
console.log(++count, count++, count);
```

The line above prints `1 1 2`. Prefix `++count` becomes 1 and returns 1. Postfix `count++` returns the current 1, then count becomes 2. The final `count` is 2.

## Common Pitfalls & Anti-Patterns
- **Expecting integer division**: `5 / 2` is `2.5`, not `2`. JavaScript has no separate integer type for `/`. Use `Math.floor(5 / 2)` when you need a whole number.
- **Confusing prefix and postfix**: `x++` returns the old value, which surprises people who expect the new one. Keep increment expressions on their own line to avoid confusion.
- **String concatenation with `+=`**: If either side is a string, `+=` concatenates instead of adding. `"5" += 1` style mixing produces text, not numbers.
- **Modulo with negatives**: The sign of `%` follows the dividend, so `-10 % 3` is `-1`. Do not assume it is always positive.

## Quick Summary
- `+`, `-`, `*`, `/`, `%`, and `**` are the arithmetic operators; `/` always gives a float.
- Compound assignment operators (`+=`, `-=`, and friends) update a variable in place.
- Prefix `++x` changes before returning; postfix `x++` returns before changing.
