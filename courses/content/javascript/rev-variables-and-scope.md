---
id: "rev-variables-and-scope"
type: "review"
title: "Variables & Scope Cheat Sheet"
moduleId: "mod-02-variables-and-scope"
order: 7
covers: ["les-declaring-variables","les-variable-naming-rules","les-scope-basics","les-hoisting","ws-tip-calculator","lab-fix-the-scope"]
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
tags: ["javascript","variables","review"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| **`let`** | Declares a block-scoped variable that can be reassigned | Counters and values that change |
| **`const`** | Declares a block-scoped variable that cannot be reassigned | Fixed values like names and rates |
| **`var`** | Declares a function-scoped variable, hoisted as `undefined` | Legacy code only; avoid in new code |
| **camelCase** | Lowercase first word, uppercase later words | `firstName`, `totalPrice` |
| **TDZ** | Region before a `let`/`const` line runs; access throws | Explains `ReferenceError` on early use |

## Key Concepts Comparison
- **`let`** vs. **`const`**: both are block-scoped, but `let` allows reassignment while `const` throws a `TypeError` on reassignment.
- **`var`** vs. **`let`**: `var` escapes blocks and hoists as `undefined`; `let` stays in its block and throws in the temporal dead zone.

## Critical Syntax / Templates
```js
const name = "Sam";
let count = 0;
count = count + 1;
console.log(`Total: ${count}`);
```
