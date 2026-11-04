---
id: "lab-eligibility-checker"
type: "lab"
title: "Eligibility Checker"
moduleId: "mod-04-operators-and-comparison"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["operators","comparison","logical"]
---

# Objective

Decide whether a person is eligible using only operators, no `if` statements. Use the constants provided in the starter code and print exactly one line: `eligible: false`.

A person is eligible when all of these hold: age is at least 18, `hasLicense` is true, `hasInsurance` is true, and `violations` equals 0.

## Requirements
- Do not change the constants
- Use comparison and logical operators to compute the result
- Do not use `if`, `else`, or a ternary
- Print exactly one line in the form `eligible: <boolean>`

## Starter State / Workspace
```js
const age = 20;
const hasLicense = true;
const hasInsurance = false;
const violations = 0;
// Print the eligibility result below
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "eligible: false", "message": "Output must be exactly: eligible: false", "weight": 2, "required": true },
  { "type": "code-contains", "value": "&&", "message": "Combine the conditions with &&" },
  { "type": "code-not-contains", "value": "if", "message": "Do not use if statements" },
  { "type": "code-not-contains", "value": "?", "message": "Do not use a ternary operator" }
]
```

## Hints
> [!TIP]
> **Hint 1:** Combine several boolean conditions with `&&` so the result is true only when all of them are true.

> [!TIP]
> **Hint 2:** Age and violations need comparisons: `age >= 18` and `violations === 0`. The license and insurance values are already booleans.

> [!TIP]
> **Hint 3:** Build the boolean expression, then print it with `console.log("eligible: " + expression)`.

## Reference Solution
```js
const age = 20;
const hasLicense = true;
const hasInsurance = false;
const violations = 0;
const eligible = age >= 18 && hasLicense && hasInsurance && violations === 0;
console.log("eligible: " + eligible);
```
