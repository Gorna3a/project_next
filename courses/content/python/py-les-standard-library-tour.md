---
id: "py-les-standard-library-tour"
type: "theory"
title: "Standard Library Tour"
moduleId: "py-mod-07-modules-and-standard-library"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 30
tags: ["python", "standard-library", "math", "datetime", "collections"]
---

# Concept Overview

The standard library is a set of modules bundled with Python. It covers arithmetic, statistics, dates, copying, specialized collections, pretty-printing, and text wrapping, among many other areas. Learning a few modules well removes the need to write common utilities from scratch.

This lesson tours `math`, `statistics`, `datetime`, `copy`, `collections`, `pprint`, and `textwrap`. It also explains `random`, but graded code in this course never uses it because tests require deterministic results.

## Key Principles & Frameworks

### math

`math` provides mathematical functions and constants that operate on numbers:

```python
import math

print(math.sqrt(81))
print(math.ceil(4.2))
print(math.floor(4.8))
print(math.factorial(5))
print(math.gcd(18, 24))
print(math.isclose(0.1 + 0.2, 0.3))
print(round(math.pi, 4))
```

Output:

```text
9.0
5
4
120
6
True
3.1416
```

- `sqrt` returns a float square root.
- `ceil` rounds up to the nearest integer, and `floor` rounds down.
- `factorial` multiplies all positive integers up to its argument.
- `gcd` returns the greatest common divisor of two integers.
- `isclose` compares floats with a tolerance, which is safer than `==` for calculated values.
- `pi` and `e` are constants.

`math.sqrt(-1)` raises `ValueError`, and passing a string raises `TypeError`. Validate inputs before calling numeric functions when the source is uncertain.

### statistics

`statistics` computes summary values from numeric data:

```python
import statistics

scores = [88, 92, 79, 92, 85]

print(statistics.mean(scores))
print(statistics.median(scores))
print(statistics.mode(scores))
print(round(statistics.stdev(scores), 2))
print(statistics.median([1, 2, 3, 4]))
```

Output:

```text
87.2
88
92
5.45
2.5
```

- `mean` is the arithmetic average.
- `median` is the middle value after sorting, or the average of the two middle values for an even count.
- `mode` is the most frequent value. It raises `StatisticsError` when no single value is most common.
- `stdev` is the sample standard deviation, which divides by `n - 1`. Use `pstdev` for the population version.

The functions accept lists, tuples, and other iterables of numbers. Empty input raises `StatisticsError` for most of them.

### datetime with fixed dates

`datetime` supplies date and time types. Use fixed values in examples and graded code so results do not depend on the day the program runs:

```python
from datetime import date, timedelta

start = date(2026, 11, 4)
end = start + timedelta(days=10)

print(start)
print(end)
print(end - start)
print(start.isoformat())
print(start.strftime("%d %B %Y"))
print(start.weekday())
```

Output:

```text
2026-11-04
2026-11-14
10 days, 0:00:00
2026-11-04
04 November 2026
2
```

- `date(year, month, day)` creates a date.
- `timedelta(days=10)` represents a duration; adding it produces a new date.
- Subtracting two dates produces a `timedelta`; its `.days` attribute gives the whole-day difference.
- `isoformat()` returns `YYYY-MM-DD`.
- `strftime` formats a date with codes such as `%Y`, `%m`, `%d`, and `%B`.
- `weekday()` returns `0` for Monday through `6` for Sunday, so Wednesday is `2`.

`date.fromisoformat` parses a date string:

```python
from datetime import date

parsed = date.fromisoformat("2026-11-04")

print(parsed.year)
print(parsed.month)
print(parsed.day)
```

Output:

```text
2026
11
4
```

The `datetime` class combines a date and a time:

```python
from datetime import datetime

moment = datetime(2026, 11, 4, 14, 30)

print(moment)
print(moment.strftime("%Y-%m-%d %H:%M"))
```

Output:

```text
2026-11-04 14:30:00
2026-11-04 14:30
```

`date.today()` and `datetime.now()` read the system clock. They are useful in real programs, but graded code should use fixed dates instead so tests are repeatable.

### copy

Module 6 showed that slicing and `.copy()` make shallow copies. `copy.copy` does the same thing for many containers, while `copy.deepcopy` recursively copies nested objects:

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

shallow[0][0] = 9

print(original)
print(shallow)
print(deep)
```

Output:

```text
[[9, 2], [3, 4]]
[[9, 2], [3, 4]]
[[1, 2], [3, 4]]
```

The shallow copy shares its inner lists with `original`, so changing a nested value appears in both. The deep copy has independent nested lists, so it keeps the original values. Use `copy.deepcopy` when a structure contains nested mutable objects and the copy must be fully independent.

### collections

The `collections` module provides specialized containers for common patterns.

#### Counter

`Counter` counts hashable values:

```python
from collections import Counter

words = ["apple", "banana", "apple", "cherry", "apple"]
counts = Counter(words)

print(counts["apple"])
print(counts.most_common(1))
print(counts["missing"])
```

Output:

```text
3
[('apple', 3)]
0
```

A missing key returns `0` instead of raising `KeyError`, which makes counting convenient. `most_common(n)` returns a list of `(value, count)` tuples ordered by count.

#### defaultdict

`defaultdict` supplies a default value when a missing key is accessed:

```python
from collections import defaultdict

groups = defaultdict(list)
groups["a"].append(1)
groups["a"].append(2)
groups["b"].append(3)

