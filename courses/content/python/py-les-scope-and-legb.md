---
id: "py-les-scope-and-legb"
type: "theory"
title: "Scope and the LEGB Rule"
moduleId: "py-mod-05-functions"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "scope", "legb", "global", "nonlocal"]
---

# Concept Overview

A name such as `count` can exist in several places at once. Scope determines which binding a name refers to. Python resolves names by searching four levels in order: local, enclosing, global, and built-in. The initials give the **LEGB** rule.

Understanding scope explains why a function can read a global value but a plain assignment inside a function creates a new local name instead of changing the global one.

## Key Principles & Frameworks

### The LEGB search order

When Python sees a name, it searches:

1. **Local** — names assigned inside the current function, including its parameters.
2. **Enclosing** — names in an outer function, for nested functions.
3. **Global** — names defined at the top level of the module.
4. **Built-in** — names Python provides, such as `len`, `print`, and `sum`.

The first match wins. If no level contains the name, Python raises `NameError`.

```python
print(len("Python"))
```

Output:

```text
6
```

`len` is not local, enclosing, or global, so Python finds it in the built-in scope.

### Local scope

Parameters and names assigned inside a function are local to that call:

```python
def greet(name):
    message = f"Hello, {name}!"
    return message


print(greet("Sam"))
# print(message) raises NameError: message is local to greet.
```

Output:

```text
Hello, Sam!
```

Each call gets a fresh local namespace. When the call ends, its local names are no longer available to the surrounding code.

### Shadowing a global name

A local name can have the same spelling as a global name. The local binding shadows the global one inside the function:

```python
name = "global"


def show_name():
    name = "local"
    print(name)


show_name()
print(name)
```

Output:

```text
local
global
```

The assignment inside `show_name` creates a local variable. It does not change the global `name`. This surprises many beginners because the two names look identical.

### Reading a global name

A function can read a global name without any special declaration:

```python
count = 10


def show_count():
    print(count)


show_count()
```

Output:

```text
10
```

No local `count` exists, so the search moves to the global scope and finds `10`.

### Assigning to a global name

To assign to a global name inside a function, declare it with `global`:

```python
count = 10


def reset():
    global count
    count = 0


reset()
print(count)
```

Output:

```text
0
```

Without `global`, the assignment would create a local `count` and leave the global unchanged:

```python
count = 10


def reset():
    count = 0
    print(count)


reset()
print(count)
```

Output:

```text
0
10
```

The function prints its local `0`, then the global `10` is still intact.

### The UnboundLocalError trap

An assignment anywhere in a function makes that name local for the whole function, even before the assignment line runs:

```python
# count = 10
#
# def reset():
#     print(count)
#     count = 0
#
# reset() raises UnboundLocalError.
```

Because `count = 0` appears in the function, Python treats `count` as local everywhere in that function. The `print` tries to read the local before it has a value. Declare `global count` if the function is meant to use the global, or pass the value in as a parameter.

### Enclosing scope and nonlocal

A nested function can read a name from the function that contains it:

```python
def outer():
    message = "outer"

    def inner():
        print(message)

    inner()


outer()
```

Output:

```text
outer
```

`inner` has no local `message`, so the search moves to the enclosing scope of `outer` and finds it.

To assign to an enclosing name, use `nonlocal`:

```python
def outer():
    count = 0

    def increment():
        nonlocal count
        count += 1
        print(count)

    increment()
    increment()


outer()
```

Output:

```text
1
2
```

`nonlocal count` tells Python that `count` belongs to the enclosing function. Without it, `count += 1` would treat `count` as local and raise `UnboundLocalError`. Module 11 builds on nested functions when it covers closures.

### Built-in scope and shadowing

Built-in names are available everywhere unless a closer scope shadows them:

```python
sum = 10
# print(sum(range(5))) now raises TypeError because sum is an integer.
```

This is why shadowing built-ins such as `sum`, `max`, `min`, `list`, or `print` is dangerous. Use a descriptive name such as `total` or `maximum` instead.

### Prefer parameters and return values

`global` is sometimes necessary, but it makes data flow harder to follow. Prefer passing values in through parameters and sending results back with `return`:

```python
def add_bonus(score, bonus):
    return score + bonus


score = 10
score = add_bonus(score, 5)
print(score)
```

Output:

```text
15
```

The function does not reach into global state. It receives what it needs and returns the result. That makes it easier to test and reuse.

## Common Pitfalls & Anti-Patterns
- **Expecting an assignment to update a global**: It creates a local unless `global` is declared.
- **Using `global` when a parameter and return value would do**: Explicit inputs and outputs are easier to follow.
- **Hitting `UnboundLocalError`**: An assignment anywhere in the function makes the name local for the entire function.
- **Forgetting `nonlocal` in a nested function**: The assignment becomes local to the inner function.
- **Using `nonlocal` without an enclosing binding**: Python raises `SyntaxError`.
- **Shadowing built-ins**: Names such as `sum`, `max`, `min`, and `print` stop behaving as functions.
- **Assuming local names survive a call**: They disappear when the call ends.
- **Relying on deeply nested scope chains**: Keep nesting shallow and pass values explicitly.
- **Declaring `global` but still assigning to a different local name**: Check the spelling; the declaration applies only to that exact name.

## Quick Summary
- Python resolves names with LEGB: local, enclosing, global, built-in.
- Parameters and assignments inside a function create local names.
- A local name can shadow a global or built-in name.
- Reading a global works without a declaration; assigning requires `global`.
- `nonlocal` assigns to a name in an enclosing function.
- Assignment anywhere in a function makes the name local throughout that function.
- Prefer parameters and return values over shared global state.
