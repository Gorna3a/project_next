---
id: "mod-03-data-types-and-conversion"
type: "module"
title: "Module 3: Data Types & Conversion"
courseId: "javascript-fundamentals"
order: 3
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-10-15"
tags: ["javascript","data-types","conversion"]
prerequisites: ["mod-02-variables-and-scope"]
description: "Explore the seven primitive types, inspect values with typeof, and convert between strings, numbers, and booleans without surprises."
---

# Module Overview

Module 2 gave you variables. Now look at what those variables hold. Every value in JavaScript belongs to a type, and this module teaches you the seven primitive types, how to inspect them, and how to move values from one type to another. You will meet both kinds of conversion: the explicit kind you write with tools like `Number()` and `String()`, and the implicit kind JavaScript performs on its own.

These skills prevent a large share of beginner bugs: why `"5" + 1` is not 6, why an empty string is not the same as zero, and why `typeof null` does not say "null". The workshop and lab then let you build a value inspector and a safe number parser.

## What You Will Be Able To Do
- Identify the seven primitive types and pick the right one for each value
- Inspect any value with `typeof` and recognize the special values `NaN`, `Infinity`, `null`, and `undefined`
- Convert between strings, numbers, and booleans deliberately with `Number()`, `String()`, `Boolean()`, `parseInt`, and `parseFloat`
- Predict when JavaScript converts types on its own, and tell truthy values from falsy ones
