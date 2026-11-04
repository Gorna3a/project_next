---
id: "rev-errors-and-strict-mode"
type: "review"
title: "Errors & Strict Mode Quick Reference"
moduleId: "mod-08-errors-and-strict-mode"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-try-catch-finally","les-throw-and-error-objects","les-strict-mode","ws-safe-json-parser","lab-validation-errors"]
tags: ["javascript","errors","strict-mode","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| `try` | Runs code that may throw | Wrap risky parsing or I/O |
| `catch (error)` | Handles a thrown error | Log, recover, or rethrow |
| `finally` | Always runs after try/catch | Cleanup and flags |
| `throw` | Stops execution and raises a value | Reject invalid input |
| `new Error(message)` | Creates a generic error | Most custom failures |
| `new TypeError(message)` | Error for wrong types | Type validation |
| `new RangeError(message)` | Error for out-of-range values | Number limits |
| `error.name` | Error category | `"TypeError"`, custom names |
| `error.message` | Human-readable description | Logging and user feedback |
| `"use strict"` | Enables strict rules for a scope | First line of a script or function |
| Strict mode | Turns silent mistakes into errors | Accidental globals, bad writes |

## Key Concepts Comparison
- **`try` vs `catch` vs `finally`**: `try` runs the risky code, `catch` handles a failure, and `finally` runs in both cases.
- **`Error` object vs string**: An `Error` carries `name`, `message`, and a stack trace; a string carries only text.
- **Strict vs non-strict**: Strict mode throws for accidental globals and other silent mistakes; non-strict code may continue with a hidden bug.

## Critical Syntax / Templates
```js
// Try, catch, finally
try {
  const data = JSON.parse(text);
  console.log(data);
} catch (error) {
  console.log(error.name + ": " + error.message);
} finally {
  console.log("Attempt finished");
}

// Throw a standard error
function validateAge(age) {
  if (typeof age !== "number") {
    throw new TypeError("Age must be a number");
  }
  if (age < 0 || age > 120) {
    throw new RangeError("Age must be between 0 and 120");
  }
  return age;
}

// Custom error name
const error = new Error("Email is missing");
error.name = "ValidationError";
throw error;

// Strict mode
"use strict";

function strictFunction() {
  "use strict";
  // ...
}
```
