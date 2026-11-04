---
id: "les-event-loop"
type: "theory"
title: "The Event Loop"
moduleId: "mod-10-asynchronous-javascript"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","async","event-loop"]
---

# Concept Overview

JavaScript executes code on a single call stack. Asynchronous work is queued and run later by the event loop. Timers and promise callbacks do not interrupt the current function; they wait until the stack is empty. Understanding the order of those queues explains most surprising async output.

## Key Principles & Frameworks

Synchronous code runs first, from top to bottom. When it finishes, the event loop drains the microtask queue, then takes one task from the task queue. It repeats this cycle.

```js
console.log("start");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");
```

This prints `start`, `end`, `promise`, `timeout`. The synchronous logs run first. The promise callback is a microtask, so it runs before the timer callback, which is a task. The `0` delay does not mean "immediately"; it means "queue this task as soon as possible."

Promise callbacks and `queueMicrotask` callbacks go into the microtask queue. Timer callbacks, I/O callbacks, and other events go into the task queue. After every task, all available microtasks run before the next task.

```js
console.log("A");

Promise.resolve().then(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
});

setTimeout(() => console.log("D"), 0);

console.log("E");
```

This prints `A`, `E`, `B`, `C`, `D`. The microtask queue keeps draining, including new microtasks added while it runs, before the timer task is considered.

The call stack must be empty before any queued work can run. A long synchronous loop blocks timers, promise callbacks, rendering, and user input.

## Common Pitfalls & Anti-Patterns
- **Assuming `setTimeout(fn, 0)` runs immediately**: It queues a task. Synchronous code and microtasks run first.
- **Expecting synchronous order**: Code after `setTimeout` runs before the callback.
- **Blocking the call stack**: Heavy synchronous work delays every queued task and freezes the page.
- **Confusing tasks and microtasks**: Promise callbacks are microtasks and run before the next timer task.

## Quick Summary
- JavaScript has one call stack and runs one task at a time.
- Synchronous code runs to completion before queued callbacks.
- Microtasks (promise callbacks) drain before the next task.
- `setTimeout(fn, 0)` queues a task; it is not immediate.
- A blocked call stack delays all asynchronous work.
