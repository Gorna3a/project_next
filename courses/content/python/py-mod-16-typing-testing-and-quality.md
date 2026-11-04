---
id: "py-mod-16-typing-testing-and-quality"
type: "module"
title: "Module 16: Typing, Testing and Code Quality"
courseId: "python-programming"
order: 16
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "typing", "testing"]
prerequisites: ["py-mod-15-environments-and-packaging"]
description: "Write strict, typed Python with type checkers, formatters, linters, docstrings, and deterministic unit tests."
---

# Module Overview

This module teaches you to make Python code stricter and easier to verify. You will annotate functions and variables with type hints, check those hints with static type checkers, format and lint code consistently, and document behavior with docstrings and doctests.

You will then write deterministic unit tests with `unittest` and `doctest`, and learn the ideas behind `pytest` and `tox` without installing them. By the end, your code will state its contracts clearly and prove them with tests.

## What You Will Be Able To Do
- Annotate functions, containers, and optional values with type hints
- Explain why hints are not enforced at runtime
- Distinguish static type checking from runtime validation
- Apply PEP 8, formatters, and linters with the right roles
- Write docstrings, `help()`-friendly docs, and doctests
- Write deterministic unit tests with `unittest` and `doctest`
- Describe pytest style tests, fixtures, parametrize, and tox environments
- Keep code quality checks honest and reproducible
