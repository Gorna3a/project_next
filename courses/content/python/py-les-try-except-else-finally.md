---
id: "py-les-try-except-else-finally"
type: "theory"
title: "try, except, else, and finally"
moduleId: "py-mod-08-exceptions-and-files"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "exceptions", "try-except", "tracebacks"]
---

# Concept Overview

An exception is Python's way of reporting that an operation cannot finish normally. A missing key, an invalid conversion, or a division by zero raises an exception. If nothing handles it, the program stops and prints a traceback.

The `try` statement lets you handle an exception instead of crashing. Its four parts have distinct jobs: `try` holds the risky code, `except` handles a matching exception, `else` runs when no exception occurred, and `finally` runs no matter what happened. Choosing the right part keeps error handling narrow and predictable.

## Key Principles & Frameworks

### Reading a traceback

When an unhandled exception stops a program, Python prints a traceback. Read it from the bottom up:

```text
Traceback (most recent call last):
  File "app.py", line 3, in <module>
    number = int("abc")
ValueError: invalid literal for int() with base 10: 'abc'
```

The last line gives the exception type and message: `ValueError` and `invalid literal for int() with base 10: 'abc'`. The lines above show the call stack. The final `File` entry is where the error occurred; earlier entries show how execution got there. The caret or source line points at the failing expression.

### Catching a specific exception

Put the risky statement inside `try` and name the expected exception in `except`:

```python
try:
    number = int("not a number")
except ValueError:
    print("That was not an integer.")
```

Output:

```text
That was not an integer.
```

`int` raises `ValueError` when the string is not a valid integer. The `except` block runs, and the program continues after the `try` statement.

Catch the exception you actually expect. A specific `except` documents what can go wrong and lets unrelated bugs surface.

### Providing a fallback value

The `try` block can assign a value that is used after the handler:

```python
try:
    number = int("abc")
except ValueError:
    number = 0

print(number)
```

Output:

```text
0
```

The assignment in `except` ensures `number` exists. Without it, the failed assignment would leave `number` unbound, and the later `print` would raise `NameError`.

### Catching several exception types

A tuple in `except` handles more than one type:

```python
for value in ["42", None]:
    try:
        number = int(value)
    except (TypeError, ValueError):
        print("Could not convert", value)
    else:
        print("Converted", number)
```

Output:

```text
Converted 42
Could not convert None
```

`int(None)` raises `TypeError` because the type is wrong. `int("abc")` raises `ValueError` because the type is right but the value is invalid. Listing both types handles either problem without catching everything.

### The else block

`else` runs only when the `try` block finishes without an exception:

```python
try:
    number = int("42")
except ValueError:
    print("Invalid input")
else:
    print(f"Parsed {number}")
```

Output:

```text
Parsed 42
```

Keeping the successful path in `else` makes the risky region small. Only the conversion belongs in `try`; code that depends on a successful conversion belongs in `else`.

### The finally block

`finally` runs whether the `try` block succeeds, raises a handled exception, or raises an unhandled exception:

```python
try:
    print("Opening resource")
finally:
    print("Cleaning up")
```

Output:

```text
Opening resource
Cleaning up
```

`finally` is for cleanup that must not be skipped, such as closing a file or releasing a lock. If an exception is still unhandled, `finally` runs before the exception continues outward.

### return inside finally

A `return` in `finally` overrides a `return` from `try`:

```python
def get_value():
    try:
        return "try"
    finally:
        return "finally"


print(get_value())
```

Output:

```text
finally
```

The `finally` block runs before the function returns, and its `return` replaces the earlier result. This is almost always a bug because it hides exceptions and makes the return value surprising. Do not return from `finally`.

### Common built-in exceptions

| Exception | Typical trigger |
| :--- | :--- |
| `ValueError` | The type is right but the value is invalid, such as `int("abc")` |
| `TypeError` | The operation received the wrong type, such as `len(5)` |
| `KeyError` | A dictionary key is missing |
| `IndexError` | A list index is out of range |
| `ZeroDivisionError` | A division or modulo has a zero divisor |
| `FileNotFoundError` | An operation needs a file that does not exist |
| `NameError` | A name has not been defined |
| `AttributeError` | An object does not have the requested attribute |
| `ImportError` | An import cannot be resolved |

A few examples:

```python
try:
    print(10 / 0)
except ZeroDivisionError:
    print("Cannot divide by zero.")
```

Output:

```text
Cannot divide by zero.
```

```python
try:
    values = [1, 2, 3]
    print(values[5])
except IndexError:
    print("Index out of range.")
```

Output:

```text
Index out of range.
```

```python
try:
    student = {"name": "Ana"}
    print(student["score"])
except KeyError:
    print("The key is missing.")
```

Output:

```text
The key is missing.
```

```python
try:
    print(len(5))
except TypeError:
    print("That value has no length.")
```

Output:

```text
That value has no length.
```

### Exception order matters

Python checks `except` clauses from top to bottom and runs the first match. Put specific exceptions before broader ones:

```python
try:
    int("abc")
except Exception:
    print("Caught by the broad clause")
except ValueError:
    print("Caught by the specific clause")
```

Output:

```text
Caught by the broad clause
```

`ValueError` is a subclass of `Exception`, so the broad clause matches first and the specific clause never runs. Reverse the order to handle the specific case meaningfully. In most code, avoid `except Exception` unless you are at a program boundary where you truly need to catch everything.

### Do not use a bare except

A bare `except:` catches every exception, including `KeyboardInterrupt` and `SystemExit`, which are usually meant to stop the program. It also hides programming mistakes:

```python
# Avoid:
# try:
#     number = int("abc")
# except:
#     pass
```

This code silently discards the error. The program continues with no value, no message, and no clue about what went wrong. Catch a specific exception and handle it, or let it propagate.

### Syntax errors cannot be caught this way

A `SyntaxError` prevents the file from being compiled, so the `try` statement never runs. Fix the syntax rather than trying to catch it at runtime. A `try` block can handle runtime failures such as bad values, missing files, and failed conversions, not a malformed program.

## Common Pitfalls & Anti-Patterns
- **Using a bare `except:`**: It catches everything, including exit signals, and hides bugs. Name the expected exception.
- **Swallowing errors with `pass`**: The program continues without a value or explanation. Handle the error or let it propagate.
- **Catching `Exception` too broadly**: A broad catch makes real bugs look like expected failures. Catch specific types.
- **Putting a broad exception before a specific one**: The specific clause becomes unreachable. Order subclasses first.
- **Using `return` inside `finally`**: It overrides earlier returns and can suppress exceptions.
- **Assuming `try` catches `SyntaxError`**: Syntax errors happen before execution.
- **Leaving variables unbound after a failed `try`**: Assign a fallback in `except` or restructure the code.
- **Putting too much code inside `try`**: A larger block can catch errors you did not intend to handle. Keep only the risky operation there.
- **Using exceptions for ordinary branching**: Use `if` when a condition is normal and expected; use exceptions for exceptional failures.
- **Forgetting that `finally` always runs**: Cleanup may overwrite state or return early if you are not careful.

## Quick Summary
- Read a traceback from the bottom: exception type, message, then the call stack.
- `try` holds risky code; `except` handles a matching exception.
- Catch specific types, and put subclasses before broader classes.
- A tuple handles several exception types.
- `else` runs only when `try` succeeds.
- `finally` always runs and is for cleanup.
- Do not return from `finally`.
- `ValueError`, `TypeError`, `KeyError`, `IndexError`, and `ZeroDivisionError` are common built-ins.
- A bare `except:` and a silent `pass` hide problems.
- Runtime `try` cannot catch a `SyntaxError`.
