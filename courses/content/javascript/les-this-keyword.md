---
id: "les-this-keyword"
type: "theory"
title: "The this Keyword"
moduleId: "mod-09-closures-this-classes"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","this","functions"]
---

# Concept Overview

`this` is a special value inside a function, and it is not chosen where the function is written. For regular functions, `this` is chosen by how the function is called. Arrow functions are the exception: they do not have their own `this` and use the surrounding one.

## Key Principles & Frameworks

When you call a function as an object method, `this` is the object before the dot.

```js
const user = {
  name: "Sam",
  greet() {
    return "Hi, " + this.name;
  },
};

console.log(user.greet());
```

This prints `Hi, Sam` because the call site is `user.greet()`.

When you call the same function as a standalone function, the link to `user` is gone.

```js
const user = {
  name: "Sam",
  greet() {
    return "Hi, " + this.name;
  },
};

const greet = user.greet;
console.log(greet());
```

In strict mode, `this` is `undefined`, so reading `this.name` throws a `TypeError`. In non-strict mode, `this` is the global object and the result is usually `Hi, undefined`. Neither is what you want. Call `user.greet()` or bind the function first.

Arrow functions do not receive a `this` from their call site. They use `this` from the surrounding scope.

```js
const counter = {
  count: 0,
  start() {
    const tick = () => {
      this.count += 1;
    };

    tick();
    tick();
    return this.count;
  },
};

console.log(counter.start());
```

This prints `2`. The arrow function inside `start` uses the `this` of `start`, which is `counter`. An arrow function used directly as an object method, however, does not get the object.

```js
const broken = {
  name: "Sam",
  greet: () => "Hi, " + this.name,
};
```

Here `this` comes from the surrounding scope, not from `broken`, so it does not refer to the object.

## Common Pitfalls & Anti-Patterns
- **Losing `this` when passing a method**: `const fn = user.greet; fn();` drops the object. Use `user.greet()`, `bind`, or an arrow wrapper.
- **Using an arrow function as an object method**: The arrow captures the outer `this`, not the object. Use a method shorthand for methods that need `this`.
- **Nested regular functions**: A regular function inside a method has its own `this`, which is not the outer object. Use an arrow function or bind it.
- **Relying on the global object**: In strict mode and modules, standalone calls have `this` as `undefined`. Do not depend on non-strict fallback behavior.

## Quick Summary
- For regular functions, `this` is determined by the call site.
- `object.method()` sets `this` to `object`.
- Standalone calls set `this` to `undefined` in strict mode and the global object otherwise.
- Arrow functions inherit `this` from the surrounding scope.
- Passing a method as a value loses its object unless you bind it or wrap the call.
