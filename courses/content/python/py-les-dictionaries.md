---
id: "py-les-dictionaries"
type: "theory"
title: "Dictionaries"
moduleId: "py-mod-06-collections"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "collections", "dictionaries", "keys", "values"]
---

# Concept Overview

A dictionary maps keys to values. Each key is unique, and looking up a key returns its value. Dictionaries are the natural choice for records, settings, counts, and any data addressed by a name rather than a position.

Keys must be hashable, the same rule sets use. Strings and numbers are common keys; tuples work when their contents are hashable. Values can be any object, including lists, dictionaries, or functions.

## Key Principles & Frameworks

### Creating and reading a dictionary

Dictionaries use curly braces with `key: value` pairs:

```python
student = {"name": "Sam", "score": 88}

print(student["name"])
print(student["score"])
```

Output:

```text
Sam
88
```

Access uses square brackets and the key, not an index. The order of pairs in the literal does not affect lookup. Python preserves insertion order when iterating, but a dictionary is not addressed by position.

### Adding and updating values

Assigning to a new key adds it. Assigning to an existing key replaces its value:

```python
student = {"name": "Sam", "score": 88}
student["score"] = 92
student["grade"] = "A"
print(student)
```

Output:

```text
{'name': 'Sam', 'score': 92, 'grade': 'A'}
```

Keys are unique. Writing the same key twice in a literal keeps the last value.

### KeyError and get

Reading a missing key with square brackets raises `KeyError`:

```python
student = {"name": "Sam"}

print(student.get("score"))
print(student.get("score", 0))
# student["score"] raises KeyError.
```

Output:

```text
None
0
```

`get(key)` returns `None` when the key is missing. `get(key, default)` returns the supplied default instead. Use `get` when absence is a normal case, and use square brackets when a missing key should be treated as a bug. Module 8 covers handling `KeyError` with `try`/`except`.

### Keys, values, and items

Dictionaries provide three views:

```python
student = {"name": "Sam", "score": 88}

print(list(student.keys()))
print(list(student.values()))
print(list(student.items()))
```

Output:

```text
['name', 'score']
['Sam', 88]
[('name', 'Sam'), ('score', 88)]
```

`keys()` yields the keys, `values()` yields the values, and `items()` yields `(key, value)` tuples. Wrapping them in `list()` is only for display; a `for` loop can use the views directly.

### Iterating over a dictionary

A `for` loop over a dictionary yields its keys:

```python
student = {"name": "Sam", "score": 88}

for key in student:
    print(key)
```

Output:

```text
name
score
```

Use `items()` when both parts are needed:

```python
student = {"name": "Sam", "score": 88}

for key, value in student.items():
    print(f"{key}: {value}")
```

Output:

```text
name: Sam
score: 88
```

The tuple unpacking in the loop header was introduced in the previous lesson.

### update and setdefault

`update` merges another dictionary into the current one. Existing keys are overwritten and new keys are added:

```python
settings = {"theme": "dark", "font": "large"}
settings.update({"theme": "light", "size": 12})
print(settings)
```

Output:

```text
{'theme': 'light', 'font': 'large', 'size': 12}
```

`setdefault(key, default)` returns the existing value when the key is present. If the key is missing, it inserts the default and returns it:

```python
settings = {"theme": "dark"}

print(settings.setdefault("theme", "light"))
print(settings.setdefault("font", "large"))
print(settings)
```

Output:

```text
dark
large
{'theme': 'dark', 'font': 'large'}
```

`setdefault` is useful for initializing a key only once. It does not overwrite an existing value.

### Merging with the pipe operator

The `|` operator creates a new merged dictionary. When both sides share a key, the right side wins:

```python
defaults = {"theme": "dark", "font": "large"}
custom = {"theme": "light"}

merged = defaults | custom
print(merged)
```

Output:

```text
{'theme': 'light', 'font': 'large'}
```

The original dictionaries are unchanged. The in-place version `defaults |= custom` would update `defaults`; it requires Python 3.9 or newer, and this course uses Python 3.12.

### Nested dictionaries

A dictionary value can be another dictionary or a list of dictionaries:

```python
school = {
    "name": "Python",
    "students": [
        {"name": "Ana", "score": 92},
        {"name": "Ben", "score": 78},
    ],
}

print(school["students"][0]["name"])
print(school["students"][1]["score"])
```

Output:

```text
Ana
78
```

Read nested access from left to right: select the `"students"` list, then an item by index, then a key inside that dictionary. The workshop and lab use this structure.

### Membership tests keys

`in` checks keys, not values:

```python
student = {"name": "Sam", "score": 88}

print("name" in student)
print("Sam" in student)
```

Output:

```text
True
False
```

To check values, use `student.values()`. To check both, loop over `student.items()`.

### Hashable keys

Keys must be hashable:

```python
# {[1, 2]: "value"} raises TypeError because lists are unhashable.
# {(1, 2): "value"} is valid because the tuple is hashable.
```

A tuple is hashable only when all its items are hashable. Strings, numbers, and `frozenset` objects are also valid keys.

## Common Pitfalls & Anti-Patterns
- **Using square brackets for a key that may be missing**: This raises `KeyError`. Use `.get()` when absence is expected.
- **Assuming `in` checks values**: It checks keys. Use `.values()` for values.
- **Using an unhashable key such as a list or dictionary**: This raises `TypeError`.
- **Expecting `{}` to be an empty set**: It is an empty dictionary; use `set()` for a set.
- **Forgetting that duplicate literal keys keep the last value**: Only one key survives.
- **Using attribute access such as `student.name`**: Dictionary values use square brackets or `.get()`.
- **Expecting `setdefault` to overwrite**: It returns the existing value and leaves it unchanged.
- **Assuming `|` modifies the left dictionary**: It creates a new dictionary; use `|=` to update in place.
- **Reading nested data in the wrong order**: Follow the path one key or index at a time.

## Quick Summary
- Dictionaries map unique, hashable keys to values.
- Use `d[key]` for required keys and `d.get(key, default)` for optional ones.
- Assigning to a key adds or updates it.
- `keys()`, `values()`, and `items()` expose the three views.
- A loop over a dictionary visits keys; `items()` gives key-value pairs.
- `update` merges and overwrites; `setdefault` initializes only when missing.
- The `|` operator creates a merged dictionary, with the right side winning.
- Nested dictionaries and lists are accessed one step at a time.
- `in` tests keys.
