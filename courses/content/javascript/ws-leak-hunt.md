---
id: "ws-leak-hunt"
type: "workshop"
title: "Leak Hunt"
moduleId: "mod-12-under-the-hood"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 45
tags: ["memory-leaks","cleanup","weakmap","workshop"]
---

# Workshop Overview

You will fix four small pieces of code that keep resources alive longer than necessary. Each fix introduces a cleanup path or a weak reference so the garbage collector can do its job.

---

## Step 1: Stop the ticker

### Instructions
`startTicker` creates an interval but never stops it. Return a function that calls `clearInterval` with the interval ID.

### Hints
1. Store the return value of `setInterval` in a variable.
2. Return a function that closes over that ID.

### Starter State / Code
```js
function startTicker(onTick) {
  let count = 0;

  setInterval(() => {
    count += 1;
    onTick(count);
  }, 1000);
}
```

### Solution State / Code
```js
function startTicker(onTick) {
  let count = 0;

  const id = setInterval(() => {
    count += 1;
    onTick(count);
  }, 1000);

  return function stop() {
    clearInterval(id);
  };
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "(() => { const stop = startTicker(() => {}); stop(); return typeof stop; })()", "expected": "function", "message": "startTicker should return a stop function", "required": true },
  { "type": "code-contains", "value": "clearInterval", "message": "The stop function should call clearInterval" }
]
```

---

## Step 2: Remove the listener

### Instructions
`attachHandler` adds a click listener but provides no way to remove it. Return a cleanup function that calls `removeEventListener` with the same element, event type, and handler.

### Hints
1. The same function reference must be passed to both methods.
2. Return a named or anonymous function that closes over the arguments.

### Starter State / Code
```js
function startTicker(onTick) {
  let count = 0;

  const id = setInterval(() => {
    count += 1;
    onTick(count);
  }, 1000);

  return function stop() {
    clearInterval(id);
  };
}

function attachHandler(element, handler) {
  element.addEventListener("click", handler);
}
```

### Solution State / Code
```js
function startTicker(onTick) {
  let count = 0;

  const id = setInterval(() => {
    count += 1;
    onTick(count);
  }, 1000);

  return function stop() {
    clearInterval(id);
  };
}

function attachHandler(element, handler) {
  element.addEventListener("click", handler);

  return function cleanup() {
    element.removeEventListener("click", handler);
  };
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "(() => { let listeners = 0; const target = { addEventListener() { listeners += 1; }, removeEventListener() { listeners -= 1; } }; const cleanup = attachHandler(target, () => {}); const before = listeners; cleanup(); return [before, listeners]; })()", "expected": [1, 0], "message": "attachHandler should add one listener and remove it during cleanup", "weight": 2, "required": true },
  { "type": "code-contains", "value": "removeEventListener", "message": "Cleanup should call removeEventListener" }
]
```

---

## Step 3: Use a weak cache

### Instructions
The current cache uses a `Map`, so every object key stays alive forever. Replace it with a `WeakMap` and expose `remember`, `recall`, and `has` helpers.

### Hints
1. Change `new Map()` to `new WeakMap()`.
2. `WeakMap` supports `set`, `get`, and `has` with object keys.
3. Keep the helper names unchanged.

### Starter State / Code
```js
const cache = new Map();

function remember(key, value) {
  cache.set(key, value);
}

function recall(key) {
  return cache.get(key);
}

function has(key) {
  return cache.has(key);
}
```

### Solution State / Code
```js
const cache = new WeakMap();

function remember(key, value) {
  cache.set(key, value);
}

function recall(key) {
  return cache.get(key);
}

function has(key) {
  return cache.has(key);
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "(() => { const key = {}; remember(key, 'value'); return [recall(key), has(key)]; })()", "expected": ["value", true], "message": "The weak cache should remember and recall object-keyed values", "required": true },
  { "type": "code-contains", "value": "WeakMap", "message": "Use a WeakMap for object keys" },
  { "type": "code-not-contains", "value": "new Map(", "message": "Do not use a Map for this cache" }
]
```

---

## Step 4: Clean up the widget

### Instructions
`createWidget` starts an interval and adds a listener, but never cleans either up. Return a `destroy` function that clears the interval and removes the listener.

### Hints
1. Store the interval ID and the listener function in variables.
2. `destroy` should call `clearInterval` and `removeEventListener`.
3. Keep the same listener reference for both add and remove.

### Starter State / Code
```js
function createWidget(button, onTick) {
  setInterval(onTick, 1000);

  const handler = () => {
    console.log("clicked");
  };

  button.addEventListener("click", handler);
}
```

### Solution State / Code
```js
function createWidget(button, onTick) {
  const id = setInterval(onTick, 1000);

  const handler = () => {
    console.log("clicked");
  };

  button.addEventListener("click", handler);

  return function destroy() {
    clearInterval(id);
    button.removeEventListener("click", handler);
  };
}
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "(() => { let listeners = 0; const button = { addEventListener() { listeners += 1; }, removeEventListener() { listeners -= 1; } }; const destroy = createWidget(button, () => {}); destroy(); return listeners; })()", "expected": 0, "message": "destroy should remove the widget listener", "weight": 2, "required": true },
  { "type": "code-contains", "value": "clearInterval", "message": "destroy should clear the interval" },
  { "type": "code-contains", "value": "removeEventListener", "message": "destroy should remove the listener" }
]
```
