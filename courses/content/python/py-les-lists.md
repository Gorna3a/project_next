---
id: "py-les-lists"
type: "theory"
title: "Lists"
moduleId: "py-mod-06-collections"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "collections", "lists", "methods"]
---

# Concept Overview

A list is an ordered, mutable collection of values. Ordered means each item keeps a position, and mutable means you can add, remove, or replace items after the list is created. Lists are the workhorse collection for sequences that change.

Lists use square brackets. Items are separated by commas, and indexing and slicing follow the same rules you learned for strings.

## Key Principles & Frameworks

### Creating and reading a list

```python
numbers = [10, 20, 30]

print(numbers[0])
print(numbers[-1])
print(numbers[1:3])
```

Output:

```text
10
30
[20, 30]
```

Index `0` is the first item and index `-1` is the last. The slice `[1:3]` starts at index `1` and stops before index `3`, so it contains `20` and `30`. A slice returns a new list.

An empty list is written `[]`. The `list()` function converts an iterable into a list:

```python
print(list(range(3)))
print(list("abc"))
```

Output:

```text
[0, 1, 2]
['a', 'b', 'c']
```

`range` and strings were introduced earlier. `list()` simply collects their values.

### Mutating an item

Lists are mutable, so you can replace an item by index:

```python
numbers = [10, 20, 30]
numbers[1] = 99
print(numbers)
```

Output:

```text
[10, 99, 30]
```

The list keeps its length; only the value at index `1` changes. This differs from strings, which cannot be changed in place.

### Adding items

`append` adds one item to the end. `extend` adds every item from another iterable. `insert` places one item at a chosen index:

```python
items = ["a", "b"]
items.append("c")
items.extend(["d", "e"])
items.insert(1, "x")
print(items)
```

Output:

```text
['a', 'x', 'b', 'c', 'd', 'e']
```

`append(["d", "e"])` would add a single nested list, not two items. Use `extend` when you want to add each value from another collection.

### Removing items

`pop` removes and returns an item. With no argument it removes the last item; with an index it removes that position. `remove` deletes the first matching value and returns `None`:

```python
items = ["a", "b", "c"]
removed = items.pop()
print(removed)
print(items)

items.remove("b")
print(items)
```

Output:

```text
c
['a', 'b']
['a']
```

Use `pop` when you need the removed value or a specific position. Use `remove` when you know the value itself. Calling `remove` with a value that is not present raises `ValueError`.

### Sorting and reversing

`sort` and `reverse` change the list in place. Both return `None`, so do not assign their result:

```python
numbers = [3, 1, 2]
numbers.sort()
print(numbers)

letters = ["b", "c", "a"]
letters.reverse()
print(letters)
```

Output:

```text
[1, 2, 3]
['a', 'c', 'b']
```

`sort()` orders the items from smallest to largest. `reverse()` reverses the current order; it does not sort. Module 6 later shows `sorted()`, which returns a new list instead of changing the original.

### Membership and length

`in` checks whether a value appears in the list. `len` returns the number of items:

```python
fruits = ["apple", "pear"]

print("pear" in fruits)
print("grape" not in fruits)
print(len(fruits))
```

Output:

```text
True
True
2
```

Membership checks compare whole items. For a nested list, `[1, 2] in [[1, 2], [3, 4]]` is `True` because the inner list matches an item.

### Nested lists

A list can contain other lists. Use two indexes to reach an inner item:

```python
matrix = [[1, 2, 3], [4, 5, 6]]

print(matrix[1][0])
matrix[0][2] = 9
print(matrix)
```

Output:

```text
4
[[1, 2, 9], [4, 5, 6]]
```

`matrix[1]` selects the second row, and `[0]` selects its first value. Nested lists are useful for grids and tables. The final lesson in this module explains how copying behaves when nested lists are involved.

## Common Pitfalls & Anti-Patterns
- **Using `append` when `extend` is needed**: `append` adds one item, even if that item is a list.
- **Assigning the result of `sort()` or `reverse()`**: Both return `None` and modify the list in place.
- **Confusing `pop` and `remove`**: `pop` uses an index and returns the item; `remove` uses a value and returns `None`.
- **Forgetting the stop-exclusive rule in slices**: `items[1:3]` includes indexes `1` and `2`, not `3`.
- **Going out of range**: The last valid index is `len(items) - 1`.
- **Assuming a slice shares storage**: A slice creates a new list, though nested objects inside it are still shared.
- **Checking for a substring in a list**: `"pear" in fruits` checks whole items. Use string methods for substrings.
- **Modifying a list while looping over it**: This can skip items. The iteration lesson shows the safe pattern.
- **Forgetting that lists are mutable**: Two names can refer to the same list; the copying lesson covers the consequences.

## Quick Summary
- Lists are ordered and mutable; use `[]` to create them.
- Indexing starts at `0`; negative indexes count from the end.
- Slices stop before the second index and return a new list.
- `append`, `extend`, and `insert` add items in different ways.
- `pop` removes by index and returns the item; `remove` deletes the first matching value.
- `sort` and `reverse` modify in place and return `None`.
- `in` tests membership and `len` counts items.
- Nested lists use multiple indexes.
