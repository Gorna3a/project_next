---
id: "ws-comparison-playground"
type: "workshop"
title: "Comparison Playground"
moduleId: "mod-04-operators-and-comparison"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 30
tags: ["operators","comparison","logical"]
---

# Workshop Overview

You will explore how JavaScript compares and combines values: strict versus loose equality, range checks, fallback operators, and a ternary choice. Each step builds on the previous one and prints a predictable result.

---

## Step 1: Compare equal values two ways

### Instructions
Declare constants `a` with value `5` and `b` with value `"5"`. Print two lines: `strict: false` using `===`, then `loose: true` using `==`.

### Hints
1. `===` checks both type and value, so a number and a string are never strictly equal.
2. `==` converts operands to a common type before comparing.

### Starter State / Code
```js
// Compare the two values below
```

### Solution State / Code
```js
const a = 5;
const b = "5";
console.log("strict: " + (a === b));
console.log("loose: " + (a == b));
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "strict: false\nloose: true", "message": "Output must be: strict: false, then loose: true", "required": true }
]
```

---

## Step 2: Check a range correctly

### Instructions
Add a constant `x` with value `7`. Print one line, `in range: true`, by testing that `x` is at least 1 and at most 10 using two comparisons joined by `&&`. Do not use a chained comparison like `1 <= x <= 10`.

### Hints
1. A range test needs two separate comparisons combined with `&&`.
2. Chained comparisons such as `1 <= x <= 10` evaluate left to right and do not test a range.

### Starter State / Code
```js
const a = 5;
const b = "5";
console.log("strict: " + (a === b));
console.log("loose: " + (a == b));
```

### Solution State / Code
```js
const a = 5;
const b = "5";
console.log("strict: " + (a === b));
console.log("loose: " + (a == b));
const x = 7;
console.log("in range: " + (x >= 1 && x <= 10));
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "strict: false\nloose: true\nin range: true", "message": "Add the line: in range: true", "required": true },
  { "type": "code-contains", "value": "&&", "message": "Use && to combine the two comparisons" }
]
```

---

## Step 3: Compare fallback operators

### Instructions
Add a constant `count` with value `0`. Print two lines: `or: 10` using `||`, then `nullish: 0` using `??`. Both use `10` as the right-hand value.

### Hints
1. `||` returns the right value when the left is any falsy value, including `0`.
2. `??` returns the right value only when the left is `null` or `undefined`.

### Starter State / Code
```js
const a = 5;
const b = "5";
console.log("strict: " + (a === b));
console.log("loose: " + (a == b));
const x = 7;
console.log("in range: " + (x >= 1 && x <= 10));
```

### Solution State / Code
```js
const a = 5;
const b = "5";
console.log("strict: " + (a === b));
console.log("loose: " + (a == b));
const x = 7;
console.log("in range: " + (x >= 1 && x <= 10));
const count = 0;
console.log("or: " + (count || 10));
console.log("nullish: " + (count ?? 10));
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "strict: false\nloose: true\nin range: true\nor: 10\nnullish: 0", "message": "Add the two fallback lines", "required": true }
]
```

---

## Step 4: Choose with a ternary

### Instructions
Add a constant `score` with value `75`. Print one line, `result: pass`, using a ternary that checks `score >= 60`.

### Hints
1. A ternary has the form `condition ? valueIfTrue : valueIfFalse`.
2. Put the whole ternary inside the `console.log` call.

### Starter State / Code
```js
const a = 5;
const b = "5";
console.log("strict: " + (a === b));
console.log("loose: " + (a == b));
const x = 7;
console.log("in range: " + (x >= 1 && x <= 10));
const count = 0;
console.log("or: " + (count || 10));
console.log("nullish: " + (count ?? 10));
```

### Solution State / Code
```js
const a = 5;
const b = "5";
console.log("strict: " + (a === b));
console.log("loose: " + (a == b));
const x = 7;
console.log("in range: " + (x >= 1 && x <= 10));
const count = 0;
console.log("or: " + (count || 10));
console.log("nullish: " + (count ?? 10));
const score = 75;
console.log("result: " + (score >= 60 ? "pass" : "fail"));
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "strict: false\nloose: true\nin range: true\nor: 10\nnullish: 0\nresult: pass", "message": "Final output must include: result: pass", "required": true },
  { "type": "code-contains", "value": "?", "message": "Use a ternary operator in the final step" }
]
```
