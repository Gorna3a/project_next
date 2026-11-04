---
id: "py-mod-07-modules-and-standard-library"
type: "module"
title: "Module 7: Modules & the Standard Library"
courseId: "python-programming"
order: 7
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "modules", "standard-library", "imports"]
prerequisites: ["py-mod-06-collections"]
description: "Import modules, explore Python's standard library, and organize your own code into modules and packages."
---

# Module Overview

A module is a Python file whose definitions can be imported into another file. Modules let you organize code into focused pieces, reuse functions without copying them, and build on code that already ships with Python. The collection of modules included with every Python installation is called the standard library.

This module starts with the mechanics of importing: the different import forms, aliases, namespaces, import caching, and the search path Python uses to find a module. The second lesson tours useful standard-library modules: `math`, `statistics`, `datetime`, `copy`, `collections`, `pprint`, and `textwrap`. The final lesson shows how to write your own modules, protect a script with `if __name__ == "__main__":`, and arrange modules into packages.

The workshop builds geometry, statistics, and date helpers from library functions. The lab extends that work with compound growth, score summaries, business-day calculations, and date differences. Both return values, so the tests call your functions directly.

## What You Will Be Able To Do
- Import modules with `import`, `from ... import`, and `as`
- Avoid wildcard imports and name collisions
- Inspect a module with `dir()` and `help()`
- Explain import caching and the module search path
- Use `math` and `statistics` for numeric work
- Work with fixed dates using `datetime.date` and `timedelta`
- Make independent copies with `copy.deepcopy`
- Use `Counter`, `defaultdict`, `deque`, and `namedtuple`
- Format nested data with `pprint` and prose with `textwrap`
- Write an importable module and protect its entry point with a main guard
- Create a package with `__init__.py` and use absolute or relative imports
- Recognize and avoid circular imports and standard-library shadowing
