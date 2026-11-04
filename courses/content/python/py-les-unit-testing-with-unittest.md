---
id: "py-les-unit-testing-with-unittest"
type: "theory"
title: "Unit Testing with unittest"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "unittest", "testing", "assertions"]
---

# Concept Overview

Unit testing verifies small pieces of code in isolation. `unittest` is the standard library test framework. It provides a `TestCase` class with assertion methods and a test runner.

A test calls your function with known inputs and checks the result. Good tests state behavior, not implementation. They use fixed values so each run gives the same result.

## Key Principles & Frameworks

### TestCase and assertions

A `TestCase` groups related test methods. Each method name starts with `test_`. Assertion methods such as `assertEqual` check behavior.

```python
import unittest

def add(a: int, b: int) -> int:
    return a + b

class TestAdd(unittest.TestCase):
    def test_add_integers(self):
        self.assertEqual(add(2, 3), 5)

    def test_add_negative(self):
        self.assertEqual(add(-1, 1), 0)

if __name__ == "__main__":
    unittest.main()
```

Module 8 covered `try`, `except`, `else`, `finally`, `raise`, and the `assert` statement. Here `assertEqual` is a `unittest` check that fails the test when values differ.

### Setup with `setUp`

`setUp` runs before every test method. Use it to build shared fixtures:

```python
import unittest

class TestAverage(unittest.TestCase):
    def setUp(self):
        self.numbers = [2, 4, 6]

    def test_average(self):
        self.assertEqual(sum(self.numbers) / len(self.numbers), 4.0)

    def test_count(self):
        self.assertEqual(len(self.numbers), 3)
```

Each test gets a fresh `self.numbers`. `setUp` keeps tests independent.

### Test discovery and output

`unittest` discovers tests by naming convention and reports results:

```bash
python -m unittest discover -s tests -v
```

```text
test_average (test_stats.TestAverage) ... ok
test_count (test_stats.TestAverage) ... ok

Ran 2 tests in 0.000s

OK
```

Discovery looks for `test_*.py` files and `TestCase` subclasses. A passing run prints `OK`. Failed tests show the mismatch.

### Writing testable code

Functions that return values are easy to test. Functions that print or read input are harder to test. Separate logic from input and output.

```python
def format_total(items: list[int]) -> str:
    return f"Total: {sum(items)}"

print(format_total([1, 2, 3]))
```

Output:

```text
Total: 6
```

The function returns a string. A test can check the return value without reading the screen.

## Common Pitfalls & Anti-Patterns
- **Testing implementation instead of behavior**: Test what a function returns, not its internal steps.
- **Flaky tests that depend on time or randomness**: Use fixed values so every run agrees.
- **Forgotten `if __name__ == "__main__":` guard**: Guards keep test files importable and runnable.
- **One large test with many asserts**: Prefer several focused tests. A failure should point to one behavior.
- **Shared mutable state between tests**: `setUp` should rebuild fixtures for each test.
- **Printing instead of returning**: Tests cannot check printed output as easily as return values.
- **`assert` for test checks**: Use `unittest` assertions so failures carry useful messages.

## Quick Summary
- `unittest.TestCase` groups tests, and methods start with `test_`.
- Use `assertEqual` and related assertion methods for checks.
- `setUp` prepares fresh fixtures before each test.
- Discovery runs all matching tests and reports `OK` on success.
- Test behavior with fixed values. Return values are easiest to test.
