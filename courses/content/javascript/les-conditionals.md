---
id: "les-conditionals"
type: "theory"
title: "Conditionals: if, else if, else, and switch"
moduleId: "mod-05-control-flow"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","control-flow","conditionals"]
---

# Concept Overview

Programs rarely run straight from top to bottom. They make choices. The `if` statement runs a block only when a condition is truthy. You can chain alternatives with `else if` and finish with `else`. The `switch` statement compares one value against several cases and is convenient when a single variable can take a known set of values.

## Key Principles & Frameworks

An `if` condition accepts any value; JavaScript converts it to true or false using the truthiness rules from Module 3. Use comparison and logical operators to build the condition.

```js
let score = 82;
if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else {
  console.log("C");
}
```

The code above prints `B`. Conditions are checked from top to bottom, and only the first true branch runs.

`switch` compares its value against each `case` using strict equality (`===`). Execution starts at the matching case and continues until a `break` or the end of the switch. The `default` case runs when nothing matches.

```js
let day = 3;
switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  case 3:
    console.log("Wednesday");
    break;
  default:
    console.log("Unknown day");
}
```

This prints `Wednesday`. Without the `break`, execution would fall through into later cases.

## Common Pitfalls & Anti-Patterns
- **Assignment inside a condition**: `if (x = 5)` assigns 5 and then tests it; it does not compare. Use `===` or `==` for comparisons.
- **Missing `break` in `switch`**: Without `break`, a matching case falls through and runs the next case too. Add `break` unless fallthrough is intentional.
- **Wrong branch order**: `else if` conditions are checked in order, so put the most specific condition first. If `score >= 70` comes before `score >= 90`, the higher branch never runs.
- **Using `switch` for ranges**: `switch` tests exact values. Use `if`/`else if` for ranges such as `score >= 90`.

## Quick Summary
- `if` runs a block when its condition is truthy; `else if` and `else` add alternatives.
- `switch` matches exact values with `===` and needs `break` to stop fallthrough.
- Put the most specific condition first, and never use `=` where you mean `===`.
