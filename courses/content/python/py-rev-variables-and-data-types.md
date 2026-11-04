---
id: "py-rev-variables-and-data-types"
type: "review"
title: "Variables & Data Types Quick Reference"
moduleId: "py-mod-02-variables-and-data-types"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-variables-and-naming", "py-les-numbers", "py-les-strings", "py-les-booleans-and-none", "py-les-type-casting", "py-ws-type-inspector", "py-lab-type-conversion-report"]
tags: ["python", "variables", "types", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Variable | A name that refers to a value | `score = 10` |
| Assignment | Binds a name to a value with `=` | Updating or initializing state |
| Dynamic typing | A name can refer to values of different types | Reusing a name for a new value |
| `snake_case` | Lowercase words joined by underscores | Variable and function names |
| `UPPER_CASE` | Uppercase words joined by underscores | Constants by convention |
| `int` | Whole number with arbitrary precision | Counts, indexes, quantities |
| `float` | Binary floating-point number | Measurements and decimal values |
| `complex` | Number with real and imaginary parts | Scientific calculations |
| `1_000_000` | Numeric literal with grouping underscores | Readable large numbers |
| `str` | Immutable sequence of text characters | Names, messages, file contents |
| `text[i]` | Character at index `i`, starting at `0` | Reading one character |
| `text[start:stop]` | Substring from start up to, not including, stop | Extracting text |
| `len(text)` | Number of characters in a string | Length checks |
| f-string | String prefixed with `f` that embeds expressions | `f"Hello, {name}"` |
| `bool` | Type with values `True` and `False` | Yes/no state |
| `None` | Special value meaning no value | Placeholders and missing results |
| Truthiness | Whether a value counts as true or false | `bool(value)` |
| `type(value)` | Returns the value's type object | Inspecting types |
| `int(value)` | Converts compatible values to an integer | Parsing whole numbers |
| `float(value)` | Converts compatible values to a float | Parsing decimals |
| `str(value)` | Converts a value to text | Building messages |
| `bool(value)` | Converts a value to `True` or `False` | Truth tests |

## Key Concepts Comparison
- **Variable as a label vs. a box**: A name points to an object. Rebinding the name does not change the object, and another name can point to the same object.
- **`int` vs. `float`**: Integers are exact whole numbers. Floats use binary floating-point and may not represent decimal fractions exactly.
- **`/` vs. exact division expectations**: `/` always returns a float. `8 / 2` produces `4.0`, not `4`.
- **String indexing vs. slicing**: Indexing returns one character; slicing returns a new substring. Slices exclude the stop index.
- **`None` vs. `False`**: Both are falsy, but `None` means no value while `False` is a definite boolean answer.
- **Explicit vs. implicit conversion**: `int("5")` is explicit. `1 + 2.5` becomes a float through implicit conversion.
- **String immutability vs. rebinding**: String methods return new strings. Rebinding a variable to the result is not the same as changing the original string.

## Critical Syntax / Templates
```python
# Assignment and rebinding
score = 10
score = 25

# Multiple assignment and swap
x, y = 1, 2
x, y = y, x

# Numbers
count = 1_000_000
price = 19.99
value = 2 + 3j

# Strings, indexing, and slicing
word = "Python"
print(word[0])
print(word[-1])
print(word[1:4])
print(word[::-1])

# String methods return new strings
text = "  Hello  "
print(text.strip())
print(text.lower())
print(text.replace("Hello", "Hi"))

# f-strings
name = "Sam"
score = 42
print(f"{name} scored {score} points.")

# Booleans and None
is_ready = True
result = None
print(bool(0))
print(bool("False"))

# Type inspection and conversion
print(type(42))
print(int("42"))
print(float("3.5"))
print(str(42))
print(bool(""))
```
