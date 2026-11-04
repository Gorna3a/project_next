---
id: "py-rev-collections"
type: "review"
title: "Collections Quick Reference"
moduleId: "py-mod-06-collections"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-lists", "py-les-tuples-and-unpacking", "py-les-sets", "py-les-dictionaries", "py-les-iterating-collections", "py-les-mutability-and-copying", "py-ws-student-records", "py-lab-inventory-report"]
tags: ["python", "collections", "lists", "dictionaries", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| List | Ordered, mutable sequence | Changing sequences |
| Tuple | Ordered, immutable sequence | Fixed groups of values |
| Set | Unordered collection of unique, hashable values | Duplicates and set algebra |
| Dictionary | Mapping of unique, hashable keys to values | Records and lookups |
| `append` / `extend` | Add one item / add each item from an iterable | Growing a list |
| `insert` | Add at an index | Ordered insertion |
| `pop` / `remove` | Remove by index / remove by value | Deleting list items |
| `sort` / `reverse` | In-place ordering; both return `None` | Changing a list |
| `sorted` | Returns a new sorted list | Keeping the original |
| `in` | Membership test | Searching collections |
| Tuple packing | `x, y = 3, 5` | Grouping values |
| Tuple unpacking | `a, b = point` | Extracting values |
| Starred unpacking | `first, *rest = values` | Collecting the remainder |
| `add` / `discard` | Add a set item / remove if present | Set updates |
| `\|` / `&` / `-` | Union / intersection / difference | Set algebra |
| `frozenset` | Immutable, hashable set | Dictionary keys |
| `.get(key, default)` | Safe dictionary lookup | Optional keys |
| `keys` / `values` / `items` | Dictionary views | Iteration |
| `update` | Merge a dictionary in place | Applying settings |
| `setdefault` | Read or insert a default | Initializing keys |
| `\|` merge | New dictionary; right side wins | Combining mappings |
| `enumerate` | Index-value pairs | Numbered output |
| `zip` | Pairs items from iterables | Parallel iteration |
| `reversed` | Reverse iterator | Backward traversal |
| `any` / `all` | At least one truthy / every truthy | Boolean summaries |
| `min` / `max` / `sum` | Aggregate a collection | Statistics |
| Aliasing | Two names for one object | Shared mutations |
| Shallow copy | New outer collection, shared inner objects | Copying lists |

## Key Concepts Comparison
- **List vs. tuple**: Lists are mutable and support append and remove. Tuples are immutable and suit fixed groups.
- **List vs. set**: Lists keep order and allow duplicates. Sets remove duplicates and have no order.
- **Set vs. dictionary**: Both use hashable keys or values, but a set stores single values while a dictionary stores key-value pairs.
- **`{}` vs. `set()`**: `{}` is an empty dictionary; `set()` is an empty set.
- **`sort()` vs. `sorted()`**: `sort()` changes the list and returns `None`. `sorted()` returns a new list.
- **`append` vs. `extend`**: `append` adds one item, even if it is a list. `extend` adds each item from an iterable.
- **`pop` vs. `remove`**: `pop` removes by index and returns the item. `remove` removes the first matching value and returns `None`.
- **`KeyError` vs. `.get()`**: Square brackets raise on a missing key. `.get()` returns `None` or a default.
- **`in` on a dictionary**: It checks keys, not values.
- **`update` vs. `setdefault`**: `update` overwrites existing keys. `setdefault` leaves an existing value alone.
- **`|` vs. `|=`**: `|` creates a merged dictionary. `|=` updates the left dictionary.
- **`b = a` vs. `b = a[:]`**: Assignment aliases the same list. A slice creates a shallow copy.
- **`[[0] * 3] * 3` vs. a loop**: Multiplication repeats references to one inner row. A loop creates separate rows.
- **Shallow vs. deep copy**: A shallow copy shares nested objects. Module 7 covers `copy.deepcopy`.

## Critical Syntax / Templates
```python
# List basics
numbers = [10, 20, 30]
print(numbers[0])
print(numbers[-1])
print(numbers[1:3])
numbers[1] = 99
numbers.append(40)
numbers.extend([50, 60])
numbers.insert(0, 5)
last = numbers.pop()
numbers.remove(20)
numbers.sort()
numbers.reverse()

# Tuple basics
point = (3, 5)
x, y = point
first, *middle, last = [1, 2, 3, 4, 5]
single = (5,)
print(type(single))

# Set basics
tags = {"python", "beginner"}
tags.add("course")
tags.discard("intro")
print(tags | {"advanced"})
print(tags & {"python"})
print(tags - {"beginner"})
locked = frozenset([1, 2, 3])
empty_set = set()

# Dictionary basics
student = {"name": "Sam", "score": 88}
print(student["name"])
print(student.get("grade"))
print(student.get("grade", "N/A"))
student["score"] = 92
student.update({"grade": "A"})
print(student.keys())
print(student.values())
print(student.items())
settings = {"theme": "dark"}
settings.setdefault("font", "large")
merged = {"a": 1} | {"a": 2, "b": 3}

# Nested collections
school = {
    "students": [
        {"name": "Ana", "score": 92},
        {"name": "Ben", "score": 78},
    ]
}
print(school["students"][0]["name"])

# Iteration helpers
scores = {"Ana": 92, "Ben": 78}
for name, score in scores.items():
    print(f"{name}: {score}")

for index, name in enumerate(["Ana", "Ben"], start=1):
    print(f"{index}. {name}")

for name, score in zip(["Ana", "Ben"], [92, 78]):
    print(f"{name}: {score}")

print(sorted([3, 1, 2]))
print(sorted([3, 1, 2], reverse=True))
print(list(reversed([1, 2, 3])))
print(any([False, True, False]))
print(all([True, True, False]))
print(min([4, 1, 9]))
print(max([4, 1, 9]))
print(sum([4, 1, 9]))

# Safe removal while filtering
numbers = [1, 2, 2, 3]
kept = []
for number in numbers:
    if number != 2:
        kept.append(number)
numbers = kept

# Aliasing and shallow copies
a = [1, 2, 3]
alias = a
copy_one = a[:]
copy_two = a.copy()
copy_three = list(a)

# Nested rows: create fresh inner lists
grid = []
for row in range(3):
    grid.append([0] * 3)
grid[0][0] = 1

# Nested dictionary with a list
inventory = [
    {"name": "Keyboard", "price": 50, "quantity": 3},
    {"name": "Monitor", "price": 150, "quantity": 2},
]
```
