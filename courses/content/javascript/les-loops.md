---
id: "les-loops"
type: "theory"
title: "Loops: for, while, and do...while"
moduleId: "mod-05-control-flow"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","control-flow","loops"]
---

# Concept Overview

Loops repeat a block of code. JavaScript has three common loop forms: `for`, `while`, and `do...while`. A `for` loop is best when you know how many repetitions you need. A `while` loop is best when repetition depends on a condition. A `do...while` loop is like `while`, but it always runs the body at least once.

## Key Principles & Frameworks

A `for` loop has three parts inside the parentheses: initialization, condition, and update. The initialization runs once, the condition is checked before each iteration, and the update runs after each iteration.

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

This prints `0`, `1`, and `2`. The loop stops when `i < 3` becomes false.

A `while` loop checks its condition before every iteration. You must change something inside the loop so the condition eventually becomes false.

```js
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
```

This prints the same three values. Forgetting `count++` would make the condition stay true forever.

A `do...while` loop checks its condition after the body, so the body always runs at least once.

```js
let n = 5;
do {
  console.log(n);
  n++;
} while (n < 3);
```

This prints `5` once, even though the condition is false from the start.

## Common Pitfalls & Anti-Patterns
- **Off-by-one errors**: `i <= 3` runs four times, not three. Decide whether the boundary is included and choose `<` or `<=` deliberately.
- **Infinite loops**: A `while` loop whose condition never becomes false runs forever. Make sure the body changes the value used in the condition.
- **Skipping the update in a `for` loop**: If the update expression is missing, the condition may never change. Keep the three parts aligned.
- **Assuming `do...while` might skip**: It never skips the first iteration because the condition is checked at the end.

## Quick Summary
- Use `for` when the number of repetitions is known.
- Use `while` when repetition depends on a condition that can change.
- `do...while` always runs at least once.
- Check boundaries carefully to avoid off-by-one errors.
