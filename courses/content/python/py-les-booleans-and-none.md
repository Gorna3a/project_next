---
id: "py-les-booleans-and-none"
type: "theory"
title: "Booleans and None"
moduleId: "py-mod-02-variables-and-data-types"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 15
tags: ["python", "booleans", "none", "truthiness"]
---

# Concept Overview

Python has two boolean values: `True` and `False`. They represent yes/no states such as "the task is finished" or "the user is signed in." The type is called `bool`.

`None` is a separate special value that represents the absence of a value. It is not the same as `False`, `0`, or the string `"None"`.

## Key Principles & Frameworks

### Boolean values

Boolean literals are capitalized:

```python
is_ready = True
is_finished = False

print(is_ready)
print(is_finished)
```

Output:

```text
True
False
```

The lowercase versions `true` and `false` are not valid Python literals. They are undefined names and produce an error.

Booleans are the result of comparisons and logical operations, which are introduced in Module 3. For now, you can assign them directly and pass them to `print()` or `bool()`.

### None

`None` represents "no value" or "nothing here yet."

```python
result = None
print(result)
```

Output:

```text
None
```

`None` is useful as a placeholder before a real value is available. It is also the value a function returns when it has no `return` statement, which you will see in Module 5.

`None` is a single special object. It is not the empty string, not `0`, and not `False`. Its type is called `NoneType`.

### Truthiness

Every value can be tested for truthiness. `bool()` converts a value to `True` or `False`:

```python
print(bool(0))
print(bool(1))
print(bool(-1))
print(bool(0.0))
print(bool(""))
print(bool("False"))
print(bool(None))
```

Output:

```text
False
True
True
False
False
True
False
```

The rules for the values introduced so far:

- `0`, `0.0`, and `None` are falsy.
- An empty string `""` is falsy.
- Most other values are truthy, including negative numbers and non-empty strings.
- The string `"False"` is truthy because it contains characters. Only the boolean value `False` is false.

Truthiness matters because conditions treat values as true or false. Module 3 introduces `if` statements and logical operators.

### Choosing between False and None

Use `False` when the answer is a definite "no." Use `None` when there is no answer yet, or when the value is intentionally absent.

```python
is_subscribed = False
last_login = None
```

`is_subscribed` says the user is not subscribed. `last_login` says no login time is available. The two states are different.

## Common Pitfalls & Anti-Patterns
- **Writing lowercase literals**: `true`, `false`, and `none` are undefined. Use `True`, `False`, and `None`.
- **Treating `"False"` as false**: A non-empty string is truthy. `bool("False")` is `True`.
- **Confusing `None` with `False`**: Both are falsy, but they are different values with different meanings.
- **Confusing `None` with an empty string**: `None` means no value; `""` is a string of length zero.
- **Testing truthiness when you mean a specific value**: A negative number is truthy even though it is less than zero. Conditions in Module 3 will make this distinction clearer.
- **Assuming all non-zero numbers are true**: That part is correct, but `0.0` is also falsy. Floating-point zero behaves like integer zero in a truth test.

## Quick Summary
- `True` and `False` are the two `bool` values.
- `None` represents the absence of a value and has type `NoneType`.
- `0`, `0.0`, `None`, and `""` are falsy; most other values are truthy.
- `bool(value)` tests truthiness.
- The string `"False"` is truthy because it is non-empty.
