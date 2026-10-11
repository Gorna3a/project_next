---
id: "les-hoisting"
type: "theory"
title: "Hoisting and the Temporal Dead Zone"
moduleId: "mod-02-variables-and-scope"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 12
tags: ["javascript","hoisting","errors"]
---

# Concept Overview

JavaScript reads declarations before it runs your code, a behavior called hoisting. A `var` declaration is hoisted and starts out as `undefined`, so using it early gives `undefined` instead of an error. Variables declared with `let` and `const` are also hoisted, but they stay in the temporal dead zone until their declaration line runs, and touching them there throws a `ReferenceError`.

## Key Principles & Frameworks

The practical rule is simple: declare every variable at the top of its scope before you use it. Then hoisting never matters in your code, and you never meet the temporal dead zone by accident. When you do see `undefined` where a value should be, or a `ReferenceError` naming a variable you declared later, you are looking at a hoisting problem.

```js
console.log(a);
var a = 1;
```

The snippet above prints `undefined`, not 1 and not an error. The declaration `var a` was hoisted, but the assignment stayed on line 2, so at line 1 the variable exists with no value yet. Replace `var` with `let` and the same program throws `ReferenceError: Cannot access 'a' before initialization`.

## Common Pitfalls & Anti-Patterns
- **Using a variable before declaration**: With `let` or `const` this throws a `ReferenceError`. Declare first, use after.
- **Relying on `var` hoisting**: Code that reads a variable before its line is hard to follow. Move declarations to the top of the scope.
- **Confusing `undefined` with undeclared**: `undefined` means the variable exists but has no value yet. A truly unknown name throws `ReferenceError`.

## Quick Summary
- `var` used early gives `undefined`; `let` and `const` used early throw `ReferenceError`.
- The temporal dead zone is the region before a `let` or `const` declaration runs.
- Declare variables at the top of their scope to avoid both problems.
