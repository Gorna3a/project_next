---
id: "les-variable-naming-rules"
type: "theory"
title: "Variable Naming Rules and Conventions"
moduleId: "mod-02-variables-and-scope"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 10
tags: ["javascript","naming","style"]
---

# Concept Overview

A variable name can contain letters, digits, underscores, and dollar signs, but it cannot start with a digit. Names cannot contain spaces or dashes, and they cannot be reserved words like `let` or `const`. Names are case-sensitive, so `score` and `Score` are two different variables.

## Key Principles & Frameworks

Beyond the hard rules there is a convention: multi-word names use camelCase, where the first word is lowercase and each later word starts with an uppercase letter. Names should describe the value they hold, so a reader can guess the contents without looking elsewhere.

```js
const firstName = "Sam";
const lessonCount = 7;
const _private = true;
const $price = 9;
```

Each name above is legal: it starts with a letter, underscore, or dollar sign and uses camelCase for multiple words. Names like `2fast`, `my-name`, and `my name` are illegal and stop the program with a `SyntaxError` before anything runs.

## Common Pitfalls & Anti-Patterns
- **Starting with a digit**: `const 2fast = true` is a `SyntaxError`. Start names with a letter, `_`, or `$`.
- **Using dashes or spaces**: `my-name` reads as subtraction to the engine. Use camelCase (`myName`) instead.
- **Single-letter names everywhere**: A loop counter named `i` is fine, but important values deserve descriptive names like `totalPrice`.

## Quick Summary
- Names use letters, digits, `_`, and `$`, and never start with a digit.
- Multi-word names use camelCase and describe their value.
- Reserved words and spaces in names cause immediate `SyntaxError`s.
