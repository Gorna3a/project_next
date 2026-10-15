---
id: "ws-type-inspector"
type: "workshop"
title: "Type Inspector"
moduleId: "mod-03-data-types-and-conversion"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
estimatedMinutes: 30
tags: ["typeof","conversion","output"]
---

# Workshop Overview

You will build a tiny type inspector: a script that reports the type of every value it holds, including one that was never assigned. In the final step you add a piece of text that looks like a number, convert it with `Number()`, and inspect the value before and after the conversion.

---

## Step 1: Report the first type

### Instructions
Declare a constant named label with the value "total". Print exactly one line: label: string, letting typeof produce the type.

### Hints
1. The typeof operator answers with the type as text, so you can join it to other text with +.
2. Join the fixed text "label: " and the result of typeof label inside one console.log.

### Starter State / Code
```js
// Inspect the value below
```

### Solution State / Code
```js
const label = "total";
console.log("label: " + typeof label);
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "label: string", "message": "Print exactly: label: string", "required": true }
]
```

---

## Step 2: Inspect three values

### Instructions
Add a constant named amount with the value 42 and a constant named paid with the value false. Print the same label: type line for each of them, so the output becomes three lines in the order label, amount, paid.

### Hints
1. Each new line follows the pattern you already built: fixed text, then the result of typeof.
2. Do not type number or boolean by hand; let typeof produce them.

### Starter State / Code
```js
const label = "total";
console.log("label: " + typeof label);
```

### Solution State / Code
```js
const label = "total";
const amount = 42;
const paid = false;
console.log("label: " + typeof label);
console.log("amount: " + typeof amount);
console.log("paid: " + typeof paid);
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "label: string\namount: number\npaid: boolean", "message": "Output must be exactly three lines: label: string, amount: number, paid: boolean", "required": true }
]
```

---

## Step 3: Inspect a missing value

### Instructions
Add a variable named note declared with let but left without a value. Print a fourth line for it in the same form. Its type is undefined, which shows what an unassigned variable holds.

### Hints
1. const requires a value at declaration time, so a variable that should stay empty needs let.
2. typeof an unassigned variable gives the text "undefined"; nothing needs to be typed by hand.

### Starter State / Code
```js
const label = "total";
const amount = 42;
const paid = false;
console.log("label: " + typeof label);
console.log("amount: " + typeof amount);
console.log("paid: " + typeof paid);
```

### Solution State / Code
```js
const label = "total";
const amount = 42;
const paid = false;
let note;
console.log("label: " + typeof label);
console.log("amount: " + typeof amount);
console.log("paid: " + typeof paid);
console.log("note: " + typeof note);
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "label: string\namount: number\npaid: boolean\nnote: undefined", "message": "Add the fourth line: note: undefined", "required": true }
]
```

---

## Step 4: Convert and inspect the result

### Instructions
Add a constant named text with the value "42". Print three more lines: text: string using typeof, then converted: number using typeof Number(text), and finally value: 42 using Number(text) on its own. The last line proves the text now behaves as a number.

### Hints
1. Number(text) returns the numeric version of the text, and typeof inspects whatever expression follows it.
2. Leave typeof off the final line so the number itself is printed.

### Starter State / Code
```js
const label = "total";
const amount = 42;
const paid = false;
let note;
console.log("label: " + typeof label);
console.log("amount: " + typeof amount);
console.log("paid: " + typeof paid);
console.log("note: " + typeof note);
```

### Solution State / Code
```js
const label = "total";
const amount = 42;
const paid = false;
let note;
console.log("label: " + typeof label);
console.log("amount: " + typeof amount);
console.log("paid: " + typeof paid);
console.log("note: " + typeof note);
const text = "42";
console.log("text: " + typeof text);
console.log("converted: " + typeof Number(text));
console.log("value: " + Number(text));
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "label: string\namount: number\npaid: boolean\nnote: undefined\ntext: string\nconverted: number\nvalue: 42", "message": "Output must end with: text: string, converted: number, value: 42", "required": true },
  { "type": "code-contains", "value": "Number(", "message": "Convert the text with Number() in the final step" }
]
```
