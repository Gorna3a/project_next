---
id: "rev-operators"
type: "review"
title: "Operators Quick Reference"
moduleId: "mod-04-operators-and-comparison"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-arithmetic-assignment-operators","les-equality-and-comparison","les-logical-and-conditional-operators","les-other-operators","ws-comparison-playground","lab-eligibility-checker"]
tags: ["javascript","operators","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| `+`, `-`, `*`, `/` | Basic arithmetic; `/` always floats | `5 / 2` is `2.5` |
| `%` | Remainder after division | `10 % 3` is `1` |
| `**` | Exponentiation | `2 ** 3` is `8` |
| `+=`, `-=`, ... | Compound assignment | `score += 10` |
| `++` / `--` | Increment / decrement | Prefix changes first |
| `===` / `!==` | Strict equality (type + value) | Preferred in all code |
| `==` / `!=` | Loose equality (coerces types) | Avoid unless needed |
| `Object.is(a, b)` | Strict equality plus NaN and signed zero | `Object.is(NaN, NaN)` is `true` |
| `&&` | Logical AND, returns first falsy or last | Short-circuits on falsy |
| `\|\|` | Logical OR, returns first truthy or last | Short-circuits on truthy |
| `??` | Nullish coalescing | Fallback only for `null`/`undefined` |
| `!` | Logical NOT | Always returns a boolean |
| `? :` | Ternary conditional | `cond ? a : b` |
| `typeof` | Type name as string | `typeof 42` is `"number"` |
| `+x` (unary) | Converts to number | `+"42"` is `42` |
| Bitwise `& \| ^ ~ << >> >>>` | 32-bit integer operations | Flags and low-level work |
| BigInt operators | Arithmetic on `BigInt` only | `10n + 20n` |

## Key Concepts Comparison
- **`===` vs `==`**: `===` compares type and value with no conversion; `==` coerces types and produces surprises like `0 == false`.
- **`||` vs `??`**: `||` replaces any falsy value; `??` replaces only `null` or `undefined`, so `0` and `""` survive.
- **Prefix vs postfix `++`**: prefix changes the variable first and returns the new value; postfix returns the old value first.

## Critical Syntax / Templates
```js
// Strict comparison and range check
if (a === b && b > 0) { /* ... */ }

// Nullish fallback
const value = input ?? "default";

// Ternary
const label = score >= 60 ? "pass" : "fail";

// Compound assignment
total += amount;
```
