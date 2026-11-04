---
id: "les-throw-and-error-objects"
type: "theory"
title: "throw and Error Objects"
moduleId: "mod-08-errors-and-strict-mode"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","errors","throw"]
---

# Concept Overview

The `throw` statement stops execution and sends a value to the nearest `catch`. Good code throws `Error` objects, not strings. An `Error` object carries a message, a name, and a stack trace that makes failures easier to diagnose. JavaScript also provides built-in error subclasses for common categories.

## Key Principles & Frameworks

`throw` accepts any value, but an `Error` object is the right choice because it includes diagnostic information.

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.log(error.name + ": " + error.message);
}
```

This prints `Error: Cannot divide by zero`. Without the `catch`, the error would stop the program.

Every `Error` object has a `name` and a `message`. The built-in subclasses set the name automatically: `TypeError` for wrong types, `RangeError` for out-of-range values, and `SyntaxError` for invalid syntax.

```js
function setAge(age) {
  if (typeof age !== "number") {
    throw new TypeError("Age must be a number");
  }
  if (age < 0 || age > 120) {
    throw new RangeError("Age must be between 0 and 120");
  }
  return age;
}
```

You can create a custom error name by changing the `name` property of an `Error` object.

```js
const error = new Error("Email is missing");
error.name = "ValidationError";
throw error;
```

This preserves the message and stack while giving the error a category your code can check.

## Common Pitfalls & Anti-Patterns
- **Throwing strings**: `throw "Something failed"` gives you no message field, no name, and no stack trace. Throw `new Error(...)` instead.
- **Throwing the wrong type**: Use `TypeError` for wrong types and `RangeError` for invalid ranges so callers can react precisely.
- **Losing the original error**: When rethrowing, include or preserve the original cause instead of replacing it with a vague message.
- **Forgetting that `throw` exits**: Code after `throw` in the same block never runs. Return or throw, but do not expect both to continue.

## Quick Summary
- `throw` stops execution and sends a value to the nearest `catch`.
- Throw `Error` objects, not strings.
- `error.name` and `error.message` describe the failure.
- Use `TypeError`, `RangeError`, and other built-in subclasses for common categories.
- Set `error.name` to create a custom error category.
