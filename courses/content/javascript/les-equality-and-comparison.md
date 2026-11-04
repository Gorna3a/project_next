---
id: "les-equality-and-comparison"
type: "theory"
title: "Equality and Comparison Operators"
moduleId: "mod-04-operators-and-comparison"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","operators","equality"]
---

# Concept Overview

Comparison operators test the relationship between two values and return a boolean. JavaScript offers two equality operators: `==`, which coerces types before comparing, and `===`, which compares both type and value. `Object.is` is a third tool with stricter rules for special values. The ordering operators `<`, `>`, `<=`, and `>=` compare numbers and strings.

## Key Principles & Frameworks

Use `===` and `!==` in almost all code. They return `true` only when both the type and the value match, with no conversion.

```js
console.log(5 === 5);        // true
console.log(5 === "5");      // false
console.log(5 !== "5");      // true
```

The loose equality operator `==` converts operands to a common type first. This produces surprising results, such as `0 == false` being `true` and `"" == 0` being `true`. These conversions make bugs hard to find, which is why `===` is preferred.

```js
console.log(5 == "5");       // true
console.log(0 == false);     // true
console.log("" == 0);        // true
```

`Object.is` behaves like `===` except for two cases: it considers `NaN` equal to `NaN`, and it distinguishes `+0` from `-0`.

```js
console.log(Object.is(NaN, NaN));   // true
console.log(NaN === NaN);           // false
console.log(Object.is(0, -0));      // false
console.log(0 === -0);              // true
```

Ordering operators compare numbers directly. When used on strings, they compare character by character using Unicode code points, which is not the same as numeric order.

```js
console.log(10 > 2);          // true
console.log("10" < "2");      // true, because "1" comes before "2"
```

Chained comparisons such as `1 < 2 < 3` do not check a range. JavaScript evaluates them left to right: `(1 < 2)` becomes `true`, which becomes `1`, and `1 < 3` is `true`. Even `3 < 2 < 1` evaluates to `true`. To test a range, combine two comparisons with `&&`.

```js
console.log(1 < 2 && 2 < 3);   // true
```

## Common Pitfalls & Anti-Patterns
- **Using `==` by habit**: Loose equality hides type mismatches. Prefer `===` unless you have a specific reason for coercion.
- **Chained comparisons**: `a < b < c` never means a range. Write `a < b && b < c`.
- **String ordering**: `"10" < "2"` is `true` because strings compare character by character. Convert to numbers first.
- **Forgetting `Object.is` for NaN**: `NaN === NaN` is `false`. Use `Object.is(value, NaN)` or `Number.isNaN(value)` to detect NaN.

## Quick Summary
- Prefer `===` and `!==`; they compare type and value with no coercion.
- `==` coerces types and produces surprising results.
- `Object.is` treats `NaN` as equal to itself and distinguishes `+0` from `-0`.
- Chained comparisons evaluate left to right and do not test ranges.
