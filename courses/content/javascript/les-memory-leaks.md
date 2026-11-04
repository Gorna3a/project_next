---
id: "les-memory-leaks"
type: "theory"
title: "Memory Leaks"
moduleId: "mod-12-under-the-hood"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","memory-leaks","devtools"]
---

# Concept Overview

A memory leak is memory that is no longer needed but remains reachable. The garbage collector cannot reclaim it because something still references it. In long-running pages, leaks grow over time and eventually slow down or crash the tab.

## Key Principles & Frameworks

Common leak patterns:
- **Timers that never stop**: `setInterval` keeps running and retains its callback scope.
- **Listeners that are never removed**: A listener keeps its function, closure, and often a DOM element reachable.
- **Detached DOM nodes**: A removed element still referenced from JavaScript cannot be collected.
- **Unbounded caches**: Arrays, maps, or objects that grow forever.
- **Subscriptions**: Event streams or observers that are never cancelled.
- **Accidental globals**: A missing declaration attaches a value to the global object.

A timer leak looks like this:

```js
function startPolling(fetchData) {
  setInterval(() => {
    fetchData();
  }, 1000);
}
```

Every call creates an interval with no way to stop it. Return a cleanup function that calls `clearInterval`.

```js
function startPolling(fetchData) {
  const id = setInterval(() => {
    fetchData();
  }, 1000);

  return function stop() {
    clearInterval(id);
  };
}
```

A listener leak has the same shape. Keep a named handler so the same reference can be removed.

```js
function attachHandler(element, handler) {
  element.addEventListener("click", handler);

  return function cleanup() {
    element.removeEventListener("click", handler);
  };
}
```

For object-keyed caches, use a `WeakMap` when the cache should not keep keys alive.

```js
const cache = new WeakMap();

function remember(key, value) {
  cache.set(key, value);
}
```

Unbounded arrays and maps still need a size limit or an eviction policy. A weak collection only helps when the keys are objects and you do not want to retain them.

## Finding Leaks in the Browser

The DevTools **Memory** panel provides heap snapshots, allocation instrumentation on a timeline, and allocation sampling. A practical process:
1. Reproduce the interaction that leaks.
2. Take a heap snapshot.
3. Repeat the interaction several times.
4. Take another snapshot and compare retained size.
5. Look for growing object counts, detached DOM nodes, and listeners.

The **Performance monitor** can show JavaScript heap size and DOM node count over time. A steadily rising line after repeated interactions is a signal to investigate.

## Common Pitfalls & Anti-Patterns
- **Clearing a timer without keeping the ID**: `clearInterval` needs the value returned by `setInterval`.
- **Removing an anonymous listener**: You cannot remove a listener without the same function reference.
- **Caching with `Map` and object keys**: The map keeps every key alive. Use `WeakMap` when appropriate.
- **Assuming a removed DOM node is freed**: JavaScript references and listeners can keep it alive.
- **Growing an array forever**: Add a limit or remove old entries when the data is no longer needed.

## Quick Summary
- Leaks are unreachable-in-principle values that remain reachable in practice.
- Timers, listeners, detached nodes, and unbounded caches are common culprits.
- Return cleanup functions and use weak collections for object-keyed metadata.
- Use heap snapshots and the performance monitor to find growth.
- Cleanup must use the same timer ID or listener reference.
