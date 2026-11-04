---
id: "les-default-and-rest-parameters"
type: "theory"
title: "Default Parameters, Rest, and Spread"
moduleId: "mod-06-functions"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","functions","parameters"]
---

# Concept Overview

Functions become more flexible when they can handle missing arguments or a variable number of arguments. Default parameters supply a value when an argument is `undefined`. Rest parameters collect extra arguments into a list. Spread syntax does the opposite in a call: it expands a list into separate arguments.

## Key Principles & Frameworks

A default parameter is written with `=` in the parameter list. It is used only when the matching argument is `undefined`.

```js
function greet(name = "friend") {
  return "Hello, " + name + "!";
}

console.log(greet());
console.log(greet("Sam"));
```

This prints `Hello, friend!` and then `Hello, Sam!`. Passing `null` does not trigger the default, because `null` is not `undefined`.

A rest parameter is written with three dots before the name. It collects all remaining arguments into a list.

```js
function countAll(...values) {
  return values.length;
}

console.log(countAll("a", "b", "c"));
```

This prints `3`. A rest parameter must be the last parameter in the list.

Spread syntax uses the same three dots in a function call. It expands a list into separate arguments.

```js
function largest(...numbers) {
  return Math.max(...numbers);
}

console.log(largest(3, 7, 2));
```

This prints `7`. The rest parameter gathers the arguments, and the spread passes them on to `Math.max`.

You can combine normal parameters with defaults and a rest parameter.

```js
function label(prefix, ...items) {
  return prefix + ": " + items.length;
}

console.log(label("Items", "a", "b"));
```

This prints `Items: 2`.

## Common Pitfalls & Anti-Patterns
- **Expecting `null` to trigger a default**: Defaults apply only to `undefined`. `greet(null)` produces `"Hello, null!"`.
- **Putting rest anywhere but last**: `function f(...rest, last)` is a syntax error. The rest parameter must come last.
- **Confusing rest and spread**: Rest collects values in a function definition; spread expands values in a call. The syntax looks the same, but the roles are opposite.
- **Assuming defaults are recalculated once**: A default expression runs on every call that needs it, not just once.

## Quick Summary
- Default parameters fill in missing `undefined` arguments.
- Rest parameters collect extra arguments into a list and must come last.
- Spread expands a list into separate arguments in a call.
- `null` does not trigger a default value.
