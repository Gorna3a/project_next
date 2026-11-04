---
id: "py-les-importing-modules"
type: "theory"
title: "Importing Modules"
moduleId: "py-mod-07-modules-and-standard-library"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "modules", "imports", "namespaces"]
---

# Concept Overview

A module is a file containing Python definitions and statements. The file name without the `.py` suffix is the module name: `math.py` would provide the `math` module, and `helpers.py` would provide `helpers`. Importing a module runs its code once and makes its names available under the module's namespace.

Python ships with a large collection of modules called the standard library. `math`, `statistics`, `datetime`, and `collections` are all part of it, so they are available without installing anything. Third-party packages are covered in Module 15; this module focuses on modules that come with Python and on modules you write yourself.

## Key Principles & Frameworks

### Importing a whole module

The simplest import statement binds the module name in your file:

```python
import math

print(math.sqrt(49))
print(round(math.pi, 4))
```

Output:

```text
7.0
3.1416
```

`import math` does not put `sqrt` or `pi` directly into your namespace. It binds the name `math`, and you reach the module's contents with a dot. This style makes it obvious where each name came from, which is valuable in larger programs.

### Importing specific names

`from ... import` binds selected names directly:

```python
from math import ceil, sqrt

print(sqrt(81))
print(ceil(4.2))
```

Output:

```text
9.0
5
```

Now `sqrt` and `ceil` are available without the `math.` prefix. Only the names you list are imported. `pi` and `floor` remain unavailable until you import them.

The two forms are equivalent in what they load; they differ in what names they bind. Use `import module` when you want the module's context to stay visible, and use `from module import name` when a few names are used repeatedly and the source is obvious.

### Aliases with as

`as` gives an imported module or name a different local name:

```python
import statistics as stats
from math import factorial as fact

print(stats.mean([2, 4, 6]))
print(fact(5))
```

Output:

```text
4
120
```

Aliases are useful for long module names or for avoiding a collision with a local name. They do not change the module's real name; `stats` is just another way to refer to the `statistics` module in this file.

### Modules are objects

A module is an object with attributes. Its `__name__` attribute holds its name:

```python
import math

print(type(math))
print(math.__name__)
```

Output:

```text
<class 'module'>
math
```

The module object holds the definitions created when the module was loaded. Accessing `math.sqrt` looks up the `sqrt` attribute on that object.

### Inspecting a module with dir and help

`dir(module)` returns a sorted list of the names a module defines:

```python
import math

names = dir(math)

print("sqrt" in names)
print("pi" in names)
print(names == sorted(names))
```

Output:

```text
True
True
True
```

The list includes public functions, constants, and some internal names that begin with an underscore. Use membership checks or print selected entries rather than relying on the full list, which can change between Python versions.

`help()` prints documentation in the interactive shell:

```python
import math

# In the interactive shell:
# help(math.sqrt)
```

`help(math)` describes the module, and `help(math.sqrt)` shows the function's signature and docstring. The `help` output is long, so it is usually read interactively rather than printed by a program.

### Import caching

A module is loaded at most once per Python process. The interpreter stores each loaded module in `sys.modules` and reuses it on later imports:

```python
import sys
import math
import math

print("math" in sys.modules)
print(sys.modules["math"] is math)
```

Output:

```text
True
True
```

The second `import math` does not reload the file. This is why a module's top-level code runs only once, even if several files import it. If a module changes while a program is running, a fresh process is the simplest way to pick up the change; `importlib.reload` exists but is easy to misuse.

### The module search path

When Python executes `import name`, it searches several locations in order. `sys.path` is the list of directories it checks:

```text
Search order when you run a script:
1. The script's directory (the current directory in the REPL)
2. Directories listed in PYTHONPATH
3. The standard library directories
4. Installed third-party package directories
```

The first matching module wins. That is convenient for your own code, but it also means a local file can hide a standard-library module. If you create `math.py` in your project directory, `import math` may load your file instead of the real `math` module. The same problem occurs with names such as `random.py`, `statistics.py`, or `datetime.py`.

### Top-level code runs on import

An import executes the module's top-level statements: imports, assignments, function definitions, and any bare code. Multi-file layouts are shown here as plain text because this module's graded code stays in one file.

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
print(config.SETTING)
```

Running `app.py` prints:

```text
config loaded
dark
```

The `print` in `config.py` runs when `config` is imported, not when `config.SETTING` is read. The module is then cached, so a second `import config` in another file would not print again. Keep import-time work small and predictable; heavy work belongs behind a function or a main guard, which the next lesson covers.

### Modules have their own namespaces

A module does not automatically see the variables of the file that imports it. Values must be passed as arguments or read from the module's own definitions:

```text
# helpers.py
def double(value):
    return value * 2
```

```text
# app.py
import helpers

count = 5
print(helpers.double(count))
```

Output:

```text
10
```

`helpers.double` receives `count` as an argument. It cannot read `app.count` directly. This separation keeps modules reusable: the same module can be imported by many programs without knowing their local names.

### Avoid wildcard imports

`from module import *` copies every public name into the current namespace. It hides where names came from and can silently overwrite names you already defined:

```python
# Avoid this:
# from math import *
```

Use `import module` or list the names you need explicitly. A wildcard import is especially risky in a large file or when two modules define the same name.

## Common Pitfalls & Anti-Patterns
- **Naming a file after a standard module**: A local `math.py` or `random.py` shadows the standard-library module. Rename your file.
- **Using `from module import *`**: It pollutes the namespace and makes the source of names unclear.
- **Forgetting that import executes top-level code**: A print, file read, or network call at module level runs on import.
- **Assuming a module can see your local variables**: Modules have separate namespaces; pass values as arguments.
- **Expecting a second import to reload the file**: Modules are cached in `sys.modules`; start a fresh process or use `importlib.reload` deliberately.
- **Using `sqrt()` after only `import math`**: The module import binds `math`, not its individual functions.
- **Confusing a module alias with the original name**: `import statistics as stats` binds `stats`; `statistics` remains unbound unless imported separately.
- **Relying on `dir()` output as a stable API list**: It includes internal names and can change between versions.
- **Placing imports after heavy top-level work**: Convention puts imports at the top, where dependencies are easy to see.

## Quick Summary
- A module is a `.py` file; importing it runs its code once and binds a module object.
- `import module` binds the module name; `from module import name` binds selected names.
- `as` creates an alias in the importing file.
- Modules are objects with attributes such as `__name__`.
- `dir()` lists names; `help()` displays documentation.
- Imports are cached in `sys.modules`, so top-level code runs once per process.
- `sys.path` determines where Python looks; a local file can shadow a standard-library module.
- Top-level code runs on import, so keep it small.
- Modules have their own namespaces.
- Avoid wildcard imports.
