---
id: "les-scope-basics"
type: "theory"
title: "Scope Basics: Block, Function, and Global"
moduleId: "mod-02-variables-and-scope"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-04"
estimatedMinutes: 15
tags: ["javascript","scope","blocks"]
---

# Concept Overview

Scope is the region of code where a variable can be used. A block is any code between curly braces `{ }`, such as the body of an `if` statement. Variables declared with `let` and `const` live only inside the block that contains them, while a variable declared outside every block is global and visible everywhere.

## Key Principles & Frameworks

Think of blocks as rooms with one-way windows: code inside a block can see variables from outside, but code outside cannot see variables declared inside. Each nested block gets its own fresh set of names, which is why redeclaring a name inside a block creates a separate variable instead of changing the outer one.

```js
const animal = "cat";
if (true) {
  const sound = "meow";
  console.log(animal, sound);
}
console.log(animal);
```

The first `console.log` prints `cat meow` because the block sees the outer `animal` and its own `sound`. The second prints `cat`. Trying to print `sound` on the last line would throw a `ReferenceError` because `sound` does not exist outside its block.

## Common Pitfalls & Anti-Patterns
- **`var` leaking out of blocks**: A `var` declared inside a block is visible after the block ends, unlike `let` and `const`. This is a frequent source of bugs.
- **Accidental globals**: Assigning to a name you never declared creates a global variable instead of failing. Always declare with `let` or `const`.
- **Shadowing by accident**: Declaring the same name in a nested block creates a second variable. The outer value stays unchanged, which surprises beginners.

## Quick Summary
- `let` and `const` are visible only inside their own block.
- Inner blocks can read outer variables, but not the other way around.
- Undeclared assignments create globals; `var` escapes blocks.
