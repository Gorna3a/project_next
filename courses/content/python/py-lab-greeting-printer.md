---
id: "py-lab-greeting-printer"
type: "lab"
title: "Greeting Printer"
moduleId: "py-mod-01-getting-started"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "print", "strings", "output"]
---

# Objective

Use the provided constants to print exactly one line: `Hello, Sam! Welcome to Python.`

The constants already contain the words. Your job is to assemble them with `print()` and control where spaces, punctuation, and line breaks appear.

## Requirements
- Use the values already stored in `greeting`, `name`, and `message`; do not rewrite them.
- Use `print()` and its `end` argument to join the pieces.
- Produce exactly one line of output.
- Add at least one comment that explains the assembly.
- Do not use an f-string; f-strings are introduced in Module 2.

## Starter State / Workspace
```python
greeting = "Hello"
name = "Sam"
message = "Welcome to Python"

# Build the greeting below.
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Hello, Sam! Welcome to Python.", "message": "The script should print the greeting exactly", "weight": 3, "required": true },
  { "type": "output-contains", "value": "Hello, Sam!", "message": "The name should follow the greeting with a comma and exclamation mark", "required": true },
  { "type": "code-contains", "value": "greeting", "message": "Use the greeting constant", "required": true },
  { "type": "code-contains", "value": "name", "message": "Use the name constant", "required": true },
  { "type": "code-contains", "value": "message", "message": "Use the message constant", "required": true },
  { "type": "code-contains", "value": "end=", "message": "Use the end argument to control the line breaks", "required": true },
  { "type": "code-contains", "value": "#", "message": "Add a comment that explains the assembly" }
]
```

## Hints
> [!TIP]
> **Hint 1:** `print()` adds a newline after each call by default. The `end` argument changes what is written after the values.

> [!TIP]
> **Hint 2:** Print the greeting first, then the name, then the message. Each call should leave the line open until the final call.

> [!TIP]
> **Hint 3:** The punctuation between the pieces belongs in `end`, not in the constants. The final print should end with a period and a newline.

## Reference Solution
```python
greeting = "Hello"
name = "Sam"
message = "Welcome to Python"

# Join the three constants, adding punctuation between them.
print(greeting, end=", ")
print(name, end="! ")
print(message, end=".")
```
