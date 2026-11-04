---
id: "py-rev-recursion-and-algorithms"
type: "review"
title: "Recursion and Algorithms Quick Reference"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-recursion", "py-les-complexity-and-big-o", "py-les-searching-algorithms", "py-les-elementary-sorting", "py-les-efficient-sorting", "py-ws-recursion-and-search", "py-lab-sort-it-yourself"]
tags: ["python", "recursion", "algorithms", "reference", "big-o"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Recursion | Function calls itself with smaller input | `f(n) = n * f(n - 1)` |
| Base case | Stopping condition returning a value directly | `if n == 0: return 1` |
| Recursive case | Call with progress toward the base case | `return n * factorial(n - 1)` |
| Call stack | Stack of paused frames | one frame per call |
| Recursion limit | Maximum stack depth before `RecursionError` | `sys.getrecursionlimit()` |
| Memoization | Storing results to avoid repeating work | `functools.cache` |
| Cache | Dictionary of stored results | `@cache` |
| Time complexity | Growth of steps with input size | `O(n)` |
| Space complexity | Growth of memory with input size | `O(n)` |
| Big-O | Growth class ignoring constants | `O(n squared)` |
| `n` | Input size measure | length of a list |
| `O(1)` | Constant growth | `items[0]` |
| `O(log n)` | Logarithmic growth | binary search |
| `O(n)` | Linear growth | one loop |
| `O(n log n)` | Linearithmic growth | merge sort |
| `O(n squared)` | Quadratic growth | nested loops |
| Best case | Fastest scenario | target found first |
| Worst case | Slowest scenario | full scan needed |
| Linear search | Scan each element in order | `O(n)` |
| Binary search | Halve the range each step | `O(log n)` |
| Midpoint | Middle index of the range | `(low + high) // 2` |
| Bubble sort | Swap adjacent out-of-order pairs | `O(n squared)` |
| Selection sort | Move smallest remaining element in place | `O(n squared)` |
| Insertion sort | Insert each element into sorted part | `O(n squared)` |
| Stability | Equal elements keep original order | Python `sorted` is stable |
| `sorted` | Return a new sorted list | `sorted(numbers)` |
| `list.sort` | Sort in place, return `None` | `numbers.sort()` |
| Timsort | Python built-in adaptive sort | `O(n log n)` worst |
| Divide and conquer | Split, solve, combine | merge sort, quicksort |
| Merge sort | Sort halves, merge sorted halves | `O(n log n)`, `O(n)` space |
| Pivot | Dividing value in quicksort | elements go left or right |
| Quicksort | Partition around pivot, recurse | `O(n log n)` average |

## Key Concepts Comparison
- **Best case vs. worst case**: Best case is the fastest scenario for an algorithm. Worst case is the slowest. Comparisons usually use worst-case growth.
- **Linear search vs. binary search**: Linear search scans every element and needs no ordering. Binary search needs sorted data but halves the range each step.
- **Iterative vs. recursive search**: Iterative search uses a loop and boundaries. Recursive search passes the range as arguments with a base case.
- **Bubble vs. selection vs. insertion sort**: Bubble sort swaps adjacent pairs. Selection sort moves the minimum in place. Insertion sort inserts each element into the sorted part.
- **`sorted` vs. `list.sort`**: `sorted` returns a new list. `list.sort` mutates in place and returns `None`.
- **Merge sort vs. quicksort**: Merge sort always runs in `O(n log n)` time and is stable but uses `O(n)` space. Quicksort averages `O(n log n)` time and uses less space but can degrade.
- **Memoization vs. divide and conquer**: Memoization reuses overlapping subproblem results. Divide and conquer splits into independent subproblems.
- **Big-O vs. measured time**: Big-O describes growth. Measured time includes constants and hardware.
- **Time vs. space complexity**: Time counts steps. Space counts memory. Both grow with input size.
- **Stable vs. fast**: Stability preserves equal-element order. Speed counts steps. They are separate properties.

## Critical Syntax / Templates
```python
# Factorial with base case
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(4))
```

```python
# Fibonacci with memoization
from functools import cache

@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(6))
```

```python
# Recursive sum of a list
def recursive_sum(numbers):
    if not numbers:
        return 0
    return numbers[0] + recursive_sum(numbers[1:])

print(recursive_sum([3, 1, 4]))
```

```python
# Iterative binary search
def binary_search(values, target):
    low = 0
    high = len(values) - 1
    while low <= high:
        middle = (low + high) // 2
        if values[middle] == target:
            return middle
        if values[middle] < target:
            low = middle + 1
        else:
            high = middle - 1
    return -1

print(binary_search([2, 4, 6, 8, 10], 6))
```

```python
# Insertion sort in place
def insertion_sort(items):
    for index in range(1, len(items)):
        key = items[index]
        position = index - 1
        while position >= 0 and items[position] > key:
            items[position + 1] = items[position]
            position -= 1
        items[position + 1] = key
    return items

print(insertion_sort([6, 3, 8, 1]))
```

```python
# Merge sort returning a new list
def merge_sort(items):
    if len(items) <= 1:
        return list(items)
    middle = len(items) // 2
    left = merge_sort(items[:middle])
    right = merge_sort(items[middle:])
    merged = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

print(merge_sort([5, 2, 9, 1]))
```

```python
# Quicksort returning a new list
def quicksort(items):
    if len(items) <= 1:
        return list(items)
    pivot = items[0]
    rest = items[1:]
    smaller = [value for value in rest if value <= pivot]
    larger = [value for value in rest if value > pivot]
    return quicksort(smaller) + [pivot] + quicksort(larger)

print(quicksort([6, 3, 8, 1]))
```
