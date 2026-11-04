---
id: "py-les-docstrings-and-documentation"
type: "theory"
title: "Docstrings and Documentation"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "docstrings", "doctest", "help"]
---

# Concept Overview

A docstring is a string literal that documents a module, class, or function. It describes what the code does, what it expects, and what it returns. Well-placed docstrings make code easier to use without reading the implementation.

Docstrings also power `help()` and documentation generators such as Sphinx. A `doctest` turns examples in a docstring into tests. Example output must match exactly.

## Key Principles & Frameworks

### Writing clear docstrings

A good docstring explains purpose, parameters, and return value:

```python
def average(numbers: list[int]) -> float:
    """Return the arithmetic mean of numbers.

    numbers: a non-empty list of numbers.
    Returns the mean as a float.
    """
    return sum(numbers) / len(numbers)


print(average([2, 4, 6]))
```

Output:

```text
4.0
```

The docstring stays accurate because it states the contract in plain language. Keep it short. Avoid repeating parameter names without explanation.

### `help()` and built-in docs

Use `help()` to read documentation at runtime:

```python
help(sum)
```

```text
Help on builtin function sum:

sum(iterable, /, start=0)
    Return the sum of iterable and start.
```

`help()` reads docstrings. It shows the signature, examples, and notes when available.

### Doctests as tests

A doctest is an interactive example inside a docstring. It is run like a test:

```python
def multiply(a: int, b: int) -> int:
    """Multiply two integers.

    >>> multiply(2, 3)
    6
    >>> multiply(-2, 3)
    -6
    """
    return a * b
```

The lines starting with `>>>` are inputs. The lines after them are expected output. Run them with the standard library: `python -m doctest -v module.py`. Doctests must match exactly, including spacing.

### Styles and Sphinx

Common styles include Google style and NumPy style. Both describe parameters and returns. Sphinx can build HTML and PDF docs from them.

```bash
python -m pip install sphinx
sphinx-quickstart docs
```

```text
Created /docs source and build directories
```

Sphinx is not available in the sandbox. For this course, clear docstrings and passing doctests are the graded skills.

## Common Pitfalls & Anti-Patterns
- **Stale docstrings**: A docstring that disagrees with the code misleads readers. Update it when the code changes.
- **Long paragraphs in docstrings**: Keep docstrings concise. Link to details elsewhere.
- **Doctest formatting drift**: Doctests fail on stray spaces. Match output exactly.
- **Documenting obvious details**: Skip restating the obvious. Explain contracts and edge cases.
- **Missing return descriptions**: State what the function returns, especially for empty inputs.
- **Using docstrings instead of comments**: Docstrings document public behavior. Comments explain tricky lines.
- **Forgetting `help()`**: `help()` is built for quick reference. Use it before searching online.

## Quick Summary
- Docstrings document modules, classes, and functions.
- `help()` reads them at runtime.
- Doctests are runnable examples inside docstrings.
- Keep docstrings short, accurate, and free of stale details.
- Sphinx builds larger documentation from docstrings.
