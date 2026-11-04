---
id: "les-arrays"
type: "theory"
title: "Arrays: Lists, Indexing, and Destructuring"
moduleId: "mod-07-arrays-objects-json"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 18
tags: ["javascript","arrays","basics"]
---

# Concept Overview

An array is an ordered list of values. You create one with square brackets, read items by their index, and change the list with methods such as `push`, `pop`, `slice`, and `splice`. Arrays are the standard way to store a sequence of related values.

## Key Principles & Frameworks

Array indexes start at 0. The first item is at index 0, the second at index 1, and so on. The `length` property tells you how many items the array contains.

```js
const scores = [90, 75, 82];
console.log(scores[0]);       // 90
console.log(scores[2]);       // 82
console.log(scores.length);   // 3
```

You can replace an item by assigning to its index.

```js
const scores = [90, 75, 82];
scores[1] = 80;
console.log(scores);   // [90, 80, 82]
```

`push` adds an item to the end and `pop` removes the last item. Both change the original array.

```js
const queue = ["Ana", "Ben"];
queue.push("Cara");
console.log(queue);       // ["Ana", "Ben", "Cara"]
console.log(queue.pop()); // "Cara"
console.log(queue);       // ["Ana", "Ben"]
```

`slice` copies a range without changing the original. The start index is included and the end index is excluded.

```js
const letters = ["a", "b", "c", "d"];
console.log(letters.slice(1, 3));   // ["b", "c"]
console.log(letters);               // ["a", "b", "c", "d"]
```

`splice` changes the original array. It can remove items and optionally insert new ones.

```js
const letters = ["a", "b", "c", "d"];
letters.splice(1, 2, "x");
console.log(letters);   // ["a", "x", "d"]
```

Destructuring pulls values out of an array into named variables.

```js
const scores = [90, 75, 82];
const [first, second] = scores;
console.log(first, second);   // 90 75
```

Arrays are copied by reference. Assigning one array to another variable does not create a new list; both variables point to the same array.

```js
const original = [1, 2, 3];
const alias = original;
alias.push(4);
console.log(original);   // [1, 2, 3, 4]
```

Use spread or `slice` to make a shallow copy before changing it independently.

```js
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original);   // [1, 2, 3]
```

## Common Pitfalls & Anti-Patterns
- **Confusing `slice` and `splice`**: `slice` returns a copy and leaves the array unchanged; `splice` mutates the array.
- **Forgetting the end index is excluded**: `slice(1, 3)` returns indexes 1 and 2, not 3.
- **Reading past the end**: An out-of-range index returns `undefined` instead of throwing.
- **Copying by reference**: `const copy = original` shares the same array. Use `[...original]` or `original.slice()` for a shallow copy.

## Quick Summary
- Arrays hold ordered values and use zero-based indexes.
- `push`/`pop` and `splice` mutate; `slice` returns a copy.
- Destructuring extracts values into variables.
- Copy an array with spread or `slice` before modifying it independently.
