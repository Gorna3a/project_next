---
id: "py-rev-modules-and-standard-library"
type: "review"
title: "Modules & Standard Library Quick Reference"
moduleId: "py-mod-07-modules-and-standard-library"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-importing-modules", "py-les-standard-library-tour", "py-les-writing-modules-and-packages", "py-ws-stdlib-explorer", "py-lab-date-and-math-helpers"]
tags: ["python", "modules", "standard-library", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Module | A `.py` file whose definitions can be imported | Organizing reusable code |
| Standard library | Modules bundled with Python | Using tools without installation |
| `import module` | Binds the module object | Keeping names namespaced |
| `from module import name` | Binds selected names directly | Short repeated calls |
| `as` | Creates a local alias | Short names and collision avoidance |
| Namespace | The mapping where a module's names live | Understanding name visibility |
| `dir(module)` | Sorted list of a module's names | Discovery and inspection |
| `help(module)` | Interactive documentation | Learning signatures |
| `sys.modules` | Cache of loaded modules | Understanding import caching |
| `sys.path` | Directories searched for imports | Diagnosing import failures |
| Shadowing | A local module hides a same-named module | Avoiding `math.py` and `random.py` |
| Top-level code | Statements that run when a module is imported | Keeping imports side-effect free |
| `__name__` | Module name, or `"__main__"` when run directly | Detecting the entry point |
| Main guard | `if __name__ == "__main__":` | Running a file only as a program |
| Package | Directory of modules with `__init__.py` | Grouping related modules |
| `__init__.py` | Package marker and initialization file | Package setup and exports |
| Absolute import | Starts from the top-level package | Clear application imports |
| Relative import | Starts with `.` inside a package | Package-internal wiring |
| Circular import | Two modules import each other | Broken by extracting shared code |
| `math` | Mathematical functions and constants | `sqrt`, `ceil`, `floor`, `pi` |
| `statistics` | Numeric summaries | `mean`, `median`, `mode`, `stdev` |
| `date` | Calendar date without a time | Fixed-date arithmetic |
| `timedelta` | Duration between dates or times | Adding or subtracting days |
| `copy.copy` | Shallow copy | New outer container |
| `copy.deepcopy` | Recursive independent copy | Nested mutable data |
| `Counter` | Counts hashable values | Frequency tables |
| `defaultdict` | Mapping with a default factory | Grouping into lists |
| `deque` | Double-ended queue | Fast operations at both ends |
| `namedtuple` | Tuple subclass with named fields | Lightweight records |
| `pprint` | Pretty-prints nested data | Debugging output |
| `textwrap` | Wraps and formats prose | `wrap`, `fill`, `shorten`, `dedent` |
| `random` | Pseudo-random values | Explained only; never graded |

## Key Concepts Comparison
- **`import module` vs. `from module import name`**: The first binds one module name and keeps access qualified. The second binds selected names directly.
- **Module vs. package**: A module is one `.py` file. A package is a directory of modules, conventionally with `__init__.py`.
- **`__name__` in a script vs. an imported module**: It is `"__main__"` when the file is the entry point and the module name when imported.
- **Main guard vs. top-level code**: The guard controls only the code inside it. Imports, assignments, and function definitions outside it still run on import.
- **Absolute vs. relative imports**: Absolute imports start at the top-level package and are explicit. Relative imports start with a dot and work only inside a package.
- **Import caching vs. reloading**: A module is loaded once per process. Editing the file does not change the cached module until the process restarts or `importlib.reload` is used.
- **`copy.copy` vs. `copy.deepcopy`**: A shallow copy shares nested objects. A deep copy recursively duplicates them.
- **`Counter` vs. `defaultdict`**: `Counter` counts occurrences and returns `0` for a missing key. `defaultdict(list)` creates an empty list for a missing key.
- **`date` vs. `datetime`**: `date` holds a calendar date. `datetime` holds a date and a time.
- **Fixed dates vs. `today()`/`now()`**: Fixed dates make output repeatable. Clock-dependent calls change between runs and belong outside graded code.
- **`random` vs. deterministic code**: Random values are useful in simulations and games but cannot produce stable test expectations. Graded code does not use `random`.
- **`pprint` vs. JSON**: `pprint` is for human-readable debugging. JSON is a data-exchange format covered in Module 8.

## Critical Syntax / Templates
```python
# Import forms
import math
import statistics as stats
from math import ceil, sqrt
from collections import Counter, defaultdict, deque, namedtuple

print(math.sqrt(81))
print(sqrt(81))
print(stats.mean([1, 2, 3]))
print(Counter("aab"))
```

```python
# Inspection and import caching
import math
import sys

print("sqrt" in dir(math))
print("math" in sys.modules)
print(sys.modules["math"] is math)

# In the interactive shell:
# help(math.sqrt)
```

```python
# math
import math

print(math.sqrt(81))
print(math.ceil(4.2))
print(math.floor(4.8))
print(math.factorial(5))
print(math.gcd(18, 24))
print(math.isclose(0.1 + 0.2, 0.3))
print(round(math.pi, 4))
```

```python
# statistics
import statistics

scores = [88, 92, 79, 92, 85]

print(statistics.mean(scores))
print(statistics.median(scores))
print(statistics.mode(scores))
print(round(statistics.stdev(scores), 2))
```

```python
# Fixed dates
from datetime import date, datetime, timedelta

start = date(2026, 11, 4)
end = start + timedelta(days=10)

print(start)
print(end)
print((end - start).days)
print(start.isoformat())
print(start.strftime("%d %B %Y"))
print(date.fromisoformat("2026-11-04"))

moment = datetime(2026, 11, 4, 14, 30)
print(moment.strftime("%Y-%m-%d %H:%M"))
```

```python
# Copying nested data
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

shallow[0][0] = 9
print(original)
print(deep)
```

```python
# collections
from collections import Counter, defaultdict, deque, namedtuple

counts = Counter(["apple", "banana", "apple"])
print(counts["apple"])
print(counts.most_common(1))

groups = defaultdict(list)
groups["a"].append(1)
print(dict(groups))

queue = deque([1, 2, 3])
queue.appendleft(0)
print(queue.popleft())

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 5)
print(p.x, p.y)
print(p._asdict())
```

```python
# pprint and textwrap
import pprint
import textwrap

data = {"name": "Project", "tags": ["python", "stdlib"]}
pprint.pprint(data, width=40, sort_dicts=False)

text = "Python's standard library saves time and keeps your code readable."
print(textwrap.wrap(text, width=30))
print(textwrap.fill(text, width=30))
print(textwrap.shorten(text, width=40, placeholder="..."))
print(textwrap.dedent("""\
    def greet():
        return "hello"
"""))
```

```python
# Main guard in a runnable module
def main():
    print("Running the program")


if __name__ == "__main__":
    main()
```

```text
# Package layout
shop/
  __init__.py
  pricing.py
  formatting.py
app.py

# shop/__init__.py
from .pricing import with_tax
from .formatting import money

# app.py
from shop import money, with_tax
# or:
from shop.pricing import with_tax
```

```python
# random: explained but never used in graded code
import random

# random.random()
# random.randint(1, 6)
# random.choice(["rock", "paper", "scissors"])
# random.shuffle(items)
```
