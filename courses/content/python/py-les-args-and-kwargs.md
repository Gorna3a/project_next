---
id: "py-les-args-and-kwargs"
type: "theory"
title: "Flexible Arguments with *args and **kwargs"
moduleId: "py-mod-05-functions"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "functions", "args", "kwargs", "unpacking"]
---

# Concept Overview

Some functions need to accept a variable number of arguments. A sum function might receive two numbers or ten. A configuration function might receive a different set of named options on every call.

Python handles both cases with `*args` and `**kwargs`. The stars collect extra positional or keyword arguments into one parameter. The same star syntax can also unpack values when calling a function.

## Key Principles & Frameworks

### Collecting positional arguments with *args

A parameter prefixed with `*` collects any number of positional arguments:

```python
def add_all(*numbers):
    total = 0
    for number in numbers:
        total += number
    return total


print(add_all(1, 2, 3))
print(add_all())
```

Output:

```text
6
0
```

The function can be called with any number of arguments, including none. Inside the function, `numbers` is a tuple: an ordered, immutable collection. Module 6 covers tuples in depth. For now, treat `numbers` as something a `for` loop can visit.

The name `args` is only a convention. `*numbers` and `*values` work the same way. The star is what matters.

### Seeing the collected tuple

```python
def show_args(*values):
    print(values)


show_args("a", "b")
```

Output:

```text
('a', 'b')
```

The tuple holds every extra positional argument in the order received. Because it is a tuple, it has no `append` method. Build a new result instead of trying to modify it.

### Mixing regular parameters with *args

Regular parameters come first, then the collector:

```python
def describe(title, *items):
    result = title
    for item in items:
        result += f", {item}"
    return result


print(describe("Fruit", "apple", "pear"))
```

Output:

```text
Fruit, apple, pear
```

`title` receives the first argument. Every remaining positional argument goes into `items`.

### Collecting keyword arguments with **kwargs

A parameter prefixed with `**` collects extra keyword arguments into a dictionary. A dictionary maps keys to values; Module 6 covers dictionaries in depth:

```python
def build_profile(**fields):
    result = ""
    for key in fields:
        result += f"{key}={fields[key]} "
    return result.strip()


print(build_profile(name="Sam", role="mentor"))
```

Output:

```text
name=Sam role=mentor
```

`fields` is a dictionary. Looping over it yields its keys in insertion order, and `fields[key]` retrieves the matching value. The caller can supply any keyword names, so `**kwargs` is useful for options that vary between calls.

### Parameter order

When a definition uses several forms, the order is:

```text
regular parameters, *args, keyword-only parameters, **kwargs
```

```python
def report(title, *values, unit="items", **extra):
    return f"{title}: {len(values)} {unit}"


print(report("Fruit", "apple", "pear"))
print(report("Jobs", "developer", unit="roles"))
```

Output:

```text
Fruit: 2 items
Jobs: 1 roles
```

`title` is positional, `values` collects the rest, `unit` is keyword-only because it follows `*values`, and `extra` collects any remaining keywords. Keep definitions like this small; a long signature is hard to call correctly.

### Unpacking positional arguments in a call

A star in a call does the reverse: it spreads an iterable into separate positional arguments:

```python
def add(a, b, c):
    return a + b + c


print(add(*range(1, 4)))
```

Output:

```text
6
```

`range(1, 4)` produces `1`, `2`, and `3`. The `*` passes them as three separate arguments, matching `a`, `b`, and `c`. Without the star, the function would receive one argument and raise `TypeError`.

### Unpacking keyword arguments in a call

Two stars spread a dictionary into keyword arguments:

```python
options = {"sep": "-", "end": "!"}
print("a", "b", **options)
```

Output:

```text
a-b!
```

The dictionary keys become parameter names. Every key must be a string, and every key must match a parameter that `print` accepts. Unpacking is common when options are assembled in one place and passed to a function later.

### Combining collection and unpacking

Collection and unpacking use the same symbols but appear in different places:

```python
def add_all(*numbers):
    total = 0
    for number in numbers:
        total += number
    return total


values = (1, 2, 3)
print(add_all(*values))
```

Output:

```text
6
```

The `*` in the definition collects; the `*` in the call spreads. Read the position to tell which job it is doing.

## Common Pitfalls & Anti-Patterns
- **Forgetting the star in the definition**: Without `*`, the function accepts only one argument instead of many.
- **Treating `args` as a list**: It is a tuple and has no `append` method. Build a new value or return a calculation.
- **Putting `**kwargs` before `*args`**: The order must be regular parameters, `*args`, keyword-only parameters, then `**kwargs`.
- **Forgetting the second star when unpacking a dictionary**: `func(options)` passes one positional dictionary; `func(**options)` passes keyword arguments.
- **Unpacking a dictionary whose keys are not strings**: Keyword names must be strings.
- **Assuming the collector name is required to be `args` or `kwargs`**: Only the stars are required.
- **Using `*args` when named parameters would be clearer**: Flexible input is useful, but explicit parameters document the interface.
- **Passing a tuple without a star**: The function receives one tuple argument rather than its individual values.
- **Modifying the collected tuple**: Tuples are immutable. Create a new result instead.

## Quick Summary
- `*args` collects extra positional arguments into a tuple.
- `**kwargs` collects extra keyword arguments into a dictionary.
- Regular parameters come before `*args`; `**kwargs` comes last.
- A bare `*` before a parameter makes it keyword-only.
- `*` in a call unpacks an iterable into positional arguments.
- `**` in a call unpacks a dictionary into keyword arguments.
- Collection and unpacking use the same symbols in different positions.
