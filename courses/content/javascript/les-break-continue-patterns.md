---
id: "les-break-continue-patterns"
type: "theory"
title: "break, continue, and Nested Loop Patterns"
moduleId: "mod-05-control-flow"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","control-flow","loops"]
---

# Concept Overview

`break` exits a loop immediately. `continue` skips the rest of the current iteration and moves to the next one. Both make loops more expressive, but they can also make control flow harder to follow. Nested loops put one loop inside another, which is useful for grids and patterns.

## Key Principles & Frameworks

Use `break` to stop searching as soon as a result is found.

```js
for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    break;
  }
  console.log(i);
}
```

This prints `1` through `4`, then stops when `i` reaches 5.

Use `continue` to skip values you do not need.

```js
for (let i = 1; i <= 5; i++) {
  if (i % 2 === 0) {
    continue;
  }
  console.log(i);
}
```

This prints `1`, `3`, and `5`. Even numbers skip the rest of the iteration.

Nested loops repeat a loop inside another. The inner loop finishes completely for each iteration of the outer loop.

```js
for (let row = 1; row <= 3; row++) {
  let line = "";
  for (let col = 1; col <= 3; col++) {
    line += "*";
  }
  console.log(line);
}
```

This prints three lines of three stars. Building a string inside the inner loop and printing it after the inner loop completes is a common pattern for shapes and tables.

## Common Pitfalls & Anti-Patterns
- **`break` in nested loops**: `break` exits only the innermost loop. The outer loop continues unless you add another condition or a labeled break.
- **`continue` with skipped updates**: In a `for` loop, `continue` still runs the update expression. In a `while` loop, make sure the update is not skipped, or the loop may never end.
- **Using `break` outside a loop or `switch`**: JavaScript throws a syntax error. `break` only belongs inside a loop or a `case`.
- **Overusing `break` and `continue`**: Simple conditions are easier to read. Use these statements when they make the intent clearer.

## Quick Summary
- `break` exits the nearest loop or `switch`.
- `continue` skips to the next iteration of the nearest loop.
- Nested loops run the inner loop fully for each outer iteration.
- `break` only exits the innermost loop.
