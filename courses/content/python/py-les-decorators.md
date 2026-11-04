---
id: "py-les-decorators"
type: "theory"
title: "Decorators"
moduleId: "py-mod-11-decorators-and-context-managers"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "decorators", "wraps", "higher-order-functions"]
---

# Concept Overview

A decorator is a function that receives a function and returns a replacement. The `@decorator` syntax is shorthand for `function = decorator(function)`. Decorators let you add behavior such as logging, validation, or transformation without changing the original function.

A good decorator accepts `*args` and `**kwargs`, calls the original function, returns its result, and preserves the original function's metadata with `functools.wraps`.

## Key Principles & Frameworks

### A simple decorator

A decorator defines a wrapper, then returns it:

```python
def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper


@shout
def greet(name):
    return f"hello, {name}"


print(greet("ana"))
```

Output:

```text
HELLO, ANA
```

`@shout` above `greet` means `greet = shout(greet)`. Afterward, the name `greet` refers to `wrapper`, which calls the original function and uppercases the result.

### Decorators run at definition time

The decorator runs when Python defines the function, not when the function is called:

```python
def announce(func):
    print(f"decorating {func.__name__}")

    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return wrapper


@announce
def add(a, b):
    return a + b


print(add(2, 3))
```

Output:

```text
decorating add
5
```

The `print` happens during definition. The wrapper runs later, when `add(2, 3)` is called.

### Accepting any arguments

Use `*args` and `**kwargs` so the wrapper can forward all arguments:

```python
def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper


@log_calls
def add(a, b):
    return a + b


print(add(2, 3))
print(add(10, 20))
```

Output:

```text
calling add
5
calling add
30
```

The wrapper does not need to know the original function's signature. It forwards everything unchanged.

### Return the original result

A decorator that forgets to return the result makes the function return `None`:

```python
def broken(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
    return wrapper


@broken
def add(a, b):
    return a + b


print(add(2, 3))
```

Output:

```text
None
```

Always return `func(*args, **kwargs)` from the wrapper when the original result matters.

### Preserving metadata with functools.wraps

Without help, the wrapper hides the original function's name and docstring:

```python
def shout(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper


@shout
def greet(name):
    """Return a greeting."""


print(greet.__name__)
```

Output:

```text
wrapper
```

`functools.wraps` copies metadata from the original function onto the wrapper:

```python
from functools import wraps


def shout(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper


@shout
def greet(name):
    """Return a greeting."""


print(greet.__name__)
print(greet.__doc__)
```

Output:

```text
greet
Return a greeting.
```

`@wraps(func)` is itself a decorator. It sets `__name__`, `__doc__`, `__wrapped__`, and other attributes. Use it in every decorator.

### Stacking decorators

Multiple decorators apply bottom-up. The decorator closest to the function runs first:

```python
from functools import wraps


def bold(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return f"<b>{func(*args, **kwargs)}</b>"
    return wrapper


def italic(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return f"<i>{func(*args, **kwargs)}</i>"
    return wrapper


@bold
@italic
def greet(name):
    return f"hello, {name}"


print(greet("ana"))
```

Output:

```text
<b><i>hello, ana</i></b>
```

`italic` wraps `greet` first, then `bold` wraps the result. Reading the decorators from bottom to top gives the order of application.

### A decorator with state

A decorator can attach state to the wrapper function:

```python
from functools import wraps


def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.call_count += 1
        return func(*args, **kwargs)
    wrapper.call_count = 0
    return wrapper


@count_calls
def add(a, b):
    return a + b


print(add(2, 3))
print(add(10, 20))
print(add.call_count)
```

Output:

```text
5
30
2
```

The count lives on the wrapper, which is the object callers use. This avoids a global variable.

## Common Pitfalls & Anti-Patterns
- **Forgetting to return the result**: The wrapper must return `func(*args, **kwargs)`.
- **Omitting `functools.wraps`**: The decorated function loses its name, docstring, and metadata.
- **Not forwarding `*args` and `**kwargs`**: The wrapper cannot handle all calls unless it forwards everything.
- **Forgetting that decorators run at definition time**: Side effects in the decorator happen when the module loads, not when the function is called.
- **Misreading stacked decorators**: Decorators apply bottom-up. Read them from the function outward.
- **Mutating arguments without copying**: Changing a mutable argument affects the caller.
- **Using a decorator for one-off behavior**: If the wrapper is used once, a normal function call is clearer.
- **Hiding exceptions unintentionally**: A wrapper that catches everything can mask real bugs. Catch only what you expect.
- **Assuming `@wraps` copies behavior**: It copies metadata only. The wrapper still controls execution.
- **Decorating a function that relies on its own name**: Some code uses `__name__` for dispatch. Preserve it with `wraps`.

## Quick Summary
- A decorator is a function that takes a function and returns a function.
- `@decorator` means `function = decorator(function)`.
- Decorators run when the function is defined.
- A wrapper should accept `*args` and `**kwargs`.
- Always return the original function's result.
- Use `functools.wraps` to preserve metadata.
- Stacked decorators apply bottom-up.
- Decorators can attach state to the wrapper.
- Keep decorators focused on one concern.
- Read stacked decorators from the function outward.
- Test decorated functions through their public behavior.
- Avoid hiding unexpected exceptions.
- Prefer a plain function call for one-off behavior.
