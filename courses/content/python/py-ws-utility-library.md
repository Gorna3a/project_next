---
id: "py-ws-utility-library"
type: "workshop"
title: "Build a Utility Library"
moduleId: "py-mod-05-functions"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 45
tags: ["python", "functions", "parameters", "utilities"]
---

# Workshop Overview

You will build a small library of four reusable functions: `celsius_to_fahrenheit`, `is_even`, `shout`, and `sum_all`. Each step adds one function and checks its behavior directly, without comparing printed output.

By the end, you will have practiced return values, default arguments, string methods, loops, and `*args`.

---

## Step 1: Convert Celsius to Fahrenheit

### Instructions
Define a function named `celsius_to_fahrenheit` that takes a Celsius temperature and returns the Fahrenheit equivalent. Use the formula `celsius * 9 / 5 + 32`.

Call the function with `0` and print the result to confirm it returns `32.0`.

### Hints
1. The function needs one parameter, such as `celsius`.
2. Use `return` so the caller receives the converted value.
3. Multiply before dividing to follow the formula exactly.

### Starter State / Code
```python
# Define celsius_to_fahrenheit below.
```

### Solution State / Code
```python
def celsius_to_fahrenheit(celsius):
    """Convert a Celsius temperature to Fahrenheit."""
    return celsius * 9 / 5 + 32


print(celsius_to_fahrenheit(0))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "round(celsius_to_fahrenheit(0), 2)", "expected": 32.0, "message": "celsius_to_fahrenheit(0) should return 32.0", "weight": 2, "required": true },
  { "type": "function-returns", "call": "round(celsius_to_fahrenheit(100), 2)", "expected": 212.0, "message": "celsius_to_fahrenheit(100) should return 212.0", "required": true },
  { "type": "function-returns", "call": "round(celsius_to_fahrenheit(-40), 2)", "expected": -40.0, "message": "celsius_to_fahrenheit(-40) should return -40.0", "required": true },
  { "type": "function-throws", "call": "celsius_to_fahrenheit()", "errorType": "TypeError", "message": "The function should require one argument", "required": true },
  { "type": "code-contains", "value": "def celsius_to_fahrenheit", "message": "Define the celsius_to_fahrenheit function", "required": true }
]
```

---

## Step 2: Check for even numbers

### Instructions
Keep `celsius_to_fahrenheit`. Add a function named `is_even` that takes a number and returns `True` when it is even and `False` otherwise.

Call `is_even(4)` and print the result.

### Hints
1. The remainder operator `%` gives what is left after division.
2. An even number has a remainder of `0` when divided by `2`.
3. Return the comparison directly; it already produces a boolean.

### Starter State / Code
```python
def celsius_to_fahrenheit(celsius):
    """Convert a Celsius temperature to Fahrenheit."""
    return celsius * 9 / 5 + 32


print(celsius_to_fahrenheit(0))

# Add is_even below.
```

### Solution State / Code
```python
def celsius_to_fahrenheit(celsius):
    """Convert a Celsius temperature to Fahrenheit."""
    return celsius * 9 / 5 + 32


def is_even(number):
    """Return True when number is even."""
    return number % 2 == 0


print(celsius_to_fahrenheit(0))
print(is_even(4))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "is_even(4)", "expected": true, "message": "is_even(4) should return True", "weight": 2, "required": true },
  { "type": "function-returns", "call": "is_even(7)", "expected": false, "message": "is_even(7) should return False", "required": true },
  { "type": "function-returns", "call": "is_even(0)", "expected": true, "message": "Zero should count as even", "required": true },
  { "type": "code-contains", "value": "number % 2 == 0", "message": "Use the remainder operator to test for even numbers", "required": true }
]
```

---

## Step 3: Shout with a default

### Instructions
Keep the previous functions. Add a function named `shout` that takes `text` and an optional `punctuation` argument defaulting to `"!"`. It should return the text in uppercase with the punctuation appended.

Call `shout("hello")` and `shout("hello", "?")`, then print both results.

