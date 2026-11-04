---
id: "py-les-iterating-collections"
type: "theory"
title: "Iterating Collections"
moduleId: "py-mod-06-collections"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "collections", "iteration", "enumerate", "zip"]
---

# Concept Overview

A `for` loop can visit the items of any collection. Lists and tuples yield their items in order, sets yield their items in an unspecified order, and dictionaries yield their keys. Python also provides helpers that add indexes, pair collections, sort results, and summarize values.

This lesson connects the collection types with `enumerate`, `zip`, `sorted`, `reversed`, `any`, `all`, `min`, `max`, and `sum`. It also explains why changing a list while looping over it can skip items.

## Key Principles & Frameworks

### Looping over lists and tuples

```python
for name in ["Ana", "Ben"]:
    print(name)

for value in (3, 5, 7):
    print(value)
```

Output:

```text
Ana
Ben
3
5
7
```

Both loops visit items in their stored order. The loop variable receives one item per pass.

### Looping over sets

Sets have no guaranteed order. Sort the result when the output must be predictable:

```python
for value in sorted({3, 1, 2}):
    print(value)
```

Output:

```text
1
2
3
```

`sorted` accepts any iterable and returns a new list. The set itself is unchanged.

### Looping over dictionaries

A loop over a dictionary yields keys:

```python
scores = {"Ana": 92, "Ben": 78}

for name in scores:
    print(name)
```

Output:

```text
Ana
Ben
```

Use `items()` when both the key and value are needed:

```python
scores = {"Ana": 92, "Ben": 78}

for name, score in scores.items():
    print(f"{name}: {score}")
```

Output:

```text
Ana: 92
Ben: 78
```

Dictionaries preserve insertion order, but do not use that as a substitute for sorting when order is part of the requirement.

### enumerate

`enumerate` pairs each item with an index:

```python
names = ["Ana", "Ben"]

for index, name in enumerate(names, start=1):
    print(f"{index}. {name}")
```

Output:

```text
1. Ana
2. Ben
```

The default start is `0`. Pass `start=1` for human-readable numbering. `enumerate` is clearer than manually maintaining a counter.

### zip

`zip` pairs items from two or more iterables:

```python
names = ["Ana", "Ben", "Chen"]
scores = [92, 78]

for name, score in zip(names, scores):
    print(f"{name}: {score}")
```

Output:

```text
Ana: 92
Ben: 78
```

`zip` stops when the shortest iterable runs out. It does not raise an error for the extra `"Chen"`. Check lengths first if missing data should be treated as a problem.

### sorted and sort

`sorted(collection)` returns a new sorted list and leaves the original unchanged. `list.sort()` sorts in place and returns `None`:

```python
numbers = [3, 1, 2]

ordered = sorted(numbers)
print(ordered)
print(numbers)

numbers.sort()
print(numbers)
```

Output:

```text
[1, 2, 3]
[3, 1, 2]
[1, 2, 3]
```

Pass `reverse=True` to sort from largest to smallest:

```python
print(sorted([3, 1, 2], reverse=True))
```

Output:

```text
[3, 2, 1]
```

Module 10 adds the `key=` argument for sorting by a computed value. This module sorts whole values only.

### reversed

`reversed` visits an iterable from the end to the start:

```python
for value in reversed([1, 2, 3]):
    print(value)
```

Output:

```text
3
2
1
```

`reversed` returns an iterator, not a list. Wrap it in `list()` if you need to store or reuse the result: `list(reversed(numbers))`.

### any and all

`any` returns `True` when at least one value is truthy. `all` returns `True` when every value is truthy:

```python
print(any([False, True, False]))
print(all([True, True, False]))
print(all([True, True, True]))
```

Output:

```text
True
False
True
```

Both accept any iterable of values. Empty inputs follow a mathematical convention: `any([])` is `False`, and `all([])` is `True`. Module 10 shows generator expressions, which are often combined with these functions.

### min, max, and sum

These built-ins accept a collection directly:

```python
numbers = [4, 1, 9, 2]

print(min(numbers))
print(max(numbers))
print(sum(numbers))
```

Output:

```text
1
9
16
```

`min` and `max` raise `ValueError` on an empty collection. `sum` returns `0` for an empty collection. All three also accept a starting value or multiple arguments in other forms, as covered in Module 5.

### Do not modify a list while iterating over it

Removing items during a loop can skip items because the list shrinks while the iterator advances:

```python
numbers = [1, 2, 2, 3]

for number in numbers:
    if number == 2:
        numbers.remove(number)

print(numbers)
```

Output:

```text
[1, 2, 3]
```

One `2` survived. After the first removal, the next item shifted into the position the loop had already passed. The loop never examined it.

Build a new list instead:

```python
numbers = [1, 2, 2, 3]
kept = []

for number in numbers:
    if number != 2:
        kept.append(number)

numbers = kept
print(numbers)
```

Output:

```text
[1, 3]
```

Iterating over a copy such as `numbers[:]` also avoids the skip, but building a new list is usually clearer.

## Common Pitfalls & Anti-Patterns
- **Modifying a list while iterating over it**: Items shift and the loop can skip them. Build a new list.
- **Expecting a dictionary loop to yield values**: It yields keys. Use `.values()` or `.items()`.
- **Relying on set order**: Sets are unordered. Sort when output order matters.
- **Assuming `zip` reports length mismatches**: It silently stops at the shortest iterable.
- **Forgetting `enumerate` starts at 0**: Pass `start=1` when numbering should begin at one.
- **Assigning the result of `list.sort()`**: It returns `None`; use `sorted()` for a new list.
- **Treating `reversed()` as a list**: It returns an iterator; wrap it in `list()` to store it.
- **Assuming `all([])` is false**: It is `True`; `any([])` is `False`.
- **Calling `min` or `max` on an empty collection**: This raises `ValueError`.
- **Using `key=` before Module 10**: This module sorts whole values only.

## Quick Summary
- `for` visits list and tuple items in order.
- Sets are unordered; sort them for predictable output.
- A dictionary loop yields keys; use `.items()` for pairs.
- `enumerate` adds indexes; `zip` pairs iterables and stops at the shortest.
- `sorted` returns a new list; `sort` changes the list and returns `None`.
- `reversed` returns an iterator.
- `any` needs one truthy value; `all` needs every value truthy.
- `min`, `max`, and `sum` accept a collection directly.
- Never remove items from a list while looping over it; build a new list instead.
