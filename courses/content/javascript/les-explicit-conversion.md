---
id: "les-explicit-conversion"
type: "theory"
title: "Explicit Conversion"
moduleId: "mod-03-data-types-and-conversion"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
estimatedMinutes: 15
tags: ["javascript","conversion","numbers"]
---

# Concept Overview

Sometimes you hold a value of one type and need another: text from a form that should behave like a number, or a number that should be printed as text. Converting a value on purpose is called explicit conversion. JavaScript provides a tool for each direction: `Number()`, `String()`, `Boolean()`, `parseInt`, and `parseFloat`.

## Key Principles & Frameworks

`Number()` converts strictly. If the whole trimmed string looks like a number, you get that number; otherwise you get `NaN`. `parseInt` and `parseFloat` are more forgiving: they read from the start of the string and stop at the first character that cannot be part of a number. `parseInt` produces a whole number, and `parseFloat` keeps the decimal part.

`String()` converts any value to text, and `Boolean()` converts any value to `true` or `false` following the truthy and falsy rules you will explore in the next lesson.

```js
console.log(Number("42"));          // 42
console.log(Number("42px"));        // NaN
console.log(Number(""));            // 0
console.log(parseInt("42px", 10));  // 42
console.log(parseFloat("3.14kg"));  // 3.14
console.log(String(2023));          // "2023"
console.log(Boolean(0));            // false
```

Notice the difference between the first two lines and the fourth one: `Number()` rejects `"42px"` completely, while `parseInt` extracts the `42` and ignores the rest. Choose based on your goal: reject bad input, or salvage the number at the start of it.

## Common Pitfalls & Anti-Patterns
- **`Number("")` is `0`**: An empty string converts to zero, not `NaN`. Empty input is usually a data problem, so check for it before converting.
- **Forgetting the radix in `parseInt`**: Always pass `10` as the second argument. It documents that you expect base-10 digits and avoids legacy surprises with strings like `"08"`.
- **Trusting `parseInt` and `parseFloat` too much**: They stop at the first invalid character, so `"42px"` quietly becomes `42`. Use `Number()` when the entire string must be numeric.
- **Ignoring the result of a conversion**: A failed conversion returns `NaN`, which then spreads through your arithmetic. Check the converted value before using it.

## Quick Summary
- Use `Number()` for a strict conversion and `parseInt` / `parseFloat` for forgiving parsing.
- `String()` turns values into text and `Boolean()` turns them into `true` or `false`.
- Empty strings convert to `0`, and malformed strings convert to `NaN`; check your input when it comes from a user.
