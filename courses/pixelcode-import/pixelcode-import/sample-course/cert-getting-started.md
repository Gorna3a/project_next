---
id: "cert-getting-started"
type: "certification-project"
title: "Console Business Card"
scope: "module"
targetId: "mod-01-getting-started"
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedHours: 1
passingGradePercent: 80
tags: ["console","output","capstone"]
---


# Capstone Objective

Print a three-line business card to the console for a fictional developer. This proves you can run a script, print values, and document your code.

## Functional Deliverables
1. A script that prints exactly three lines
2. A comment explaining each line

## Requirements & Rubric
| # | Requirement | Weight | Required |
| :-- | :--- | :--- | :--- |
| 1 | Output matches the expected business card exactly | 50 | Yes |
| 2 | Uses console.log for every line | 20 | Yes |
| 3 | Contains at least one comment | 20 | No |
| 4 | Does not use document.write | 10 | No |

## Starter Workspace
```js
// Print the business card below
```

## Automated Validation Criteria
```json
[
  { "type": "output-equals", "value": "Sam Rivera\nJavaScript Developer\nsam@example.com", "message": "Output must be the three exact lines.", "weight": 50, "required": true },
  { "type": "code-contains", "value": "console.log", "message": "Use console.log to print.", "weight": 20, "required": true },
  { "type": "code-contains", "value": "//", "message": "Add at least one comment.", "weight": 20 },
  { "type": "code-not-contains", "value": "document.write", "message": "Do not use document.write.", "weight": 10 }
]
```
