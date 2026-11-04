---
id: "py-les-efficient-sorting"
type: "theory"
title: "Efficient Sorting"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "sorting", "merge-sort", "quicksort", "divide-and-conquer"]
---

# Concept Overview

Efficient sorting algorithms use divide and conquer. The input is split into smaller pieces, each piece is sorted, and the results are combined. Splitting reduces the work much faster than the elementary passes from the previous lesson.

This lesson covers merge sort and quicksort. It compares their time and space complexities and explains when each one is preferable.

## Key Principles & Frameworks

### Divide and conquer

Divide and conquer follows three steps. Divide splits the problem into smaller subproblems. Conquer solves each subproblem, often recursively. Combine merges the solved parts into a solution for the original problem. The base case is a subproblem too small to divide.

```text
divide:   [9, 3, 7, 1, 8, 2, 6, 4] -> [9, 3, 7, 1] and [8, 2, 6, 4]
conquer:  first half -> [1, 3, 7, 9], second half -> [2, 4, 6, 8]
combine:  merge the sorted halves -> [1, 2, 3, 4, 6, 7, 8, 9]
```

Each level of splitting handles all elements, so total work depends on the number of levels and the cost of combining.

### Merge sort

Merge sort splits the list into halves, sorts each half recursively, and merges the two sorted halves into one sorted list. The merge step compares the front elements of the two halves and repeatedly takes the smaller one.

```python
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

data = [5, 2, 9, 1]
print(merge_sort(data))
```

Output:

```text
[1, 2, 5, 9]
```

Merge sort runs in `O(n log n)` time in all cases and uses `O(n)` extra space. It is stable.

### Quicksort and the pivot

Quicksort picks a pivot element and reorders the rest of the list. Elements less than the pivot go left. Elements greater than the pivot go right. The two partitions are then sorted recursively. A pivot is the element used as the dividing value.

```python
def quicksort(items):
    if len(items) <= 1:
        return list(items)
    pivot = items[0]
    rest = items[1:]
    smaller = [value for value in rest if value <= pivot]
    larger = [value for value in rest if value > pivot]
    return quicksort(smaller) + [pivot] + quicksort(larger)

data = [6, 3, 8, 1]
print(quicksort(data))
```

Output:

```text
[1, 3, 6, 8]
```

Average time is `O(n log n)`. Quicksort typically uses less extra space than merge sort but can degrade to `O(n squared)` time with poor pivot choices on sorted input.

### Choosing between merge sort and quicksort

Merge sort guarantees `O(n log n)` time and is stable, but it needs extra space for the merged output. Quicksort usually needs less extra space and is faster on average, but its worst case is worse and it is not stable in the simple form shown here.

```text
merge sort:  time O(n log n) always, space O(n), stable
quicksort:   time O(n log n) average, O(n squared) worst, space O(log n) typical, unstable
```

Use merge sort when stability or worst-case guarantees matter. Use quicksort when extra space is limited and average speed matters most.

### Comparing complexities

```python
def compare_growth(n):
    return {
        "linear": n,
        "n_log_n": n * 3,
        "quadratic": n * n,
    }

print(compare_growth(4))
```

Output:

```text
{'linear': 4, 'n_log_n': 12, 'quadratic': 16}
```

The factors are illustrative only. The key point is that quadratic growth overtakes linear growth quickly as `n` grows.

### Recursion depth in efficient sorts

Both algorithms use recursion, so the call stack depends on how the problem splits. Good splits keep the recursion depth near `log n`. Poor splits in quicksort can produce a depth near `n` and raise `RecursionError` on large inputs.

```python
import sys

print(sys.getrecursionlimit())
```

Output:

```text
1000
```

Choosing a good pivot reduces the depth. Merge sort always splits input evenly, so its depth grows roughly with `log n`.

## Common Pitfalls & Anti-Patterns
- **Missing base case**: A sort that divides forever never reaches a list of length zero or one.
- **Exponential recursion without memoization**: Different subproblems here do not overlap, so memoization does not help. Efficient splits matter instead.
- **Ignoring worst case**: Quicksort's worst case is `O(n squared)`. A bad pivot on sorted data can cause this case.
- **Forgetting extra space**: Merge sort builds new lists at every level. The memory cost is `O(n)`.
- **Confusing faster with more stable**: Stability is about preserving equal-element order. Speed is about steps. They are separate properties.
- **Choosing the pivot poorly**: Always picking the first element is simple but degrades on sorted input.
- **Off-by-one errors in partition logic**: Elements equal to the pivot must go to one side consistently.
- **Mutating while partitioning**: Build new lists or use index logic carefully. Changing a list during iteration skips elements.
- **Calling the built-in sort in a custom implementation**: The lab in this module forbids `sorted(` and `.sort(` for learning purposes.
- **Assuming Big-O is exact**: Constants, interpreter overhead, and memory access affect real running time.

## Quick Summary
- Divide and conquer splits, solves, and combines.
- Merge sort splits evenly and merges sorted halves.
- Merge sort runs in `O(n log n)` time and uses `O(n)` space.
- Merge sort is stable.
- Quicksort orders elements around a pivot.
- Quicksort runs in `O(n log n)` average time and `O(n squared)` worst-case time.
- Quicksort usually uses less extra space than merge sort.
- Good splits keep recursion depth near `log n`.
- Pick merge sort for stability and guaranteed worst case.
- Pick quicksort for low extra space and good average speed.
