---
id: "py-les-first-class-functions-and-closures"
type: "theory"
title: "First-Class Functions and Closures"
moduleId: "py-mod-11-decorators-and-context-managers"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "functions", "closures", "nonlocal", "first-class"]
---

# Concept Overview

In Python, functions are first-class values. You can assign a function to a variable, pass it as an argument, return it from another function, and store it in a data structure. This makes it possible to write higher-order functions: functions that operate on other functions.

A closure is a nested function that remembers variables from the function that created it. Closures are the foundation of decorators, callbacks, and many small stateful objects. This lesson covers first-class functions, nested functions, closures, `nonlocal`, and a common late-binding pitfall.

## Key Principles & Frameworks

### Functions are values

A function can be assigned to a variable, passed to another function, and compared by identity:

```python
def greet(name):
    return f"Hello, {name}"


say_hello = greet
print(say_hello("Ana"))
print(greet is say_hello)
```

Output:

```text
Hello, Ana
True
```

`say_hello` and `greet` refer to the same function object. The parentheses call the function; without them, the name refers to the function itself.

### Passing functions as arguments

A higher-order function accepts a function and calls it:

```python
def apply(func, value):
    return func(value)


def shout(text):
    return text.upper()


print(apply(shout, "hello"))
print(apply(str.upper, "hello"))
```

Output:

```text
HELLO
HELLO
```

`str.upper` is a function too, so it can be passed directly. Passing behavior as an argument avoids duplicating the calling code.

### Returning functions

A function can create and return another function:

```python
def make_multiplier(factor):
    def multiply(value):
        return value * factor
    return multiply


double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))
print(triple(5))
```

Output:

```text
10
15
```

`multiply` remembers `factor` from the call that created it. Each call to `make_multiplier` creates a new `multiply` with its own captured value.

### Closures capture variables

A closure keeps a reference to variables from its enclosing scope. The inner function can read them later, even after the outer function has returned:

```python
def make_greeter(prefix):
    def greet(name):
        return f"{prefix}, {name}!"
    return greet


hello = make_greeter("Hello")
hi = make_greeter("Hi")

print(hello("Ana"))
print(hi("Ben"))
```

Output:

```text
Hello, Ana!
Hi, Ben!
```

The two greeters capture different `prefix` values. The variable is looked up when the inner function runs, not when it is defined.

### Updating a captured variable with nonlocal

A nested function can read a captured variable, but assigning to it creates a new local variable unless you declare `nonlocal`:

```python
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
print(counter())
```

Output:

```text
1
2
3
```

`nonlocal count` tells Python that `count` belongs to the enclosing function. Without it, `count += 1` would raise `UnboundLocalError`.

### The error without nonlocal

The same code without `nonlocal` fails:

```python
def make_counter():
    count = 0

    def increment():
        count += 1
        return count

    return increment


counter = make_counter()
try:
    print(counter())
except UnboundLocalError as error:
    print(str(error))
```

Output:

```text
cannot access local variable 'count' where it is not associated with a value
```

Python decides that `count` is local to `increment` because it is assigned there. The read happens before the assignment, so it fails. Use `nonlocal` for any captured variable that the inner function assigns to.

### Late binding in loops

Closures capture variable names, not values. A closure created inside a loop sees the final value of the loop variable:

```python
def make_functions():
    functions = []
    for i in range(3):
        def show():
            return i
        functions.append(show)
    return functions


print([function() for function in make_functions()])
```

Output:

```text
[2, 2, 2]
```

All three functions return `2` because they all look up the same variable `i`, whose final value is `2`. This is a common source of bugs.

### Fixing late binding

Bind the current value as a default argument. Default arguments are evaluated when the function is defined, not when it is called:

```python
def make_functions():
    functions = []
    for i in range(3):
        def show(value=i):
            return value
        functions.append(show)
    return functions


print([function() for function in make_functions()])
```

Output:

```text
[0, 1, 2]
```

Alternatively, create the closure in a helper function that receives the value as a parameter. Both approaches capture the value at definition time.

### When to use closures

Closures are useful for small stateful functions, callbacks, and configuration. They keep state private without defining a full class. When the state or behavior grows, a class is usually clearer.

## Common Pitfalls & Anti-Patterns
- **Forgetting `nonlocal`**: An assignment inside a nested function creates a new local variable unless `nonlocal` is used.
- **Late binding in loops**: Closures capture the variable, not its current value. Use a default argument or a helper function.
- **Mutating a captured mutable object without `nonlocal`**: You can call `items.append(...)` without `nonlocal` because the variable itself is not reassigned. Rebinding `items = ...` requires `nonlocal`.
- **Returning an inner function that depends on a loop variable**: The returned function may use the final value. Capture the value explicitly.
- **Using a closure where a class is clearer**: Closures with several pieces of state are hard to inspect and test. Use a class instead.
- **Assuming closures copy values**: They capture names. Changes to the captured variable are visible to every closure that shares it.
- **Passing a function with the wrong signature**: The caller must match the expected arguments.
- **Calling a function instead of passing it**: `apply(shout(), "hello")` calls `shout` first. Pass `shout`.
- **Storing too much state in a closure**: Hidden state makes debugging difficult. Keep closures small.

## Quick Summary
- Functions are first-class values in Python.
- A function can be assigned, passed, and returned.
- A higher-order function takes or returns a function.
- A closure remembers variables from its enclosing scope.
- `nonlocal` lets a nested function rebind a captured variable.
- Without `nonlocal`, an assignment creates a local variable.
- Closures capture variable names, not values.
- Late binding in loops can be fixed with a default argument.
- Use closures for small stateful behavior.
- Prefer a class when state or behavior grows.
- Pass functions without calling them.
- Keep closures small and explicit.
