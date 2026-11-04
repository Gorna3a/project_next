---
id: "py-les-writing-modules-and-packages"
type: "theory"
title: "Writing Modules and Packages"
moduleId: "py-mod-07-modules-and-standard-library"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "modules", "packages", "main-guard"]
---

# Concept Overview

Any Python file can be imported as a module. Writing your own modules keeps a program organized: related functions live together, and other files can reuse them without copying code. A package groups several modules into a directory with a shared name.

Two details make user-written modules predictable. First, importing a module runs its top-level code, so that code should be safe to execute on import. Second, a module can tell whether it is being run directly or imported by checking `__name__`. The `if __name__ == "__main__":` guard uses that difference to run a program only when the file is the entry point.

## Key Principles & Frameworks

### A module is a file

The file name, without `.py`, becomes the import name. A file named `greetings.py` provides the module `greetings`:

```text
greetings.py
------------
def greet(name):
    return f"Hello, {name}!"


def farewell(name):
    return f"Goodbye, {name}!"
```

```text
app.py
------
import greetings

print(greetings.greet("Ana"))
print(greetings.farewell("Ben"))
```

Output:

```text
Hello, Ana!
Goodbye, Ben!
```

`app.py` and `greetings.py` must be in the same directory, or `greetings.py` must be inside a package that is on the import path. Module names are case-sensitive and normally use lowercase letters and underscores.

### Importing selected names from your module

A user-written module supports the same import forms as a standard-library module:

```text
app.py
------
from greetings import greet

print(greet("Ana"))
```

Output:

```text
Hello, Ana!
```

The module's other definitions still exist, but only `greet` is bound in `app.py`. This is useful when a module exposes a small public interface.

### Modules have their own namespace

Names defined in a module are not automatically visible in the file that imports it:

```text
app.py
------
import greetings

print(dir(greetings))
```

`dir(greetings)` includes `greet`, `farewell`, and Python's internal module attributes. The importing file reaches them through the module object. A module cannot read the importing file's local variables unless they are passed as arguments.

### The __name__ attribute

Every module has a `__name__` attribute. When a file is run directly, Python sets it to the string `"__main__"`:

```python
print(__name__)
```

Output:

```text
__main__
```

When the same file is imported, `__name__` is the module's name instead. A file named `greetings.py` reports `"greetings"` when imported and `"__main__"` when run directly.

```text
greetings.py
------------
print(f"greetings loaded as {__name__}")
```

Running `python greetings.py` prints `greetings loaded as __main__`. Importing `greetings` from another file prints `greetings loaded as greetings`.

### The main guard

The main guard runs code only when the file is the program's entry point:

```python
def main():
    print("Running the program")


if __name__ == "__main__":
    main()
```

Output:

```text
Running the program
```

If another file imports this module, the function definitions still execute, but `main()` is not called. The guard protects the program's starting action, not the entire file.

A module that is both importable and runnable usually follows this shape:

```text
converter.py
------------
def celsius_to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32


def main():
    print(celsius_to_fahrenheit(20))


if __name__ == "__main__":
    main()
```

Running `python converter.py` prints `68.0`. Importing `converter` gives you `celsius_to_fahrenheit` without printing anything.

### Top-level code runs on import

Everything at the top level of a module executes when the module is imported. That includes imports, assignments, function definitions, and any bare statements:

```text
config.py
---------
print("config loaded")
SETTING = "dark"
```

```text
app.py
------
import config
import config

print(config.SETTING)
```

Output:

```text
config loaded
dark
```

The `print` runs once because the first import loads and caches the module. The second import reuses the cached object. Even one execution of a heavy or error-prone statement can be a problem, so keep module-level code limited to definitions and simple constants. Put file reads, network calls, and long calculations inside functions or behind the main guard.

### Packages and __init__.py

A package is a directory of modules. A regular package contains an `__init__.py` file, which marks the directory as a package and runs when the package is imported:

```text
shop/
  __init__.py
  pricing.py
  formatting.py
app.py
```

