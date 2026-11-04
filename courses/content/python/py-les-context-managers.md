---
id: "py-les-context-managers"
type: "theory"
title: "Context Managers"
moduleId: "py-mod-11-decorators-and-context-managers"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "context-managers", "with", "contextlib"]
---

# Concept Overview

A context manager guarantees that setup and cleanup code runs around a block of code, even when an exception occurs. The `with` statement calls `__enter__` before the block and `__exit__` after it. This pattern is ideal for files, locks, database transactions, and any resource that must be released.

You can implement the protocol directly with `__enter__` and `__exit__`, or use `contextlib.contextmanager` to turn a generator into a context manager. `contextlib.suppress` provides a concise way to ignore selected exceptions.

## Key Principles & Frameworks

### The with protocol

A context manager implements two methods:

```python
class ManagedResource:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"acquiring {self.name}")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print(f"releasing {self.name}")
        return False


with ManagedResource("database") as resource:
    print(f"using {resource.name}")
```

Output:

```text
acquiring database
using database
releasing database
```

`__enter__` runs before the block and its return value is assigned to `resource`. `__exit__` runs after the block, whether it succeeds or raises. Returning `False` lets an exception propagate.

### Handling exceptions in __exit__

`__exit__` receives the exception details. It can log, clean up, and decide whether to suppress:

```python
class ManagedResource:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            print(f"error: {exc_value}")
        print("cleanup")
        return True


with ManagedResource("database") as resource:
    raise ValueError("boom")

print("continued")
```

Output:

```text
error: boom
cleanup
continued
```

Because `__exit__` returns `True`, the exception is suppressed and execution continues. Return `False` to let the exception propagate after cleanup.

### contextlib.contextmanager

`@contextmanager` turns a generator into a context manager. The code before `yield` is setup, the yielded value is the `as` target, and the code after `yield` is cleanup:

```python
from contextlib import contextmanager


@contextmanager
def managed_resource(name):
    print(f"acquiring {name}")
    try:
        yield name
    finally:
        print(f"releasing {name}")


with managed_resource("database") as name:
    print(f"using {name}")
```

Output:

```text
acquiring database
using database
releasing database
```

The `finally` block guarantees cleanup even when the `with` body raises. A context manager written this way needs exactly one `yield`.

### Suppressing exceptions with contextlib.suppress

`suppress` ignores selected exceptions inside its block:

```python
from contextlib import suppress


def read_optional(path):
    with suppress(FileNotFoundError):
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    return None


print(read_optional("missing.txt"))
```

Output:

```text
None
```

`suppress` is clearer than a `try`/`except`/`pass` block. It suppresses only the listed exception types.

### Returning values from __enter__

`__enter__` can return any object. Returning `self` is common, but a different object is fine:

```python
class Connection:
    def __enter__(self):
        return "connected"

    def __exit__(self, exc_type, exc_value, traceback):
        print("closed")
        return False


with Connection() as status:
    print(status)
```

Output:

```text
connected
closed
```

The `as` target receives whatever `__enter__` returns.

### Reusable and reentrant managers

A context manager instance can be reused if its state is reset in `__enter__`. Reentrant managers, which can be nested, need careful state tracking. For most cases, create a new instance for each `with` block.

## Common Pitfalls & Anti-Patterns
- **Forgetting `yield` in a `@contextmanager` function**: Without `yield`, Python raises `TypeError` when entering the context.
- **Yielding more than once**: A context manager must yield exactly one value.
- **Swallowing exceptions in `__exit__`**: Returning `True` suppresses the exception. Return `False` unless suppression is intentional.
- **Not cleaning up on exception**: Put cleanup in `finally` or `__exit__` so it runs even when the body raises.
- **Ignoring the `exc_type` argument**: Check it before deciding whether to suppress.
- **Using a context manager for simple code**: A plain `try`/`finally` is fine for a single cleanup.
- **Mutating state across nested uses**: Reentrant managers need careful bookkeeping.
- **Forgetting to close manually when not using `with`**: If you do not use `with`, call cleanup yourself.
- **Suppressing too broadly**: `suppress(Exception)` hides programming errors. List specific exception types.
- **Returning a value from `__exit__` other than a boolean**: Only `True` and `False` have defined meaning for suppression.

## Quick Summary
- `with` calls `__enter__` before the block and `__exit__` after it.
- `__enter__` returns the value bound by `as`.
- `__exit__` receives exception details and runs during cleanup.
- Returning `True` from `__exit__` suppresses the exception.
- Returning `False` lets the exception propagate.
- `@contextmanager` turns a generator into a context manager.
- A context manager must yield exactly one value.
- Put cleanup in `finally` to guarantee it runs.
- `contextlib.suppress` ignores selected exception types.
- Context managers are ideal for resources and transactions.
- Create a new instance for each `with` block unless the manager is designed to be reused.
- Do not suppress exceptions broadly.
- Use `with` to make cleanup automatic and reliable.
- Prefer `contextlib` helpers for simple cases.
