---
id: "rev-data-types"
type: "review"
title: "Data Types & Conversion Cheat Sheet"
moduleId: "mod-03-data-types-and-conversion"
order: 7
covers: ["les-primitive-types","les-typeof-and-special-values","les-explicit-conversion","les-implicit-coercion","ws-type-inspector","lab-safe-number-parser"]
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
tags: ["javascript","data-types","review"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| **`typeof x`** | Returns the type of a value as a lowercase string | Inspect a value before converting or using it |
| **`Number(x)`** | Strict conversion: a numeric string becomes a number, anything else becomes `NaN` | Convert form input before arithmetic |
| **`parseInt(x, 10)` / `parseFloat(x)`** | Read a number from the start of a string and ignore the rest, always pass radix 10 | Extract `42` from `"42px"` |
| **`NaN`** | "Not a number": the result of a failed numeric operation; never equal to anything | Detect it with `Number.isNaN(x)` |
| **Falsy values** | `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN` | Every other value is truthy |

## Key Concepts Comparison
- **Explicit conversion** vs. **implicit coercion**: you trigger the first yourself with `Number()`, `String()`, or `Boolean()`; JavaScript triggers the second on its own, like `+` with a string or a truthy/falsy check.
- **`Number()`** vs. **`parseInt()`**: `Number("42px")` is strict and gives `NaN`, while `parseInt("42px", 10)` stops at the first non-digit and gives `42`.
- **`null`** vs. **`undefined`**: both mean "no value", but `undefined` means "not assigned yet" and `null` means "deliberately empty". `typeof null` is `"object"`, a historical bug.

## Critical Syntax / Templates
```js
typeof "pixel";        // "string"
Number("42");          // 42
Number("42px");        // NaN
parseInt("42px", 10);  // 42
Number.isNaN(NaN);     // true
Boolean("");           // false
"5" + 1;               // "51"
"5" - 1;               // 4
```
