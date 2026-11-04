---
id: "les-memory-lifecycle-and-gc"
type: "theory"
title: "Memory Lifecycle and Garbage Collection"
moduleId: "mod-12-under-the-hood"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","memory","garbage-collection"]
---

# Concept Overview

JavaScript allocates memory when you create objects, arrays, functions, and DOM nodes. It releases memory automatically through garbage collection. The collector reclaims values that are no longer reachable from the program's roots. You do not free memory manually, but you do control which references remain.

## Key Principles & Frameworks

Memory moves through three stages:
1. **Allocate**: create a value, such as an object literal or an array.
2. **Use**: read or update it through references.
3. **Release**: remove the last reachable reference so the collector can reclaim it.

```js
let user = { name: "Sam" };
let alias = user;

user = null;
console.log(alias.name);
```

This prints `Sam`. Setting `user` to `null` does not free the object because `alias` still references it.

```js
alias = null;
```

Now the object is unreachable from these variables, so the garbage collector may reclaim it.

Reachability starts from roots such as the global object, the current call stack, closures, and the DOM. An object stays alive while any chain of references connects it to a root.

Closures can keep values alive even after the outer function returns.

```js
function makeReader() {
  const data = ["large", "array", "of", "values"];

  return function read() {
    return data[0];
  };
}

const read = makeReader();
console.log(read());
```

The returned function closes over `data`, so the array stays reachable as long as `read` exists. This is useful for private state, but it also means a closure can retain more data than intended.

Weak collections help with object-keyed metadata. `WeakMap` and `WeakSet` do not prevent their keys from being garbage collected.

```js
const metadata = new WeakMap();

const key = {};
metadata.set(key, { visited: true });

console.log(metadata.get(key));
```

When no other reference to `key` exists, the entry can be collected. A regular `Map` would keep the key alive.

Garbage collection timing is not guaranteed. The engine decides when to run it based on its own heuristics. You cannot force a collection from normal application code.

## Common Pitfalls & Anti-Patterns
- **Assuming garbage collection is immediate**: Setting a variable to `null` makes a value eligible, but collection may happen later.
- **Keeping accidental global references**: A forgotten global variable keeps its value reachable for the life of the page.
- **Retaining large objects in closures**: Capture only the fields the function needs, not an entire large object.
- **Using `Map` for object-keyed caches that should not retain keys**: Prefer `WeakMap` when the cache should not keep objects alive.
- **Forgetting DOM references**: A JavaScript reference to a removed DOM node can keep the node and its subtree in memory.

## Quick Summary
- JavaScript allocates memory automatically and reclaims it through garbage collection.
- Reachability from roots determines whether a value can be collected.
- Closures and globals can keep values alive longer than expected.
- WeakMap and WeakSet do not prevent key collection.
- Collection timing is not deterministic.
