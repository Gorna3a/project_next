---
id: "py-ws-safe-number-parser"
type: "workshop"
title: "Safe Number Parser"
moduleId: "py-mod-08-exceptions-and-files"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 45
tags: ["python", "exceptions", "try-except", "parsing"]
---

# Workshop Overview

You will parse a list of messy values without letting a single bad entry stop the program. The first step wraps an integer conversion in `try` and `except`. The second separates valid numbers from invalid input. The third builds a summary with counts, a total, and an average.

The raw data stays fixed. Every function returns a value, so the tests call the functions directly.

---

## Step 1: Convert safely

### Instructions
Define `safe_int(value)` that returns the integer value when `int(value)` succeeds. If the conversion raises `TypeError` or `ValueError`, return `None` instead.

Print `safe_int("42")`, `safe_int("not-a-number")`, and `safe_int(None)`.

### Hints
1. Put `return int(value)` inside a `try` block.
2. Catch `(TypeError, ValueError)` and return `None`.
3. Do not use a bare `except:`; catch only the errors that a failed conversion can raise.

### Starter State / Code
```python
raw_values = ["42", "not-a-number", "7.5", "", "-3", "100"]

# Define safe_int below.
```

### Solution State / Code
```python
raw_values = ["42", "not-a-number", "7.5", "", "-3", "100"]


def safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


print(safe_int("42"))
print(safe_int("not-a-number"))
print(safe_int(None))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "safe_int(\"42\")", "expected": 42, "message": "A numeric string should convert to an integer", "weight": 2, "required": true },
  { "type": "function-returns", "call": "safe_int(\"-3\")", "expected": -3, "message": "Negative numeric strings should convert", "required": true },
  { "type": "function-returns", "call": "safe_int(\"7.5\")", "expected": null, "message": "A decimal string is not a valid integer", "required": true },
  { "type": "function-returns", "call": "safe_int(\"\")", "expected": null, "message": "An empty string should return None", "required": true },
  { "type": "function-returns", "call": "safe_int(None)", "expected": null, "message": "None should return None instead of raising TypeError", "required": true },
  { "type": "code-contains", "value": "try:", "message": "Use a try block around the conversion", "required": true },
  { "type": "code-contains", "value": "ValueError", "message": "Catch ValueError", "required": true },
  { "type": "code-contains", "value": "TypeError", "message": "Catch TypeError", "required": true },
  { "type": "code-not-contains", "value": "except:", "message": "Do not use a bare except", "required": true },
  { "type": "code-not-contains", "value": "except Exception", "message": "Catch specific conversion errors, not all exceptions", "required": true }
]
```

---

## Step 2: Split valid and invalid values

### Instructions
Keep `safe_int`. Define `split_numbers(values)` that loops over the input and builds a dictionary with two keys:

- `"valid"`: the successfully converted integers, in original order
- `"invalid"`: the original values that could not be converted, in original order

Use `safe_int` inside the loop. Print `split_numbers(raw_values)`.

### Hints
1. Start with `valid = []` and `invalid = []`.
2. Call `safe_int(value)` once per item.
3. Compare with `is None` instead of `== None`; a valid conversion can produce `0`.
4. Append the original value to `invalid` when the conversion fails.

### Starter State / Code
```python
raw_values = ["42", "not-a-number", "7.5", "", "-3", "100"]


def safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


print(safe_int("42"))
print(safe_int("not-a-number"))
print(safe_int(None))

# Define split_numbers below.
```

