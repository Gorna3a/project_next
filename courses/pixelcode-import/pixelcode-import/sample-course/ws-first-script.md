---
id: "ws-first-script"
type: "workshop"
title: "Write Your First Script"
moduleId: "mod-01-getting-started"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 25
tags: ["console","output","comments"]
---


# Workshop Overview

You will build a small script that prints a welcome banner. Along the way you will print text, print several values at once, and document your code with comments.

---

## Step 1: Print a message

### Instructions
Use console.log to print the exact text Welcome to PixelCode.

### Hints
1. console.log takes the value you want to print inside parentheses.
2. Text values need quotation marks around them.

### Starter State / Code
```js
// Print the message below
```

### Solution State / Code
```js
console.log("Welcome to PixelCode");
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Welcome to PixelCode", "message": "Print exactly: Welcome to PixelCode" }
]
```

---

## Step 2: Print several values

### Instructions
Print the text Lesson followed by the number 1 in a single console.log call, separated by a comma.

### Hints
1. console.log accepts more than one argument.
2. Separate arguments with commas; the output joins them with a space.

### Starter State / Code
```js
console.log("Welcome to PixelCode");
// Add a second console.log below
```

### Solution State / Code
```js
console.log("Welcome to PixelCode");
console.log("Lesson", 1);
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "Lesson 1", "message": "Your output should contain: Lesson 1" }
]
```

---

## Step 3: Add a comment

### Instructions
Add a single-line comment above your second console.log that explains what it prints.

### Hints
1. Single-line comments start with two forward slashes.
2. Comments are ignored when the code runs.

### Starter State / Code
```js
console.log("Welcome to PixelCode");
console.log("Lesson", 1);
```

### Solution State / Code
```js
console.log("Welcome to PixelCode");
// Print the lesson number
console.log("Lesson", 1);
```

### Evaluation Tests
```json
[
  { "type": "code-contains", "value": "//", "message": "Add a comment that starts with //" },
  { "type": "output-contains", "value": "Lesson 1", "message": "Keep printing: Lesson 1" }
]
```
