---
id: "py-quiz-decorators-and-context-managers"
type: "quiz"
title: "Decorators & Context Managers Knowledge Check"
moduleId: "py-mod-11-decorators-and-context-managers"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "decorators", "context-managers", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
When does a decorator run?

- [x] When the function is defined
- [ ] When the function is called
- [ ] When the module is imported but before any definitions
- [ ] Only when `functools.wraps` is used

*Explanation*: The `@decorator` syntax calls the decorator immediately during function definition. The wrapper runs later, when the function is called.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
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
print(greet.__name__)
```

- [x] `HELLO, ANA` then `greet`
- [ ] `HELLO, ANA` then `wrapper`
- [ ] `hello, ana` only
- [ ] It raises `AttributeError`

*Explanation*: The wrapper uppercases the result. `@wraps(func)` preserves the original name.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
Returning `True` from `__exit__` suppresses an exception raised in the `with` block.

- [x] True
- [ ] False

*Explanation*: `__exit__` receives the exception details. Returning `True` tells Python to suppress it; returning `False` lets it propagate.

---

## Question 4
<!-- meta: {"type":"multiple","points":2} -->
Which statements are correct? Select all that apply.

- [x] A decorator factory returns a decorator, not a wrapper
- [x] `functools.wraps` copies metadata but not behavior
- [x] Stacked decorators apply bottom-up
- [ ] A lambda can be used as a decorator factory without nesting
- [ ] `@contextmanager` requires two `yield` statements

*Explanation*: A factory has three levels: factory, decorator, and wrapper. `wraps` copies names and docstrings. Decorators apply from the function outward. A context manager must yield exactly one value.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
from contextlib import contextmanager


@contextmanager
def managed(value):
    print("start")
    try:
        yield value
    finally:
        print("end")


with managed(5) as current:
    print(current)
```

- [x] `start` then `5` then `end`
- [ ] `start` then `end` then `5`
- [ ] `5` then `start` then `end`
- [ ] It raises `TypeError`

*Explanation*: The code before `yield` runs on entry. The yielded value becomes `current`. The `finally` block runs during cleanup.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
What happens if a `@contextmanager` function has no `yield`?

- [x] Python raises `TypeError` when entering the context
- [ ] The context manager does nothing
- [ ] The `with` block is skipped
- [ ] The function returns `None`

*Explanation*: `contextmanager` requires exactly one `yield` to produce the `as` value. Without it, entering the context fails.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
from functools import wraps


def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return [func(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator


@repeat(2)
def identity(value):
    return value


print(identity(7))
```

- [x] `[7, 7]`
- [ ] `[7]`
- [ ] `7`
- [ ] It raises `TypeError`

*Explanation*: `repeat(2)` returns a decorator that calls the original function twice and collects the results in a list.

---

## Question 8
<!-- meta: {"type":"single","points":1} -->
When is a class-based decorator a good choice?

- [x] When the decorator needs substantial state or several methods
- [ ] When the function has no arguments
- [ ] When you need to avoid `functools.wraps`
- [ ] When the decorator should run only once

*Explanation*: A class can store state and define helper methods. A plain function decorator is simpler for stateless behavior.
