---
id: "les-primitive-types"
type: "theory"
title: "The Seven Primitive Types"
moduleId: "mod-03-data-types-and-conversion"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
estimatedMinutes: 15
tags: ["javascript","data-types","primitives"]
---

# Concept Overview

Every value in JavaScript has a type. A type describes what kind of value it is and what you can do with it. Values split into two groups: primitives and objects. This lesson covers the seven primitive types: string, number, boolean, null, undefined, bigint, and symbol. Everything that is not a primitive is an object, which later modules cover in depth.

Strings hold text. Numbers hold numeric values. Booleans hold `true` or `false`. The remaining four are special cases: `undefined` means no value has been assigned yet, `null` means empty on purpose, bigint holds integers larger than the number type can store safely, and symbol creates unique identifiers.

## Key Principles & Frameworks

Text lives in strings, written inside double quotes or single quotes. Numbers cover both whole values like `1995` and decimals like `0.5`; JavaScript does not separate them into different types. Booleans have exactly two possible values: `true` and `false`.

The four special primitives each solve one problem. `undefined` and `null` represent missing values, bigint represents very large integers, and symbol represents unique labels. You declare them like any other value.

```js
let title = "JavaScript";
let year = 1995;
let isFun = true;
let empty = null;
let missing;
let huge = 9007199254740993n;
let id = Symbol("id");

console.log(title, year, isFun, empty, missing, huge, id);
```

The final line prints all seven values separated by spaces: the string, the number, the boolean, `null`, `undefined`, the large BigInt, and the unique Symbol.

## Common Pitfalls & Anti-Patterns
- **Floating-point precision**: Decimals are stored as binary fractions, so `0.1 + 0.2` prints `0.30000000000000004`, not `0.3`. Do not rely on exact decimal results in money or measurement code; round when needed.
- **Mixing bigint and number**: A BigInt written with the `n` suffix, like `10n`, cannot be combined directly with a regular number. `1 + 1n` throws a TypeError until you convert one side.
- **Treating null and undefined as interchangeable**: Both mean "no value", but they are not the same. `undefined` means "not assigned yet" and `null` means "deliberately empty". The next lesson shows how to tell them apart.

## Quick Summary
- JavaScript has seven primitive types: string, number, boolean, null, undefined, bigint, and symbol.
- `"JavaScript"` is a string, `1995` is a number, and `true` is a boolean.
- `0.1 + 0.2` is not exactly `0.3` because decimals are stored in binary.
