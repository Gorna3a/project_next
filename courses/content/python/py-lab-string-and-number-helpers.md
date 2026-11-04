---
id: "py-lab-string-and-number-helpers"
type: "lab"
title: "String and Number Helpers"
moduleId: "py-mod-05-functions"
order: 7
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 30
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "functions", "args", "strings"]
---

# Objective

Build three small helper functions: one limits a number to a range, one averages any number of values, and one checks whether text is a palindrome. Each function returns its result so the tests can call it directly.

## Requirements
- Define `clamp(value, low, high)`. Return `low` when `value` is below the range, `high` when it is above the range, and `value` otherwise. Assume `low <= high`.
- Define `average(*numbers)` using `*args`. Return the arithmetic mean of the values. Return `0.0` when no numbers are supplied.
- Define `is_palindrome(text)`. Return `True` when the text reads the same forwards and backwards after converting it to lowercase and removing spaces. Return `False` otherwise.
- Use `return` in every function; do not print the results.
- Do not use imports, `input()`, or third-party packages.
- Keep the exact function names and parameter order shown above.

## Starter State / Workspace
```python
def clamp(value, low, high):
    """Return value limited to the range low through high."""
    # TODO: return the clamped value.
    pass


def average(*numbers):
    """Return the arithmetic mean, or 0.0 when no numbers are given."""
    # TODO: total the numbers and divide by the count.
    pass


def is_palindrome(text):
    """Return True when text reads the same backwards, ignoring case and spaces."""
    # TODO: normalize the text and compare it with its reverse.
    pass
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "clamp(15, 0, 10)", "expected": 10, "message": "A value above the range should return high", "weight": 2, "required": true },
  { "type": "function-returns", "call": "clamp(-3, 0, 10)", "expected": 0, "message": "A value below the range should return low", "required": true },
  { "type": "function-returns", "call": "clamp(5, 0, 10)", "expected": 5, "message": "A value inside the range should return unchanged", "required": true },
  { "type": "function-returns", "call": "clamp(10, 0, 10)", "expected": 10, "message": "A value equal to the upper bound should return unchanged", "required": true },
  { "type": "function-returns", "call": "round(average(2, 4, 6), 2)", "expected": 4.0, "message": "average(2, 4, 6) should return 4.0", "weight": 2, "required": true },
  { "type": "function-returns", "call": "round(average(10), 2)", "expected": 10.0, "message": "A single value should average to itself", "required": true },
  { "type": "function-returns", "call": "round(average(1, 2), 2)", "expected": 1.5, "message": "The average should support fractional results", "required": true },
  { "type": "function-returns", "call": "round(average(), 2)", "expected": 0.0, "message": "No arguments should return 0.0", "required": true },
  { "type": "function-returns", "call": "is_palindrome(\"level\")", "expected": true, "message": "level is a palindrome", "weight": 2, "required": true },
  { "type": "function-returns", "call": "is_palindrome(\"Racecar\")", "expected": true, "message": "The check should ignore case", "required": true },
  { "type": "function-returns", "call": "is_palindrome(\"Never odd or even\")", "expected": true, "message": "The check should ignore spaces", "required": true },
  { "type": "function-returns", "call": "is_palindrome(\"hello\")", "expected": false, "message": "hello is not a palindrome", "required": true },
  { "type": "code-contains", "value": "def clamp", "message": "Define the clamp function", "required": true },
  { "type": "code-contains", "value": "def average", "message": "Define the average function", "required": true },
  { "type": "code-contains", "value": "def is_palindrome", "message": "Define the is_palindrome function", "required": true },
  { "type": "code-contains", "value": "*numbers", "message": "Use *args to collect the numbers", "required": true },
  { "type": "code-contains", "value": "if not numbers", "message": "Handle the empty average case", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** In `clamp`, check the low boundary first, then the high boundary. If neither condition matches, the original value is already in range.

> [!TIP]
> **Hint 2:** In `average`, handle the empty case before dividing. `if not numbers` is true when the tuple is empty. Then accumulate a total and divide by `len(numbers)`.

> [!TIP]
> **Hint 3:** In `is_palindrome`, build a cleaned string with `text.lower().replace(" ", "")`. Compare it to `cleaned[::-1]`, which is the reversed slice.

## Reference Solution
```python
def clamp(value, low, high):
    """Return value limited to the range low through high."""
    if value < low:
        return low
    if value > high:
        return high
    return value


def average(*numbers):
    """Return the arithmetic mean, or 0.0 when no numbers are given."""
    if not numbers:
        return 0.0
    total = 0
    for number in numbers:
        total += number
    return total / len(numbers)


def is_palindrome(text):
    """Return True when text reads the same backwards, ignoring case and spaces."""
    cleaned = text.lower().replace(" ", "")
    return cleaned == cleaned[::-1]
```
