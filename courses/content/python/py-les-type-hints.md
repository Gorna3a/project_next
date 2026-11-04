---
id: "py-les-type-hints"
type: "theory"
title: "Type Hints"
moduleId: "py-mod-16-typing-testing-and-quality"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "typing", "type-hints", "annotations", "collections"]
---

# Concept Overview

Type hints annotate what a value or function should be. An annotation is a note attached to a parameter, a return value, or a variable. It names the expected type without changing how the program runs.

Type hints help readers understand code faster. They also let tools check your code before it runs. In Python 3.12, modern built-in generics such as `list[int]` work without imports.

## Key Principles & Frameworks

### Basic annotations

Annotate parameters and the return value:

```python
def add(a: int, b: int) -> int:
    return a + b

result: int = add(2, 3)
print(result)
```

Output:

```text
5
```

The annotation `int` states the expected type. The `-> int` states the return type. Python does not reject a call with the wrong type.

### Containers with generic types

Use built-in generics such as `list[int]` and `dict[str, int]`:

```python
def total(prices: list[float]) -> float:
    return round(sum(prices), 2)

def count_by_word(words: list[str]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return counts

print(total([1.5, 2.25, 3.0]))
print(count_by_word(["a", "b", "a"]))
```

Output:

```text
6.75
{'a': 2, 'b': 1}
```

`list[float]` means a list whose items are floats. `dict[str, int]` maps strings to integers.

### Optional values with `X | None`

Use the union form `X | None` when a value may be missing:

```python
def find_user(name: str, users: dict[str, str]) -> str | None:
    return users.get(name)

users = {"ana": "Admin", "ben": "Viewer"}
print(find_user("ana", users))
print(find_user("cid", users))
```

Output:

```text
Admin
None
```

`str | None` states that the result is either a string or `None`. `Optional` is the older name for the same idea.

### `Any`, `Callable`, and `TypedDict`

`Any` means no specific type is required. Use it sparingly. `Callable` describes functions. `TypedDict` describes dictionaries with fixed keys.

```python
from collections.abc import Callable
from typing import Any, TypedDict

def apply_twice(func: Callable[[int], int], value: int) -> int:
    return func(func(value))

class Stats(TypedDict):
    count: int
    total: int
    label: str

def make_stats(count: int, total: int) -> Stats:
    return {"count": count, "total": total, "label": f"{count} items"}

print(apply_twice(lambda x: x + 1, 10))
print(make_stats(2, 5))
```

Output:

```text
12
{'count': 2, 'total': 5, 'label': '2 items'}
```

`Callable[[int], int]` means a function that takes an int and returns an int. `TypedDict` gives names and types to dictionary keys.

### Hints are not enforced at runtime

Python ignores annotations when the program runs:

```python
def double(x: int) -> int:
    return x * 2

print(double("ab"))
```

Output:

```text
abab
```

The annotation says `int`, yet the string is accepted. Runtime validation is a separate concern. Static tools check the contract before execution.

## Common Pitfalls & Anti-Patterns
- **Assuming hints are enforced at runtime**: Hints guide humans and tools. They do not stop bad values.
- **Overusing `Any`**: `Any` disables checking. Prefer specific types where you know them.
- **`Optional` confusion**: `Optional[X]` means `X | None`, not "has a default value".
- **Using `list` without item types**: `list` alone says little. Prefer `list[int]` or `list[str]`.
- **Annotating only the return value**: Annotate parameters too so callers know the contract.
- **String annotations for builtin generics**: In Python 3.12, use `list[int]`, not `List[int]` from `typing`.
- **Exporting mutable shared defaults**: Annotate defaults carefully; avoid `def f(items: list = [])`.

## Quick Summary
- Annotations state expected types for tools and readers.
- Use `list[int]`, `dict[str, int]`, and other built-in generics.
- Use `X | None` for optional values.
- Use `Callable` for functions and `TypedDict` for fixed-shape dicts.
- `Any` means unchecked. Use it sparingly.
- Hints are not enforced when Python runs the code.
