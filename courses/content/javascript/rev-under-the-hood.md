---
id: "rev-under-the-hood"
type: "review"
title: "Under the Hood Quick Reference"
moduleId: "mod-12-under-the-hood"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-memory-lifecycle-and-gc","les-memory-leaks","les-performance-debugging","ws-leak-hunt","lab-optimize-the-loop"]
tags: ["javascript","memory","performance","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Allocation | Creating a value in memory | Objects, arrays, functions |
| Reachability | A reference chain from a root to a value | Determines collection |
| Root | Global object, call stack, closures, DOM | Starting point for reachability |
| Garbage collection | Automatic reclamation of unreachable values | Frees memory |
| `WeakMap` | Object-keyed map with weak keys | Caches that should not retain keys |
| `WeakSet` | Set of objects with weak references | Tracking without retention |
| Leak | Unneeded memory that stays reachable | Timers, listeners, caches |
| Heap snapshot | DevTools capture of live objects | Compare growth over time |
| `performance.now()` | High-resolution timestamp in milliseconds | Measure elapsed time |
| `console.time` | Named timer in the console | Quick measurements |
| Performance panel | DevTools runtime trace | Find scripting/render hotspots |
| Hot path | Code that dominates measured time | Optimization target |
| Premature optimization | Optimizing before measuring | Wastes effort and readability |

## Key Concepts Comparison
- **Expected retention vs leak**: A closure intentionally keeping private state is not a leak; a growing cache or forgotten listener is.
- **Strong vs weak reference**: Strong references keep values alive; `WeakMap` and `WeakSet` do not prevent key collection.
- **Memory vs performance**: A leak grows over time; a slow function may use little memory but still block the main thread.
- **Measure vs guess**: Timing and profiles identify the real hotspot; intuition often points at the wrong line.
- **JavaScript vs rendering**: A slow interaction can come from scripting, layout, paint, or network, not only your functions.

## Critical Syntax / Templates
```js
// Reachability
let user = { name: "Sam" };
let alias = user;
user = null;
console.log(alias.name); // Sam

// Cleanup function
function attachHandler(element, handler) {
  element.addEventListener("click", handler);
  return () => element.removeEventListener("click", handler);
}

// Weak cache
const cache = new WeakMap();

function remember(key, value) {
  cache.set(key, value);
}

// Timing
const start = performance.now();
// ... work ...
const elapsed = performance.now() - start;
console.log(elapsed);

console.time("work");
// ... work ...
console.timeEnd("work");

// Set-based membership
const seen = new Set(items);
if (seen.has(value)) {
  // ...
}
```