print(dict(groups))
```

Output:

```text
{'a': [1, 2], 'b': [3]}
```

The factory passed to `defaultdict` creates the default. `defaultdict(list)` creates an empty list for a missing key. Be aware that reading a missing key inserts it:

```python
from collections import defaultdict

groups = defaultdict(list)

print(groups["x"])
print(dict(groups))
```

Output:

```text
[]
{'x': []}
```

Use `key in groups` if you need to check presence without creating the key.

#### deque

A `deque` is a double-ended queue with fast appends and removals at both ends:

```python
from collections import deque

queue = deque([1, 2, 3])
queue.append(4)
queue.appendleft(0)

print(queue)
print(queue.popleft())
print(queue.pop())
print(queue)
```

Output:

```text
deque([0, 1, 2, 3, 4])
0
4
deque([1, 2, 3])
```

`append` and `pop` work on the right end. `appendleft` and `popleft` work on the left end. A deque is a better choice than a list when you frequently remove items from the front.

#### namedtuple

`namedtuple` creates a small class whose fields have names:

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 5)

print(p)
print(p.x)
print(p.y)
print(p._asdict())

x, y = p
print(x + y)
```

Output:

```text
Point(x=3, y=5)
3
5
{'x': 3, 'y': 5}
8
```

A named tuple is immutable and still supports normal tuple indexing and unpacking. `_asdict()` converts it to a dictionary. Module 9 covers full classes; a named tuple is a lightweight option when you only need named fields.

### pprint

`pprint` formats nested data across multiple lines so it is easier to read:

```python
import pprint

data = {
    "name": "A very long project name",
    "tags": ["python", "standard-library", "modules", "collections"],
    "owner": {"name": "Sam", "active": True},
}

pprint.pprint(data, width=40, sort_dicts=False)
```

Output:

```text
{'name': 'A very long project name',
 'tags': ['python',
          'standard-library',
          'modules',
          'collections'],
 'owner': {'name': 'Sam',
           'active': True}}
```

By default, `pprint` sorts dictionary keys. Passing `sort_dicts=False` preserves insertion order. `pformat` returns the formatted string instead of printing it:

```python
import pprint

print(pprint.pformat([1, 2, 3]))
```

Output:

```text
[1, 2, 3]
```

`pprint` is a debugging and display tool. Do not parse its output or use it as a data format; JSON is covered in Module 8.

### textwrap

`textwrap` formats prose:

```python
import textwrap

text = "Python's standard library saves time and keeps your code readable."

print(textwrap.wrap(text, width=30))
print(textwrap.fill(text, width=30))
print(textwrap.shorten(text, width=40, placeholder="..."))
```

Output:

```text
["Python's standard library", 'saves time and keeps your code', 'readable.']
Python's standard library
saves time and keeps your code
readable.
Python's standard library saves time...
```

`wrap` returns a list of lines, while `fill` returns one string with newlines. `shorten` collapses whitespace and trims the text to fit the width, adding the placeholder.

`dedent` removes a common leading indentation from every line:

```python
import textwrap

text = """\
    def greet():
        return "hello"
"""

print(textwrap.dedent(text))
```

Output:

```text
def greet():
    return "hello"
```

`dedent` is useful for multiline strings that are indented to match the surrounding code but should be displayed without that indentation.

### random: explained, never graded

`random` generates pseudo-random values:

```python
import random

# These calls produce different values on each run:
# random.random()
# random.randint(1, 6)
# random.choice(["rock", "paper", "scissors"])
# random.shuffle(items)
```

`random.random()` returns a float from `0.0` up to but not including `1.0`. `randint(1, 6)` returns an integer from `1` through `6`. `choice` picks one item, and `shuffle` reorders a list in place.

`random.seed(42)` makes a sequence reproducible, but this course never uses `random` in graded code because tests need fixed results. It is still a standard-library module, so never name your own file `random.py`.

## Common Pitfalls & Anti-Patterns
- **Naming a file after a standard module**: `math.py` or `random.py` can shadow the library module.
- **Using `date.today()` or `datetime.now()` in graded code**: The result changes with the clock. Use fixed dates.
- **Using `random` in graded code**: Unseeded output changes between runs and cannot be tested reliably.
- **Expecting `Counter` to raise on a missing key**: It returns `0`.
- **Reading a missing `defaultdict` key just to check presence**: The read inserts the key. Use `in`.
- **Using `copy.copy` when nested objects must be independent**: Use `copy.deepcopy`.
- **Assuming `statistics.mode` always returns a value**: It raises `StatisticsError` when no single mode exists.
- **Parsing `pprint` output**: It is for display, not data exchange.
- **Expecting `timedelta.days` to expose fractional days**: `.days` is an integer day count; use `.total_seconds()` for finer units.
- **Passing invalid values to `math` functions**: Negative square roots and non-numeric arguments raise errors.

## Quick Summary
- `math` provides `sqrt`, `ceil`, `floor`, `factorial`, `gcd`, `isclose`, `pi`, and more.
- `statistics` provides `mean`, `median`, `mode`, and `stdev`.
- `datetime` works with fixed `date`, `datetime`, and `timedelta` values; avoid clock-dependent calls in graded code.
- `copy.copy` is shallow; `copy.deepcopy` recursively copies nested objects.
- `Counter` counts values, `defaultdict` supplies defaults, `deque` supports fast operations at both ends, and `namedtuple` adds field names.
- `pprint` formats nested data; `pformat` returns the string.
- `textwrap.wrap`, `fill`, `shorten`, and `dedent` format prose.
- `random` is explained here but never used in graded code.
