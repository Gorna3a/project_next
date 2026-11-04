---
id: "rev-arrays-objects-json"
type: "review"
title: "Arrays, Objects & JSON Quick Reference"
moduleId: "mod-07-arrays-objects-json"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-arrays","les-array-methods","les-objects","les-iterating-collections","les-map-and-set","les-json","ws-student-records","lab-inventory-report"]
tags: ["javascript","arrays","objects","json","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Array literal | `[1, 2, 3]` | Ordered list of values |
| Index | Zero-based position | `items[0]` |
| `push` / `pop` | Add or remove at the end; mutates | Stacks and queues |
| `slice(start, end)` | Copy a range; end excluded | Non-mutating copy |
| `splice(start, count, ...items)` | Remove or insert; mutates | In-place edits |
| Destructuring | `const [a, b] = list` | Extract values |
| `map` | Transform each item into a new array | `list.map(fn)` |
| `filter` | Keep items that pass a test | `list.filter(fn)` |
| `reduce` | Combine items into one value | `list.reduce(fn, initial)` |
| `find` | First matching item or `undefined` | Search |
| `some` / `every` | Test any or all items | Validation |
| `sort` | Reorder in place; lexicographic by default | `sort((a, b) => a - b)` |
| Object literal | `{ key: value }` | Named record |
| Spread | `{ ...obj }` / `[...arr]` | Shallow copy or merge |
| Object destructuring | `const { name } = user` | Extract fields |
| `Object.keys/values/entries` | Arrays of keys, values, or pairs | Iterate objects |
| `for...of` | Visits values of an iterable | Arrays, strings, Map, Set |
| `for...in` | Visits keys of an object | Object properties |
| `Map` | Key-value store with any key type | Lookup tables |
| `Set` | Collection of unique values | Deduplication |
| `JSON.stringify` | JavaScript value to JSON text | Serialize |
| `JSON.parse` | JSON text to JavaScript value | Deserialize |

## Key Concepts Comparison
- **`slice` vs `splice`**: `slice` copies a range and leaves the array unchanged; `splice` removes or inserts items in place.
- **`map` vs `filter`**: `map` transforms every item and keeps the same length; `filter` keeps only items that pass a test.
- **`for...of` vs `for...in`**: `for...of` visits values of iterables; `for...in` visits object keys as strings.
- **Object vs `Map`**: Object keys are strings or symbols; `Map` keys can be any type.
- **Typed arrays**: `Int8Array`, `Float64Array`, and friends are fixed-length numeric arrays backed by raw binary data. They are useful for performance-sensitive work such as graphics and audio, but they are not covered in depth here.

## Critical Syntax / Templates
```js
// Arrays
const scores = [90, 75, 82];
const [first, second] = scores;
const copy = [...scores];

// Array methods
const names = users.map((user) => user.name);
const passing = scores.filter((score) => score >= 60);
const total = scores.reduce((sum, score) => sum + score, 0);
const top = [...scores].sort((a, b) => b - a)[0];

// Objects
const user = { name: "Sam", age: 20 };
const updated = { ...user, age: 21 };
const { name } = user;
const keys = Object.keys(user);

// Iteration
for (const score of scores) { /* ... */ }
for (const [key, value] of Object.entries(user)) { /* ... */ }

// Map and Set
const lookup = new Map();
lookup.set("Ana", 92);
const unique = new Set([1, 2, 2, 3]);

// JSON
const text = JSON.stringify(user);
const parsed = JSON.parse(text);
```
