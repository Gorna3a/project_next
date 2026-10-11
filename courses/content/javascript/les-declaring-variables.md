---
id: "les-declaring-variables"
type: "theory"
title: "Declaring Variables with var, let, and const"
moduleId: "mod-02-variables-and-scope"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 15
tags: ["javascript","variables","declaration"]
---

# Concept Overview

A variable is a named container for a value. You create one by declaring it with a keyword, then you assign a value with a single equals sign. JavaScript has three declaration keywords: `var`, `let`, and `const`. They differ in where the variable is visible and whether it can be reassigned.

## Key Principles & Frameworks

Use `let` when the value will change later, and `const` when it will not. Once a `const` variable is assigned, assigning it again throws a `TypeError`. The keyword `var` is the oldest form and behaves differently with scope, which the next lessons explain. Modern code uses `let` and `const` almost exclusively.

```js
let age = 25;
const name = "Sam";
age = 26;
console.log(name, age);
```

The lines above print `Sam 26`. The first line declares `age` and assigns 25. The second line declares `name` permanently as `"Sam"`. The third line reassigns `age`, which is allowed because it was declared with `let`. Trying `name = "Alex"` instead would crash the program.

## Common Pitfalls & Anti-Patterns
- **Reassigning `const`**: Assigning a new value to a `const` variable throws a `TypeError`. If a value changes, declare it with `let`.
- **Assigning without declaring**: Writing `total = 0` without `var`, `let`, or `const` creates an accidental global variable. Always declare first.
- **Using `var` by habit**: `var` leaks out of blocks in surprising ways. Prefer `let` and `const` in all new code.

## Quick Summary
- Declare changeable values with `let` and fixed values with `const`.
- Reassigning a `const` variable throws an error.
- Always declare a variable before assigning to it.
