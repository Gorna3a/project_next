---
id: "py-mod-08-exceptions-and-files"
type: "module"
title: "Module 8: Exceptions & Files"
courseId: "python-programming"
order: 8
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "exceptions", "files", "json", "csv"]
prerequisites: ["py-mod-07-modules-and-standard-library"]
description: "Handle errors with try and except, raise meaningful exceptions, and read and write text, JSON, and CSV files."
---

# Module Overview

Programs do not run in a perfect world. A user types letters where a number is expected, a file is missing, or a network resource is unavailable. Python reports these problems as exceptions. Handling them well keeps a program running when recovery is possible and produces a clear failure when it is not.

This module begins with `try`, `except`, `else`, and `finally`, including how to read a traceback and choose the right built-in exception. The second lesson shows how to raise exceptions, chain one exception to another with `raise ... from`, use `assert` for internal checks, and define a small custom exception. The third lesson covers reading and writing text files with `open`, `with`, explicit encodings, and `pathlib`. The final lesson works with JSON and CSV, the two most common formats for structured data.

The workshop parses messy numeric input and separates valid values from invalid ones. The lab validates report rows, raises `ValidationError` for bad data, and writes `report.txt`. The lab's file tests check the workspace after your script runs, so the script must create the file at the top level.

## What You Will Be Able To Do
- Read a traceback and identify the failing line and exception
- Catch specific exceptions with `try` and `except`
- Use `else` for code that runs only when no exception occurs
- Use `finally` for cleanup that must always run
- Avoid bare `except`, silent `pass`, and overly broad catches
- Raise built-in and custom exceptions with useful messages
- Preserve the original cause with `raise ... from`
- Use `assert` for programmer invariants
- Read and write text files with explicit encodings
- Choose between read, write, append, and exclusive-create modes
- Use `pathlib.Path` for common file operations
- Serialize and parse JSON with the `json` module
- Read and write CSV rows with the `csv` module
- Validate data, collect errors, and write a report file
