---
id: "py-les-code-formatting-and-linting"
type: "theory"
title: "Code Formatting and Linting"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "pep8", "formatting", "linting"]
---

# Concept Overview

Formatting controls how code looks. Linting checks how code behaves. A formatter rewrites spacing, line breaks, and quotes for consistency. A linter reports suspicious patterns and style issues without rewriting much code.

PEP 8 is the style guide for Python. Tools such as `black`, `ruff`, and `yapf` help you follow it. In this lesson they appear only in non-graded examples. They are not available in the sandbox.

## Key Principles & Frameworks

### PEP 8 basics

PEP 8 recommends 4-space indentation, two blank lines around top-level definitions, and consistent naming:

```python
def total(items: list[int]) -> int:
    return sum(items)


def is_valid(name: str) -> bool:
    return len(name.strip()) > 0
```

PEP 8 also prefers short lines. Long lines are harder to review. Keep lines short and use consistent quotes in a project.

### Formatters: black and yapf

`black` is an opinionated formatter. It rewrites code to one style. `yapf` offers more options.

```bash
black calculator.py
yapf -i calculator.py
```

```text
reformatted calculator.py
```

A formatter changes layout, not logic. It does not rename variables or fix bugs. After formatting, the program should behave exactly as before.

### Linters: ruff and flake8

`ruff` is a fast linter. It reports unused imports, shadowed names, and other issues. `flake8` serves a similar role. `ruff` can also format code.

```bash
ruff check calculator.py
ruff format calculator.py
```

```text
calculator.py:1:1: F401 `json` imported but unused
```

A linter reports a problem. It may suggest a fix, but it usually does not rewrite the whole file. Formatters rewrite layout. Linters check quality.

### Running tools before committing

A common workflow is: format, lint, type-check, test. This order keeps the code readable and verifiable.

```bash
python -m pip install black ruff
black .
ruff check .
```

```text
All checks passed
```

These commands appear for concept only. They are not part of graded work in this course.

## Common Pitfalls & Anti-Patterns
- **Formatter vs linter confusion**: A formatter fixes layout. A linter reports suspicious code.
- **Ignoring a linter warning**: Unused imports and shadowed names often hide real bugs.
- **Inconsistent quotes and spacing**: Mixed styles make review harder. Pick one style per project.
- **Long lines**: Long lines are hard to scan. Break them into smaller parts.
- **Formatting without testing**: A formatter should not change behavior, but always run your tests anyway.
- **Chasing the file as a whole**: A formatter rewrites every file it touches. Review the diff.
- **Assuming PEP 8 is optional**: PEP 8 is a shared baseline. Follow it unless your project states otherwise.

## Quick Summary
- PEP 8 defines Python style: 4 spaces, short lines, clear names.
- Formatters such as `black` and `yapf` rewrite layout for consistency.
- Linters such as `ruff` and `flake8` report issues without major rewrites.
- A formatter fixes how code looks. A linter checks how code behaves.
- `black`, `ruff`, and `yapf` are not available in the sandbox.
