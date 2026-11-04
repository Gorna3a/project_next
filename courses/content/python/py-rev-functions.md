---
id: "py-rev-functions"
type: "review"
title: "Functions Quick Reference"
moduleId: "py-mod-05-functions"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-function-basics", "py-les-arguments-and-parameters", "py-les-args-and-kwargs", "py-les-scope-and-legb", "py-les-builtin-functions", "py-ws-utility-library", "py-lab-string-and-number-helpers"]
tags: ["python", "functions", "parameters", "scope", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| `def` | Defines a function | Reusable logic |
| Parameter | Name in a function definition | Receiving input |
| Argument | Value supplied in a call | Calling a function |
| `return` | Ends the call and sends a value back | Producing a result |
| Implicit `None` | A function without `return` returns `None` | Missing-return bugs |
| Docstring | First string literal in a function | Documentation |
| Positional argument | Matched to parameters by order | Short calls |
| Keyword argument | Matched to parameters by name | Readable calls |
| Default value | Used when an argument is omitted | Optional inputs |
| Keyword-only | Parameter after a bare `*` | Explicit options |
| Mutable default | A default object reused across calls | Classic bug source |
| `*args` | Collects extra positional arguments into a tuple | Variable input |
| `**kwargs` | Collects extra keyword arguments into a dictionary | Flexible options |
| Unpacking | `*` or `**` spreads values into a call | Passing variable data |
| LEGB | Local, enclosing, global, built-in lookup order | Name resolution |
| `global` | Declares assignment to a global name | Updating module state |
| `nonlocal` | Declares assignment to an enclosing name | Nested-function state |
| `abs` | Absolute value | Distance and magnitude |
| `round` | Rounds to a number of digits | Display and precision |
| `min` / `max` | Smallest or largest value | Comparisons |
| `sum` | Adds an iterable | Totals |
| `pow` | Power, optionally with a modulus | Exponentiation |
| `divmod` | Quotient and remainder together | Unit conversion |
| `isinstance` | Type membership check | Input validation |
| `help` | Prints documentation | Looking up behavior |
| `dir` | Lists available names | Exploring objects |

## Key Concepts Comparison
- **Parameter vs. argument**: A parameter is the name in the definition. An argument is the value in the call.
- **`print` vs. `return`**: `print` displays a value and returns `None`. `return` sends a value to the caller.
- **Implicit vs. explicit `None`**: A function with no `return` gives `None`; `return None` does the same thing explicitly.
- **Positional vs. keyword**: Positional arguments depend on order. Keyword arguments depend on names and can be reordered.
- **Default vs. keyword-only**: A default can be omitted. A keyword-only parameter must be named unless it also has a default.
- **Mutable vs. immutable default**: Mutable defaults such as `[]` are shared across calls. Use `None` and create a fresh object inside.
- **`*args` vs. `**kwargs`**: `*args` collects positional values into a tuple. `**kwargs` collects keyword values into a dictionary.
- **Collection vs. unpacking**: A star in the definition collects. A star in the call spreads.
- **Local vs. global**: Local names belong to one call. Global names belong to the module.
- **`global` vs. `nonlocal`**: `global` targets the module scope. `nonlocal` targets an enclosing function scope.
- **Built-in shadowing**: A local or global name can hide a built-in such as `sum` or `max`.
- **Banker's rounding**: `round(2.5)` is `2`; `round(3.5)` is `4`. Exact halves go to the nearest even integer.

## Critical Syntax / Templates
```python
# Basic function with a docstring
def greet(name):
    """Return a greeting for name."""
    return f"Hello, {name}!"


print(greet("Sam"))

# Positional and keyword arguments
def describe(name, role):
    return f"{name} is a {role}."


print(describe("Sam", "mentor"))
print(describe(role="mentor", name="Sam"))

# Default and keyword-only parameters
def introduce(name, *, greeting="Hello"):
    return f"{greeting}, {name}!"


print(introduce("Sam"))
print(introduce("Sam", greeting="Hi"))

# Mutable default: use None and create a fresh list
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

# *args: collect positional arguments into a tuple
def add_all(*numbers):
    total = 0
    for number in numbers:
        total += number
    return total


print(add_all(1, 2, 3))

# **kwargs: collect keyword arguments into a dictionary
def build_profile(**fields):
    result = ""
    for key in fields:
        result += f"{key}={fields[key]} "
    return result.strip()


print(build_profile(name="Sam", role="mentor"))

# Unpacking in a call
def add(a, b, c):
    return a + b + c


print(add(*range(1, 4)))

options = {"sep": "-", "end": "!"}
print("a", "b", **options)

# Scope: read a global, then assign with global
count = 10


def show_count():
    print(count)


def reset():
    global count
    count = 0

# Scope: assign to an enclosing name
def outer():
    value = 0

    def increment():
        nonlocal value
        value += 1
        return value

    return increment()

# Built-in functions
print(abs(-7))
print(round(3.14159, 2))
print(min(3, 7, 2))
print(max(3, 7, 2))
print(sum(range(1, 11)))
print(pow(2, 5))
print(pow(2, 5, 3))
quotient, remainder = divmod(17, 5)
print(isinstance(5, int))

# Documentation and exploration
help(round)       # Prints the signature and description.
dir("")           # Lists string methods and attributes.
```
