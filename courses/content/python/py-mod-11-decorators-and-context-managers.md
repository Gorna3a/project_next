---
id: "py-mod-11-decorators-and-context-managers"
type: "module"
title: "Module 11: Decorators & Context Managers"
courseId: "python-programming"
order: 11
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "decorators", "closures", "context-managers", "with"]
prerequisites: ["py-mod-10-iteration-and-functional-tools"]
description: "Wrap functions with decorators, preserve metadata with functools.wraps, and manage resources with context managers."
---

# Module Overview

Decorators let you change or extend a function without editing its source. A decorator is a function that receives another function and returns a replacement. Because Python functions are first-class values, you can wrap, time, cache, or validate calls in a reusable way. Context managers use a similar idea to guarantee that setup and cleanup code always runs, even when exceptions occur.

This module starts with first-class functions and closures. The second lesson builds decorators from wrapper functions. The third lesson shows decorator factories that accept arguments. The fourth lesson covers the `with` protocol, `__enter__` and `__exit__`, and `contextlib`.

The workshop builds a call counter and a timer decorator, both deterministic. The lab builds a decorator factory that validates function arguments.

## What You Will Be Able To Do
- Pass functions as arguments and return them from other functions
- Define nested functions that capture variables from their enclosing scope
- Use `nonlocal` to update a captured variable
- Explain late binding in closures created inside loops
- Write a decorator that wraps a function with `*args` and `**kwargs`
- Return the wrapper's result and preserve the original function's metadata with `functools.wraps`
- Stack several decorators and predict their order
- Build a decorator factory that accepts arguments
- Recognize when a class-based decorator is appropriate
- Use `functools.cache` for memoization
- Implement `__enter__` and `__exit__` for the `with` statement
- Create a context manager with `contextlib.contextmanager`
- Use `contextlib.suppress` to ignore selected exceptions
- Avoid swallowing exceptions accidentally in `__exit__`
