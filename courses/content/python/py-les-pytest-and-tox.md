---
id: "py-les-pytest-and-tox"
type: "theory"
title: "Pytest and Tox"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "pytest", "tox", "fixtures"]
---

# Concept Overview

`pytest` is a popular third-party test framework. Its style is simpler than `unittest`: plain functions named `test_*` and plain `assert` statements. `pytest` also provides fixtures and parameterised tests.

`tox` runs tests in multiple Python versions and environments. It automates the matrix of configurations that a project must support. `nose` was an earlier framework and is a historical note.

`pytest` and `tox` are not available in the sandbox and are not graded. This lesson shows them in non-graded `bash` and `text` blocks only. Graded tests in this course use `unittest` and `doctest`.

## Key Principles & Frameworks

### Plain pytest functions

A pytest test is a function that starts with `test_`. It uses `assert` directly:

```bash
python -m pip install pytest
pytest tests/test_stats.py -v
```

```text
tests/test_stats.py::test_average PASSED
tests/test_stats.py::test_count PASSED
```

```python
def add(a: int, b: int) -> int:
    return a + b


def test_add():
    assert add(2, 3) == 5
```

The code above is a concept snippet. It shows the style. It is not graded code.

### Fixtures

A fixture sets up shared data. The `@pytest.fixture` decorator marks a factory function:

```bash
cat tests/conftest.py
```

```text
import pytest

@pytest.fixture
def numbers():
    return [2, 4, 6]
```

```python
# tests/test_stats.py

def test_average(numbers):
    assert sum(numbers) / len(numbers) == 4.0
```

Fixtures are injected as arguments. `pytest` calls the factory and passes the result into the test.

### Parametrize

Parametrize runs one test with many inputs:

```bash
pytest tests/test_stats.py -v
```

```text
tests/test_stats.py::test_average[2-3-5] PASSED
```

```python
# tests/test_stats.py

@pytest.mark.parametrize("a, b, expected", [(2, 3, 5), (-1, 1, 0)])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

Each tuple in the list becomes a separate test case. This keeps many cases in one function.

### Tox and multiple environments

`tox` runs commands across Python versions. A `tox.ini` lists the environments:

```bash
tox -e py312
tox -e py311
```

```text
py312: OK
py311: OK
```

`nose` was once common for `pytest`-style tests. It is now unmaintained. New projects should use `pytest` or `unittest`.

## Common Pitfalls & Anti-Patterns
- **Importing `pytest` in graded code**: `pytest` is not available in the sandbox. Graded code uses `unittest`.
- **Flaky tests that depend on time or randomness**: Use fixed values and deterministic fixtures.
- **Testing implementation instead of behavior**: Test return values and observable effects.
- **Overusing fixtures**: A fixture should share setup, not hide the behavior being tested.
- **Skipping tox for version checks**: Tox exists to catch version differences early.
- **Confusing `nose` with modern tools**: `nose` is historical. Use `pytest` or `unittest`.
- **Relying on plain `assert` in `unittest`**: `unittest` provides its own assertion methods.

## Quick Summary
- `pytest` uses plain `test_*` functions and plain `assert` statements.
- Fixtures provide shared setup through `@pytest.fixture`.
- `parametrize` runs one test with many inputs.
- `tox` runs tests across multiple Python environments.
- `nose` is a historical note. `pytest` and `tox` are not available in the sandbox.
