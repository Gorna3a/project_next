---
id: "rev-control-flow"
type: "review"
title: "Control Flow Quick Reference"
moduleId: "mod-05-control-flow"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-conditionals","les-loops","les-break-continue-patterns","ws-fizzbuzz-and-friends","lab-number-patterns"]
tags: ["javascript","control-flow","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| `if` | Runs a block when a condition is truthy | `if (age >= 18) { ... }` |
| `else if` | Adds another condition checked in order | Grading scales |
| `else` | Runs when no earlier condition matched | Fallback branch |
| `switch` | Compares one value against exact cases with `===` | Menu choices, status codes |
| `break` | Exits the nearest loop or `switch` | Stop searching early |
| `continue` | Skips to the next loop iteration | Skip unwanted values |
| `for` | Loop with init, condition, update | Counting a known number of times |
| `while` | Loop that checks before each iteration | Repeating until a condition changes |
| `do...while` | Loop that checks after each iteration | Always run the body once |
| Nested loop | A loop inside another loop | Grids, tables, patterns |
| Off-by-one | Using `<` vs `<=` at the boundary incorrectly | Loop runs once too many or too few |
| Infinite loop | A loop whose condition never becomes false | Forgetting to update the counter |

## Key Concepts Comparison
- **`if` vs `switch`**: `if` handles ranges and complex conditions; `switch` matches a single value against exact cases.
- **`while` vs `do...while`**: `while` may run zero times; `do...while` always runs at least once.
- **`break` vs `continue`**: `break` leaves the loop; `continue` skips the rest of the current iteration.

## Critical Syntax / Templates
```js
// Branching
if (condition) {
  // ...
} else if (otherCondition) {
  // ...
} else {
  // ...
}

// Switch with no fallthrough
switch (value) {
  case 1:
    // ...
    break;
  default:
    // ...
}

// Loops
for (let i = 0; i < 5; i++) { /* ... */ }
while (condition) { /* ... */ }
do { /* ... */ } while (condition);

// Nested loop skeleton
for (let row = 1; row <= 3; row++) {
  let line = "";
  for (let col = 1; col <= 3; col++) {
    line += "*";
  }
  console.log(line);
}
```
