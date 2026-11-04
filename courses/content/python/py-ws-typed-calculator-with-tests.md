---
id: "py-ws-typed-calculator-with-tests"
type: "workshop"
title: "Typed Calculator with Tests"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
tags: ["python", "typing", "doctest", "unittest"]
---

# Workshop Overview

You will build a small typed calculator module step by step. Each step keeps the previous functions and adds a new piece.

Step 1 writes typed `add` and `subtract` functions. Step 2 adds a typed `multiply_many` function. Step 3 adds a doctest to `multiply_many` and checks it with `python -m doctest`. Step 4 adds a `unittest` class that tests the calculator and prints the test result.

The final file defines three typed functions, includes a passing doctest in `multiply_many`, and runs a passing `unittest` class when executed.

---

## Step 1: Typed add and subtract

### Instructions
Define `add(a: int, b: int) -> int` that returns `a + b`. Define `subtract(a: int, b: int) -> int` that returns `a - b`. Both functions must have parameter and return annotations.

### Hints
1. Add `: int` after each parameter name.
2. Add `-> int` before the colon of the `def` line.
3. Return the arithmetic result directly.

### Starter State / Code
```python
# Define add(a: int, b: int) -> int
# Define subtract(a: int, b: int) -> int
```

### Solution State / Code
```python
def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "add(2, 3)", "expected": 5, "message": "add(2, 3) should return 5", "weight": 2, "required": true },
  { "type": "function-returns", "call": "subtract(5, 3)", "expected": 2, "message": "subtract(5, 3) should return 2", "weight": 2, "required": true },
  { "type": "function-returns", "call": "add(-1, 1)", "expected": 0, "message": "add should handle negative numbers", "required": true },
  { "type": "code-contains", "value": "-> int", "message": "Annotate return values with int", "required": true },
  { "type": "code-contains", "value": "def add(a: int, b: int)", "message": "Annotate add parameters", "required": true }
]
```

---

## Step 2: Typed multiply_many

### Instructions
Keep `add` and `subtract`. Define `multiply_many(values: list[int]) -> int` that returns the product of every value in `values`. The product of an empty list is `1`. Print `"ready"` at the end of the module.

### Hints
1. Start with `result = 1`.
2. Loop with `for value in values` and multiply into `result`.
3. Annotate the parameter as `list[int]` and the return as `int`.

### Starter State / Code
```python
def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b

# Define multiply_many below.
```

### Solution State / Code
```python
def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b


def multiply_many(values: list[int]) -> int:
    result = 1
    for value in values:
        result *= value
    return result


print("ready")
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "multiply_many([2, 3, 4])", "expected": 24, "message": "multiply_many should multiply every value", "weight": 2, "required": true },
  { "type": "function-returns", "call": "multiply_many([])", "expected": 1, "message": "An empty list should give the product 1", "required": true },
  { "type": "function-returns", "call": "multiply_many([5])", "expected": 5, "message": "A single value should return that value", "required": true },
  { "type": "output-contains", "value": "ready", "message": "Print ready at the end of the module", "required": true },
  { "type": "code-contains", "value": "values: list[int]", "message": "Annotate values as list[int]", "required": true }
]
```

---

## Step 3: Add a doctest

### Instructions
Keep the three functions. Add a docstring to `multiply_many` that contains a doctest with one example. The example must show `multiply_many([2, 3, 4])` and the expected result `24`. Keep the printed `ready` line at the end.

### Hints
1. Place a triple-quoted string directly below the `def` line.
2. Write the example as `>>> multiply_many([2, 3, 4])`.
3. Put the expected output `24` on the next line, unchanged.

### Starter State / Code
```python
def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b


def multiply_many(values: list[int]) -> int:
    result = 1
    for value in values:
        result *= value
    return result


print("ready")
```

### Solution State / Code
```python
def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b


def multiply_many(values: list[int]) -> int:
    """Return the product of every value.

    >>> multiply_many([2, 3, 4])
    24
    """
    result = 1
    for value in values:
        result *= value
    return result


print("ready")
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "multiply_many([2, 3, 4])", "expected": 24, "message": "multiply_many should still return the product", "weight": 2, "required": true },
  { "type": "output-contains", "value": "ready", "message": "The module should still print ready", "required": true },
  { "type": "code-contains", "value": "multiply_many([2, 3, 4])", "message": "The doctest should call multiply_many", "required": true },
  { "type": "code-contains", "value": ">>>", "message": "The docstring should contain a doctest marker", "required": true }
]
```

---

## Step 4: Add a unittest class

### Instructions
Keep the three functions and the doctest. Import `unittest`. Define `TestCalculator` as a subclass of `unittest.TestCase` with two tests: `test_add` checks `add(2, 3) == 5`, and `test_multiply_many` checks `multiply_many([2, 3, 4]) == 24`. At the end of the module, run `unittest.main(verbosity=2)` inside the `if __name__ == "__main__":` guard.

### Hints
1. Import `unittest` at the top.
2. In each test method, use `self.assertEqual(...)` for the check.
3. Guard the runner so importing the module does not run the tests.

### Starter State / Code
```python
def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b


def multiply_many(values: list[int]) -> int:
    """Return the product of every value.

    >>> multiply_many([2, 3, 4])
    24
    """
    result = 1
    for value in values:
        result *= value
    return result


print("ready")
```

### Solution State / Code
```python
import unittest


def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b


def multiply_many(values: list[int]) -> int:
    """Return the product of every value.

    >>> multiply_many([2, 3, 4])
    24
    """
    result = 1
    for value in values:
        result *= value
    return result


class TestCalculator(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)

    def test_multiply_many(self):
        self.assertEqual(multiply_many([2, 3, 4]), 24)


if __name__ == "__main__":
    unittest.main(verbosity=2)
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "add(2, 3)", "expected": 5, "message": "add should still work", "weight": 2, "required": true },
  { "type": "function-returns", "call": "multiply_many([2, 3, 4])", "expected": 24, "message": "multiply_many should still work", "weight": 2, "required": true },
  { "type": "output-contains", "value": "OK", "message": "The test run should report OK", "weight": 2, "required": true },
  { "type": "output-contains", "value": "Ran 2 tests", "message": "Both tests should run", "required": true },
  { "type": "code-contains", "value": "unittest.TestCase", "message": "Use unittest.TestCase", "required": true },
  { "type": "code-contains", "value": "def test_add", "message": "Define test_add", "required": true },
  { "type": "code-contains", "value": "def test_multiply_many", "message": "Define test_multiply_many", "required": true }
]
```