### Hints
1. Strings have an `upper()` method that returns a new uppercase string.
2. Put the default value in the definition: `punctuation="!"`.
3. Concatenate with `+` after converting the text to uppercase.

### Starter State / Code
```python
def celsius_to_fahrenheit(celsius):
    """Convert a Celsius temperature to Fahrenheit."""
    return celsius * 9 / 5 + 32


def is_even(number):
    """Return True when number is even."""
    return number % 2 == 0


print(celsius_to_fahrenheit(0))
print(is_even(4))

# Add shout below.
```

### Solution State / Code
```python
def celsius_to_fahrenheit(celsius):
    """Convert a Celsius temperature to Fahrenheit."""
    return celsius * 9 / 5 + 32


def is_even(number):
    """Return True when number is even."""
    return number % 2 == 0


def shout(text, punctuation="!"):
    """Return text in uppercase with punctuation appended."""
    return text.upper() + punctuation


print(celsius_to_fahrenheit(0))
print(is_even(4))
print(shout("hello"))
print(shout("hello", "?"))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "shout(\"hello\")", "expected": "HELLO!", "message": "shout(\"hello\") should return HELLO!", "weight": 2, "required": true },
  { "type": "function-returns", "call": "shout(\"hello\", \"?\")", "expected": "HELLO?", "message": "shout(\"hello\", \"?\") should return HELLO?", "required": true },
  { "type": "function-returns", "call": "shout(\"hello\", punctuation=\".\")", "expected": "HELLO.", "message": "The punctuation argument should work by keyword", "required": true },
  { "type": "code-contains", "value": "text.upper()", "message": "Convert the text to uppercase", "required": true }
]
```

---

## Step 4: Sum any number of arguments

### Instructions
Keep the previous functions. Add a function named `sum_all` that accepts any number of numeric positional arguments and returns their sum.

Use `*args` to collect the arguments, loop over them, and accumulate a total. Call `sum_all(1, 2, 3)` and print the result.

### Hints
1. A parameter written as `*numbers` collects extra positional arguments into a tuple.
2. Start `total` at `0` and add each value in a `for` loop.
3. Return the total after the loop, not inside it.

### Starter State / Code
```python
def celsius_to_fahrenheit(celsius):
    """Convert a Celsius temperature to Fahrenheit."""
    return celsius * 9 / 5 + 32


def is_even(number):
    """Return True when number is even."""
    return number % 2 == 0


def shout(text, punctuation="!"):
    """Return text in uppercase with punctuation appended."""
    return text.upper() + punctuation


print(celsius_to_fahrenheit(0))
print(is_even(4))
print(shout("hello"))
print(shout("hello", "?"))

# Add sum_all below.
```

### Solution State / Code
```python
def celsius_to_fahrenheit(celsius):
    """Convert a Celsius temperature to Fahrenheit."""
    return celsius * 9 / 5 + 32


def is_even(number):
    """Return True when number is even."""
    return number % 2 == 0


def shout(text, punctuation="!"):
    """Return text in uppercase with punctuation appended."""
    return text.upper() + punctuation


def sum_all(*numbers):
    """Return the sum of any number of numeric arguments."""
    total = 0
    for number in numbers:
        total += number
    return total


print(celsius_to_fahrenheit(0))
print(is_even(4))
print(shout("hello"))
print(shout("hello", "?"))
print(sum_all(1, 2, 3))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "sum_all(1, 2, 3)", "expected": 6, "message": "sum_all(1, 2, 3) should return 6", "weight": 2, "required": true },
  { "type": "function-returns", "call": "sum_all()", "expected": 0, "message": "sum_all() should return 0 with no arguments", "required": true },
  { "type": "function-returns", "call": "sum_all(10, -2, 5)", "expected": 13, "message": "sum_all should handle positive and negative values", "required": true },
  { "type": "code-contains", "value": "*numbers", "message": "Collect the arguments with *numbers", "required": true },
  { "type": "code-contains", "value": "for number in numbers", "message": "Loop over the collected arguments", "required": true }
]
```
