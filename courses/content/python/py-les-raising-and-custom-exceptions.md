---
id: "py-les-raising-and-custom-exceptions"
type: "theory"
title: "Raising and Custom Exceptions"
moduleId: "py-mod-08-exceptions-and-files"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "exceptions", "raise", "custom-exceptions", "assert"]
---

# Concept Overview

Some failures cannot be handled inside the function that detects them. A validation function may know that a score is out of range, but only the caller knows what to do about it. Raising an exception reports the problem upward and lets the caller decide whether to recover.

Python lets you raise built-in exceptions, define small custom exception types, and connect a new exception to the original one with `raise ... from`. The `assert` statement is a related tool for internal invariants, but it is not a replacement for validating user input.

## Key Principles & Frameworks

### Raising a built-in exception

Use `raise` with an exception instance and a clear message:

```python
def validate_age(age):
    if age < 0:
        raise ValueError("age cannot be negative")
    return age


try:
    validate_age(-1)
except ValueError as error:
    print(str(error))
```

Output:

```text
age cannot be negative
```

`raise ValueError("age cannot be negative")` creates the exception and immediately stops the function. The caller's `except` clause receives it. The message should say what is wrong and, when useful, which value caused the problem.

### A custom exception template

A custom exception gives callers a specific type to catch. The minimal definition is two lines:

```python
class ValidationError(Exception):
    pass
```

`class` defines a new type, and `Exception` is its parent. `pass` means the body adds nothing else. Classes are covered fully in Module 9; for now, treat this as the standard template for a small exception type.

Use the custom exception in the same way as a built-in:

```python
class ValidationError(Exception):
    pass


def validate_age(age):
    if age < 0:
        raise ValidationError("age cannot be negative")
    return age


try:
    validate_age(-1)
except ValidationError as error:
    print(type(error).__name__)
    print(str(error))
```

Output:

```text
ValidationError
age cannot be negative
```

`type(error).__name__` is the exception's class name. `str(error)` returns the message passed to it. Catching `ValidationError` does not accidentally catch unrelated `ValueError` or `TypeError` failures.

### Why custom exceptions help

A custom type lets callers distinguish a domain problem from a library problem. If a report validator raises `ValidationError`, the caller can show a friendly message for bad rows while still letting programming mistakes crash the program. It also makes tests precise: a test can require `ValidationError` instead of accepting any error.

Keep the custom type small. The template with `pass` is enough for this module. A later module can add fields or behavior when classes are covered in depth.

### Chaining with raise from

When a low-level exception causes your higher-level exception, preserve the connection with `raise ... from`:

```python
class ValidationError(Exception):
    pass


def parse_age(text):
    try:
        age = int(text)
    except ValueError as error:
        raise ValidationError("age must be an integer") from error
    return age


try:
    parse_age("abc")
except ValidationError as error:
    print(str(error))
    print(type(error.__cause__).__name__)
```

Output:

```text
age must be an integer
ValueError
```

The `ValidationError` is what the caller sees, and `error.__cause__` points to the original `ValueError`. A traceback shows both exceptions and the message "The above exception was the direct cause of the following exception". This is much easier to debug than replacing the original error with no context.

Without `from`, Python still records the original as implicit context in many cases, but `raise ... from` makes the relationship explicit. Use it whenever you translate one exception into another.

### Re-raising the current exception

A bare `raise` inside an `except` block re-raises the exception that is currently being handled:

```python
def log_and_reraise(text):
    try:
        int(text)
    except ValueError:
        print("Conversion failed")
        raise
```

Calling `log_and_reraise("abc")` prints `Conversion failed` and then lets the original `ValueError` continue with its traceback. Use this pattern when you want to record or annotate a failure without hiding it. A bare `raise` outside an active `except` block raises `RuntimeError`.

### Assertions

`assert condition, "message"` raises `AssertionError` when the condition is false:

```python
def average(values):
    assert len(values) > 0, "values cannot be empty"
    return sum(values) / len(values)


print(average([2, 4, 6]))
```

Output:

```text
4.0
```

When the check fails, the message is available through `str(error)`:

```python
def average(values):
    assert len(values) > 0, "values cannot be empty"
    return sum(values) / len(values)


try:
    average([])
except AssertionError as error:
    print(str(error))
```

Output:

```text
values cannot be empty
```

Use `assert` for invariants that should always hold if the program is correct, such as internal assumptions and development checks. Do not use it to validate user input: Python can run with assertions disabled using `python -O`, which removes the checks entirely. Raise `ValueError` or `ValidationError` for input that can legitimately be wrong.

### Raising a string is an error

Exceptions must be instances of a class derived from `BaseException`. Raising a string produces a `TypeError` instead of the exception you intended:

```python
try:
    raise "something went wrong"
except TypeError as error:
    print(str(error))
```

Output:

```text
exceptions must derive from BaseException
```

Always raise an exception instance, usually with a message: `raise ValueError("...")`. A custom exception must inherit from `Exception`; a plain class does not qualify.

## Common Pitfalls & Anti-Patterns
- **Raising a string**: `raise "error"` produces `TypeError`. Raise an exception instance.
- **Defining a custom exception without inheriting from `Exception`**: `class ValidationError: pass` is not raisable as an exception. Use `class ValidationError(Exception): pass`.
- **Using `assert` for user input**: Assertions can be disabled with `python -O`. Raise a real exception for data validation.
- **Losing the original cause**: When translating an exception, use `raise NewError(...) from error`.
- **Raising a bare `Exception`**: A specific built-in or custom type lets callers handle the problem precisely.
- **Using a bare `raise` outside `except`**: There is no active exception, so Python raises `RuntimeError`.
- **Raising without a useful message**: A message should identify the problem and the bad value when helpful.
- **Catching an error only to re-raise it unchanged**: Let it propagate instead; add context only when it helps.
- **Swallowing the error after raising a replacement**: Do not catch and pass; either handle the problem or report it.
- **Relying on `__cause__` being set without `from`**: Use `raise ... from` to make the chain explicit.

## Quick Summary
- `raise ValueError("message")` reports a failure to the caller.
- `class ValidationError(Exception): pass` defines a minimal custom exception.
- Custom exceptions let callers catch domain failures precisely.
- `raise ... from error` preserves the original cause.
- A bare `raise` inside `except` re-raises the current exception.
- `assert condition, "message"` raises `AssertionError` when the condition is false.
- Use `assert` for internal invariants, not user input.
- Raise exception instances, never strings.
- Catch specific exceptions, and let unexpected failures surface.
