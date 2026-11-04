---
id: "py-quiz-modules-and-standard-library"
type: "quiz"
title: "Modules & Standard Library Knowledge Check"
moduleId: "py-mod-07-modules-and-standard-library"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "modules", "standard-library", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which import makes `sqrt` available without the `math.` prefix?

- [x] `from math import sqrt`
- [ ] `import math`
- [ ] `import math.sqrt`
- [ ] `from math import math`

*Explanation*: `from math import sqrt` binds the function directly. `import math` binds only the module name, and `import math.sqrt` is invalid syntax.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import math

print(math.ceil(4.2))
```

- [x] `5`
- [ ] `4`
- [ ] `4.2`
- [ ] `5.0`

*Explanation*: `math.ceil` rounds up to the nearest integer, so it returns the integer `5`.

---

## Question 3
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
from datetime import date, timedelta

start = date(2026, 11, 4)
print(start + timedelta(days=10))
```

- [x] `2026-11-14`
- [ ] `2026-11-04`
- [ ] `2026-11-14 00:00:00`
- [ ] `10`

*Explanation*: Adding a `timedelta` to a `date` produces a new date. Printing that date uses the `YYYY-MM-DD` format.

---

## Question 4
<!-- meta: {"type":"true-false","points":1} -->
Importing the same module twice re-runs its top-level code each time.

- [ ] True
- [x] False

*Explanation*: Loaded modules are cached in `sys.modules`. The second import reuses the cached module, so its top-level code runs only once per process.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
When this file is run directly, what does it print?

```python
print(__name__)
```

- [x] `__main__`
- [ ] `__name__`
- [ ] `main`
- [ ] The file name without `.py`

*Explanation*: Python sets `__name__` to `"__main__"` for the file that starts the program. Imported modules receive their module names instead.

---

## Question 6
<!-- meta: {"type":"true-false","points":1} -->
A file named `math.py` in the script's directory can shadow the standard-library `math` module.

- [x] True
- [ ] False

*Explanation*: The script's directory is early in the module search path, so a local `math.py` can be found before the standard-library module. Avoid naming files after standard modules.

---

## Question 7
<!-- meta: {"type":"multiple","points":2} -->
Which of these modules are part of Python's standard library? Select all that apply.

- [x] `math`
- [x] `statistics`
- [x] `datetime`
- [x] `random`
- [ ] `requests`
- [ ] `numpy`

*Explanation*: `math`, `statistics`, `datetime`, and `random` ship with Python. `requests` and `numpy` are third-party packages that must be installed separately.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
from collections import Counter

print(Counter("aab").most_common(1))
```

- [x] `[('a', 2)]`
- [ ] `{'a': 2}`
- [ ] `[('b', 1)]`
- [ ] `2`

*Explanation*: `Counter` counts the characters, and `most_common(1)` returns a list containing the single most common `(value, count)` tuple, `[('a', 2)]`.
