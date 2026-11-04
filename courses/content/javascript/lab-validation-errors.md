---
id: "lab-validation-errors"
type: "lab"
title: "Validation Errors"
moduleId: "mod-08-errors-and-strict-mode"
order: 5
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 30
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["errors","validation","throw"]
---

# Objective

Implement three validation functions that return the validated value when the input is correct and throw the appropriate error when it is not.

Definitions:
- `validateAge(age)` returns `age` when it is an integer from 0 through 120. Throw `TypeError` when `age` is not a number, and `RangeError` when it is outside the allowed range or not an integer.
- `validateEmail(email)` returns `email` when it is a string containing both `"@"` and `"."`. Throw `TypeError` when it is not a string, and `Error` when the format is invalid.
- `parseScore(text)` returns the numeric value of `text`. Throw `Error` when the text does not convert to a valid number.

## Requirements
- Throw `Error` objects, never strings
- Use `TypeError` for wrong types and `RangeError` for out-of-range values
- Include a clear message on every error
- Return the original value or converted number when validation passes

## Starter State / Workspace
```js
// Implement validateAge, validateEmail, and parseScore below
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "validateAge(25)", "expected": 25, "message": "validateAge(25) should return 25", "weight": 2, "required": true },
  { "type": "function-throws", "call": "validateAge(\"25\")", "errorType": "TypeError", "message": "A non-number age should throw TypeError", "weight": 2, "required": true },
  { "type": "function-throws", "call": "validateAge(200)", "errorType": "RangeError", "message": "An out-of-range age should throw RangeError", "weight": 2, "required": true },
  { "type": "function-returns", "call": "validateEmail(\"sam@example.com\")", "expected": "sam@example.com", "message": "validateEmail should return a valid email", "weight": 2, "required": true },
  { "type": "function-throws", "call": "validateEmail(42)", "errorType": "TypeError", "message": "A non-string email should throw TypeError" },
  { "type": "function-throws", "call": "validateEmail(\"no-at-sign\")", "errorType": "Error", "message": "An invalid email format should throw Error" },
  { "type": "function-returns", "call": "parseScore(\"42\")", "expected": 42, "message": "parseScore(\"42\") should return 42", "weight": 2, "required": true },
  { "type": "function-throws", "call": "parseScore(\"abc\")", "errorType": "Error", "message": "Non-numeric text should throw Error" },
  { "type": "code-contains", "value": "throw new", "message": "Throw Error objects with new" }
]
```

## Hints
> [!TIP]
> **Hint 1:** Check the type first with `typeof`, then check the range or format.

> [!TIP]
> **Hint 2:** Use `Number.isInteger(age)` to reject decimals, and compare the age against 0 and 120.

> [!TIP]
> **Hint 3:** For `parseScore`, convert with `Number(text)` and throw when `Number.isNaN` is true.

## Reference Solution
```js
function validateAge(age) {
  if (typeof age !== "number") {
    throw new TypeError("Age must be a number");
  }
  if (!Number.isInteger(age) || age < 0 || age > 120) {
    throw new RangeError("Age must be an integer between 0 and 120");
  }
  return age;
}

function validateEmail(email) {
  if (typeof email !== "string") {
    throw new TypeError("Email must be a string");
  }
  if (!email.includes("@") || !email.includes(".")) {
    throw new Error("Email format is invalid");
  }
  return email;
}

function parseScore(text) {
  const score = Number(text);
  if (Number.isNaN(score)) {
    throw new Error("Score must be numeric");
  }
  return score;
}
```
