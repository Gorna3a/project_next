---
id: "les-logical-and-conditional-operators"
type: "theory"
title: "Logical and Conditional Operators"
moduleId: "mod-04-operators-and-comparison"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","operators","logical"]
---

# Concept Overview

Logical operators combine boolean conditions and often return one of their operands rather than a strict boolean. `&&` (AND), `||` (OR), and `!` (NOT) short-circuit: they stop evaluating as soon as the result is known. The nullish coalescing operator `??` provides a fallback only for `null` or `undefined`. The ternary operator `? :` chooses between two values based on a condition.

## Key Principles & Frameworks

`&&` returns its first falsy operand, or the last operand if all are truthy. `||` returns its first truthy operand, or the last operand if all are falsy. Both short-circuit: `&&` skips the right side when the left is falsy, and `||` skips the right side when the left is truthy.

```js
console.log(true && "yes");      // "yes"
console.log(false && "yes");     // false
console.log("" || "default");    // "default"
console.log("hi" || "default"); // "hi"
```

`!` negates truthiness and always returns a real boolean. Applying it twice (`!!value`) converts any value to its boolean equivalent.

```js
console.log(!true);      // false
console.log(!0);         // true
console.log(!!"text");   // true
```

`??` returns the right operand only when the left is `null` or `undefined`. Unlike `||`, it does not treat `0`, `""`, or `false` as missing.

```js
console.log(0 || 10);     // 10
console.log(0 ?? 10);     // 0
console.log(null ?? 10);  // 10
```

The ternary operator has the form `condition ? valueIfTrue : valueIfFalse`. It is the only operator that takes three operands and is useful for choosing between two values inline.

```js
let age = 20;
let status = age >= 18 ? "adult" : "minor";
console.log(status);   // "adult"
```

Precedence matters: `!` binds tighter than `&&`, which binds tighter than `||`, which binds tighter than `??`. Use parentheses when mixing them to make intent clear.

## Common Pitfalls & Anti-Patterns
- **`||` vs `??` for defaults**: `count || 10` replaces `0` with `10`, which is usually wrong for numbers. Use `count ?? 10` when only `null` or `undefined` should trigger the fallback.
- **Assuming logical operators return booleans**: `a && b` may return `b`, not `true`. If you need a boolean, wrap in `!!` or use a comparison.
- **Nested ternaries**: Stacking `? :` inside `? :` is hard to read. Prefer `if`/`else` for multi-way decisions.
- **Mixing `&&` and `||` without parentheses**: Precedence surprises cause bugs. Parenthesize mixed expressions.

## Quick Summary
- `&&` returns the first falsy value or the last value; `||` returns the first truthy value or the last value.
- `!` always returns a boolean; `!!` converts to boolean.
- `??` falls back only for `null` or `undefined`, so `0` and `""` survive.
- Use the ternary operator for simple two-way choices and `if`/`else` for complex ones.
