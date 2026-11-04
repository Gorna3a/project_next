---
id: "rev-asynchronous-javascript"
type: "review"
title: "Asynchronous JavaScript Quick Reference"
moduleId: "mod-10-asynchronous-javascript"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
covers: ["les-event-loop","les-callbacks-and-timers","les-promises","les-async-await","les-fetch-and-apis","ws-promise-pipeline","lab-retry-with-async-await"]
tags: ["javascript","async","promises","fetch","reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Call stack | Tracks the function currently running | Synchronous execution |
| Task queue | Holds timer and I/O callbacks | Runs one task at a time |
| Microtask queue | Holds promise callbacks | Drains before the next task |
| Event loop | Moves queued work onto the stack | Coordinates async execution |
| Callback | Function passed to run later | Timers, event handlers |
| `setTimeout(fn, ms)` | Queues `fn` after at least `ms` | One-time delay |
| `setInterval(fn, ms)` | Repeats `fn` until cleared | Polling, animations |
| `Promise` | Pending, fulfilled, or rejected result | Async values |
| `.then` / `.catch` / `.finally` | Handle value, error, cleanup | Promise chains |
| `Promise.all` | Waits for all, rejects on first rejection | Independent parallel work |
| `Promise.allSettled` | Waits for all, reports every status | Best-effort batch work |
| `Promise.race` | Settles with the first result | Timeouts, racing sources |
| `async` | Function always returns a promise | Async functions |
| `await` | Pauses the async function for a promise | Sequential steps |
| `fetch(url)` | Returns a promise for a `Response` | HTTP requests |
| `response.ok` | True for status 200–299 | HTTP error checks |

## Key Concepts Comparison
- **Task vs microtask**: Promise callbacks are microtasks and run before the next timer task.
- **Callback vs promise**: Callbacks are functions invoked later; promises represent a future value and support chaining and centralized errors.
- **Sequential vs parallel**: `await` one by one is sequential. `Promise.all` starts independent work together.
- **Network error vs HTTP error**: `fetch` rejects on network failure but resolves on 404/500. Check `response.ok`.

## Critical Syntax / Templates
```js
// Event loop order
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("end"); // start, end, promise, timeout

// Promise chain
Promise.resolve(2)
  .then((value) => value * 3)
  .then((value) => console.log(value))
  .catch((error) => console.log(error.message));

// async/await with error handling
async function loadData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error("Request failed: " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

// Parallel work
const [user, orders] = await Promise.all([
  fetchUser(1),
  fetchOrders(1),
]);

// Sequential loop instead of forEach
for (const id of ids) {
  await loadItem(id);
}

// Retry loop
async function retry(task, attempts) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
```
