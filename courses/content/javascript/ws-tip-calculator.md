---
id: "ws-tip-calculator"
type: "workshop"
title: "Tip Calculator"
moduleId: "mod-02-variables-and-scope"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 30
tags: ["variables","arithmetic","output"]
---

# Workshop Overview

You will build a small script that calculates a restaurant tip and prints a formatted total. Along the way you will declare constants, combine them with arithmetic, and format the result with a template literal.

---

## Step 1: Declare the bill

### Instructions
Declare a constant named bill with the value 40, then print it with console.log.

### Hints
1. Constants are declared with the const keyword followed by a name and a value.
2. Print the variable itself, not the text "bill".

### Starter State / Code
```js
// Declare the bill below
```

### Solution State / Code
```js
const bill = 40;
console.log(bill);
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "40", "message": "Print exactly: 40" }
]
```

---

## Step 2: Calculate the tip

### Instructions
Declare a constant named tipPercent with the value 15, compute the tip as bill multiplied by tipPercent divided by 100, store it in a constant named tip, and print tip.

### Hints
1. Reuse the bill constant from the previous step instead of typing 40 again.
2. Multiplication uses * and division uses /.

### Starter State / Code
```js
const bill = 40;
console.log(bill);
// Calculate the tip below
```

### Solution State / Code
```js
const bill = 40;
console.log(bill);
const tipPercent = 15;
const tip = bill * tipPercent / 100;
console.log(tip);
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "40\n6", "message": "Output must be exactly two lines: 40 and 6" }
]
```

---

## Step 3: Print the formatted total

### Instructions
Print the exact text Total: 46 using a template literal that adds bill and tip inside ${ }.

### Hints
1. Template literals use backticks, not quotation marks.
2. Write the addition inside ${ } and let JavaScript compute it.

### Starter State / Code
```js
const bill = 40;
console.log(bill);
const tipPercent = 15;
const tip = bill * tipPercent / 100;
console.log(tip);
```

### Solution State / Code
```js
const bill = 40;
console.log(bill);
const tipPercent = 15;
const tip = bill * tipPercent / 100;
console.log(tip);
console.log(`Total: ${bill + tip}`);
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "40\n6\nTotal: 46", "message": "Output must be exactly: 40, 6, Total: 46 on three lines" },
  { "type": "code-contains", "value": "${", "message": "Use a template literal with ${ } for the total" }
]
```
