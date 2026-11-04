---
id: "py-les-comparison-and-identity-operators"
type: "theory"
title: "Comparison, Identity, and Membership Operators"
moduleId: "py-mod-03-operators-and-conditionals"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "operators", "comparison", "identity", "membership"]
---

# Concept Overview

Comparison operators answer questions about values: are they equal, which one is larger, and does one contain another? They produce `True` or `False`, which makes them the foundation of every decision a program makes.

Python separates equality from identity. `==` asks whether two values are equal; `is` asks whether two names refer to the same object. String membership uses `in` and `not in` to test for a substring.

## Key Principles & Frameworks

### Equality and ordering

| Operator | Meaning | Example | Result |
| :--- | :--- | :--- | :--- |
| `==` | Equal to | `5 == 5` | `True` |
| `!=` | Not equal to | `5 != 3` | `True` |
| `<` | Less than | `3 < 5` | `True` |
| `>` | Greater than | `5 > 3` | `True` |
| `<=` | Less than or equal to | `5 <= 5` | `True` |
| `>=` | Greater than or equal to | `5 >= 6` | `False` |

```python
print(5 == 5)
print(5 != 3)
print(3 < 5)
print(5 <= 5)
```

Output:

```text
True
True
True
True
```

Comparisons work with numbers and strings. Numeric comparisons are straightforward. String comparisons use lexicographic order based on Unicode code points, and they are case-sensitive:

```python
print("apple" < "banana")
print("Apple" < "apple")
```

Output:

```text
True
True
```

Uppercase letters have lower code points than lowercase letters, so `"Apple"` sorts before `"apple"`.

Comparing incompatible types with an ordering operator is an error:

```python
# "a" < 1 raises TypeError.
```

Equality is different: values of different types can be compared for equality, and the result is usually `False`.

```python
print(1 == 1.0)
print("1" == 1)
```

Output:

```text
True
False
```

`1` and `1.0` are numerically equal even though one is an int and the other is a float. `"1"` and `1` are different types and are not equal.

### Chained comparisons

Python allows a comparison chain:

```python
age = 25
print(18 <= age < 65)
```

Output:

```text
True
```

The chain means `18 <= age and age < 65`. The middle expression is evaluated only once. This reads naturally for ranges and is preferred over repeating the variable.

### Identity: is and is not

`is` tests identity: do two names refer to the same object? `is not` tests the opposite.

```python
result = None

print(result is None)
print(result is not None)
```

Output:

```text
True
False
```

Use `is None` when checking for `None`. Do not use `is` to compare numbers or strings:

```python
a = 1000
b = 1000

print(a == b)
print(a is b)
```

The equality check is reliably `True`. The identity check depends on whether the interpreter reused the same object, so it may be `True` or `False`. Never build logic on that behavior. Use `==` for values and reserve `is` for identity checks such as `None`.

The reverse mistake is also common: do not use `==` when you specifically need identity. In this course, that situation mainly involves `None`.

### Membership in strings

`in` tests whether a substring appears inside a string. `not in` tests the opposite:

```python
text = "Python"

print("yth" in text)
print("java" in text)
print("java" not in text)
```

Output:

```text
True
False
True
```

Membership checks substrings, not words. `"cat" in "concatenate"` is `True` because the characters appear in sequence.

The empty string is a substring of every string:

```python
print("" in "abc")
```

Output:

```text
True
```

Module 6 extends `in` to collections, where it checks membership of elements rather than substrings.

### Assignment versus equality

`=` assigns a value. `==` compares values. They are different operators and are not interchangeable.

```python
score = 10
print(score == 10)
```

Output:

```text
True
```

Using `=` where a comparison is required is a syntax error in an `if` statement, which the next lessons introduce.

## Common Pitfalls & Anti-Patterns
- **Using `is` for equality**: `is` checks identity, not value equality. Use `==` unless you specifically need identity.
- **Using `==` to check for `None`**: Prefer `is None`. It states the intent and avoids custom equality behavior.
- **Writing `=` instead of `==`**: Assignment is not a comparison, and it is a syntax error in a condition.
- **Expecting string comparisons to ignore case**: `"Apple"` and `"apple"` are different strings.
- **Comparing incompatible types with `<`**: `"a" < 1` raises `TypeError`.
- **Assuming `in` checks whole words**: It checks substrings. `"cat" in "concatenate"` is `True`.
- **Forgetting that the empty string is a substring**: `"" in text` is always `True`.
- **Comparing floats for exact equality**: `0.1 + 0.2 == 0.3` is `False`. Use a tolerance when exact decimal behavior matters.
- **Misreading a chain**: `0 < x < 10` means both comparisons must hold.

## Quick Summary
- `==`, `!=`, `<`, `>`, `<=`, and `>=` compare values and return booleans.
- Numeric equality treats `1` and `1.0` as equal; text and numbers are not equal.
- Chained comparisons express a range without repeating the middle value.
- `is` and `is not` compare identity; use them for `None`, not for value equality.
- `in` and `not in` test substrings in strings.
- `=` assigns; `==` compares.
