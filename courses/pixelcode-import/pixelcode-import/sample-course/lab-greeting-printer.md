---
id: "lab-greeting-printer"
type: "lab"
title: "Greeting Printer"
moduleId: "mod-01-getting-started"
order: 5
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 20
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["console","output","strings"]
---


# Objective

Print a personalized greeting using the constants provided in the starter code. The output must be exactly one line: Hello, Sam! Welcome to JavaScript.

## Requirements
- Use console.log exactly once
- Build the greeting from the provided constants
- Do not change the constants

## Starter State / Workspace
```js
const name = "Sam";
const language = "JavaScript";
// Print the greeting below
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Hello, Sam! Welcome to JavaScript.", "message": "Output must be exactly: Hello, Sam! Welcome to JavaScript.", "weight": 2, "required": true },
  { "type": "code-contains", "value": "name", "message": "Use the name constant instead of typing the name." },
  { "type": "code-contains", "value": "language", "message": "Use the language constant instead of typing the language." }
]
```

## Hints
> [!TIP]
> **Hint 1:** You can join text and values with the plus sign, or use a template literal with backticks.

> [!TIP]
> **Hint 2:** Remember the comma, the exclamation mark, and the full stop in the exact output.

## Reference Solution
```js
const name = "Sam";
const language = "JavaScript";
console.log("Hello, " + name + "! Welcome to " + language + ".");
```
