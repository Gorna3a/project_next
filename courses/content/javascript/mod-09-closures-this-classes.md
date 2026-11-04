---
id: "mod-09-closures-this-classes"
type: "module"
title: "Module 9: Closures, this & Classes"
courseId: "javascript-fundamentals"
order: 9
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
tags: ["javascript","closures","this","classes","prototypes"]
prerequisites: ["mod-08-errors-and-strict-mode"]
description: "Use closures to keep private state, control this with call, apply, and bind, and build reusable class hierarchies."
---

# Module Overview

Functions in JavaScript are more than reusable blocks of code. They remember the scope where they were created, they receive a `this` value based on how they are called, and they can share behavior through prototypes and classes.

This module connects those ideas. You will use closures to keep private state, learn how `this` changes across call styles, control it explicitly with `call`, `apply`, and `bind`, then build inheritance with prototypes and `class`.

## What You Will Be Able To Do
- Explain lexical scope and use closures to create private state
- Predict the value of `this` in methods, plain functions, and arrow functions
- Use `call`, `apply`, and `bind` to control `this`
- Trace property lookup through the prototype chain
- Build classes with constructors, inheritance, static members, getters, setters, and private fields
