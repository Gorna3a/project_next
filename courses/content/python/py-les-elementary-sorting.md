---
id: "py-les-elementary-sorting"
type: "theory"
title: "Elementary Sorting"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "sorting", "bubble-sort", "insertion-sort", "timsort"]
---

# Concept Overview

Elementary sorting algorithms organize a list with simple repeated passes. They are easy to implement and useful for learning how comparisons and swaps work. They also show why efficient algorithms matter when lists grow large.

This lesson covers bubble sort, selection sort, and insertion sort. It also explains stability, the difference between `sorted` and `list.sort`, and Python's built-in Timsort.

## Key Principles & Frameworks

### Bubble sort

Bubble sort repeatedly scans the list and swaps each pair of adjacent elements that are out of order. Each full scan moves one large element to the end, as if it bubbles up. After enough scans, the list is sorted.

```python
def bubble_sort(items):
    n = len(items)
    for end in range(n - 1, 0, -1):
        swapped = False
        for index in range(end):
            if items[index] > items[index + 1]:
                items[index], items[index + 1] = items[index + 1], items[index]
                swapped = True
        if not swapped:
            break
    return items

data = [5, 2, 9, 1]
print(bubble_sort(data))
```

Output:

```text
[1, 2, 5, 9]
```

The `swapped` flag stops early when a full scan makes no swaps. Worst-case time is `O(n squared)`.

### Selection sort

Selection sort builds the sorted part from left to right. Each pass finds the smallest remaining element and swaps it into place.

```python
def selection_sort(items):
    n = len(items)
    for start in range(n):
        smallest = start
        for index in range(start + 1, n):
            if items[index] < items[smallest]:
                smallest = index
        items[start], items[smallest] = items[smallest], items[start]
    return items

data = [4, 2, 7, 1]
print(selection_sort(data))
```

Output:

```text
[1, 2, 4, 7]
```

Selection sort performs the minimum number of swaps, but it still scans every unsorted element on each pass. Time is `O(n squared)`.

### Insertion sort

Insertion sort takes each element in turn and inserts it into the sorted portion to its left. It shifts larger elements right to open a space for the current value.

```python
def insertion_sort(items):
    for index in range(1, len(items)):
        key = items[index]
        position = index - 1
        while position >= 0 and items[position] > key:
            items[position + 1] = items[position]
            position -= 1
        items[position + 1] = key
    return items

data = [6, 3, 8, 1]
print(insertion_sort(data))
```

Output:

```text
[1, 3, 6, 8]
```

Insertion sort adapts well to nearly sorted lists. Its worst case is still `O(n squared)`.

### Stability

Stability describes whether equal elements keep their original relative order after sorting. A stable sort preserves the order of equal keys. An unstable sort may reorder equal elements.

```text
before: [(2, "first"), (1, "x"), (2, "second"), (1, "y")]
after stable sort by key: [(1, "x"), (1, "y"), (2, "first"), (2, "second")]
after unstable sort by key: [(1, "y"), (1, "x"), (2, "second"), (2, "first")]
```

Python's built-in sort is stable. This matters when sorting by one field while preserving the order of another field.

### `sorted` vs `list.sort`

The built-in function `sorted(items)` returns a new sorted list and leaves the original unchanged. The method `items.sort()` sorts the list in place and returns `None`.

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

`sorted` always creates a new list. `list.sort` mutates the list and returns `None`.

### Timsort

Python's built-in sorts use Timsort, an adaptive hybrid algorithm. Timsort detects runs of already sorted elements and uses insertion sort for small runs and merge sort for larger sections. Its worst-case time is `O(n log n)` and its best-case time is `O(n)` for nearly sorted data.

```python
data = [8, 2, 5, 1, 9, 3]
print(sorted(data))
```

Output:

```text
[1, 2, 3, 5, 8, 9]
```

For this course, calling `sorted` is preferred over writing a slow elementary sort when the goal is correctness rather than learning.

## Common Pitfalls & Anti-Patterns
- **Using `list.sort` when a new list is needed**: `list.sort()` mutates the list and returns `None`. Use `sorted()` when the original must stay unchanged.
- **Assuming `list.sort()` returns the sorted list**: It returns `None`. Assigning `result = items.sort()` stores `None`.
- **Forgetting stability**: Equal elements may matter. Python's sort is stable, but custom sorts are not always stable.
- **Choosing an elementary sort for large data**: Bubble, selection, and insertion sorts all run in `O(n squared)` time in the worst case.
- **Off-by-one errors in swap loops**: Compare the boundary conditions with a small trace on three or four elements.
- **Swapping values instead of positions**: Swapping elements with equal values is harmless, but swapping the wrong positions breaks the sort.
- **Mutating the input unexpectedly**: Functions that sort in place change the caller's list. Document the behavior clearly.
- **Confusing reversibility with stability**: Sorting in reverse uses the same stability rule in reverse order.
- **Timing small lists to judge an algorithm**: Measure growth with larger inputs.
- **Reimplementing Timsort by hand**: The standard library is faster and well tested. Write custom sorts only for learning or special constraints.

## Quick Summary
- Bubble sort scans adjacent pairs and moves large values right.
- Selection sort finds the smallest element on each pass.
- Insertion sort inserts each element into the sorted left part.
- All three elementary sorts run in `O(n squared)` worst-case time.
- Stability preserves the order of equal elements.
- `sorted()` returns a new list and leaves the original unchanged.
- `list.sort()` sorts in place and returns `None`.
- Python's built-in sorts use Timsort.
- Timsort runs in `O(n log n)` worst-case time.
- Prefer `sorted` for production code.
