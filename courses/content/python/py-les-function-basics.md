---
id: "py-les-function-basics"
type: "theory"
title: "Function Basics"
moduleId: "py-mod-05-functions"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "functions", "return", "docstrings"]
---

# Concept Overview

A function is a named block of code that performs a task. You define the function once, then call it whenever you need that task done. Values go in through parameters, and a result comes out through `return`.

Functions are the main tool for managing complexity. Instead of repeating the same steps in several places, you give the steps a name and call that name. If the logic changes later, you change it in one place.

## Key Principles & Frameworks

### Defining and calling a function

A function definition starts with `def`, followed by the function name, parentheses, and a colon. The body is indented:

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Sam")
print(message)
```

Output:

```text
Hello, Sam!
```

`def greet(name):` creates the function. `greet("Sam")` calls it and passes `"Sam"` in. The `return` statement sends `"Hello, Sam!"` back to the caller, where it is assigned to `message`.

The function body does not run when the definition is read. It runs when the function is called. A function must be defined before the call executes.

### Parameters and arguments

The names inside the parentheses of a definition are **parameters**. The values supplied in a call are **arguments**:

```python
def add(a, b):
    return a + b


print(add(2, 3))
```

Output:

```text
5
```

Here `a` and `b` are parameters; `2` and `3` are arguments. The first argument is matched to the first parameter, and the second to the second.

### return sends a value back

`return` does two things: it ends the function immediately, and it hands a value to the caller.

```python
def classify(number):
    if number < 0:
        return "negative"
    return "non-negative"


print(classify(-5))
print(classify(5))
```

Output:

```text
negative
non-negative
```

When `number` is negative, the first `return` runs and the function ends. The second `return` is never reached for that call. For a non-negative number, the first condition is false, so the second `return` provides the result.

A function can have more than one `return`, but only one runs per call.

### Functions without return produce None

If a function finishes without executing `return`, the caller receives `None`:

```python
def greet(name):
    message = f"Hello, {name}!"


result = greet("Sam")
print(result)
```

Output:

```text
None
```

The function creates `message`, but it never sends the value back. The name `message` is local to the function and disappears when the call ends. Module 5's scope lesson explains that behavior in detail.

### print versus return

`print` displays a value. `return` sends a value to the code that called the function. They are not interchangeable:

```python
def show_total(a, b):
    print(a + b)


result = show_total(2, 3)
print(result)
```

Output:

```text
5
None
```

The function prints `5`, but its return value is `None`, so the second print displays `None`. Compare that with returning the total:

```python
def total(a, b):
    return a + b


result = total(2, 3)
print(result)
```

Output:

```text
5
```

A useful rule: use `return` when the caller needs the result. Use `print` only when the job is specifically to display something.

### Docstrings

A docstring is a string literal placed as the first statement in a function. It documents what the function does:

```python
def area(width, height):
    """Return the area of a rectangle."""
    return width * height


print(area(3, 4))
```

Output:

```text
12
```

The docstring is not executed as part of the calculation. It is stored with the function and shown by tools such as `help(area)`. Write docstrings that state the job and, when useful, what the function returns.

### Functions make testing easier

A function with clear inputs and a return value can be tested by calling it with known arguments and checking the result. The rest of this module uses that idea: graded tests call your functions directly.

```python
def square(number):
    return number * number


print(square(5))
```

Output:

```text
25
```

Tests can check `square(5)`, `square(0)`, and `square(-3)` without reading printed output. That is one reason `return` is preferred over `print` for reusable logic.

## Common Pitfalls & Anti-Patterns
- **Forgetting `return`**: The function returns `None`, even if it calculates a value internally.
- **Printing instead of returning**: The caller receives `None` and cannot reuse the result.
- **Assuming `print` returns the printed value**: It returns `None`.
- **Placing code after a `return` in the same branch**: That code never runs. Move it before the return or into another branch.
- **Confusing parameters with arguments**: Parameters are the names in the definition; arguments are the values in the call.
- **Calling a function before it is defined**: The definition must execute before the call.
- **Leaving off the parentheses when calling**: `greet` refers to the function itself; `greet("Sam")` calls it.
- **Building the body at the wrong indentation**: The body must be indented under `def`.
- **Writing a vague docstring**: State what the function does and what it returns.

## Quick Summary
- `def` defines a function; parentheses call it.
- Parameters receive arguments.
- `return` ends the call and sends a value back.
- A function without `return` produces `None`.
- `print` displays a value; `return` gives it to the caller.
- Docstrings document a function's purpose.
- Functions with clear inputs and return values are easier to test and reuse.
