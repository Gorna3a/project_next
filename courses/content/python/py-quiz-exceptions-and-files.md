---
id: "py-quiz-exceptions-and-files"
type: "quiz"
title: "Exceptions & Files Knowledge Check"
moduleId: "py-mod-08-exceptions-and-files"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "exceptions", "files", "json", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which line defines a usable custom exception?

- [x] `class ValidationError(Exception): pass`
- [ ] `class ValidationError: pass`
- [ ] `raise ValidationError(Exception)`
- [ ] `def ValidationError(Exception): pass`

*Explanation*: A custom exception must inherit from `Exception` (or another exception class). The template `class ValidationError(Exception): pass` creates a raisable type. A plain class does not inherit from `BaseException`.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
try:
    value = int("42")
except ValueError:
    print("invalid")
else:
    print("valid")
finally:
    print("done")
```

- [x] `valid` then `done`
- [ ] `invalid` then `done`
- [ ] `valid` only
- [ ] `done` only

*Explanation*: The conversion succeeds, so `else` prints `valid`. `finally` always runs and prints `done`.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
A `finally` block runs even when the `try` block raises an exception.

- [x] True
- [ ] False

*Explanation*: `finally` runs whether the `try` block succeeds, raises a handled exception, or raises an exception that continues outward. It is used for cleanup.

---

## Question 4
<!-- meta: {"type":"single","points":1} -->
Which mode opens a file for writing and erases its existing contents?

- [ ] `"r"`
- [x] `"w"`
- [ ] `"a"`
- [ ] `"x"`

*Explanation*: `"w"` truncates an existing file and creates it if it is missing. `"a"` appends, `"r"` reads, and `"x"` fails when the file already exists.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import json

data = json.loads('{"score": 92, "active": true}')
print(data["score"])
print(data["active"])
```

- [x] `92` then Python `True`
- [ ] `92` then the text `true`
- [ ] `"92"` then Python `True`
- [ ] It raises `JSONDecodeError`

*Explanation*: `json.loads` converts a JSON number to a Python number and JSON `true` to the Python boolean `True`. The output uses Python's capitalization.

---

## Question 6
<!-- meta: {"type":"true-false","points":1} -->
`raise "something went wrong"` is the correct way to raise an exception.

- [ ] True
- [x] False

*Explanation*: Exceptions must be instances of a class derived from `BaseException`. Raising a string produces a `TypeError`. Use `raise ValueError("something went wrong")` or another exception instance.

---

## Question 7
<!-- meta: {"type":"multiple","points":2} -->
Which values can `json.dumps` serialize without a custom encoder? Select all that apply.

- [x] A dictionary with string keys
- [x] A list of numbers
- [x] `None`
- [ ] A set of strings
- [ ] A `datetime.date` object
- [ ] A custom object without conversion

*Explanation*: JSON supports objects, arrays, strings, numbers, booleans, and null. Sets, dates, and custom objects must be converted to supported types first.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import csv

rows = list(csv.reader(["name,score", "Ana,92"]))
print(rows[1])
```

- [x] `['Ana', '92']`
- [ ] `['Ana', 92]`
- [ ] `('Ana', '92')`
- [ ] `Ana,92`

*Explanation*: `csv.reader` accepts any iterable of strings and returns each row as a list. Every field is a string, so `"92"` stays a string.
