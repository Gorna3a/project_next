---
id: "les-promises"
type: "theory"
title: "Promises"
moduleId: "mod-10-asynchronous-javascript"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 25
tags: ["javascript","async","promises"]
---

# Concept Overview

A `Promise` represents a value that will exist later. It starts pending, then becomes fulfilled with a value or rejected with a reason. Promises let you chain asynchronous steps and handle errors in one place instead of nesting callbacks.

## Key Principles & Frameworks

Create a promise with the `Promise` constructor. The executor function receives `resolve` and `reject`.

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Finished");
  } else {
    reject(new Error("Failed"));
  }
});

promise.then((value) => console.log(value));
```

`resolve` fulfills the promise; `reject` rejects it. Settling a promise more than once has no effect after the first call.

Use `.then` to handle fulfillment, `.catch` to handle rejection, and `.finally` for cleanup.

```js
Promise.resolve(2)
  .then((value) => value * 3)
  .then((value) => console.log(value))
  .catch((error) => console.log(error.message))
  .finally(() => console.log("done"));
```

This prints `6` and `done`. Each `.then` returns a new promise, so values pass down the chain. Returning a promise from a `.then` flattens it: the next step waits for that promise.

```js
Promise.resolve(1)
  .then((value) => Promise.resolve(value + 1))
  .then((value) => console.log(value));
```

This prints `2`. If you forget to return the inner promise, the chain does not wait for it.

Promises provide combinators for multiple operations:
- `Promise.all([...])` waits for every promise and fulfills with an array of values. It rejects as soon as one input rejects.
- `Promise.allSettled([...])` waits for every promise and fulfills with objects describing each result, whether fulfilled or rejected.
- `Promise.race([...])` settles with the first input that fulfills or rejects.

```js
Promise.all([Promise.resolve(1), Promise.resolve(2)]).then((values) => {
  console.log(values);
});

Promise.allSettled([
  Promise.resolve("ok"),
  Promise.reject(new Error("bad")),
]).then((results) => {
  console.log(results.map((result) => result.status));
});
```

This prints `[1, 2]` and `["fulfilled", "rejected"]`.

## Common Pitfalls & Anti-Patterns
- **Not returning a promise in `.then`**: The chain will not wait for it. Return the promise or use `async`/`await`.
- **Nesting `.then` calls**: Nesting recreates callback hell. Return values and keep the chain flat.
- **Forgetting `.catch`**: A rejected promise with no handler becomes an unhandled rejection.
- **Creating a promise for an existing promise**: `new Promise((resolve) => resolve(existing))` is unnecessary. Return `existing`.
- **Assuming `Promise.all` waits for all rejections**: It rejects on the first rejection. Use `Promise.allSettled` when every result matters.

## Quick Summary
- A promise is pending, then fulfilled or rejected.
- `.then` handles values, `.catch` handles errors, `.finally` runs cleanup.
- Chains pass values and flatten returned promises.
- `Promise.all` waits for all or rejects on the first failure.
- `Promise.allSettled` reports every result; `Promise.race` uses the first settled result.
