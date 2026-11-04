---
id: "ws-student-records"
type: "workshop"
title: "Process Student Records"
moduleId: "mod-07-arrays-objects-json"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 45
tags: ["arrays","objects","array-methods"]
---

# Workshop Overview

You will build four functions that process an array of student objects: collect names, filter passing students, compute an average, and find the top student. Each step uses a different array method.

---

## Step 1: Collect the names

### Instructions
Use `map` to write a function named `getNames` that takes an array of student objects and returns an array of their names. Print the result.

### Hints
1. `map` calls your callback once per item and builds a new array from the returned values.
2. The callback should return the `name` property of each student.

### Starter State / Code
```js
const students = [
  { name: "Ana", grade: 92 },
  { name: "Ben", grade: 58 },
  { name: "Cara", grade: 75 },
  { name: "Dan", grade: 61 },
];

// Define getNames below
```

### Solution State / Code
```js
const students = [
  { name: "Ana", grade: 92 },
  { name: "Ben", grade: 58 },
  { name: "Cara", grade: 75 },
  { name: "Dan", grade: 61 },
];

function getNames(list) {
  return list.map((student) => student.name);
}

console.log(getNames(students));
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "getNames(students)", "expected": ["Ana", "Ben", "Cara", "Dan"], "message": "getNames should return the four student names", "required": true },
  { "type": "code-contains", "value": "map", "message": "Use map to collect the names" }
]
```

---

## Step 2: Filter passing students

### Instructions
Write a function named `getPassing` that returns the names of students whose grade is at least 60. Use `filter` before `map`.

### Hints
1. `filter` keeps only the items whose callback returns `true`.
2. Chain `.map` after `.filter` to turn the remaining student objects into names.

### Starter State / Code
```js
const students = [
  { name: "Ana", grade: 92 },
  { name: "Ben", grade: 58 },
  { name: "Cara", grade: 75 },
  { name: "Dan", grade: 61 },
];

function getNames(list) {
  return list.map((student) => student.name);
}

console.log(getNames(students));
```

### Solution State / Code
```js
const students = [
  { name: "Ana", grade: 92 },
  { name: "Ben", grade: 58 },
  { name: "Cara", grade: 75 },
  { name: "Dan", grade: 61 },
];

function getNames(list) {
  return list.map((student) => student.name);
}

function getPassing(list) {
  return list
    .filter((student) => student.grade >= 60)
    .map((student) => student.name);
}

console.log(getNames(students));
console.log(getPassing(students));
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "getPassing(students)", "expected": ["Ana", "Cara", "Dan"], "message": "getPassing should return Ana, Cara, and Dan", "required": true },
  { "type": "code-contains", "value": "filter", "message": "Use filter to keep passing students" }
]
```

---

## Step 3: Compute the average grade

### Instructions
Write a function named `averageGrade` that returns the average of all grades. Use `reduce` with an initial value of 0, then divide by the number of students.

### Hints
1. `reduce` combines all grades into a total.
2. The second argument to `reduce` is the starting accumulator value.

### Starter State / Code
```js
const students = [
  { name: "Ana", grade: 92 },
  { name: "Ben", grade: 58 },
  { name: "Cara", grade: 75 },
  { name: "Dan", grade: 61 },
];

function getNames(list) {
  return list.map((student) => student.name);
}

function getPassing(list) {
  return list
    .filter((student) => student.grade >= 60)
    .map((student) => student.name);
}

console.log(getNames(students));
console.log(getPassing(students));
```

### Solution State / Code
```js
const students = [
  { name: "Ana", grade: 92 },
  { name: "Ben", grade: 58 },
  { name: "Cara", grade: 75 },
  { name: "Dan", grade: 61 },
];

function getNames(list) {
  return list.map((student) => student.name);
}

function getPassing(list) {
  return list
    .filter((student) => student.grade >= 60)
    .map((student) => student.name);
}

function averageGrade(list) {
  const total = list.reduce((sum, student) => sum + student.grade, 0);
  return total / list.length;
}

console.log(getNames(students));
console.log(getPassing(students));
console.log(averageGrade(students));
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "averageGrade(students)", "expected": 71.5, "message": "averageGrade should return 71.5", "required": true },
  { "type": "code-contains", "value": "reduce", "message": "Use reduce to compute the total grade" }
]
```

---

## Step 4: Find the top student

### Instructions
Write a function named `topStudent` that returns the name of the student with the highest grade. Copy the array with spread before sorting, and use a numeric comparator.

### Hints
1. `sort` mutates the array, so copy it first with `[...list]`.
2. A comparator `(a, b) => b.grade - a.grade` orders students from highest to lowest grade.

### Starter State / Code
```js
const students = [
  { name: "Ana", grade: 92 },
  { name: "Ben", grade: 58 },
  { name: "Cara", grade: 75 },
  { name: "Dan", grade: 61 },
];

function getNames(list) {
  return list.map((student) => student.name);
}

function getPassing(list) {
  return list
    .filter((student) => student.grade >= 60)
    .map((student) => student.name);
}

function averageGrade(list) {
  const total = list.reduce((sum, student) => sum + student.grade, 0);
  return total / list.length;
}

console.log(getNames(students));
console.log(getPassing(students));
console.log(averageGrade(students));
```

### Solution State / Code
```js
const students = [
  { name: "Ana", grade: 92 },
  { name: "Ben", grade: 58 },
  { name: "Cara", grade: 75 },
  { name: "Dan", grade: 61 },
];

function getNames(list) {
  return list.map((student) => student.name);
}

function getPassing(list) {
  return list
    .filter((student) => student.grade >= 60)
    .map((student) => student.name);
}

function averageGrade(list) {
  const total = list.reduce((sum, student) => sum + student.grade, 0);
  return total / list.length;
}

function topStudent(list) {
  const sorted = [...list].sort((a, b) => b.grade - a.grade);
  return sorted[0].name;
}

console.log(getNames(students));
console.log(getPassing(students));
console.log(averageGrade(students));
console.log(topStudent(students));
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "topStudent(students)", "expected": "Ana", "message": "topStudent should return Ana", "required": true },
  { "type": "code-contains", "value": "sort", "message": "Use sort with a comparator to rank the students" }
]
```