```text
shop/pricing.py
---------------
def with_tax(price, rate=0.2):
    return round(price * (1 + rate), 2)
```

```text
shop/formatting.py
------------------
def money(amount):
    return f"${amount:.2f}"
```

```text
app.py
------
from shop.pricing import with_tax
from shop.formatting import money

print(money(with_tax(50)))
```

Output:

```text
$60.00
```

The package name is the directory name, and each module is addressed as `package.module`. `__init__.py` may be empty. It can also expose a convenient public interface:

```text
shop/__init__.py
----------------
from .pricing import with_tax
from .formatting import money
```

```text
app.py
------
from shop import money, with_tax

print(money(with_tax(50)))
```

Output:

```text
$60.00
```

Python 3.3 and later can also create namespace packages without `__init__.py`, but a regular package with the file is the conventional choice and is required by some tools. Keep `__init__.py` small; importing a package should not trigger expensive work.

### Absolute and relative imports

An absolute import starts from the top-level package:

```text
from shop.pricing import with_tax
```

A relative import starts from the current package:

```text
from .pricing import with_tax
```

A single dot means the current package, and two dots mean the parent package. Relative imports are only valid inside a package. Running a module file directly can produce `ImportError: attempted relative import with no known parent package`, because Python does not know which package the file belongs to.

Use absolute imports in application code because they are explicit. Use relative imports for wiring inside a package, especially in `__init__.py`, when the shorter form makes the package's internal structure clear.

### Circular imports

A circular import happens when two modules import each other. If one module tries to use a name from the other before that name has been defined, the program fails:

```text
a.py
----
import b

def a_value():
    return b.b_value() + 1
```

```text
b.py
----
import a

VALUE = a.a_value()
```

When `a` is imported, it begins executing and imports `b`. `b` then imports `a`, which is only partially initialized, and calls `a.a_value()` before that function has been defined. Python raises `AttributeError`.

Break the cycle by moving shared code into a third module:

```text
shared.py
---------
def base_value():
    return 10
```

```text
a.py
----
import shared

def a_value():
    return shared.base_value() + 1
```

```text
b.py
----
import shared

VALUE = shared.base_value()
```

Now both modules depend on `shared`, and the dependency graph has no loop. Deferring an import inside a function can also break a cycle, but restructuring is usually clearer.

## Common Pitfalls & Anti-Patterns
- **Naming a file after a standard-library module**: `math.py`, `random.py`, or `datetime.py` can shadow the real module.
- **Running heavy work at module level**: Imports execute top-level code, so file reads and long calculations can slow every import.
- **Forgetting the main guard**: A script with top-level calls runs its program when imported instead of only defining names.
- **Using `from module import *`**: Wildcard imports hide the source of names and can overwrite existing definitions.
- **Creating a circular import**: Two modules importing each other can leave one partially initialized. Move shared code out.
- **Using a relative import in a directly run script**: Relative imports require a package context.
- **Omitting `__init__.py` from a regular package**: Namespace packages exist, but conventional packages and some tools expect the file.
- **Using a hyphen in a module or package name**: `my-module.py` cannot be imported with a normal `import` statement. Use underscores.
- **Reassigning a module name**: `import math` followed by `math = 5` loses the module reference. Choose different local names.
- **Expecting an edited module to reload automatically**: A running process keeps the cached module. Restart it or use `importlib.reload` deliberately.

## Quick Summary
- Any `.py` file can be imported as a module, using its file name without the suffix.
- User-written modules support `import`, `from ... import`, and `as`.
- A module has its own namespace; pass values in as arguments.
- `__name__` is `"__main__"` when a file is run directly and the module name when imported.
- `if __name__ == "__main__":` guards the program's entry point.
- Top-level code runs on import, so keep it safe and small.
- A regular package is a directory with `__init__.py`; modules inside are addressed as `package.module`.
- Absolute imports start at the top-level package; relative imports start with a dot inside a package.
- Circular imports are broken by moving shared code to a separate module.
- Never name a module after a standard-library module.
