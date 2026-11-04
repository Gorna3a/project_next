---
id: "les-array-methods"
type: "theory"
title: "Array Methods: map, filter, reduce, and Friends"
moduleId: "mod-07-arrays-objects-json"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","arrays","methods"]
---

# Concept Overview

Array methods let you transform and inspect lists without writing manual loops. `map` transforms every item, `filter` keeps matching items, and `reduce` combines all items into one value. `find`, `some`, and `every` answer questions about a list, and `sort` reorders it.

## Key Principles & Frameworks

`map` returns a new array with the same length. Its callback receives each item and returns the replacement value.

```js
const prices = [10, 20, 30];
const withTax = prices.map((price) => price * 1.2);
console.log(withTax);   // [12, 24, 36]
```

`filter` returns a new array containing only the items for which the callback returns `true`.

```js
const scores = [45, 72, 88, 60];
const passing = scores.filter((score) => score >= 60);
console.log(passing);   // [72, 88, 60]
```

`reduce` combines the array into a single value. The callback receives an accumulator and the current item. Always pass an initial value unless you intentionally want the first item to be the starting accumulator.

```js
const scores = [10, 20, 30];
const total = scores.reduce((sum, score) => sum + score, 0);
console.log(total);   // 60
```

`find` returns the first matching item or `undefined`. `some` returns `true` if any item matches. `every` returns `true` only if all items match.

```js
const users = [{ name: "Ana" }, { name: "Ben" }];
console.log(users.find((user) => user.name === "Ben"));   // { name: "Ben" }
console.log(users.some((user) => user.name === "Cara"));  // false
console.log(users.every((user) => user.name.length > 2)); // true
```

`sort` reorders the array in place. By default it converts items to strings and compares them lexicographically, so numbers need a comparator.

```js
const numbers = [10, 2, 1];
console.log(numbers.sort());                  // [1, 10, 2]
console.log([...numbers].sort((a, b) => a - b)); // [1, 2, 10]
```

`map`, `filter`, `find`, `some`, and `every` do not mutate the original array. `sort` and `reverse` do mutate it.

## Common Pitfalls & Anti-Patterns
- **Default `sort` is lexicographic**: `[10, 2, 1].sort()` gives `[1, 10, 2]`. Pass `(a, b) => a - b` for numeric order.
- **Forgetting that `sort` and `reverse` mutate**: Copy first with `[...array]` when the original order must stay unchanged.
- **Omitting `reduce`'s initial value**: Without it, an empty array throws and the first item becomes the starting accumulator, which may not be what you want.
- **Forgetting to return from a callback**: A `map` callback without `return` produces an array of `undefined`.

## Quick Summary
- `map` transforms each item and returns a new array.
- `filter` keeps matching items; `find` returns the first match.
- `reduce` combines items into one value; pass an initial value.
- `some` and `every` test a condition across the array.
- `sort` and `reverse` mutate; the default sort is lexicographic.
