---
id: "py-lab-validation-decorators"
type: "lab"
title: "Validation Decorators"
moduleId: "py-mod-11-decorators-and-context-managers"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "decorators", "validation", "factories"]
---

# Objective

Build a decorator factory that validates a numeric argument before calling the original function. Apply it to a small function and keep the original function's metadata.

The tests call your function directly. Keep the implementation free of prompts and printed output.

## Requirements
- Import `wraps` from `functools`.
- Define `validate_range(minimum, maximum)` that returns a decorator.
- The decorator should wrap a function and check its first positional argument.
- If the argument is less than `minimum` or greater than `maximum`, raise `ValueError` with the message `value must be between {minimum} and {maximum}`.
- Otherwise call the original function and return its result.
- Preserve the original function's name and docstring with `wraps`.
- Define `area_of_square(side)` that returns `side * side` and is decorated with `validate_range(1, 10)`.
- Do not print inside the functions.

## Starter State / Workspace
```python
from functools import wraps

# Define validate_range and area_of_square below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "area_of_square(4)", "expected": 16, "message": "A valid side should return its square", "weight": 2, "required": true },
  { "type": "function-returns", "call": "area_of_square(1)", "expected": 1, "message": "The lower bound should be allowed", "required": true },
  { "type": "function-returns", "call": "area_of_square(10)", "expected": 100, "message": "The upper bound should be allowed", "required": true },
  { "type": "function-throws", "call": "area_of_square(0)", "errorType": "ValueError", "message": "A value below the minimum should raise ValueError", "weight": 2, "required": true },
  { "type": "function-throws", "call": "area_of_square(11)", "errorType": "ValueError", "message": "A value above the maximum should raise ValueError", "required": true },
  { "type": "function-returns", "call": "area_of_square.__name__", "expected": "area_of_square", "message": "wraps should preserve the function name", "required": true },
  { "type": "function-returns", "call": "area_of_square.__doc__", "expected": "Return the area of a square.", "message": "wraps should preserve the docstring", "required": true },
  { "type": "code-contains", "value": "def validate_range(minimum, maximum)", "message": "Define the factory", "required": true },
  { "type": "code-contains", "value": "def decorator(func)", "message": "Return a decorator from the factory", "required": true },
  { "type": "code-contains", "value": "def wrapper(value)", "message": "Wrap a function with one value", "required": true },
  { "type": "code-contains", "value": "@wraps(func)", "message": "Use functools.wraps", "required": true },
  { "type": "code-contains", "value": "raise ValueError", "message": "Raise ValueError for invalid values", "required": true },
  { "type": "code-contains", "value": "validate_range(1, 10)", "message": "Apply the factory with the requested range", "required": true },
  { "type": "code-contains", "value": "value must be between", "message": "Use the required error message", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** `validate_range(minimum, maximum)` should return `decorator`, and `decorator(func)` should return `wrapper`.

> [!TIP]
> **Hint 2:** Inside `wrapper(value)`, check `value < minimum or value > maximum`. If so, raise `ValueError(f"value must be between {minimum} and {maximum}")`.

> [!TIP]
> **Hint 3:** Apply `@wraps(func)` to `wrapper`, then return `func(value)` when validation passes.

> [!TIP]
> **Hint 4:** Decorate `area_of_square` with `@validate_range(1, 10)` and give it a docstring that says `Return the area of a square.`.

## Reference Solution
```python
from functools import wraps


def validate_range(minimum, maximum):
    def decorator(func):
        @wraps(func)
        def wrapper(value):
            if value < minimum or value > maximum:
                raise ValueError(f"value must be between {minimum} and {maximum}")
            return func(value)
        return wrapper
    return decorator


@validate_range(1, 10)
def area_of_square(side):
    """Return the area of a square."""
    return side * side
```
