---
id: "les-implicit-coercion"
type: "theory"
title: "Implicit Coercion and Falsy Values"
moduleId: "mod-03-data-types-and-conversion"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
estimatedMinutes: 15
tags: ["javascript","coercion","truthy-falsy"]
---

# Concept Overview

You can already convert values on purpose with `Number()`, `String()`, and `Boolean()`. JavaScript also converts values on its own, without being asked. This automatic conversion is called implicit coercion, and it explains some of the strangest results in the language.

## Key Principles & Frameworks

The plus sign causes the most surprises. If either side of `+` is a string, JavaScript joins the two values as text. The other arithmetic operators, `-`, `*`, and `/`, always convert both sides to numbers. That single rule explains why `"5" + 1` and `"5" - 1` produce such different results.

Separately, places that expect a true-or-false condition treat every value as either truthy or falsy. Exactly eight values are falsy: `false`, `0`, `-0`, `0n`, `""` (the empty string), `null`, `undefined`, and `NaN`. Everything else is truthy, including `"0"`, `"false"`, and a string containing only a space. You can preview this with `Boolean()`.

```js
console.log("5" + 1);       // "51"  — text wins with +
console.log("5" - 1);       // 4     — - forces numbers
console.log(1 + true);      // 2     — true counts as 1
console.log(Boolean(""));   // false — empty string is falsy
console.log(Boolean("0"));  // true  — non-empty strings are truthy
console.log(Boolean(" "));  // true  — even a single space is truthy
```

The safest habit is to convert explicitly when a type matters. `Number("5") + 1` gives `6` and makes your intention visible to anyone reading the code.

## Common Pitfalls & Anti-Patterns
- **`+` joins when you expect math**: `"5" + 1` gives `"51"`, not `6`. If a value came from text input, convert it with `Number()` before adding.
- **`-`, `*`, and `/` quietly convert text to numbers**: `"5" - 1` gives `4`, which can hide data that was never really numeric. Convert explicitly so mistakes stay visible.
- **Judging truthiness by appearance**: `"0"`, `"false"`, and `" "` are all truthy because they are non-empty strings. Only `""` is falsy among strings.

## Quick Summary
- Implicit coercion is JavaScript converting types automatically; explicit conversion is clearer when a specific type matters.
- With `+`, a string on either side means concatenation; `-`, `*`, and `/` force numeric conversion.
- The eight falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Everything else is truthy.
