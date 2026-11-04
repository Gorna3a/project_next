---
id: "les-try-catch-finally"
type: "theory"
title: "try, catch, and finally"
moduleId: "mod-08-errors-and-strict-mode"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","errors","try-catch"]
---

# Concept Overview

An error interrupts normal execution. The `try` statement lets you run risky code and respond if it fails. The `catch` block receives the error, and the `finally` block runs whether or not an error occurred. Together they give you control over failure.

## Key Principles & Frameworks

Code inside `try` runs normally until something throws. If an error occurs, the rest of the `try` block is skipped and control moves to `catch`. If no error occurs, `catch` is skipped.

```js
try {
  const data = JSON.parse('{"name":"Sam"}');
  console.log(data.name);
} catch (error) {
  console.log("Could not parse: " + error.message);
}
```

This prints `Sam`. A malformed string would skip the log and run the `catch` block instead.

The `catch` parameter is usually an `Error` object with a `message` and a `name`. You can inspect it or log it.

```js
try {
  JSON.parse("{bad json}");
} catch (error) {
  console.log(error.name + ": " + error.message);
}
```

`finally` runs after `try` and `catch`, regardless of success or failure. It is useful for cleanup such as closing a connection or resetting a flag.

```js
try {
  console.log("Trying");
} catch (error) {
  console.log("Failed");
} finally {
  console.log("Finished");
}
```

This prints `Trying` and then `Finished`. If the `try` block threw, it would print `Failed` and then `Finished`.

## Common Pitfalls & Anti-Patterns
- **Empty `catch` blocks**: `catch (error) {}` swallows the failure and hides the cause. Log the error, recover deliberately, or rethrow it.
- **Catching too much**: Wrapping a large block hides which line failed. Keep `try` blocks small and focused.
- **Assuming `finally` only runs on success**: It runs on both paths, including when the error is rethrown.
- **Returning from `finally`**: A `return` inside `finally` overrides any return or throw from `try` and `catch`, which is almost never intended.

## Quick Summary
- `try` runs risky code; `catch` handles a thrown error.
- `finally` always runs, whether the try succeeded or failed.
- Catch only the code you can handle, and never leave a silent empty catch.
- A `return` inside `finally` can override earlier results.
