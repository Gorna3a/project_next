---
id: "py-les-type-checkers-and-pydantic"
type: "theory"
title: "Type Checkers and Pydantic"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "typing", "mypy", "pydantic"]
---

# Concept Overview

A type checker reads annotations without running the code. It reports mismatches between a function's contract and how the function is called. The program never runs during this check.

Runtime validation is different. It inspects real values while the program runs and rejects bad data. Tools such as Pydantic provide that safety for models and input data.

In this lesson, `mypy`, `pyright`, `pyre`, and Pydantic appear only in non-graded examples. They are not available in the sandbox. Graded code uses standard library only.

## Key Principles & Frameworks

### Static checking with mypy

`mypy` checks annotations and reports errors before execution:

```bash
mypy calculator.py
```

```text
calculator.py:3: error: Argument 2 to "add" has incompatible type "str"; expected "int"
```

The checker compares the call `add(2, "three")` with the contract `def add(a: int, b: int) -> int`. The string violates the contract, so `mypy` reports it. The program itself would still run and raise `TypeError` at the `+` operator.

### Pyright and pyre

`pyright` and `pyre` provide the same idea: static checking of annotations. Tools differ in strictness and speed, but the purpose is identical. They examine calls, assignments, and returns against the declared types.

```bash
pyright calculator.py
pyre --source-directory src check
```

```text
calculator.py:3:5 - error: Argument of type "str" is not assignable to parameter of type "int"
```

`pyright` is common in editors. `pyre` is used in some large codebases. For this course, the shared idea matters more than the tool name.

### Runtime validation with Pydantic

Pydantic validates data at runtime when values enter your program:

```bash
python -m pip install pydantic
```

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

user = User(name="ana", age="42")
print(type(user.age))
```

This model would coerce a numeric string into an integer. An invalid value such as `User(name="ana", age="new")` would raise a validation error at runtime. Pydantic is shown for concept only and is not graded.

### Choosing the right check

Use static checkers to catch mistakes early and to document contracts. Use runtime validation when data comes from outside your program, such as JSON, forms, or network payloads.

```python
def add(a: int, b: int) -> int:
    return a + b

class Point(BaseModelPlaceholder):
    x: int
    y: int
```

The static checker verifies that `add(2, 3)` matches its contract. Runtime validation verifies that incoming data matches a model. The two approaches complement each other.

## Common Pitfalls & Anti-Patterns
- **Assuming a type checker runs the code**: Checkers read annotations. They do not execute functions.
- **Ignoring checker strictness settings**: A lenient checker may miss errors that a strict checker finds.
- **Confusing static and runtime checks**: Static checking helps before execution. Runtime validation protects running code.
- **Using Pydantic for every internal function**: Use it for input boundaries and models, not for every helper.
- **Annotating with `Any` everywhere**: `Any` silences the checker. It hides real mismatches.
- **Expecting hints alone to validate input**: Hints do not validate values. You still need explicit checks or models.
- **Running a checker once and never again**: Add the checker to your normal workflow so new code stays clean.

## Quick Summary
- Static checkers such as `mypy` and `pyright` inspect annotations without running code.
- `pyre` serves the same static purpose in large projects.
- Pydantic validates real values at runtime.
- Use static checking for internal contracts and runtime validation for external data.
- `mypy`, `pyright`, `pyre`, and Pydantic are not available in the sandbox.
