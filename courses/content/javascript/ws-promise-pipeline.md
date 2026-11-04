---
id: "ws-promise-pipeline"
type: "workshop"
title: "Promise Pipeline"
moduleId: "mod-10-asynchronous-javascript"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 50
tags: ["async","promises","timers","pipeline"]
---

# Workshop Overview

You will build a small data pipeline. Each step returns a promise, and the final function awaits the steps in order. The timers use a zero delay so the tests stay fast and deterministic.

---

## Step 1: Fetch a user

### Instructions
Write a function named `fetchUser` that returns a promise resolving to `{ id, name: "Sam" }`. Use `setTimeout` with a `0` delay inside a `new Promise`. Reject with `new Error("User not found")` when `id` is `0`.

### Hints
1. Return `new Promise((resolve, reject) => { ... })`.
2. Call `setTimeout` inside the executor and settle the promise there.

### Starter State / Code
```js
// Define fetchUser below
```

### Solution State / Code
```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
        return;
      }
      resolve({ id, name: "Sam" });
    }, 0);
  });
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "fetchUser(1)", "expected": { "id": 1, "name": "Sam" }, "message": "fetchUser(1) should resolve to the user", "required": true },
  { "type": "function-throws", "call": "fetchUser(0)", "errorType": "Error", "message": "fetchUser(0) should reject with an Error", "required": true }
]
```

---

## Step 2: Fetch orders

### Instructions
Write a function named `fetchOrders` that takes a user and returns a promise resolving to two orders with `userId` equal to the user's `id`. The orders should be `{ id: 101, userId, total: 40 }` and `{ id: 102, userId, total: 60 }`. Use a zero-delay timer.

### Hints
1. Reuse the promise-plus-`setTimeout` shape from Step 1.
2. Build each order object with `userId: user.id`.

### Starter State / Code
```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
        return;
      }
      resolve({ id, name: "Sam" });
    }, 0);
  });
}
```

### Solution State / Code
```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
        return;
      }
      resolve({ id, name: "Sam" });
    }, 0);
  });
}

function fetchOrders(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, userId: user.id, total: 40 },
        { id: 102, userId: user.id, total: 60 },
      ]);
    }, 0);
  });
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "fetchOrders({ id: 1 })", "expected": [{ "id": 101, "userId": 1, "total": 40 }, { "id": 102, "userId": 1, "total": 60 }], "message": "fetchOrders should resolve to two orders for the user", "required": true },
  { "type": "function-returns", "call": "fetchOrders({ id: 7 })", "expected": [{ "id": 101, "userId": 7, "total": 40 }, { "id": 102, "userId": 7, "total": 60 }], "message": "fetchOrders should use the user's id", "required": true }
]
```

---

## Step 3: Summarize orders

### Instructions
Write a function named `summarizeOrders` that takes an array of orders and returns a promise resolving to `{ count, total }`. Use `reduce` to add the order totals.

### Hints
1. `orders.length` gives the count.
2. `orders.reduce((sum, order) => sum + order.total, 0)` gives the total.
3. Wrap the result in `Promise.resolve(...)`.

### Starter State / Code
```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
        return;
      }
      resolve({ id, name: "Sam" });
    }, 0);
  });
}

function fetchOrders(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, userId: user.id, total: 40 },
        { id: 102, userId: user.id, total: 60 },
      ]);
    }, 0);
  });
}
```

### Solution State / Code
```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
        return;
      }
      resolve({ id, name: "Sam" });
    }, 0);
  });
}

function fetchOrders(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, userId: user.id, total: 40 },
        { id: 102, userId: user.id, total: 60 },
      ]);
    }, 0);
  });
}

function summarizeOrders(orders) {
  return Promise.resolve({
    count: orders.length,
    total: orders.reduce((sum, order) => sum + order.total, 0),
  });
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "summarizeOrders([{ total: 40 }, { total: 60 }])", "expected": { "count": 2, "total": 100 }, "message": "summarizeOrders should count orders and sum totals", "required": true },
  { "type": "function-returns", "call": "summarizeOrders([])", "expected": { "count": 0, "total": 0 }, "message": "An empty order list should produce a zero summary", "required": true }
]
```

---

## Step 4: Assemble the pipeline

### Instructions
Write an `async` function named `loadOrderSummary` that takes a user ID and performs three awaited steps: fetch the user, fetch that user's orders, and summarize the orders. Return `{ customer: user.name, count, total }`.

### Hints
1. `await fetchUser(id)` gives you the user.
2. Pass the user to `fetchOrders`, then pass the orders to `summarizeOrders`.
3. Return a new object with `customer`, `count`, and `total`.

### Starter State / Code
```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
        return;
      }
      resolve({ id, name: "Sam" });
    }, 0);
  });
}

function fetchOrders(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, userId: user.id, total: 40 },
        { id: 102, userId: user.id, total: 60 },
      ]);
    }, 0);
  });
}

function summarizeOrders(orders) {
  return Promise.resolve({
    count: orders.length,
    total: orders.reduce((sum, order) => sum + order.total, 0),
  });
}
```

### Solution State / Code
```js
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
        return;
      }
      resolve({ id, name: "Sam" });
    }, 0);
  });
}

function fetchOrders(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, userId: user.id, total: 40 },
        { id: 102, userId: user.id, total: 60 },
      ]);
    }, 0);
  });
}

function summarizeOrders(orders) {
  return Promise.resolve({
    count: orders.length,
    total: orders.reduce((sum, order) => sum + order.total, 0),
  });
}

async function loadOrderSummary(id) {
  const user = await fetchUser(id);
  const orders = await fetchOrders(user);
  const summary = await summarizeOrders(orders);

  return {
    customer: user.name,
    count: summary.count,
    total: summary.total,
  };
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "loadOrderSummary(1)", "expected": { "customer": "Sam", "count": 2, "total": 100 }, "message": "The pipeline should combine the user and order summary", "required": true },
  { "type": "function-throws", "call": "loadOrderSummary(0)", "errorType": "Error", "message": "The pipeline should propagate a user lookup failure", "required": true },
  { "type": "code-contains", "value": "await", "message": "Use await to sequence the steps" }
]
```