### Solution State / Code
```python
raw_values = ["42", "not-a-number", "7.5", "", "-3", "100"]


def safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def split_numbers(values):
    valid = []
    invalid = []

    for value in values:
        number = safe_int(value)
        if number is None:
            invalid.append(value)
        else:
            valid.append(number)

    return {"valid": valid, "invalid": invalid}


print(safe_int("42"))
print(safe_int("not-a-number"))
print(safe_int(None))
print(split_numbers(raw_values))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "split_numbers(raw_values)", "expected": {"valid": [42, -3, 100], "invalid": ["not-a-number", "7.5", ""]}, "message": "The parser should keep valid integers and the original invalid values in order", "weight": 3, "required": true },
  { "type": "function-returns", "call": "split_numbers([])", "expected": {"valid": [], "invalid": []}, "message": "An empty input should produce two empty lists", "required": true },
  { "type": "function-returns", "call": "split_numbers([\"1\", \"2\", \"x\"])", "expected": {"valid": [1, 2], "invalid": ["x"]}, "message": "split_numbers should work with a different list", "required": true },
  { "type": "function-returns", "call": "split_numbers([\"0\", \"bad\"])", "expected": {"valid": [0], "invalid": ["bad"]}, "message": "A valid zero should not be treated as a failed conversion", "weight": 2, "required": true },
  { "type": "code-contains", "value": "for value in values", "message": "Loop over the input values", "required": true },
  { "type": "code-contains", "value": "safe_int(value)", "message": "Reuse safe_int for each conversion", "required": true },
  { "type": "code-contains", "value": "invalid.append", "message": "Collect invalid values in a list", "required": true },
  { "type": "code-contains", "value": "valid.append", "message": "Collect valid numbers in a list", "required": true }
]
```

---

## Step 3: Summarize the results

### Instructions
Keep the previous functions. Define `summarize(values)` that calls `split_numbers(values)` and returns a dictionary with four keys:

- `"count"`: the number of valid values
- `"total"`: the sum of the valid values
- `"average"`: the average of the valid values, rounded to two decimal places
- `"invalid"`: the number of invalid values

When there are no valid values, return an average of `0.0` instead of dividing by zero. Print `summarize(raw_values)`.

### Hints
1. Call `split_numbers(values)` first and store the result.
2. `sum(valid)` and `len(valid)` give the total and count.
3. Wrap the division in `try`/`except ZeroDivisionError`, or check that the list is non-empty before dividing.

### Starter State / Code
```python
raw_values = ["42", "not-a-number", "7.5", "", "-3", "100"]


def safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def split_numbers(values):
    valid = []
    invalid = []

    for value in values:
        number = safe_int(value)
        if number is None:
            invalid.append(value)
        else:
            valid.append(number)

    return {"valid": valid, "invalid": invalid}


print(safe_int("42"))
print(safe_int("not-a-number"))
print(safe_int(None))
print(split_numbers(raw_values))

# Define summarize below.
```

### Solution State / Code
```python
raw_values = ["42", "not-a-number", "7.5", "", "-3", "100"]


def safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def split_numbers(values):
    valid = []
    invalid = []

    for value in values:
        number = safe_int(value)
        if number is None:
            invalid.append(value)
        else:
            valid.append(number)

    return {"valid": valid, "invalid": invalid}


def summarize(values):
    parts = split_numbers(values)
    valid = parts["valid"]
    total = sum(valid)

    try:
        average = round(total / len(valid), 2)
    except ZeroDivisionError:
        average = 0.0

    return {
        "count": len(valid),
        "total": total,
        "average": average,
        "invalid": len(parts["invalid"]),
    }


print(safe_int("42"))
print(safe_int("not-a-number"))
print(safe_int(None))
print(split_numbers(raw_values))
print(summarize(raw_values))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "summarize(raw_values)", "expected": {"count": 3, "total": 139, "average": 46.33, "invalid": 3}, "message": "The summary should contain the correct count, total, average, and invalid count", "weight": 3, "required": true },
  { "type": "function-returns", "call": "summarize([])", "expected": {"count": 0, "total": 0, "average": 0.0, "invalid": 0}, "message": "An empty input should produce a zero average, not a division error", "weight": 2, "required": true },
  { "type": "function-returns", "call": "summarize([\"10\", \"bad\", \"20\"])", "expected": {"count": 2, "total": 30, "average": 15.0, "invalid": 1}, "message": "summarize should work with a different mix of values", "required": true },
  { "type": "code-contains", "value": "split_numbers(values)", "message": "Reuse split_numbers", "required": true },
  { "type": "code-contains", "value": "sum(valid)", "message": "Sum the valid values", "required": true },
  { "type": "code-contains", "value": "len(valid)", "message": "Count the valid values", "required": true },
  { "type": "code-not-contains", "value": "except:", "message": "Do not use a bare except", "required": true },
  { "type": "code-not-contains", "value": "except Exception", "message": "Catch specific errors, not all exceptions", "required": true }
]
```
