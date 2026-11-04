---
id: "py-lab-typed-stats-module"
type: "lab"
title: "Typed Stats Module"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 8
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "typing", "doctest", "stats", "annotations"]
---

# Objective

You are given a small module with working functions but no type hints and no doctests. Add type hints to every function and add doctests so that function behavior, doctests, and the module print check all pass.

The finished module defines `mean`, `median`, and `maximum` with full annotations. Each function has a three-line docstring with one doctest. Running the module prints `done` and exits without error. Running `python -m doctest` on the file reports no failures.

## Requirements
- Keep the function names `mean`, `median`, and `maximum` with the same parameter names.
- Annotate every parameter as `list[int]` and every return value as `float` for `mean` and `median`, and `int` for `maximum`.
- Add a three-line docstring to each function with one doctest example and the exact expected output.
- Keep behavior identical: `mean` returns `round(sum(values) / len(values), 2)`. `median` returns the middle value (or the rounded average of the two middle values) as a float. `maximum` returns `max(values)`.
- Keep the final `print("done")` line.
- Do not use `Any`, `input()`, `random`, or the current time.
- Do not print inside the functions.

## Starter State / Workspace
```python
def mean(values):
    return round(sum(values) / len(values), 2)


def median(values):
    ordered = sorted(values)
    count = len(ordered)
    middle = count // 2
    if count % 2 == 1:
        return float(ordered[middle])
    return round((ordered[middle - 1] + ordered[middle]) / 2, 2)


def maximum(values):
    return max(values)


print("done")
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "mean([2, 4, 6])", "expected": 4.0, "message": "mean should average the values", "weight": 2, "required": true },
  { "type": "function-returns", "call": "median([3, 1, 2])", "expected": 2.0, "message": "median of an odd count should return the middle value", "weight": 2, "required": true },
  { "type": "function-returns", "call": "median([1, 2, 3, 4])", "expected": 2.5, "message": "median of an even count should average the two middle values", "weight": 2, "required": true },
  { "type": "function-returns", "call": "maximum([3, 9, 2])", "expected": 9, "message": "maximum should return the largest value", "weight": 2, "required": true },
  { "type": "output-contains", "value": "done", "message": "The module should print done", "required": true },
  { "type": "code-contains", "value": "values: list[int]", "message": "Annotate each list parameter", "required": true },
  { "type": "code-contains", "value": "-> float", "message": "Annotate mean and median returns as float", "required": true },
  { "type": "code-contains", "value": "-> int", "message": "Annotate maximum return as int", "required": true },
  { "type": "code-contains", "value": "def mean(values: list[int])", "message": "Define mean with its annotation", "required": true },
  { "type": "code-contains", "value": "def median(values: list[int])", "message": "Define median with its annotation", "required": true },
  { "type": "code-contains", "value": "def maximum(values: list[int])", "message": "Define maximum with its annotation", "required": true },
  { "type": "code-contains", "value": ">>>", "message": "Add doctests with the doctest marker", "required": true },
  { "type": "code-contains", "value": ">>> mean([2, 4, 6])", "message": "mean should have a doctest example", "required": true },
  { "type": "code-contains", "value": ">>> median([1, 2, 3, 4])", "message": "median should have a doctest example", "required": true },
  { "type": "code-contains", "value": ">>> maximum([3, 9, 2])", "message": "maximum should have a doctest example", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** A module docstring is optional here. Each function needs its own three-line docstring with one example.

> [!TIP]
> **Hint 2:** Write the doctest line as `>>> mean([2, 4, 6])` and the next line as `4.0`. The output must match exactly.

> [!TIP]
> **Hint 3:** `median([1, 2, 3, 4])` gives `2.5` and `maximum([3, 9, 2])` gives `9`. Use those values in the doctests.

> [!TIP]
> **Hint 4:** The median docstring line `>>> median([1, 2, 3, 4])` needs `2.5` as its output. The maximum docstring line `>>> maximum([3, 9, 2])` needs `9` as its output.

## Reference Solution
```python
def mean(values: list[int]) -> float:
    """Return the rounded mean.

    >>> mean([2, 4, 6])
    4.0
    """
    return round(sum(values) / len(values), 2)


def median(values: list[int]) -> float:
    """Return the median as a float.

    >>> median([1, 2, 3, 4])
    2.5
    """
    ordered = sorted(values)
    count = len(ordered)
    middle = count // 2
    if count % 2 == 1:
        return float(ordered[middle])
    return round((ordered[middle - 1] + ordered[middle]) / 2, 2)


def maximum(values: list[int]) -> int:
    """Return the largest value.

    >>> maximum([3, 9, 2])
    9
    """
    return max(values)


print("done")
```
