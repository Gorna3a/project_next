---
id: "les-map-and-set"
type: "theory"
title: "Map, Set, WeakMap, and WeakSet"
moduleId: "mod-07-arrays-objects-json"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","map","set","collections"]
---

# Concept Overview

`Map` and `Set` are built-in collections with different strengths from objects and arrays. A `Map` stores key-value pairs and allows keys of any type. A `Set` stores unique values. `WeakMap` and `WeakSet` hold object keys weakly so they can be garbage-collected when nothing else references them.

## Key Principles & Frameworks

A `Map` uses `set` to add entries, `get` to read them, `has` to check for a key, and `delete` to remove one. The `size` property returns the number of entries.

```js
const scores = new Map();
scores.set("Ana", 92);
scores.set("Ben", 58);

console.log(scores.get("Ana"));   // 92
console.log(scores.has("Ben"));   // true
console.log(scores.size);         // 2
scores.delete("Ben");
console.log(scores.size);         // 1
```

Unlike plain objects, `Map` keys keep their original type. An object key in a `Map` stays an object; object keys in a plain object are converted to strings.

```js
const user = { name: "Sam" };
const roles = new Map();
roles.set(user, "admin");
console.log(roles.get(user));   // "admin"
```

A `Set` stores each value only once. Use `add`, `has`, `delete`, and `size`.

```js
const tags = new Set();
tags.add("javascript");
tags.add("web");
tags.add("javascript");

console.log(tags.size);          // 2
console.log(tags.has("web"));    // true
```

`Map` and `Set` are iterable. A `Map` yields `[key, value]` pairs, and a `Set` yields values.

```js
const scores = new Map([["Ana", 92], ["Ben", 58]]);
for (const [name, score] of scores) {
  console.log(name, score);
}
```

`WeakMap` and `WeakSet` hold object keys or values weakly. They are not iterable, have no `size`, and their contents can disappear when the object is no longer used elsewhere. They are useful for attaching private data to objects without preventing garbage collection.

## Common Pitfalls & Anti-Patterns
- **Assuming plain objects keep key types**: Object keys are converted to strings. Use a `Map` when keys must keep their type.
- **Expecting `Set` to deduplicate objects by content**: `Set` compares objects by reference, so two equal-looking objects are still two entries.
- **Trying to iterate a `WeakMap`**: `WeakMap` and `WeakSet` are not iterable and have no `size`.
- **Using `Map` for simple string keys**: A plain object is often simpler. Reach for `Map` when key types vary or insertion order matters.

## Quick Summary
- `Map` stores key-value pairs with keys of any type and supports `set`, `get`, `has`, `delete`, and `size`.
- `Set` stores unique values and supports `add`, `has`, `delete`, and `size`.
- `Map` and `Set` are iterable; plain object keys are strings.
- `WeakMap` and `WeakSet` hold objects weakly and are not iterable.
