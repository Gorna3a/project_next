---
id: "py-les-variables-and-naming"
type: "theory"
title: "Variables and Naming"
moduleId: "py-mod-02-variables-and-data-types"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "variables", "assignment", "naming"]
---

# Concept Overview

A variable is a name that refers to a value. You create one with an assignment statement:

```python
message = "Hello"
score = 10
```

The `=` symbol assigns the value on the right to the name on the left. It does not test equality; comparisons are covered in Module 3.

Python is dynamically typed. A name can refer to an object of any type, and it can later refer to an object of a different type. The type belongs to the value, not to the name.

## Key Principles & Frameworks

### Assignment and rebinding

A name is a label that points to an object. It is not a box that contains the object.

```python
score = 10
print(score)

score = 25
print(score)
```

The first `print()` shows `10`. The assignment `score = 25` moves the label to a different integer object; it does not change the number `10`.

This distinction matters when two names refer to the same value:

```python
x = 10
y = x
x = 20

print(x)
print(y)
```

Output:

```text
20
10
```

`y = x` makes `y` refer to the same integer object as `x`. Rebinding `x` afterward does not affect `y`. Later modules show how this works with mutable objects such as lists, where changing the object through one name is visible through another.

A visual model:

```text
x ---> 10
y ---> 10

After x = 20:

x ---> 20
y ---> 10
```

### Dynamic typing

Python does not require you to declare a type before assigning a value. The same name can refer to different types over time:

```python
value = 42
print(value)

value = "forty-two"
print(value)
```

This is flexible, but it does not remove the need to know what type a value has. Operations that work on numbers may fail on strings. Module 5 and Module 16 show how to check types and add optional hints.

### Naming rules

A variable name must follow these rules:

- It can contain letters, digits, and underscores.
- It cannot begin with a digit.
- It is case-sensitive, so `name`, `Name`, and `NAME` are different.
- It cannot be a reserved keyword such as `if`, `for`, `class`, `def`, `True`, `False`, or `None`.
- It should use ASCII letters and underscores for portability.

Valid examples:

```python
user_name = "Sam"
account_balance = 125.50
MAX_ATTEMPTS = 3
```

Invalid examples:

```text
2nd_place = "Sam"     # starts with a digit
user-name = "Sam"     # hyphen is not allowed
class = "Python"      # class is a keyword
```

### Naming conventions

PEP 8 recommends `snake_case` for variables: lowercase words separated by underscores.

```python
first_name = "Ada"
total_price = 19.99
item_count = 3
```

Use descriptive names. `total_price` is clearer than `tp`, and `elapsed_seconds` is clearer than `x`. Short names are fine for tiny, local ideas, but clarity wins in most code.

Constants are written in `UPPER_CASE` with underscores:

```python
MAX_ATTEMPTS = 3
DEFAULT_TIMEOUT = 30
```

Python does not enforce constant behavior. The naming convention tells other programmers to treat the value as fixed.

Avoid names that shadow built-in functions or types:

```python
print = "hello"
```

That assignment replaces the `print` function for the rest of the program, so later calls fail. Use a different name such as `message` or `output_text`.

### Multiple assignment and swapping

You can assign several names in one statement:

```python
x, y = 1, 2
print(x, y)
```

Output:

```text
1 2
```

The same syntax swaps values without a temporary variable:

```python
x, y = y, x
print(x, y)
```

Output:

```text
2 1
```

The right-hand side is evaluated before the new bindings are created, so the swap works as intended.

## Common Pitfalls & Anti-Patterns
- **Treating a name as a box**: A name points to an object. Rebinding one name does not change another name that pointed to the old object.
- **Assuming assignment changes every alias**: With immutable values such as integers and strings, rebinding a name creates a new binding. Mutable objects behave differently in Module 6.
- **Using `=` as an equality test**: `=` assigns. Equality testing is introduced in Module 3.
- **Starting a name with a digit**: `2nd_place` is invalid. Use `second_place`.
- **Using hyphens**: `user-name` is parsed as a subtraction expression, not one name.
- **Using a keyword**: `class`, `if`, and `for` cannot be variable names.
- **Shadowing a built-in**: Naming a variable `print`, `sum`, or `str` hides the built-in and causes confusing failures.
- **Using vague names**: `data`, `thing`, and `x` rarely explain intent. Prefer names that describe the value's role.
- **Assuming constants cannot change**: `UPPER_CASE` is a convention, not a runtime restriction.

## Quick Summary
- Assignment binds a name to a value with `=`.
- Names are labels for objects, not boxes that contain them.
- Python is dynamically typed; a name can refer to different types over time.
- Use `snake_case` for variables and `UPPER_CASE` for constants by convention.
- Names are case-sensitive and cannot start with a digit or use keywords.
- Multiple assignment supports concise initialization and swapping.
