---
id: "py-ws-call-counter-and-timer"
type: "workshop"
title: "Call Counter and Timer"
moduleId: "py-mod-11-decorators-and-context-managers"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 55
tags: ["python", "decorators", "context-managers", "workshop"]
---

# Workshop Overview

You will build a small toolkit of decorators and context managers. The first step counts calls. The second step repeats a call a configurable number of times. The third step implements the context manager protocol directly. The fourth step builds a context manager from a generator and uses `contextlib.suppress`.

Everything is deterministic: no clocks, no randomness, and no network.

---

## Step 1: Count calls

### Instructions
Define `count_calls(func)` that returns a wrapper. The wrapper should call `func` with all arguments, return its result, and increment `wrapper.call_count`. Initialize `call_count` to `0` on the wrapper. Use `functools.wraps`.

Apply `count_calls` to `add(a, b)` and print `add(2, 3)` and `add.call_count`.

### Hints
1. Define `wrapper(*args, **kwargs)` inside `count_calls`.
2. Call `func(*args, **kwargs)`, store the result, increment `wrapper.call_count`, and return the result.
3. Set `wrapper.call_count = 0` before returning the wrapper.

### Starter State / Code
```python
from functools import wraps

# Define count_calls below.
```

### Solution State / Code
```python
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


print(add.call_count)
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "add.call_count", "expected": 0, "message": "call_count should start at zero before a call", "required": true },
  { "type": "function-returns", "call": "add(2, 3)", "expected": 5, "message": "The decorated function should still return its result", "weight": 2, "required": true },
  { "type": "function-returns", "call": "add.__name__", "expected": "add", "message": "wraps should preserve the function name", "required": true },
  { "type": "code-contains", "value": "def count_calls(func)", "message": "Define count_calls", "required": true },
  { "type": "code-contains", "value": "@wraps(func)", "message": "Use functools.wraps", "required": true },
  { "type": "code-contains", "value": "wrapper.call_count", "message": "Store the count on the wrapper", "required": true }
]
```

---

## Step 2: Repeat a call

### Instructions
Keep `count_calls`. Define `make_repeater(times)` that returns a decorator. The decorator should call the original function `times` times and return a list of the results. Use `functools.wraps`.

Apply it to `greet(name)` with `3` and print `greet("ana")`.

### Hints
1. `make_repeater(times)` returns `decorator(func)`.
2. The wrapper can use a list comprehension or a loop.
3. Forward all arguments with `*args` and `**kwargs`.

### Starter State / Code
```python
from functools import wraps


def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        wrapper.call_count += 1
        return result

    wrapper.call_count = 0
    return wrapper


# Define make_repeater below.
```

### Solution State / Code
```python
from functools import wraps


def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        wrapper.call_count += 1
        return result

    wrapper.call_count = 0
    return wrapper


def make_repeater(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator


@count_calls
def add(a, b):
    return a + b


@make_repeater(3)
def greet(name):
    return f"hi {name}"


print(add(2, 3))
print(add.call_count)
print(greet("ana"))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "greet(\"ana\")", "expected": ["hi ana", "hi ana", "hi ana"], "message": "The decorated function should repeat its result", "weight": 2, "required": true },
  { "type": "function-returns", "call": "greet.__name__", "expected": "greet", "message": "wraps should preserve the function name", "required": true },
  { "type": "function-returns", "call": "make_repeater(2)(lambda value: value + 1)(5)", "expected": [6, 6], "message": "The factory should work with a different function", "weight": 2, "required": true },
  { "type": "code-contains", "value": "def make_repeater(times)", "message": "Define the factory", "required": true },
  { "type": "code-contains", "value": "def decorator(func)", "message": "Return a decorator from the factory", "required": true },
  { "type": "code-contains", "value": "return decorator", "message": "The factory must return the decorator", "required": true }
]
```

---

## Step 3: Implement a context manager class

### Instructions
Keep the previous code. Define `ManagedResource` with `__init__(self, name)`, `__enter__(self)`, and `__exit__(self, exc_type, exc_value, traceback)`.

`__enter__` should set `self.entered = True` and return `self`. `__exit__` should set `self.exited = True` and return `False`.

Print whether entering and exiting a `with` block sets the flags.

### Hints
1. Store `name`, `entered`, and `exited` in `__init__`.
2. `__enter__` returns `self` so the `as` clause receives the resource.
3. Return `False` from `__exit__` so exceptions propagate.

