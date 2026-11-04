---
id: "py-les-builtin-functions"
type: "theory"
title: "Useful Built-in Functions"
moduleId: "py-mod-05-functions"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "builtins", "round", "sum"]
---

# Concept Overview

Python ships with a set of built-in functions that are always available. They cover common math, comparison, inspection, and documentation tasks. Learning the most useful ones keeps your code short and avoids reinventing standard behavior.

This lesson covers `abs`, `round`, `min`, `max`, `sum`, `pow`, `divmod`, `isinstance`, `help`, and `dir`. All ten are part of the built-in scope described in the previous lesson.

## Key Principles & Frameworks

### abs

`abs` returns the absolute value of a number:

```python
print(abs(-7))
print(abs(3.5))
```

Output:

```text
7
3.5
```

The result keeps the number's type: an integer stays an integer, and a float stays a float.

### round

`round(number, ndigits)` rounds to a given number of decimal places:

```python
print(round(3.14159, 2))
print(round(2.675, 2))
```

Output:

```text
3.14
2.67
```

`2.675` looks like it should round up to `2.68`, but binary floating-point cannot represent it exactly. The stored value is slightly below `2.675`, so it rounds down. This is the same floating-point precision issue from Module 2.

With no `ndigits`, `round` returns an integer:

```python
print(round(2.5))
print(round(3.5))
print(round(3.7))
```

Output:

```text
2
4
4
```

Python uses banker's rounding: a value exactly halfway between two integers rounds to the nearest even integer. That is why `2.5` becomes `2` and `3.5` becomes `4`. Do not assume halves always round up.

### min and max

`min` and `max` accept several arguments or a single iterable:

```python
print(min(3, 7, 2))
print(max(3, 7, 2))
print(min(range(5)))
print(max(range(5)))
```

Output:

```text
2
7
0
4
```

With several arguments, they compare the arguments. With one iterable, they compare its items. Strings work too, using lexicographic order. Calling either function with an empty sequence raises `ValueError`.

### sum

`sum` adds the values of an iterable and accepts an optional starting value:

```python
print(sum(range(1, 11)))
print(sum(range(1, 4), 10))
```

Output:

```text
55
16
```

The first call adds `1` through `10`. The second adds `1`, `2`, and `3`, starting from `10`, for `16`. `sum` is designed for numbers; summing strings raises `TypeError` because it uses addition, and string addition is not supported by `sum`'s accumulator.

### pow

`pow(base, exponent)` raises a number to a power, just like the `**` operator:

```python
print(pow(2, 5))
print(pow(2, 5, 3))
```

Output:

```text
32
2
```

The three-argument form computes `(2 ** 5) % 3`, which is `32 % 3`, or `2`. This modular form is common in cryptography and number theory. For ordinary powers, `**` is usually more readable.

### divmod

`divmod(a, b)` returns the floor quotient and remainder together:

```python
quotient, remainder = divmod(17, 5)

print(quotient)
print(remainder)
```

Output:

```text
3
2
```

The result is a tuple holding two values. Unpacking assigns each value to a name. A tuple is an ordered collection; Module 6 covers tuples in depth. `divmod` is handy for converting units, such as minutes into hours and minutes.

### isinstance

`isinstance(value, type)` checks whether a value belongs to a type:

```python
print(isinstance(5, int))
print(isinstance("5", int))
print(isinstance(True, int))
```

Output:

```text
True
False
True
```

The third result surprises many people: `bool` is a subclass of `int`, so `True` counts as an integer. Use `isinstance` when a function should accept more than one type, and remember that booleans pass integer checks.

### help

`help` displays documentation for an object:

```python
help(round)
```

This prints the signature and description of `round`. The exact text varies by Python version, so read the output rather than memorizing it. `help` is most useful in the interactive shell, where you can scroll through long entries.

### dir

`dir` lists the names available on an object or in the current scope:

```python
print(dir(""))
```

This prints the string methods and attributes, such as `upper`, `lower`, and `replace`, along with internal names that begin and end with double underscores. The exact list depends on the Python version. `dir()` with no argument lists the names currently in scope. Use it to explore, then confirm details with `help`.

### Combining built-ins with your functions

Built-ins work naturally inside the functions you write:

```python
def average(*numbers):
    if not numbers:
        return 0.0
    return sum(numbers) / len(numbers)


print(round(average(2, 4, 6), 2))
```

Output:

```text
4.0
```

`sum(numbers)` and `len(numbers)` consume the tuple collected by `*numbers`. The result is divided and then rounded for display. Module 6 covers the collection types these built-ins work with in more detail.

## Common Pitfalls & Anti-Patterns
- **Expecting `round` to always round halves up**: Python uses banker's rounding. `round(2.5)` is `2`.
- **Forgetting float precision**: `round(2.675, 2)` is `2.67`, not `2.68`.
- **Expecting `round(x)` to return a float**: Without `ndigits`, it returns an integer.
- **Calling `min` or `max` on an empty sequence**: This raises `ValueError`.
- **Trying to `sum` strings**: Use `"".join(...)` once Module 6 covers collections, or concatenate explicitly.
- **Assuming `isinstance(True, int)` is false**: Booleans are integers in Python's type hierarchy.
- **Shadowing a built-in**: A local name such as `sum` hides the function and breaks later calls.
- **Memorizing `help` output**: It varies by version and object. Read it when needed.
- **Treating `divmod`'s result as a single number**: It returns a tuple of two values; unpack it.

## Quick Summary
- `abs` returns a number's absolute value.
- `round` rounds, using banker's rounding at exact halves; without `ndigits` it returns an integer.
- `min` and `max` work with several arguments or one iterable.
- `sum` adds an iterable, with an optional starting value.
- `pow(base, exponent)` matches `**`; the three-argument form computes a modulus.
- `divmod` returns quotient and remainder as a tuple.
- `isinstance` checks types, and `True` counts as an `int`.
- `help` shows documentation; `dir` lists available names.
- Avoid shadowing built-ins with your own variables.
