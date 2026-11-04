---
id: "py-ws-recursion-and-search"
type: "workshop"
title: "Recursion and Search"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 45
tags: ["python", "recursion", "searching", "workshop", "memoization"]
---

# Workshop Overview

You will build four functions step by step. Each step adds one function and keeps the previous functions. Every function is called directly by the tests, so each function must return its result instead of printing it.

The four steps are: a recursive factorial, Fibonacci with memoization, a recursive sum of a list, and binary search on a sorted list.

---

## Step 1: Factorial

### Instructions
Define `factorial(n)` that returns the factorial of `n` recursively. The factorial of `0` is `1`. For larger `n`, the result is `n` multiplied by the factorial of `n - 1`.

### Hints
1. Start with the base case for `n == 0`.
2. The recursive case is `n * factorial(n - 1)`.
3. Return the products from each call.

### Starter State / Code
```python
# Define factorial below.
```

### Solution State / Code
```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "factorial(0)", "expected": 1, "message": "factorial(0) should return 1", "weight": 2, "required": true },
  { "type": "function-returns", "call": "factorial(4)", "expected": 24, "message": "factorial(4) should return 24", "weight": 2, "required": true },
  { "type": "function-returns", "call": "factorial(5)", "expected": 120, "message": "factorial(5) should return 120", "required": true },
  { "type": "code-contains", "value": "def factorial(n)", "message": "Define factorial(n)", "required": true }
]
```

---

## Step 2: Fibonacci with Memoization

### Instructions
Keep `factorial`. Define `fibonacci(n)` that returns the nth Fibonacci number. The first two values are `fibonacci(0) == 0` and `fibonacci(1) == 1`. For larger `n`, the result is `fibonacci(n - 1) + fibonacci(n - 2)`. Use memoization with `functools.cache` so each value is computed only once.

### Hints
1. Import `cache` from `functools`.
2. Place `@cache` directly above the function definition.
3. Add the two base cases for `n < 2`.

### Starter State / Code
```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

# Define fibonacci below.
```

### Solution State / Code
```python
from functools import cache

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)


@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "fibonacci(0)", "expected": 0, "message": "fibonacci(0) should return 0", "weight": 2, "required": true },
  { "type": "function-returns", "call": "fibonacci(1)", "expected": 1, "message": "fibonacci(1) should return 1", "required": true },
  { "type": "function-returns", "call": "fibonacci(10)", "expected": 55, "message": "fibonacci(10) should return 55", "weight": 2, "required": true },
  { "type": "code-contains", "value": "@cache", "message": "Use memoization with cache", "required": true },
  { "type": "code-contains", "value": "def fibonacci(n)", "message": "Define fibonacci(n)", "required": true }
]
```

---

## Step 3: Recursive Sum

### Instructions
Keep `factorial` and `fibonacci`. Define `recursive_sum(numbers)` that returns the sum of a list of numbers using recursion. An empty list sums to `0`. Each call adds the first element to the sum of the rest.

### Hints
1. The base case checks an empty list.
2. Use `numbers[0]` for the first element.
3. The recursive call processes `numbers[1:]`.

### Starter State / Code
```python
from functools import cache

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)


@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Define recursive_sum below.
```

### Solution State / Code
```python
from functools import cache

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)


@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def recursive_sum(numbers):
    if not numbers:
        return 0
    return numbers[0] + recursive_sum(numbers[1:])
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "recursive_sum([1, 2, 3, 4])", "expected": 10, "message": "recursive_sum of 1..4 should be 10", "weight": 2, "required": true },
  { "type": "function-returns", "call": "recursive_sum([])", "expected": 0, "message": "An empty list should sum to 0", "required": true },
  { "type": "function-returns", "call": "recursive_sum([-2, 5, 3])", "expected": 6, "message": "recursive_sum should handle negative numbers", "required": true },
  { "type": "code-contains", "value": "def recursive_sum(numbers)", "message": "Define recursive_sum(numbers)", "required": true }
]
```

---

## Step 4: Binary Search

### Instructions
Keep the previous functions. Define `binary_search(values, target)` that returns the index of `target` in a sorted list `values`, or `-1` when `target` is absent. Use the iterative form with `low` and `high` boundaries and the midpoint `(low + high) // 2`.

### Hints
1. Start with `low = 0` and `high = len(values) - 1`.
2. While `low <= high`, compute `middle = (low + high) // 2`.
3. Move `low` to `middle + 1` when the middle value is smaller, and `high` to `middle - 1` when it is larger.

### Starter State / Code
```python
from functools import cache

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)


@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def recursive_sum(numbers):
    if not numbers:
        return 0
    return numbers[0] + recursive_sum(numbers[1:])

# Define binary_search below.
```

### Solution State / Code
```python
from functools import cache

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)


@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


def recursive_sum(numbers):
    if not numbers:
        return 0
    return numbers[0] + recursive_sum(numbers[1:])


def binary_search(values, target):
    low = 0
    high = len(values) - 1
    while low <= high:
        middle = (low + high) // 2
        if values[middle] == target:
            return middle
        if values[middle] < target:
            low = middle + 1
        else:
            high = middle - 1
    return -1
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "binary_search([2, 4, 6, 8, 10], 6)", "expected": 2, "message": "binary_search should find 6 at index 2", "weight": 2, "required": true },
  { "type": "function-returns", "call": "binary_search([2, 4, 6, 8, 10], 5)", "expected": -1, "message": "A missing target should return -1", "required": true },
  { "type": "function-returns", "call": "binary_search([], 5)", "expected": -1, "message": "An empty list should return -1", "required": true },
  { "type": "function-returns", "call": "binary_search([7], 7)", "expected": 0, "message": "A single-element list should return 0", "required": true },
  { "type": "code-contains", "value": "def binary_search(values, target)", "message": "Define binary_search(values, target)", "required": true }
]
```
