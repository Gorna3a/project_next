---
id: "py-rev-getting-started"
type: "review"
title: "Getting Started Quick Reference"
moduleId: "py-mod-01-getting-started"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-what-is-python", "py-les-python-versions-and-implementations", "py-les-running-python", "py-les-basic-syntax", "py-ws-first-script", "py-lab-greeting-printer"]
tags: ["python", "basics", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Python | A readable, general-purpose programming language | Scripts, web services, data work |
| Interpreter | A program that reads and executes source code | Runs `.py` files |
| CPython | The reference Python implementation, written in C | Default interpreter on most systems |
| PyPy | An alternative implementation with a JIT compiler | Faster long-running pure-Python code |
| PEP | Python Enhancement Proposal | Design documents such as PEP 8 and PEP 20 |
| REPL | Read-Evaluate-Print Loop | Interactive experiments |
| Script | A `.py` file executed from top to bottom | Repeatable programs |
| `print()` | Writes values to standard output | Displaying results |
| `sep` | Separator placed between `print()` values | `print("A", "B", sep="-")` |
| `end` | Text written after the final `print()` value | `print("A", end="")` |
| Comment | Text after `#`, ignored by Python | Explaining intent |
| Indentation | Leading spaces that define a block | Four spaces per level |
| PEP 8 | The official Python style guide | Consistent formatting |
| Line continuation | Splitting a statement across lines | Parentheses or a trailing `\` |
| Case sensitivity | `name`, `Name`, and `NAME` are different | Matching exact names |

## Key Concepts Comparison
- **REPL vs. script**: The REPL evaluates input immediately and echoes bare expression values. A script runs from a saved file and produces output only through calls such as `print()`.
- **Python 2 vs. Python 3**: Python 3 is the supported line. It uses `print()` as a function and handles text as Unicode by default. Python 2 reached end of life in 2020.
- **CPython vs. PyPy**: Both implement Python. CPython is the reference implementation; PyPy uses a just-in-time compiler and may support new versions later.
- **`sep` vs. `end`**: `sep` goes between multiple values; `end` goes after the last value. Both default to a space and a newline respectively.
- **Implicit vs. explicit continuation**: Parentheses, brackets, and braces allow a statement to continue automatically. A backslash continues a line explicitly and must be the final character.

## Critical Syntax / Templates
```python
# A comment is ignored by Python.
print("Hello, world!")

# Several values with a custom separator.
print("Name", "Sam", "Level", "Beginner", sep=" | ")

# Keep the line open, then finish it.
print("Status: ", end="")
print("ready")

# Implicit continuation inside parentheses.
print(
    "A long message can be split "
    "across several lines."
)

# Explicit continuation.
print("This line continues " \
      "on the next line.")

# Check the interpreter version from a terminal.
# python --version
# python3 --version
# py --version
```
