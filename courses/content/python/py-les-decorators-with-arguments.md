---
id: "py-les-decorators-with-arguments"
type: "theory"
title: "Decorators with Arguments"
moduleId: "py-mod-11-decorators-and-context-managers"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "decorators", "decorator-factories", "cache"]
---

# Concept Overview

A decorator factory is a function that takes arguments and returns a decorator. This adds one more level of nesting: the factory receives the decorator arguments, the decorator receives the function, and the wrapper receives the call arguments.

Decorator factories are useful for configurable behavior, such as repeating a call a fixed number of times or validating values against a threshold. Python also provides `functools.cache` as a ready-made decorator for memoization.

## Key Principles & Frameworks

### A decorator factory has three levels

The outer function receives the decorator arguments and returns the actual decorator:

```python
from functools import wraps


def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                results.append(func(*args, **kwargs))
            return results
        return wrapper
    return decorator


@repeat(3)
def greet(name):
    return f"hi {name}"


print(greet("ana"))
```

Output:

```text
['hi ana', 'hi ana', 'hi ana']
```

`repeat(3)` returns `decorator`. Python then applies `decorator(greet)`. The wrapper closes over `times`, so it knows how many times to call the original function.

### Reading the nesting

Each level has one job:

- `repeat(times)` stores configuration and returns a decorator.
- `decorator(func)` receives the function and returns a wrapper.
- `wrapper(*args, **kwargs)` runs when the decorated function is called.

Keep all three levels. A factory that returns the wrapper directly skips the function and breaks the `@` syntax.

### A validation factory

A factory can build a decorator that validates each call:

```python
from functools import wraps


def require_min(minimum):
    def decorator(func):
        @wraps(func)
        def wrapper(value):
            if value < minimum:
                raise ValueError(f"value must be at least {minimum}")
            return func(value)
        return wrapper
    return decorator


@require_min(10)
def square(value):
    return value * value


print(square(12))
try:
    print(square(5))
except ValueError as error:
    print(str(error))
```

Output:

```text
144
value must be at least 10
```

The factory captures `minimum`. The wrapper checks the argument before calling the original function.

### Forwarding arguments through a factory

When the wrapper accepts `*args` and `**kwargs`, the factory can decorate functions with any signature:

```python
from functools import wraps


def log_if_negative(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        if result < 0:
            print("negative result")
        return result
    return wrapper


@log_if_negative
def difference(a, b):
    return a - b


print(difference(2, 5))
```

Output:

```text
negative result
-3
```

The wrapper calls the function first, inspects the result, then returns it. Use this pattern for post-processing and validation.

### Class-based decorators

A class can act as a decorator when its instances are callable. `__init__` receives the function, and `__call__` runs on each invocation:

```python
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
print(add(10, 20))
print(add.count)
```

Output:

```text
5
30
2
```

Class-based decorators are useful when the decorator needs substantial state or several methods. They do not preserve `__name__` automatically unless you set it yourself.

### functools.cache

`functools.cache` memoizes a function's results. Repeated calls with the same arguments return the stored result:

```python
from functools import cache


@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


print(fibonacci(10))
print(fibonacci(5))
```

Output:

```text
55
5
```

`cache` is a decorator, not a factory. It requires the arguments to be hashable. Use `functools.lru_cache(maxsize=...)` when you need to limit memory.

### When to use a factory

Use a plain decorator when the behavior is fixed. Use a factory when callers need to configure the behavior, such as a threshold, a number of retries, or a format string. Keep the configuration small and validate it early.

## Common Pitfalls & Anti-Patterns
- **Returning the wrapper instead of the decorator**: A factory must return a decorator, which then returns the wrapper.
- **Forgetting `@wraps(func)`**: The decorated function loses its name and docstring.
- **Capturing mutable configuration**: If the factory argument is mutable, later changes affect the decorator. Copy it if needed.
- **Using a factory for a fixed behavior**: If there are no arguments, write a plain decorator.
- **Ignoring hashability with `cache`**: Arguments must be hashable. Lists and dictionaries cannot be cached.
- **Unbounded cache growth**: `cache` keeps every result. Use `lru_cache` with a size limit for large domains.
- **Class-based decorators without `__wrapped__`**: Tools that inspect functions may not follow the wrapper. Set `__wrapped__` or use `functools.wraps`.
- **Validating too late**: Check factory arguments when the decorator is created, not on every call.
- **Overcomplicating the factory**: Three levels of nesting are enough. Deeper nesting is hard to read.
- **Forgetting to call the factory**: `@repeat` without parentheses passes the function to `repeat`, which expects a number. Use `@repeat(3)`.

## Quick Summary
- A decorator factory takes arguments and returns a decorator.
- The factory returns a decorator; the decorator returns a wrapper.
- Factories enable configurable decorators.
- Use `*args` and `**kwargs` to support any function signature.
- Apply `functools.wraps` at the wrapper level.
- Validate configuration when the decorator is created.
- Class-based decorators use `__call__` and can hold state.
- `functools.cache` memoizes results for hashable arguments.
- Use `lru_cache` to limit memory.
- Keep factories shallow and focused.
- Prefer a plain decorator when there is no configuration.
- Decorators should preserve the original result and metadata.
- Test decorated functions through their public behavior.
- Avoid hidden mutable state in factories.
