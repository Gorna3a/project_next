---
id: "ws-safe-json-parser"
type: "workshop"
title: "Safe JSON Parser"
moduleId: "mod-08-errors-and-strict-mode"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 40
tags: ["errors","json","try-catch"]
---

# Workshop Overview

You will build a set of parsing helpers that fail gracefully. The functions use `try` and `catch` to turn invalid JSON into safe fallback values, throw clear errors for invalid numbers, and use `finally` to record that an attempt happened.

---

## Step 1: Parse safely

### Instructions
Write a function named `safeParse` that takes a JSON string and returns the parsed value. If parsing fails, return `null` instead of letting the error escape.

### Hints
1. Put `JSON.parse` inside a `try` block.
2. Return `null` from the `catch` block.

### Starter State / Code
```js
// Define safeParse below
```

### Solution State / Code
```js
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "safeParse('{\"name\":\"Sam\"}')", "expected": { "name": "Sam" }, "message": "safeParse should return the parsed object", "required": true },
  { "type": "function-returns", "call": "safeParse('{bad')", "expected": null, "message": "safeParse should return null for invalid JSON", "required": true },
  { "type": "code-contains", "value": "try", "message": "Use a try block" }
]
```

---

## Step 2: Parse with a fallback

### Instructions
Write a function named `parseOr` that takes a JSON string and a fallback value. Return the parsed value when parsing succeeds, otherwise return the fallback.

### Hints
1. Reuse the same `try`/`catch` shape as `safeParse`.
2. Return the `fallback` parameter from the `catch` block.

### Starter State / Code
```js
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}
```

### Solution State / Code
```js
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

function parseOr(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return fallback;
  }
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "parseOr('{\"ok\":true}', { \"ok\": false })", "expected": { "ok": true }, "message": "parseOr should return the parsed object when parsing succeeds", "required": true },
  { "type": "function-returns", "call": "parseOr('not json', { \"ok\": false })", "expected": { "ok": false }, "message": "parseOr should return the fallback when parsing fails", "required": true }
]
```

---

## Step 3: Reject invalid numbers

### Instructions
Write a function named `parseNumber` that converts text to a number. If the result is `NaN`, throw a new `Error` with the message `"Not a number"`. Otherwise return the number.

### Hints
1. `Number(text)` converts the text to a number.
2. Use `Number.isNaN` to detect an invalid result, then `throw new Error(...)`.

### Starter State / Code
```js
function parseOr(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return fallback;
  }
}
```

### Solution State / Code
```js
function parseOr(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return fallback;
  }
}

function parseNumber(text) {
  const value = Number(text);
  if (Number.isNaN(value)) {
    throw new Error("Not a number");
  }
  return value;
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "parseNumber(\"42\")", "expected": 42, "message": "parseNumber(\"42\") should return 42", "required": true },
  { "type": "function-throws", "call": "parseNumber(\"abc\")", "errorType": "Error", "message": "parseNumber should throw an Error for invalid text", "required": true }
]
```

---

## Step 4: Track attempts with finally

### Instructions
Write a function named `parseAudit` that attempts to parse JSON and always returns an object with two properties: `value` (the parsed value or `null`) and `attempted` (always `true`). Set `attempted` inside a `finally` block.

### Hints
1. Start with `value = null` and `attempted = false`.
2. Assign the parse result inside `try`; set `attempted = true` inside `finally`.
3. Return the object after the `try`/`catch`/`finally` structure.

### Starter State / Code
```js
function parseNumber(text) {
  const value = Number(text);
  if (Number.isNaN(value)) {
    throw new Error("Not a number");
  }
  return value;
}
```

### Solution State / Code
```js
function parseNumber(text) {
  const value = Number(text);
  if (Number.isNaN(value)) {
    throw new Error("Not a number");
  }
  return value;
}

function parseAudit(text) {
  let value = null;
  let attempted = false;
  try {
    value = JSON.parse(text);
  } catch (error) {
    value = null;
  } finally {
    attempted = true;
  }
  return { value: value, attempted: attempted };
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "parseAudit('{\"ok\":true}')", "expected": { "value": { "ok": true }, "attempted": true }, "message": "parseAudit should return the parsed value and attempted: true", "required": true },
  { "type": "function-returns", "call": "parseAudit('{bad')", "expected": { "value": null, "attempted": true }, "message": "parseAudit should return null on failure and still report attempted: true", "required": true },
  { "type": "code-contains", "value": "finally", "message": "Use a finally block to set attempted" }
]
```
