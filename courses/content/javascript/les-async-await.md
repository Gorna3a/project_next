---
id: "les-async-await"
type: "theory"
title: "async and await"
moduleId: "mod-10-asynchronous-javascript"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","async","await","promises"]
---

# Concept Overview

`async` and `await` let you write promise-based code in a style that looks synchronous. An `async` function always returns a promise. Inside it, `await` pauses the function until a promise settles, then continues with the fulfilled value. The pause does not block the rest of the program.

## Key Principles & Frameworks

Mark a function `async` to use `await` inside it. A returned value becomes a fulfilled promise; a thrown error becomes a rejected promise.

```js
async function getNumber() {
  return 5;
}

getNumber().then((value) => console.log(value));
```

This prints `5`. `getNumber()` returns a promise even though the body returns a plain number.

Use `try`/`catch` around `await` to handle rejections.

```js
async function loadUser() {
  try {
    const user = await Promise.resolve({ name: "Sam" });
    return user.name;
  } catch (error) {
    return "Unknown";
  }
}

loadUser().then((name) => console.log(name));
```

This prints `Sam`. If the awaited promise rejected, the `catch` block would run.

`await` makes each step wait. Independent operations should run in parallel with `Promise.all`.

```js
async function loadSequential() {
  const user = await Promise.resolve("user");
  const orders = await Promise.resolve("orders");
  return [user, orders];
}

async function loadParallel() {
  const [user, orders] = await Promise.all([
    Promise.resolve("user"),
    Promise.resolve("orders"),
  ]);
  return [user, orders];
}
```

Both return the same values. The parallel version starts both promises before waiting, so it finishes sooner when the operations are independent.

`forEach` does not wait for an async callback. It ignores the promises the callback returns.

```js
const ids = [1, 2, 3];

ids.forEach(async (id) => {
  await Promise.resolve(id);
  console.log(id);
});

console.log("done");
```

`done` can print before the callbacks finish. Use a `for...of` loop for sequential work, or `Promise.all(ids.map(...))` for parallel work.

```js
for (const id of ids) {
  await Promise.resolve(id);
}
```

## Common Pitfalls & Anti-Patterns
- **Forgetting `await`**: The variable receives a promise instead of the resolved value.
- **Using `await` inside `forEach`**: `forEach` does not wait. Use `for...of` or `Promise.all` with `map`.
- **Waiting sequentially for independent work**: `await` one by one is slower than `Promise.all` when the operations do not depend on each other.
- **Leaving a rejected promise unhandled**: Use `try`/`catch` inside the async function or attach `.catch` to the returned promise.
- **Thinking `await` blocks the whole program**: It pauses only the async function. Other tasks can still run.

## Quick Summary
- `async` functions always return a promise.
- `await` pauses the async function until a promise settles.
- Use `try`/`catch` to handle rejected awaits.
- Use `Promise.all` for independent work that can run in parallel.
- `forEach` ignores async callbacks; use `for...of` or `Promise.all` with `map`.
