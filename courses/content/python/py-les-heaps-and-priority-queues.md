---
id: "py-les-heaps-and-priority-queues"
type: "theory"
title: "Heaps and Priority Queues"
moduleId: "py-mod-14-data-structures"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 15
tags: ["python", "data-structures", "heaps", "heapq", "priority-queue"]
---

# Concept Overview

A heap is a tree stored in a list that keeps one item at the top: the smallest in a min-heap, or the largest in a max-heap. Only the top item has a guaranteed position. The rest of the tree follows the parent rule: every parent is smaller (min-heap) or larger (max-heap) than its children.

A priority queue is the behavior a heap provides: always return the item with the best priority first. The `heapq` module implements a min-heap over a plain list. `heapify`, `heappush`, and `heappop` each cost `O(log n)`.

## Key Principles & Frameworks

### The heap invariant

In a min-heap, the smallest item is at index `0`, and each parent is `<=` its children. A list viewed as a tree puts the children of index `i` at indexes `2 * i + 1` and `2 * i + 2`. That layout lets `heapq` work directly on a list:

```python
import heapq

heap = [5, 1, 7, 2, 6]
heapq.heapify(heap)
print(heap)
```

Output:

```text
[1, 2, 7, 5, 6]
```

The list is not fully sorted: only the parent rule holds. Index `0` holds `1`, and every parent is smaller than its children.

### Pushing and popping

`heappush` adds an item and restores the parent rule. `heappop` removes and returns the smallest item:

```python
import heapq

heap = [1, 2, 7, 5, 6]
heapq.heappush(heap, 3)
print(heapq.heappop(heap))
print(heap)
```

Output:

```text
1
[2, 5, 3, 7, 6]
```

`heappop` returns `1`, the smallest value. The remaining list still obeys the parent rule, with `2` at index `0`.

### Building a priority queue

A priority queue orders items by their priority field. Tuples compare element by element, so `(priority, item)` puts the lowest priority first:

```python
import heapq

tasks = [(3, "email"), (1, "alarm"), (2, "report")]
heapq.heapify(tasks)
print(heapq.heappop(tasks))
print(heapq.heappop(tasks))
print(heapq.heappop(tasks))
```

Output:

```text
(1, 'alarm')
(2, 'report')
(3, 'email')
```

Each pop returns the task with the smallest priority number. If two priorities tie, the second element decides the order. Adding a unique counter as the middle element avoids comparing the items themselves.

### Heap sort in brief

Heap sort repeatedly pops the smallest item into a new list:

```python
import heapq


def heap_sort(values):
    result = []
    heapq.heapify(values)
    while values:
        result.append(heapq.heappop(values))
    return result


print(heap_sort([4, 1, 3, 2]))
```

Output:

```text
[1, 2, 3, 4]
```

Sorting costs `O(n log n)` time: building the heap is `O(n)`, and each of the `n` pops costs `O(log n)`. In practice, `sorted()` has better constants.

## Common Pitfalls & Anti-Patterns
- **heapq is a min-heap only**: `heapq` always keeps the smallest item at the top. To get a max-heap, negate the values or store negative priorities.
- **Expecting the rest of the list to be sorted**: only index `0` and the parent rule are guaranteed. Items below the root are not in order.
- **Comparing items when priorities tie**: in `(priority, item)` tuples, equal priorities compare the items next. Add a unique counter if the items are not meant to be compared.
- **Forgetting `heapify` before popping**: `heappop` assumes the parent rule already holds. Call `heapify` on an existing list first.

## Quick Summary
- A min-heap keeps the smallest item at index `0`, with every parent `<=` its children.
- `heapq` provides `heapify`, `heappush`, and `heappop` over a plain list.
- `heapq` is a min-heap; use negated priorities for largest-first order.
- A priority queue pops the best priority first in `O(log n)` per operation.
