---
id: "py-les-complexity-and-big-o"
type: "theory"
title: "Complexity and Big-O"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "big-o", "complexity", "algorithms"]
---

# Concept Overview

Time complexity describes how the number of steps in an algorithm grows as the input grows. Space complexity describes how memory use grows with the input. These measures help you compare algorithms before they become too slow or too large for real data.

Big-O notation describes the growth rate of a resource need. It ignores constant factors and small inputs and focuses on how the cost grows when `n`, the input size, becomes large.

## Key Principles & Frameworks

### Input size and growth

Input size is the measure of data the algorithm processes. For a list it is usually the length. Doubling the input size can double the work, quadruple it, or increase it more slowly depending on the algorithm.

```python
def sum_list(items):
    total = 0
    for item in items:
        total += item
    return total

print(sum_list([1, 2, 3, 4]))
```

Output:

```text
10
```

The loop runs once per element, so the work grows directly with the list length.

### Common Big-O classes

The following classes cover most algorithms in this course:

```text
O(1)      constant time
O(log n)  logarithmic time
O(n)      linear time
O(n log n) linearithmic time
O(n squared) quadratic time
```

Each class describes a growth pattern. `O(1)` does not grow with `n`. `O(n)` grows in proportion to `n`. `O(n squared)` grows with the square of `n`.

### Constant time `O(1)`

Constant time means the number of steps does not grow with the input size. Index access and dictionary lookups are typical examples.

```python
numbers = [10, 20, 30]

print(numbers[1])
```

Output:

```text
20
```

Reading one position takes the same number of steps for a list of three items or three thousand items.

### Linear time `O(n)`

Linear time means the work grows in direct proportion to the input size. A single loop over a list is linear.

```python
def contains_target(items, target):
    for item in items:
        if item == target:
            return True
    return False

print(contains_target([2, 5, 8], 5))
print(contains_target([2, 5, 8], 9))
```

Output:

```text
True
False
```

The loop may stop early, but in the worst case it scans every element.

### Logarithmic time `O(log n)`

Logarithmic time grows more slowly than linear time because each step removes a large part of the remaining input. Binary search halves the candidate range on each step and runs in `O(log n)` time.

```text
n = 8:  log n = 3 steps
n = 64: log n = 6 steps
n = 1024: log n = 10 steps
```

Increasing the input from 8 to 1024 adds only 7 steps. This is why logarithmic algorithms scale so well.

### Quadratic time `O(n squared)`

Quadratic time grows with the square of the input size. Nested loops over the same data usually produce `O(n squared)` behavior.

```python
def all_pairs(items):
    pairs = []
    for first in items:
        for second in items:
            pairs.append((first, second))
    return pairs

print(len(all_pairs([1, 2, 3])))
```

Output:

```text
9
```

Three elements produce nine pairs. Four elements would produce sixteen pairs.

### Analyzing loops

To analyze a function, count how many times each line runs. A single loop over `n` items is `O(n)`. Nested loops multiply their counts. Sequential statements add their counts, but Big-O keeps only the dominant term.

```python
def analyze(items):
    total = 0
    for item in items:
        total += item
    return total

print(analyze([1, 2, 3]))
```

Output:

```text
6
```

The loop body runs `len(items)` times. The surrounding statements run once and do not affect growth.

### Space complexity

Space complexity measures extra memory. A loop that reuses variables uses constant extra space. Creating a new list with one output per input element uses `O(n)` space.

```python
def copy_list(items):
    result = []
    for item in items:
        result.append(item)
    return result

print(copy_list([1, 2, 3]))
```

Output:

```text
[1, 2, 3]
```

The result list grows with the input, so the space cost is `O(n)`.

## Common Pitfalls & Anti-Patterns
- **Assuming Big-O gives exact running time**: Big-O describes growth, not seconds. Constants and hardware affect measured time.
- **Confusing best case with worst case**: Best case is the fastest scenario for an algorithm. Worst case is the slowest. Many comparisons use the worst case.
- **Ignoring early exits**: A function may return early, but worst-case analysis still counts the scans that run to the end.
- **Counting lines instead of growth**: Big-O compares growth rates, so doubling `n` matters more than the number of source lines.
- **Forgetting nested loops**: Nested loops multiply work. Two loops over `n` items produce `O(n squared)`.
- **Ignoring memory**: An algorithm can be fast in time but expensive in space. Both measures matter.
- **Treating `O(1)` code as free**: Constant does not mean zero. The constant work still takes time.
- **Mixing input measures**: Comparing `O(n)` for a list with `O(n)` for a string is meaningful only when `n` means the same unit in both.
- **Over-optimizing small inputs**: Growth matters most for large inputs. Small cases rarely dominate performance.
- **Stating complexity without naming `n`**: Always say what `n` measures.

## Quick Summary
- Time complexity measures growth in steps with input size.
- Space complexity measures growth in memory with input size.
- Big-O ignores constants and small inputs.
- `O(1)` is constant growth.
- `O(log n)` grows more slowly than linear.
- `O(n)` grows in direct proportion to the input.
- `O(n log n)` grows slightly faster than linear.
- `O(n squared)` grows with the square of the input.
- Nested loops multiply their step counts.
- Big-O does not give exact running time.
- Worst case is the standard basis for comparison.
- Name `n` when you state any complexity.
