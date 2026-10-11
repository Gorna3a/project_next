---
id: "lab-fix-the-scope"
type: "lab"
title: "Fix the Scope"
moduleId: "mod-02-variables-and-scope"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 20
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["scope","debugging","variables"]
---

# Objective

A script that counts votes and greets a user has three bugs: a shadowed variable, a reassigned constant, and the wrong output. Fix the declarations and assignments so the output is exactly two lines: Count: 3 and Name: Sam.

## Requirements
- The program must print exactly Count: 3 on the first line and Name: Sam on the second line
- Keep the const declaration for user and do not reassign it
- Fix the block so it updates the outer total instead of declaring a second one

## Starter State / Workspace
```js
let total = 0;
const user = "Sam";
if (true) {
  let total = 3;
}
console.log("Count: " + total);
user = "Alex";
console.log("Name: " + user);
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Count: 3\nName: Sam", "message": "Output must be exactly: Count: 3 and Name: Sam on two lines.", "weight": 2, "required": true },
  { "type": "code-contains", "value": "total = 3", "message": "Assign 3 to the existing total inside the block." },
  { "type": "code-not-contains", "value": "let total = 3", "message": "Do not declare a second total inside the block." }
]
```

## Hints
> [!TIP]
> **Hint 1:** Declaring `let total` inside the block creates a separate variable. Assign to the outer one without redeclaring it.

> [!TIP]
> **Hint 2:** A `const` variable cannot be reassigned. Delete the line that changes user instead of fixing it.

## Reference Solution
```js
let total = 0;
const user = "Sam";
if (true) {
  total = 3;
}
console.log("Count: " + total);
console.log("Name: " + user);
```
