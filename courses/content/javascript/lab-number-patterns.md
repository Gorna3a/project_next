---
id: "lab-number-patterns"
type: "lab"
title: "Number Patterns"
moduleId: "mod-05-control-flow"
order: 5
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 25
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["loops","nested-loops","patterns"]
---

# Objective

Print a number triangle with exactly five rows:

```text
1
1 2
1 2 3
1 2 3 4
1 2 3 4 5
```

Use nested loops. Do not print the rows as hard-coded strings.

## Requirements
- Use a `for` loop for the rows and a nested loop for the numbers in each row
- Row N contains the numbers 1 through N, separated by single spaces
- Print exactly five rows with no trailing spaces

## Starter State / Workspace
```js
// Print the number triangle below
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5", "message": "Output must be the five-row number triangle", "weight": 2, "required": true },
  { "type": "code-contains", "value": "for", "message": "Use a for loop to build the rows" },
  { "type": "code-not-contains", "value": "1 2 3 4 5", "message": "Do not hard-code the final row; build it with loops" }
]
```

## Hints
> [!TIP]
> **Hint 1:** The outer loop controls the row number, and the inner loop controls how many numbers appear in that row.

> [!TIP]
> **Hint 2:** Start each row with an empty string, then add numbers and spaces to it inside the inner loop.

> [!TIP]
> **Hint 3:** Print the completed row after the inner loop finishes, not inside it.

## Reference Solution
```js
for (let row = 1; row <= 5; row++) {
  let line = "";
  for (let col = 1; col <= row; col++) {
    line += col;
    if (col < row) {
      line += " ";
    }
  }
  console.log(line);
}
```
