---
id: "les-iterators-and-generators"
type: "theory"
title: "Iterators and Generators"
moduleId: "mod-11-modules-iterators-dom"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","iterators","generators","for-of"]
---

# Concept Overview

An iterable is an object that can produce a sequence of values. Arrays, strings, maps, and sets are iterable, which is why `for...of` works with them. An iterator is the object that tracks the current position and returns the next value. Generators are functions that create iterators with `yield`.

## Key Principles & Frameworks

The iterator protocol requires a `next()` method that returns `{ value, done }`.

```js
const values = [10, 20];

const iterator = values[Symbol.iterator]();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

This prints `{ value: 10, done: false }`, `{ value: 20, done: false }`, and `{ value: undefined, done: true }`.

`for...of` calls `Symbol.iterator` and then `next()` until `done` is true.

```js
for (const value of [10, 20]) {
  console.log(value);
}
```

You can make a custom iterable by implementing `[Symbol.iterator]`.

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

console.log([...range]);
```

This prints `[1, 2, 3]`.

A generator function uses `function*` and `yield`. Calling it returns a generator object without running the body.

```js
function* ids() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = ids();
console.log(generator.next());
console.log(generator.next());
```

The first `next()` starts the body and runs until the first `yield`. The second resumes after that `yield`. Generators are lazy: work happens only when you ask for the next value.

Generators can represent sequences that would be expensive to build in full.

```js
function* naturalNumbers() {
  let number = 1;
  while (true) {
    yield number;
    number += 1;
  }
}

const numbers = naturalNumbers();
console.log(numbers.next().value);
console.log(numbers.next().value);
```

Use `yield*` to delegate to another iterable.

```js
function* combined() {
  yield 0;
  yield* [1, 2];
  yield 3;
}

console.log([...combined()]);
```

This prints `[0, 1, 2, 3]`.

## Common Pitfalls & Anti-Patterns
- **Expecting a generator to run immediately**: Nothing runs until `next()` is called.
- **Reusing an exhausted generator**: Once `done` is true, further calls keep returning done. Create a new generator instead.
- **Forgetting that spread consumes the iterator**: Spreading a generator exhausts it.
- **Using `yield` inside a regular function**: Only generator functions can use `yield`.
- **Building huge arrays unnecessarily**: A generator can produce values one at a time without storing them all.

## Quick Summary
- Iterables implement `Symbol.iterator`; iterators implement `next()`.
- `for...of` consumes iterables.
- Generators use `function*` and `yield`, and are lazy.
- `yield*` delegates to another iterable.
- An exhausted generator cannot be restarted.