### Starter State / Code
```python
from functools import wraps
from contextlib import contextmanager, suppress


def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        wrapper.call_count += 1
        return result

    wrapper.call_count = 0
    return wrapper


def make_repeater(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator


# Define ManagedResource below.
```

### Solution State / Code
```python
from functools import wraps
from contextlib import contextmanager, suppress


def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        wrapper.call_count += 1
        return result

    wrapper.call_count = 0
    return wrapper


def make_repeater(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator


class ManagedResource:
    def __init__(self, name):
        self.name = name
        self.entered = False
        self.exited = False

    def __enter__(self):
        self.entered = True
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.exited = True
        return False


resource = ManagedResource("database")
with resource:
    pass
print(resource.entered)
print(resource.exited)
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "ManagedResource(\"db\").__enter__().name", "expected": "db", "message": "__enter__ should return the resource", "weight": 2, "required": true },
  { "type": "function-returns", "call": "ManagedResource(\"db\").__exit__(None, None, None)", "expected": false, "message": "__exit__ should return False", "required": true },
  { "type": "function-returns", "call": "ManagedResource(\"db\").entered", "expected": false, "message": "entered should start False", "required": true },
  { "type": "code-contains", "value": "def __enter__(self)", "message": "Implement __enter__", "required": true },
  { "type": "code-contains", "value": "def __exit__(self, exc_type, exc_value, traceback)", "message": "Implement __exit__ with the full signature", "required": true },
  { "type": "code-contains", "value": "self.entered = True", "message": "Set entered in __enter__", "required": true },
  { "type": "code-contains", "value": "self.exited = True", "message": "Set exited in __exit__", "required": true }
]
```

---

## Step 4: Build a generator context manager

### Instructions
Keep the previous code. Define `managed_value(value)` with `@contextmanager` so it yields `value`. Define `read_managed_value(value)` that uses `with managed_value(value) as current:` and returns `current`.

Define `ignore_missing()` that uses `suppress(FileNotFoundError)` around `open("missing.txt")` and returns `"done"`.

Print `read_managed_value(5)` and `ignore_missing()`.

### Hints
1. `managed_value` needs `@contextmanager` and exactly one `yield`.
2. `read_managed_value` shows how to use the manager and return a value.
3. `suppress(FileNotFoundError)` ignores only that exception.

### Starter State / Code
```python
from functools import wraps
from contextlib import contextmanager, suppress


def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        wrapper.call_count += 1
        return result

    wrapper.call_count = 0
    return wrapper


def make_repeater(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator


class ManagedResource:
    def __init__(self, name):
        self.name = name
        self.entered = False
        self.exited = False

    def __enter__(self):
        self.entered = True
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.exited = True
        return False


# Define managed_value, read_managed_value, and ignore_missing below.
```

### Solution State / Code
```python
from functools import wraps
from contextlib import contextmanager, suppress


def count_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        wrapper.call_count += 1
        return result

    wrapper.call_count = 0
    return wrapper


def make_repeater(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator


class ManagedResource:
    def __init__(self, name):
        self.name = name
        self.entered = False
        self.exited = False

    def __enter__(self):
        self.entered = True
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.exited = True
        return False


@contextmanager
def managed_value(value):
    yield value


def read_managed_value(value):
    with managed_value(value) as current:
        return current


def ignore_missing():
    with suppress(FileNotFoundError):
        open("missing.txt", "r", encoding="utf-8")
    return "done"


@count_calls
def add(a, b):
    return a + b


@make_repeater(3)
def greet(name):
    return f"hi {name}"


resource = ManagedResource("database")
with resource:
    pass
print(resource.entered)
print(resource.exited)
print(add(2, 3))
print(add.call_count)
print(greet("ana"))
print(read_managed_value(5))
print(ignore_missing())
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "read_managed_value(5)", "expected": 5, "message": "The generator context manager should yield its value", "weight": 2, "required": true },
  { "type": "function-returns", "call": "read_managed_value(\"hello\")", "expected": "hello", "message": "managed_value should work with any value", "required": true },
  { "type": "function-returns", "call": "ignore_missing()", "expected": "done", "message": "suppress should ignore the missing file", "weight": 2, "required": true },
  { "type": "code-contains", "value": "@contextmanager", "message": "Use contextmanager", "required": true },
  { "type": "code-contains", "value": "yield value", "message": "Yield the managed value", "required": true },
  { "type": "code-contains", "value": "suppress(FileNotFoundError)", "message": "Suppress FileNotFoundError", "required": true },
  { "type": "code-contains", "value": "open(\"missing.txt\"", "message": "Attempt to open the missing file", "required": true }
]
```
