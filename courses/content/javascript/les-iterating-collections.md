---
id: "les-iterating-collections"
type: "theory"
title: "Iterating Collections: for...of and for...in"
moduleId: "mod-07-arrays-objects-json"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","iteration","for-of","for-in"]
---

# Concept Overview

JavaScript has two common iteration statements for collections. `for...of` visits the values of an iterable such as an array, string, `Map`, or `Set`. `for...in` visits the keys of an object. Choosing the right loop prevents a large class of bugs.

## Key Principles & Frameworks

`for...of` gives you each value directly. It works with any iterable.

```js
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);
}
```

This prints each fruit. With a string, it visits each character. With a `Map`, it visits `[key, value]` pairs. With a `Set`, it visits each unique value.

`for...in` gives you each key as a string. It is designed for objects.

```js
const user = { name: "Sam", age: 20 };
for (const key in user) {
  console.log(key + ": " + user[key]);
}
```

This prints `name: Sam` and then `age: 20`.

Plain objects are not iterable with `for...of`. To iterate over an object's values, convert it first with `Object.keys`, `Object.values`, or `Object.entries`.

```js
const user = { name: "Sam", age: 20 };
for (const [key, value] of Object.entries(user)) {
  console.log(key + ": " + value);
}
```

Use `for...of` for arrays and other iterables. Use `for...in` for object keys, or prefer `Object.entries` with `for...of` when you need both keys and values.

## Common Pitfalls & Anti-Patterns
- **Using `for...in` on arrays**: It visits indexes as strings and may include inherited properties. Use `for...of` for array values.
- **Using `for...of` on a plain object**: Objects are not iterable by default, so the loop throws. Use `Object.keys` or `Object.entries`.
- **Inherited properties in `for...in`**: The loop can include inherited enumerable properties. Guard with `Object.hasOwn` when that matters.
- **Changing the collection while iterating**: Adding or removing items during iteration can skip or repeat elements. Collect changes and apply them after the loop.

## Quick Summary
- `for...of` visits values of arrays, strings, `Map`, and `Set`.
- `for...in` visits keys of an object.
- Do not use `for...in` on arrays.
- Use `Object.entries` with `for...of` to get keys and values together.
