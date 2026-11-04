---
id: "les-lexical-scope-and-closures"
type: "theory"
title: "Lexical Scope and Closures"
moduleId: "mod-09-closures-this-classes"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","closures","scope"]
---

# Concept Overview

Lexical scope means a function can access variables from the place where it was defined, not where it is called. A closure is a function that keeps access to that outer scope even after the outer function has finished. Closures are how JavaScript creates private state and configurable functions.

## Key Principles & Frameworks

An inner function can read and update variables from its outer function. The outer function does not need to stay running for those variables to remain available.

```js
function makeCounter() {
  let count = 0;

  return {
    increment() {
      count += 1;
      return count;
    },
    value() {
      return count;
    },
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
console.log(counter.value());
```

This prints `2`. The `count` variable is not accessible from outside `makeCounter`, but the returned methods close over it. Each call to `makeCounter` creates a separate `count`.

Closures also let you build functions from other values.

```js
function multiplyBy(factor) {
  return function (value) {
    return value * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5));
console.log(triple(5));
```

This prints `10` and `15`. Each returned function remembers its own `factor`.

A closure captures the variable itself, not a snapshot of its value. This matters in loops.

```js
const functions = [];

for (var i = 0; i < 3; i++) {
  functions.push(function () {
    return i;
  });
}

console.log(functions.map((fn) => fn()));
```

This prints `[3, 3, 3]`. The `var` declaration creates one `i` binding for the whole function scope, so every closure reads the final value. With `let`, each iteration gets a new binding and the result is `[0, 1, 2]`.

## Common Pitfalls & Anti-Patterns
- **Using `var` in a closure loop**: All closures share one binding. Use `let` when each iteration needs its own value.
- **Assuming a closure copies a value**: It keeps a live reference. Later changes are visible to the closure.
- **Unintentionally sharing state**: Two closures created by the same function call share the same outer variables; separate calls create separate state.
- **Holding large objects alive**: A closure keeps referenced values in memory. Capture only what the function needs.

## Quick Summary
- Lexical scope is based on where a function is defined.
- A closure is a function plus the outer variables it remembers.
- Closures create private state and configurable functions.
- Closures capture live bindings, so `var` loop closures can see the final value.
- Each call to a factory function creates fresh closed-over state.
