---
id: "py-rev-typing-testing-and-quality"
type: "review"
title: "Typing, Testing and Code Quality Quick Reference"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-type-hints", "py-les-type-checkers-and-pydantic", "py-les-code-formatting-and-linting", "py-les-docstrings-and-documentation", "py-les-unit-testing-with-unittest", "py-les-pytest-and-tox", "py-ws-typed-calculator-with-tests", "py-lab-typed-stats-module"]
tags: ["python", "typing", "testing", "quality", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Annotation | Type note on a parameter, variable, or return | `def add(a: int) -> int` |
| `list[int]` | List of ints | `values: list[int]` |
| `dict[str, int]` | Dict from str to int | `counts: dict[str, int]` |
| `X \| None` | Value or missing | `def find(...) -> str \| None` |
| `Any` | Unchecked type | `value: Any` (use sparingly) |
| `Callable` | Function type | `Callable[[int], int]` |
| `TypedDict` | Dict with fixed keys | `class Stats(TypedDict)` |
| `mypy` | Static type checker | `mypy calculator.py` |
| `pyright` | Static type checker | `pyright calculator.py` |
| Runtime validation | Real-value checks while running | Pydantic models (concept only) |
| PEP 8 | Python style guide | 4-space indentation |
| Formatter | Rewrites layout | `black .` |
| Linter | Reports issues | `ruff check .` |
| Docstring | Documents a definition | `"""Return ..."""` |
| `help()` | Reads docstrings | `help(sum)` |
| Doctest | Runnable example in a docstring | `python -m doctest module.py` |
| `unittest.TestCase` | Standard test class | `class TestAdd(unittest.TestCase)` |
| `setUp` | Fixture setup per test | `def setUp(self)` |
| `assertEqual` | unittest check | `self.assertEqual(add(2, 3), 5)` |
| Discovery | Finds `test_*` files | `python -m unittest discover -s tests -v` |
| pytest | Third-party test framework | `pytest tests/ -v` |
| Fixture | Shared pytest setup | `@pytest.fixture def numbers()` |
| Parametrize | Many cases in one test | `@pytest.mark.parametrize` |
| tox | Multi-environment runner | `tox -e py312` |

## Key Concepts Comparison
- **Static checking vs. runtime checking**: Static checkers read annotations without running code. Runtime checks inspect real values while the program runs.
- **Type checker vs. linter**: A type checker verifies annotation contracts. A linter reports suspicious patterns and style issues.
- **Formatter vs. linter**: A formatter rewrites layout for consistency. A linter reports problems it usually does not rewrite.
- **Docstring vs. doctest**: A docstring documents behavior. A doctest is a runnable example inside that docstring.
- **`unittest` vs. `pytest`**: `unittest` uses classes and its own assertion methods. `pytest` uses plain functions and plain `assert`.
- **Hint vs. validation**: A hint states a contract for tools. Validation enforces the contract on real data.
- **Behavior test vs. implementation test**: A behavior test checks return values and effects. An implementation test checks internal steps and breaks on refactors.
- **Deterministic test vs. flaky test**: A deterministic test uses fixed values. A flaky test depends on the clock or randomness.
- **Optional vs. default**: `Optional[X]` means `X | None`. A default value is separate.
- **Pydantic vs. hints**: Pydantic validates data at runtime. Hints alone do not validate values.

## Critical Syntax / Templates
```python
# Typed function with containers and Optional
def find_user(name: str, users: dict[str, str]) -> str | None:
    return users.get(name)


def total(prices: list[float]) -> float:
    return round(sum(prices), 2)
```

```python
# Callable and TypedDict
from collections.abc import Callable
from typing import TypedDict

class Stats(TypedDict):
    count: int
    total: int


def apply_twice(func: Callable[[int], int], value: int) -> int:
    return func(func(value))
```

```python
# Doctest that must pass exactly
def multiply(a: int, b: int) -> int:
    """Multiply two integers.

    >>> multiply(2, 3)
    6
    """
    return a * b
```

```python
# unittest class with setUp
import unittest

class TestAdd(unittest.TestCase):
    def setUp(self):
        self.pair = (2, 3)

    def test_add(self):
        self.assertEqual(add(self.pair[0], self.pair[1]), 5)

if __name__ == "__main__":
    unittest.main(verbosity=2)
```

```bash
# Concept-only checks (not available in the sandbox)
python -m pip install black ruff pytest
black .
ruff check .
pytest tests/ -v
tox -e py312
```

```text
# Concept-only test output
tests/test_stats.py::test_average PASSED
========================= 2 passed in 0.01s =========================
```
