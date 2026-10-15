---
id: "lab-safe-number-parser"
type: "lab"
title: "Safe Number Parser"
moduleId: "mod-03-data-types-and-conversion"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
estimatedMinutes: 20
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["conversion","parsing","numbers"]
---

# Objective

Four string inputs sit in the starter code: two real numbers and two that only look numeric. Convert each one with `Number()` and print a compact report. The report shows the converted value for every input, followed by a validity line for each, so invalid inputs are clearly marked instead of silently accepted.

## Requirements
- Convert each input with `Number()` and print one conversion line per input in the exact form `<input> -> <result>`, for example `42 -> 42`, in the order A, B, C, D
- Invalid inputs must show `NaN` as their converted result
- After the four conversion lines, print four validity lines in the exact form `Invalid: true` or `Invalid: false` using `Number.isNaN`, one per input in the same order
- Keep the four constant declarations unchanged

## Starter State / Workspace
```js
const inputA = "42";
const inputB = "3.14";
const inputC = "42px";
const inputD = "not a number";
// Print the report below
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "42 -> 42\n3.14 -> 3.14\n42px -> NaN\nnot a number -> NaN\nInvalid: false\nInvalid: false\nInvalid: true\nInvalid: true", "message": "Output must be exactly the four conversion lines followed by the four Invalid lines.", "weight": 2, "required": true },
  { "type": "output-contains", "value": "Invalid: true", "message": "The report must mark the invalid inputs with Invalid: true." },
  { "type": "code-contains", "value": "Number.isNaN", "message": "Use Number.isNaN to decide the Invalid lines." }
]
```

## Hints
> [!TIP]
> **Hint 1:** `Number()` converts strictly: the whole string must be numeric or the result is `NaN`. That `NaN` is exactly what marks an input as invalid in the report.

> [!TIP]
> **Hint 2:** `Number.isNaN(Number(input))` answers with `true` or `false`. Join that answer after the label `"Invalid: "` to print a validity line.

> [!TIP]
> **Hint 3:** `NaN` is a value, not text, but joining it with `+` prints the word `NaN`. The four conversion lines mark invalid input on their own.

## Reference Solution
```js
const inputA = "42";
const inputB = "3.14";
const inputC = "42px";
const inputD = "not a number";

console.log(inputA + " -> " + Number(inputA));
console.log(inputB + " -> " + Number(inputB));
console.log(inputC + " -> " + Number(inputC));
console.log(inputD + " -> " + Number(inputD));

console.log("Invalid: " + Number.isNaN(Number(inputA)));
console.log("Invalid: " + Number.isNaN(Number(inputB)));
console.log("Invalid: " + Number.isNaN(Number(inputC)));
console.log("Invalid: " + Number.isNaN(Number(inputD)));
```
