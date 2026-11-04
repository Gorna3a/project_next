---
id: "py-les-searching-algorithms"
type: "theory"
title: "Searching Algorithms"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "searching", "binary-search", "linear-search"]
---

# Concept Overview

Searching algorithms find a target value inside a collection. The simplest approach checks each element in order. A faster approach uses the ordering of the collection to skip large parts on every step.

This lesson covers linear search and binary search in both iterative and recursive forms. An iterative implementation uses a loop. A recursive implementation calls itself on a smaller part of the collection.

## Key Principles & Frameworks

### Linear search

Linear search checks elements one at a time from the start until it finds the target or reaches the end. It works on any order of data and runs in `O(n)` time.

```python
def linear_search(items, target):
    for index in range(len(items)):
        if items[index] == target:
            return index
    return -1

data = [7, 3, 9, 5]
print(linear_search(data, 9))
print(linear_search(data, 4))
```

Output:

```text
2
-1
```

The function returns the index of the target or `-1` when the target is absent. Best case is one comparison. Worst case is `n` comparisons.

### Binary search requirements

Binary search requires the collection to be sorted in ascending order. Each step compares the target with the middle element. The result tells you which half to keep. The other half can never contain the target and is skipped.

```text
sorted: [2, 4, 6, 8, 10, 12, 14]
target: 10

middle element: 8  -> target is larger, keep right half
middle element: 12 -> target is smaller, keep left half
middle element: 10 -> target found
```

Skipping halves is why binary search runs in `O(log n)` time.

### Iterative binary search

An iterative binary search keeps a `low` and `high` index. The midpoint is `(low + high) // 2`. Each comparison moves one boundary inward.

```python
def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        middle = (low + high) // 2
        if items[middle] == target:
            return middle
        if items[middle] < target:
            low = middle + 1
        else:
            high = middle - 1
    return -1

data = [2, 4, 6, 8, 10, 12, 14]
print(binary_search(data, 10))
print(binary_search(data, 7))
```

Output:

```text
4
-1
```

The loop stops when `low > high`, which means the candidate range is empty.

### Recursive binary search

A recursive binary search passes the search range as arguments. Each call handles the middle element and recurses on one half. The base case is an empty range.

```python
def binary_search_recursive(items, target, low, high):
    if low > high:
        return -1
    middle = (low + high) // 2
    if items[middle] == target:
        return middle
    if items[middle] < target:
        return binary_search_recursive(items, target, middle + 1, high)
    return binary_search_recursive(items, target, low, middle - 1)

data = [2, 4, 6, 8, 10, 12, 14]
print(binary_search_recursive(data, 10, 0, len(data) - 1))
```

Output:

```text
4
```

Each call reduces the range. The recursion depth grows with `log n`, so the call stack stays small.

### Finding the insertion point

Binary search can also find where a value belongs in sorted order. The boundary case often causes off-by-one errors, so trace `low` and `high` on small examples.

```python
def insertion_point(items, target):
    low = 0
    high = len(items)
    while low < high:
        middle = (low + high) // 2
        if items[middle] < target:
            low = middle + 1
        else:
            high = middle
    return low

data = [2, 4, 6, 8]
print(insertion_point(data, 5))
print(insertion_point(data, 9))
```

Output:

```text
2
4
```

The return value is the index where the target would be inserted to keep the list sorted.

### Empty and single-element inputs

Empty inputs and single-element inputs are common edge cases. A robust search returns `-1` for an empty list. Single-element lists only need one comparison.

```python
def search_safe(items, target):
    if not items:
        return -1
    return binary_search(items, target)

print(search_safe([], 3))
print(search_safe([3], 3))
```

Output:

```text
-1
0
```

Testing these cases early often reveals boundary errors before they affect larger inputs.

## Common Pitfalls & Anti-Patterns
- **Running binary search on unsorted data**: Binary search requires sorted input. Unsorted input can produce wrong answers even when the code is correct.
- **Off-by-one errors in binary search**: Using `<` instead of `<=` in the loop condition, or forgetting to move past the middle element, skips elements or never terminates.
- **Returning the wrong value for missing targets**: The contract must state `-1`, `None`, or another specific value for absent targets.
- **Using floating-point midpoints**: Integer midpoints with `//` are required for index arithmetic.
- **Forgetting to shrink the range**: Each branch must move `low` or `high`, or the search never ends.
- **Confusing best case with worst case**: Finding the target immediately is luck. Analysis uses the worst case.
- **Searching duplicates without a rule**: If duplicates exist, any matching index is usually acceptable. Decide the rule in advance.
- **Modifying the list during the search**: Changing elements or order during the search invalidates comparisons.
- **Comparing search time without naming the cost model**: State whether the cost is comparisons, steps, or seconds.
- **Testing only successful searches**: Always test missing targets, empty lists, and single-element lists.

## Quick Summary
- Linear search checks each element in order and runs in `O(n)` time.
- Linear search works on unsorted data.
- Binary search requires sorted data and runs in `O(log n)` time.
- Binary search keeps the half that can contain the target.
- The midpoint is `(low + high) // 2`.
- The loop ends when `low > high`.
- Iterative search uses a loop and two boundaries.
- Recursive search passes the range as arguments.
- The missing-target result must be explicit.
- Empty lists return the missing-target value.
- Trace boundaries on small inputs to catch off-by-one errors.
