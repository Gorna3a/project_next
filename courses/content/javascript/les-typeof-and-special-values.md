---
id: "les-typeof-and-special-values"
type: "theory"
title: "typeof and Special Values"
moduleId: "mod-03-data-types-and-conversion"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
estimatedMinutes: 12
tags: ["javascript","typeof","special-values"]
---

# Concept Overview

A value in front of you does not announce its type. The `typeof` operator solves that: it examines a value and returns the type as a lowercase string. This lesson also introduces three values that confuse almost every beginner: `NaN`, `Infinity`, and the difference between `null` and `undefined`.

## Key Principles & Frameworks

`typeof` takes one value and answers with a string: `"string"`, `"number"`, `"boolean"`, `"undefined"`, `"bigint"`, or `"symbol"`. For `null` it answers `"object"`, which is a historical bug that browsers kept for compatibility. Test for null by comparing directly against it instead of trusting `typeof`.

`NaN` means "not a number". It is the result of a numeric operation that failed, like `0 / 0`, and it has a strange property: it is not equal to anything, not even to itself. To test for it, use `Number.isNaN(value)`. `Infinity` is simpler: dividing a nonzero number by zero gives `Infinity`, a real number value rather than an error. Meanwhile, `undefined` means "not assigned yet" and `null` means "deliberately empty".

```js
console.log(typeof "pixel");       // "string"
console.log(typeof 42);            // "number"
console.log(typeof true);          // "boolean"
console.log(typeof undefined);     // "undefined"
console.log(typeof null);          // "object" (the historical bug)
console.log(typeof 42n);           // "bigint"

console.log(0 / 0);                // NaN
console.log(1 / 0);                // Infinity
console.log(typeof NaN);           // "number"
console.log(NaN === NaN);          // false
console.log(Number.isNaN(0 / 0));  // true
```

The last line is the safe way to ask "is this value `NaN`?". A direct comparison, shown on the line before it, always answers `false`.

## Common Pitfalls & Anti-Patterns
- **`typeof null` is `"object"`**: This legacy result is wrong but cannot be fixed without breaking old websites. Compare against `null` directly when you need to check for it.
- **`NaN` never equals itself**: Since `NaN === NaN` is false, a comparison check never finds it. Always test with `Number.isNaN(value)`.
- **Assuming division by zero is an error**: `1 / 0` gives `Infinity`, a valid number, and `0 / 0` gives `NaN`. Neither throws. Guard against them when input can be unusual.
- **Using `NaN` as a placeholder for "empty"**: `NaN` spreads through arithmetic; one `NaN` turns every later calculation into `NaN`. Use `null` when a value is missing on purpose.

## Quick Summary
- `typeof` returns the type of a value as a lowercase string.
- `typeof null` is `"object"`, a historical quirk; check for null by comparing directly.
- `NaN` means a failed number result and never equals anything; test it with `Number.isNaN`. `Infinity` is a real number value.
- `undefined` means "not assigned yet"; `null` means "deliberately empty".
