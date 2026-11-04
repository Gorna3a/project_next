---
id: "py-mod-05-functions"
type: "module"
title: "Module 5: Functions"
courseId: "python-programming"
order: 5
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "functions", "parameters", "scope"]
prerequisites: ["py-mod-04-loops"]
description: "Package logic into reusable functions with parameters, return values, flexible argument handling, clear scope, and Python's built-in helpers."
---

# Module Overview

A function is a named block of code that performs one job. You define it once, call it whenever needed, and pass in the values it should work with. Functions make programs shorter, easier to test, and easier to change.

This module starts with the mechanics: `def`, parameters, arguments, `return`, `None`, and docstrings. It then covers positional and keyword arguments, default values, keyword-only parameters, and the mutable-default pitfall. Next you will collect variable numbers of arguments with `*args` and `**kwargs`, and unpack arguments at the call site. The scope lesson explains how Python resolves names through the local, enclosing, global, and built-in scopes, including `global` and `nonlocal`. The final lesson tours the built-in functions you will use most often.

The workshop builds a small utility library, and the lab turns the rules into three tested helpers. From this module onward, graded code is organized into functions, so the tests call your functions directly instead of comparing printed output.

## What You Will Be Able To Do
- Define and call functions with `def`
- Send values into a function with parameters and arguments
- Return results with `return` and explain why a missing return gives `None`
- Distinguish `print` from `return`
- Use positional, keyword, default, and keyword-only arguments
- Avoid mutable default arguments
- Collect extra arguments with `*args` and `**kwargs`
- Unpack arguments when calling a function
- Trace name lookup through the LEGB rule
- Update outer names with `global` and `nonlocal` when appropriate
- Use `abs`, `round`, `min`, `max`, `sum`, `pow`, `divmod`, and `isinstance`
- Look up documentation with `help` and inspect names with `dir`
