---
id: "mod-08-errors-and-strict-mode"
type: "module"
title: "Module 8: Errors & Strict Mode"
courseId: "javascript-fundamentals"
order: 8
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
tags: ["javascript","errors","strict-mode"]
prerequisites: ["mod-07-arrays-objects-json"]
description: "Handle failures with try, catch, and finally; throw meaningful Error objects; and use strict mode to catch silent mistakes."
---

# Module Overview

Programs fail. Inputs are malformed, files are missing, and assumptions turn out to be wrong. This module teaches you to handle failures deliberately instead of letting them crash the program or disappear silently. You will learn `try`, `catch`, and `finally`, then how to throw and inspect `Error` objects.

The final lesson covers strict mode, a set of rules that turns several silent mistakes into visible errors. The workshop wraps JSON parsing in error handling, and the lab validates input by throwing the right error types.

## What You Will Be Able To Do
- Catch runtime errors with `try`/`catch`/`finally` and understand the flow
- Throw and inspect `Error` objects, including built-in subclasses and custom names
- Use strict mode and recognize the mistakes it turns into errors
- Validate input and report failures with meaningful error types
