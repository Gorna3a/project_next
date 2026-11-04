---
id: "py-les-type-casting"
type: "theory"
title: "Inspecting and Converting Types"
moduleId: "py-mod-02-variables-and-data-types"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "types", "casting", "conversion"]
---

# Concept Overview

Every value has a type. The type determines which operations are valid and how the value behaves. Python provides `type()` to inspect a value and conversion functions such as `int()`, `float()`, `str()`, and `bool()` to create a value of another type.

Converting a value does not change the original object. It returns a new value. This is especially important for immutable types such as strings and numbers.

## Key Principles & Frameworks

### Inspecting a type with type()

`type()` returns the type object of a value:

```python
print(type(42))
print(type(19.99))
print(type("42"))
print(type(True))
print(type(None))
```

Output:

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
```

The angle brackets are part of the display format. In an f-string, the same text appears:

```python
value = 42
print(f"{value} has type {type(value)}")
```

Output:

```text
42 has type <class 'int'>
```

### Converting to an integer

`int()` converts compatible values to an integer:

```python
print(int("42"))
print(int(3.9))
print(int(-3.9))
```

Output:

```text
42
3
-3
```

When converting a float, `int()` truncates toward zero; it does not round to the nearest integer. `3.9` becomes `3`, and `-3.9` becomes `-3`.

When converting a string, the text must represent a valid integer:

```python
print(int(" 42 "))
```

Output:

```text
42
```

Surrounding whitespace is allowed. A decimal point is not:

```python
# int("3.5") raises ValueError.
```

To convert `"3.5"`, use `float()` first, then decide whether to truncate or round.

### Converting to a float

`float()` converts integers and numeric strings to floating-point values:

```python
print(float("19.99"))
print(float(5))
print(float("-2.5"))
```

Output:

```text
19.99
5.0
-2.5
```

Invalid numeric text raises `ValueError`:

```python
# float("abc") raises ValueError.
```

Module 8 covers how to handle conversion errors without crashing the program.

### Converting to a string

`str()` converts a value to its text representation:

```python
print(str(42))
print(str(3.5))
print(str(True))
print(str(None))
```

Output:

```text
42
3.5
True
None
```

This is useful when you need to concatenate text with a non-string value:

```python
age = 42
print("Age: " + str(age))
```

Output:

```text
Age: 42
```

### Converting to a boolean

`bool()` applies Python's truthiness rules:

```python
print(bool(0))
print(bool(1))
print(bool(""))
print(bool("0"))
print(bool("False"))
print(bool(None))
```

Output:

```text
False
True
False
True
True
False
```

A non-empty string is true even when its text looks false. `bool("False")` is `True` because the string contains characters.

### Implicit conversion

Python converts an integer to a float automatically when the two are combined in arithmetic:

```python
total = 1 + 2.5
print(total)
print(type(total))
```

Output:

```text
3.5
<class 'float'>
```

This is called implicit conversion because you did not call a conversion function. The result follows the wider type needed for the operation.

No implicit conversion turns a numeric string into a number. `"5" + 1` raises `TypeError`; you must call `int("5")` or `float("5")` first.

## Common Pitfalls & Anti-Patterns
- **Calling `int()` on decimal text**: `int("3.5")` raises `ValueError`. Use `float("3.5")` first.
- **Expecting `int()` to round**: It truncates toward zero. `int(3.9)` is `3`, not `4`.
- **Calling `float()` on non-numeric text**: `float("abc")` raises `ValueError`.
- **Assuming `bool("False")` is false**: Any non-empty string is truthy.
- **Thinking `type()` returns a string**: It returns a type object. Use an f-string to display it.
- **Expecting conversions to modify the original value**: They return new objects.
- **Using `eval()` to parse a number**: It executes arbitrary code and is unsafe. Use the specific conversion function.
- **Assuming mixed arithmetic keeps an integer type**: Combining an int and a float produces a float.

## Quick Summary
- `type(value)` reveals the value's type.
- `int()` converts compatible values and truncates floats toward zero.
- `float()` converts integers and numeric text to floats.
- `str()` produces a text representation for display or concatenation.
- `bool()` applies truthiness rules; non-empty strings are true.
- Mixing an int and a float produces a float through implicit conversion.
