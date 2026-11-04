---
id: "py-les-sets"
type: "theory"
title: "Sets"
moduleId: "py-mod-06-collections"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "collections", "sets", "uniqueness"]
---

# Concept Overview

A set is an unordered collection of unique values. Adding a duplicate changes nothing, and membership checks are fast. Sets are the right tool for uniqueness, tags, and mathematical operations such as union and intersection.

Set items must be hashable: values that have a stable hash and can be compared for equality. Numbers, strings, and tuples of hashable values work. Lists, dictionaries, and other sets do not.

## Key Principles & Frameworks

### Creating a set

Sets use curly braces with values inside:

```python
numbers = {1, 2, 3}
print(2 in numbers)
print(5 in numbers)
```

Output:

```text
True
False
```

Membership checks work by value. Sets do not support indexing or slicing because they have no defined order.

Duplicates are removed automatically:

```python
numbers = [1, 2, 2, 3, 1]
unique = set(numbers)

print(unique)
print(len(unique))
```

Output:

```text
{1, 2, 3}
3
```

Converting a list to a set removes duplicates, but it also loses the original order. If order matters, build a new list with a loop instead, as the iteration lesson shows.

### The empty set

`{}` creates an empty dictionary, not an empty set. Use `set()` for an empty set:

```python
empty = {}
empty_set = set()

print(type(empty))
print(type(empty_set))
```

Output:

```text
<class 'dict'>
<class 'set'>
```

This is one of the most common set mistakes. A non-empty set literal such as `{1, 2}` is unambiguous, but the braces alone are reserved for dictionaries.

### Adding and removing items

`add` inserts one value. `discard` removes a value if it is present and does nothing otherwise:

```python
numbers = {1, 2}
numbers.add(3)
numbers.discard(1)
print(numbers)
```

Output:

```text
{2, 3}
```

The displayed order is not guaranteed, even though these small integers happen to appear in ascending order.

`remove` also deletes a value, but it raises `KeyError` when the value is missing. Use `discard` when absence is acceptable. Neither method returns a useful value; both change the set in place and return `None`.

### Union, intersection, and difference

Set operators combine sets:

```python
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)
print(a & b)
print(a - b)
```

Output:

```text
{1, 2, 3, 4, 5}
{3}
{1, 2}
```

- `a | b` is the union: everything in either set.
- `a & b` is the intersection: only values in both sets.
- `a - b` is the difference: values in `a` that are not in `b`.

The methods `union`, `intersection`, and `difference` do the same jobs and accept other iterables. The operators are shorter when both sides are sets.

### Removing duplicates while keeping order

If the original order matters, do not convert straight to a set. Build a list and check membership before appending:

```python
numbers = [3, 1, 3, 2, 1]
unique = []

for number in numbers:
    if number not in unique:
        unique.append(number)

print(unique)
```

Output:

```text
[3, 1, 2]
```

This keeps the first occurrence of each value. It is slower than a set for large inputs, but it preserves order.

### Frozenset

A `frozenset` is an immutable set. It supports membership and set operations but has no `add` or `discard`:

```python
locked = frozenset([1, 2, 3])

print(2 in locked)
# locked.add(4) raises AttributeError because frozenset is immutable.
```

Output:

```text
True
```

Because `frozenset` is immutable and hashable, it can be used as a dictionary key. Module 6's dictionary lesson explains keys.

### Hashable values

Set elements must be hashable:

```python
# {[1, 2]} raises TypeError because lists are unhashable.
# {(1, 2)} is valid because the tuple is hashable.
```

A tuple is hashable only when all its items are hashable. A tuple containing a list is not. These rules also apply to dictionary keys.

### Sets are unordered

Do not rely on the order in which a set prints or iterates. It can differ between runs, especially for strings. If you need sorted output later in this module, combine a set with `sorted`, which the iteration lesson introduces.

## Common Pitfalls & Anti-Patterns
- **Using `{}` for an empty set**: It creates an empty dictionary. Use `set()`.
- **Expecting sets to keep insertion order**: Sets are unordered; print order is not a contract.
- **Trying to index or slice a set**: Sets have no positions. Convert to a list first if order is needed.
- **Adding an unhashable value**: Lists, dictionaries, and sets cannot be set elements.
- **Using `remove` for a value that may be absent**: This raises `KeyError`. Use `discard` when absence is fine.
- **Assuming duplicate removal preserves order**: Converting a list to a set loses order.
- **Trying to modify a frozenset**: It is immutable and has no `add` or `discard`.
- **Using a set when duplicates or order are meaningful**: Choose a list instead.
- **Comparing set print order in tests**: Compare members or sorted results, not raw order.

## Quick Summary
- Sets are unordered collections of unique, hashable values.
- `set()` creates an empty set; `{}` creates an empty dictionary.
- `add` inserts and `discard` removes safely; `remove` raises on a missing value.
- `|`, `&`, and `-` compute union, intersection, and difference.
- Converting a list to a set removes duplicates but loses order.
- A membership-check loop preserves first-seen order.
- `frozenset` is an immutable, hashable set.
- Do not depend on set iteration or print order.
