---
id: "les-other-operators"
type: "theory"
title: "Other Operators: Unary, String, Bitwise, and BigInt"
moduleId: "mod-04-operators-and-comparison"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","operators","unary","bitwise"]
---

# Concept Overview

Beyond arithmetic and logic, JavaScript has several smaller operator families. Unary operators act on a single value: plus, minus, logical NOT, typeof, void, delete, and increment/decrement. The string operator `+` concatenates text. The comma operator evaluates several expressions and keeps the last result. Bitwise operators treat numbers as 32-bit integers. BigInt operators work on BigInt values but do not mix with regular numbers.

## Key Principles & Frameworks

Unary plus converts a value to a number, which is a compact way to coerce types. Unary minus negates. `typeof` reports the type as a string. `void` evaluates its operand and returns `undefined`. `delete` removes a property from an object.

```js
console.log(+"42");        // 42
console.log(-"42");        // -42
console.log(typeof 42);     // "number"
console.log(void 0);       // undefined
const user = { name: "Sam" };
delete user.name;
console.log(user);         // {}
```

The `+` operator concatenates strings when at least one operand is a string. If both operands are numbers, it adds them. Mixing types can produce surprising results because the number is converted to text.

```js
console.log("Hello, " + "Sam");   // "Hello, Sam"
console.log("Score: " + 10);      // "Score: 10"
console.log(1 + 2 + "3");         // "33"
```

The comma operator evaluates each operand from left to right and returns the last one. It is rarely needed and most often appears in compact `for` loops.

```js
let a = (1, 2, 3);
console.log(a);   // 3
```

Bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`) convert operands to 32-bit signed integers, apply the operation, and convert back. They are useful for flags and low-level work but truncate large numbers.

```js
console.log(5 & 3);    // 1
console.log(5 | 3);    // 7
console.log(5 ^ 3);    // 6
console.log(1 << 2);    // 4
```

BigInt values use the same arithmetic operators as numbers, but a BigInt cannot be combined directly with a number. Convert one side first, or keep the types separate. Comparison operators, however, work between BigInt and number.

```js
console.log(10n + 20n);     // 30n
console.log(10n < 20);      // true
// 10n + 20;  // TypeError: Cannot mix BigInt and other types
```

## Common Pitfalls & Anti-Patterns
- **Unary `+` on unexpected values**: `+true` is `1` and `+null` is `0`. Coercion is implicit; prefer `Number()` when intent matters.
- **`delete` on array elements**: `delete arr[0]` leaves a hole instead of removing the element. Use `splice` for arrays.
- **Bitwise truncation**: Bitwise operators convert to 32-bit integers, so large numbers lose precision silently.
- **Mixing BigInt and number**: Arithmetic between a BigInt and a number throws. Keep calculations within one type.

## Quick Summary
- Unary `+` coerces to number; `typeof` reports type; `void` returns `undefined`; `delete` removes object properties.
- `+` concatenates when a string is involved.
- The comma operator returns its last operand.
- Bitwise operators work on 32-bit integers; BigInt arithmetic does not mix with regular numbers.
