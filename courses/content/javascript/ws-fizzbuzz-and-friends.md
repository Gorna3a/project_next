---
id: "ws-fizzbuzz-and-friends"
type: "workshop"
title: "FizzBuzz and Friends"
moduleId: "mod-05-control-flow"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 35
tags: ["loops","conditionals","fizzbuzz"]
---

# Workshop Overview

You will practice control flow by building three small scripts: a counter, the classic FizzBuzz exercise, and a running sum with an odd-number filter. Each step extends the previous one.

---

## Step 1: Count with a for loop

### Instructions
Use a `for` loop to print each number from 1 through 5 on its own line.

### Hints
1. Start the counter at 1 and keep looping while it is at most 5.
2. Put `console.log` inside the loop so it prints once per iteration.

### Starter State / Code
```js
// Print numbers 1 through 5
```

### Solution State / Code
```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "1\n2\n3\n4\n5", "message": "Print the numbers 1 through 5, one per line", "required": true }
]
```

---

## Step 2: FizzBuzz

### Instructions
Change the loop to run from 1 through 15. Print `Fizz` for multiples of 3, `Buzz` for multiples of 5, `FizzBuzz` for multiples of both, and the number itself otherwise.

### Hints
1. Check the combined case first, before the single cases.
2. Use the remainder operator `%` to test whether a number is a multiple.

### Starter State / Code
```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

### Solution State / Code
```js
for (let i = 1; i <= 15; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", "message": "FizzBuzz output must run from 1 through 15 with the correct replacements", "required": true }
]
```

---

## Step 3: Add a running sum

### Instructions
After the FizzBuzz loop, add a `while` loop that adds the numbers 1 through 10 and prints exactly one line: `sum: 55`.

### Hints
1. Keep a `total` variable starting at 0 and a counter starting at 1.
2. Increase the counter every iteration so the loop eventually stops.

### Starter State / Code
```js
for (let i = 1; i <= 15; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
```

### Solution State / Code
```js
for (let i = 1; i <= 15; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}

let total = 0;
let n = 1;
while (n <= 10) {
  total += n;
  n++;
}
console.log("sum: " + total);
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "sum: 55", "message": "Add the line: sum: 55", "required": true },
  { "type": "code-contains", "value": "while", "message": "Use a while loop for the running sum" }
]
```

---

## Step 4: Skip even numbers with continue

### Instructions
Add a `for` loop from 1 through 9. Use `continue` to skip even numbers, and print only the odd numbers, one per line.

### Hints
1. Test whether the current number is even with `i % 2 === 0`.
2. Put `continue` inside that `if` block, before `console.log`.

### Starter State / Code
```js
for (let i = 1; i <= 15; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}

let total = 0;
let n = 1;
while (n <= 10) {
  total += n;
  n++;
}
console.log("sum: " + total);
```

### Solution State / Code
```js
for (let i = 1; i <= 15; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}

let total = 0;
let n = 1;
while (n <= 10) {
  total += n;
  n++;
}
console.log("sum: " + total);

for (let i = 1; i <= 9; i++) {
  if (i % 2 === 0) {
    continue;
  }
  console.log(i);
}
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "1\n3\n5\n7\n9", "message": "Print only the odd numbers from 1 through 9", "required": true },
  { "type": "code-contains", "value": "continue", "message": "Use continue to skip even numbers" }
]
```
