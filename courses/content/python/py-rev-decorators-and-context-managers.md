---
id: "py-rev-decorators-and-context-managers"
type: "review"
title: "Decorators & Context Managers Quick Reference"
moduleId: "py-mod-11-decorators-and-context-managers"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-first-class-functions-and-closures", "py-les-decorators", "py-les-decorators-with-arguments", "py-les-context-managers", "py-ws-call-counter-and-timer", "py-lab-validation-decorators"]
tags: ["python", "decorators", "context-managers", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| First-class function | A function that can be assigned, passed, and returned | `apply(shout, "hello")` |
| Higher-order function | A function that takes or returns a function | `make_multiplier(2)` |
| Nested function | A function defined inside another function | `def wrapper(...):` |
| Closure | A nested function that remembers enclosing variables | `make_counter()` |
| `nonlocal` | Rebinds a captured variable | `nonlocal count` |
| Late binding | Closures capture variable names, not values | Loop variable bugs |
| Decorator | A function that wraps another function | `@shout` |
| `@decorator` | Shorthand for `func = decorator(func)` | Applying a decorator |
| Wrapper | The replacement function returned by a decorator | `def wrapper(*args, **kwargs):` |
| `*args` / `**kwargs` | Forwards all positional and keyword arguments | Flexible wrappers |
| `functools.wraps` | Copies metadata onto a wrapper | `@wraps(func)` |
| `__wrapped__` | Reference to the original function | Introspection |
| Decorator factory | A function that returns a decorator | `repeat(times)` |
| `@wraps(func)` level | Applied to the wrapper inside the decorator | Metadata preservation |
| Class-based decorator | A callable class that wraps a function | `class CountCalls:` |
| `__call__` | Makes an instance callable | `instance(*args)` |
| `functools.cache` | Memoizes results for hashable arguments | `@cache` |
| `functools.lru_cache` | Memoizes with a size limit | `@lru_cache(maxsize=128)` |
| Context manager | Object used with `with` | `with open(...) as file:` |
| `__enter__` | Setup and return value for `with` | `def __enter__(self):` |
| `__exit__` | Cleanup after the block | `def __exit__(self, exc_type, exc_value, traceback):` |
| `exc_type` | Exception class passed to `__exit__` | Deciding whether to suppress |
| Suppress | Returning `True` from `__exit__` | Swallowing an expected exception |
| `@contextmanager` | Turns a generator into a context manager | `@contextmanager` |
| `yield` in context manager | Produces the `as` value | `yield resource` |
| `contextlib.suppress` | Ignores selected exception types | `suppress(FileNotFoundError)` |
| Reentrant manager | A context manager usable in nested `with` blocks | Careful state tracking |

## Key Concepts Comparison
- **Function vs. function call**: A function name without parentheses is the object. Parentheses call it.
- **Closure vs. class**: A closure keeps small private state. A class is better for larger state or methods.
- **`nonlocal` vs. `global`**: `nonlocal` rebinds a variable in an enclosing function. `global` rebinds a module-level name.
- **Late binding value vs. current value**: Closures look up variables when called. Use a default argument to capture the value at definition time.
- **Decorator vs. decorator factory**: A decorator wraps a function. A factory takes arguments and returns a decorator.
- **Plain decorator vs. class-based decorator**: A plain decorator is a function. A class-based decorator stores state in an instance.
- **`@wraps` metadata vs. behavior**: `wraps` copies names and docstrings. It does not change execution.
- **Stacked decorators order**: Decorators apply bottom-up, from the function outward.
- **`__exit__` returning `True` vs. `False`**: `True` suppresses the exception. `False` lets it propagate.
- **Direct protocol vs. `@contextmanager`**: Implement `__enter__` and `__exit__` directly, or use a generator with `@contextmanager`.
- **`suppress` vs. `try`/`except`**: `suppress` is concise for expected exceptions. `try`/`except` is better when you need the exception object.
- **`cache` vs. `lru_cache`**: `cache` keeps every result. `lru_cache` limits memory.
- **Context manager instance vs. generator manager**: An instance can hold state. A generator manager is shorter for simple setup and cleanup.

## Critical Syntax / Templates
```python
# First-class functions and closures
def make_multiplier(factor):
    def multiply(value):
        return value * factor
    return multiply


double = make_multiplier(2)
print(double(5))
```

```python
# Counter closure with nonlocal
def make_counter():
    count = 0

    def increment():
        nonlocal count
        count += 1
        return count

    return increment


counter = make_counter()
print(counter())
print(counter())
```

```python
# Late binding fix
def make_functions():
    functions = []
    for i in range(3):
        def show(value=i):
            return value
        functions.append(show)
    return functions


print([function() for function in make_functions()])
```

```python
# Simple decorator
from functools import wraps


def shout(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper


@shout
def greet(name):
    return f"hello, {name}"


print(greet("ana"))
```

```python
# Decorator that preserves and counts calls
from functools import wraps


def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        wrapper.call_count += 1
        return result

    wrapper.call_count = 0
    return wrapper


@count_calls
def add(a, b):
    return a + b


print(add(2, 3))
print(add.call_count)
```

```python
# Decorator factory
from functools import wraps


def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator


@repeat(3)
def greet(name):
    return f"hi {name}"


print(greet("ana"))
```

```python
# Class-based decorator
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        return self.func(*args, **kwargs)


@CountCalls
def add(a, b):
    return a + b


print(add(2, 3))
print(add.count)
```

```python
# Memoization
from functools import cache


@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


print(fibonacci(10))
```

```python
# Context manager with __enter__ and __exit__
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

```python
# Context manager from a generator
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

```python
# Suppressing an expected exception
from contextlib import suppress


def read_optional(path):
    with suppress(FileNotFoundError):
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
    return None


print(read_optional("missing.txt"))
```
