---
id: "les-callbacks-and-timers"
type: "theory"
title: "Callbacks and Timers"
moduleId: "mod-10-asynchronous-javascript"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","async","callbacks","timers"]
---

# Concept Overview

A callback is a function you pass to another function so it can be called later. Timers are the simplest way to schedule a callback. `setTimeout` runs a callback once after a delay, and `setInterval` runs it repeatedly until you stop it.

## Key Principles & Frameworks

`setTimeout` returns a timer ID that you can pass to `clearTimeout`.

```js
function greet(name) {
  console.log("Hello, " + name);
}

const timerId = setTimeout(greet, 1000, "Sam");
clearTimeout(timerId);
```

The delay is a minimum wait, not an exact schedule. If the call stack is busy, the callback runs later than requested.

`setInterval` repeats until you clear it.

```js
let ticks = 0;

const intervalId = setInterval(() => {
  ticks += 1;
  console.log("tick " + ticks);

  if (ticks === 3) {
    clearInterval(intervalId);
  }
}, 1000);
```

Callbacks often receive the result of an asynchronous operation. When steps depend on each other, nesting callbacks quickly becomes hard to read.

```js
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      console.log(details);
    });
  });
});
```

This is called callback hell. Each step is indented further, errors are easy to miss, and reusing or testing one step in isolation is difficult. Promises and `async`/`await` solve the coordination problem, but callbacks are still common in event handlers, timers, and older APIs.

A `try`/`catch` around the call that schedules a callback does not catch errors thrown later inside the callback.

```js
try {
  setTimeout(() => {
    throw new Error("boom");
  }, 0);
} catch (error) {
  console.log("caught");
}
```

The `catch` does not run. The callback executes after the `try` block has finished, so its error is uncaught. Async code needs its own error handling.

## Common Pitfalls & Anti-Patterns
- **Forgetting to clear an interval**: A repeating timer keeps running and can leak work. Store the ID and call `clearInterval`.
- **Assuming the delay is exact**: Timers are minimum delays. Busy code can push them later.
- **Nesting callbacks deeply**: Callback hell is hard to read and handle errors in. Use promises or `async`/`await` for sequences.
- **Trying to catch callback errors with an outer `try`/`catch`**: The callback runs later. Put error handling inside the callback or use promise rejection.
- **Expecting callback order from timers with the same delay**: Do not rely on subtle timing differences. Schedule explicit sequencing instead.

## Quick Summary
- A callback is a function passed to be called later.
- `setTimeout` schedules one callback; `setInterval` repeats until cleared.
- Timer delays are minimums, not guarantees.
- Nested callbacks create callback hell.
- Errors inside callbacks are not caught by an outer `try`/`catch`.
