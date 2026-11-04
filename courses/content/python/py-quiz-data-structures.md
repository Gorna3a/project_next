---
id: "py-quiz-data-structures"
type: "quiz"
title: "Data Structures Knowledge Check"
moduleId: "py-mod-14-data-structures"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "data-structures", "quiz", "trees", "hashing"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Why is removing from the front of a Python list expensive?

- [ ] Lists cannot remove from the front
- [x] Every later item must shift one slot left, costing O(n)
- [ ] The head node is removed
- [ ] Removing the first item runs a sort

*Explanation*: `pop(0)` deletes index `0`, so each remaining item moves one position left. That shift touches `O(n)` items. A `deque` removes from the front in `O(1)`.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
from collections import deque

queue = deque(["a", "b", "c"])
queue.append("d")
print(queue.popleft())
print(list(queue))
```

- [ ] `a` then `['a', 'b', 'c', 'd']`
- [ ] `d` then `['b', 'c', 'd']`
- [x] `a` then `['b', 'c', 'd']`
- [ ] `a` then `['b', 'c']`

*Explanation*: `popleft` removes `"a"`, the oldest item. `append("d")` adds `"d"` at the back, so the queue holds `b`, `c`, and `d`.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
A stack returns items in the same order they were added (first in, first out).

- [ ] True
- [x] False

*Explanation*: A stack is last-in, first-out. The most recently pushed item is popped first, which is the reverse of insertion order.

---

## Question 4
<!-- meta: {"type":"multiple","points":2} -->
Which statements about `heapq` are correct? Select all that apply.

- [x] `heapq` is a min-heap: the smallest item comes out first
- [x] `heapq.heapify` restores the heap rule on an existing list
- [x] Negating priorities makes the largest value come out first
- [ ] `heapq` keeps the whole list fully sorted
- [ ] `heapq` pops the largest item first by default

*Explanation*: `heapq` keeps the smallest item at index `0` and the parent rule elsewhere, but the list is not sorted beyond that. To get largest-first order, store negated values.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import heapq

heap = [5, 1, 7, 2]
heapq.heapify(heap)
print(heapq.heappop(heap))
print(heapq.heappop(heap))
```

- [ ] `1` then `3`
- [ ] `2` then `1`
- [ ] `7` then `5`
- [x] `1` then `2`

*Explanation*: `heapify` arranges the list so the minimum (`1`) sits at index `0`. The first pop returns `1`, the next returns `2`, the two smallest values.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
Which of these cannot be a dictionary key?

- [ ] A string such as `"name"`
- [ ] An integer
- [ ] A tuple of hashable values
- [x] A list such as `[1, 2]`

*Explanation*: Dictionary keys must be hashable. Lists are mutable and unhashable, so using one as a key raises `TypeError`. Strings, integers, and tuples of hashables work.

---

## Question 7
<!-- meta: {"type":"multiple","points":2} -->
Which statements about binary search trees are correct? Select all that apply.

- [x] Every left-subtree value is smaller than the node
- [x] In-order traversal returns values in sorted order
- [x] Inserting sorted values can make the tree a chain
- [ ] Search must check both subtrees at each node
- [ ] A BST always stays balanced as values are inserted

*Explanation*: The BST rule sends search down a single branch, and in-order traversal exploits that rule to produce sorted output. Without rebalancing, sorted insertion degenerates the tree into a list with `O(n)` search.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    elif value > root.value:
        root.right = insert(root.right, value)
    return root


def in_order_list(node, result=None):
    if result is None:
        result = []
    if node is not None:
        in_order_list(node.left, result)
        result.append(node.value)
        in_order_list(node.right, result)
    return result


root = None
for value in [10, 5, 20, 15]:
    root = insert(root, value)
print(in_order_list(root))
```

- [ ] `[10, 15, 5, 20]`
- [x] `[5, 10, 15, 20]`
- [ ] `[20, 15, 10, 5]`
- [ ] `[5, 15, 10, 20]`

*Explanation*: In-order traversal visits left, node, then right. For the tree built from `10, 5, 20, 15`, that order is `5`, `10`, `15`, `20`, which is sorted.
