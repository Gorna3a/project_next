---
id: "py-les-arguments-and-parameters"
type: "theory"
title: "Arguments and Parameters"
moduleId: "py-mod-05-functions"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "functions", "arguments", "defaults", "keyword"]
---

# Concept Overview

Function calls become flexible when arguments can be matched by position, by name, or by a default. Python supports all three, plus keyword-only parameters that must be named at the call site.

Defaults make common calls shorter, but they come with one important rule: a default value is created once when the function is defined, not every time the function is called. That rule causes a classic bug when the default is mutable.

## Key Principles & Frameworks

### Positional arguments

By default, arguments are matched to parameters by position:

```python
def describe(name, role):
    return f"{name} is a {role}."


print(describe("Sam", "mentor"))
```

Output:

```text
Sam is a mentor.
```

The first argument goes to `name` and the second to `role`. Passing them in the wrong order produces a different, possibly nonsensical result, so positional calls require care.

### Keyword arguments

An argument can be matched by parameter name instead:

```python
def describe(name, role):
    return f"{name} is a {role}."


print(describe(role="mentor", name="Sam"))
```

Output:

```text
Sam is a mentor.
```

Keyword arguments remove the need to remember parameter order. The parameter names become part of the call, so a typo such as `roll="mentor"` raises `TypeError`.

### Mixing positional and keyword arguments

Positional arguments must come before keyword arguments in a call:

```python
def describe(name, role):
    return f"{name} is a {role}."


print(describe("Sam", role="mentor"))
```

Output:

```text
Sam is a mentor.
```

Writing `describe(role="mentor", "Sam")` is a syntax error. Once a keyword argument appears, every later argument must also be a keyword argument.

### Default values

A parameter can declare a default value. If the caller omits that argument, the default is used:

```python
def describe(name, role="student"):
    return f"{name} is a {role}."


print(describe("Sam"))
print(describe("Sam", "mentor"))
```

Output:

```text
Sam is a student.
Sam is a mentor.
```

Parameters with defaults must come after parameters without defaults. `def describe(name="Sam", role):` is a syntax error because a required parameter would follow an optional one.

### Keyword-only parameters

A bare `*` in the definition marks the end of positional parameters. Anything after it can only be passed by keyword:

```python
def greet(name, *, greeting="Hello"):
    return f"{greeting}, {name}!"


print(greet("Sam"))
print(greet("Sam", greeting="Hi"))
```

Output:

```text
Hello, Sam!
Hi, Sam!
```

Calling `greet("Sam", "Hi")` raises `TypeError` because `greeting` is keyword-only. This is useful when an option should be explicit at the call site.

### Mutable default arguments

A default value is evaluated once when `def` runs. If that value is mutable, every call shares the same object. A list is a mutable collection; Module 6 covers lists in depth, but the default-argument rule matters now:

```python
def add_item(item, items=[]):
    items.append(item)
    return items


print(add_item("a"))
print(add_item("b"))
```

Output:

```text
['a']
['a', 'b']
```

The second call did not start with an empty list. It reused the list created when the function was defined, so `"a"` was still inside. This behavior is rarely what you want.

### The None default pattern

Use `None` as the default and create a fresh object inside the function:

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items


print(add_item("a"))
print(add_item("b"))
```

Output:

```text
['a']
['b']
```

`None` is immutable, so sharing it is harmless. Each call that receives `None` creates a new list. This pattern is the standard fix for mutable defaults.

### Argument count errors

Python raises `TypeError` when a call cannot be matched to the parameters:

```python
def describe(name, role):
    return f"{name} is a {role}."


# describe("Sam") raises TypeError: missing role.
# describe("Sam", "mentor", "extra") raises TypeError: too many arguments.
```

Read the error message: it usually names the missing or unexpected argument. The fix is to adjust the call or the definition, not to catch the error yet. Module 8 covers handling exceptions properly.

## Common Pitfalls & Anti-Patterns
- **Putting a positional argument after a keyword argument**: This is a syntax error.
- **Putting a required parameter after a defaulted one**: Defaults must come last.
- **Using a mutable default such as `[]` or `{}`**: The same object is reused across calls. Use `None` and create a fresh value inside.
- **Assuming defaults are re-evaluated on every call**: They are evaluated once when the function is defined.
- **Misspelling a keyword argument**: The call raises `TypeError` because no parameter has that name.
- **Forgetting that `*` makes later parameters keyword-only**: A positional call for those parameters fails.
- **Passing too many or too few arguments**: Match the call to the signature or add sensible defaults.
- **Using keyword-only parameters for required inputs without a reason**: They make every call longer.

## Quick Summary
- Positional arguments match parameters by order.
- Keyword arguments match parameters by name and can appear in any order.
- Positional arguments must come before keyword arguments.
- Default values apply when an argument is omitted.
- Required parameters must come before parameters with defaults.
- A bare `*` makes the following parameters keyword-only.
- Defaults are evaluated once, so never use a mutable default; use `None` and create a fresh object.
- Argument count or name mismatches raise `TypeError`.
