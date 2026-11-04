---
id: "py-rev-data-structures"
type: "review"
title: "Data Structures Quick Reference"
moduleId: "py-mod-14-data-structures"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-arrays-and-linked-lists", "py-les-stacks-and-queues", "py-les-heaps-and-priority-queues", "py-les-hash-tables", "py-les-binary-search-trees", "py-ws-linked-list-and-stack", "py-lab-bst-toolkit"]
tags: ["python", "data-structures", "reference", "trees", "hashing"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| List | Dynamic array with O(1) indexing | `items[0]`, `append` |
| Array module | Fixed-type compact storage | `array("i", values)` |
| Linked list node | Value plus `next` link | `Node(value)` |
| Head | First node of a linked list | `lst.head` |
| Stack | LIFO ordering | `append`, `pop()` |
| Queue | FIFO ordering | `deque.popleft()` |
| `deque` | Double-ended queue, O(1) both ends | `append`, `popleft` |
| Min-heap | Smallest item at index `0` | `heapq.heappop` |
| `heapq.heapify` | Restore the parent rule on a list | once before pops |
| `heapq.heappush` | Add an item, keep the heap valid | `heappush(heap, item)` |
| `heapq.heappop` | Remove and return the smallest item | `heappop(heap)` |
| Priority queue | Return best priority first | `(priority, item)` tuples |
| Hash function | Maps a key to a slot number | `hash(key)` |
| Collision | Two keys mapping to one slot | resolved by key comparison |
| `dict` | Hash table mapping keys to values | `counts[word]` |
| `set` | Hash table of unique keys | `seen.add(value)` |
| Hashable | Can be a key or set member | strings, numbers, tuples |
| `__hash__` | Object hash for lookup tables | define with `__eq__` |
| BST invariant | Left values smaller, right values larger | one rule per node |
| `contains` | Walk down one branch by comparison | `O(log n)` balanced |
| `in_order_list` | Left, node, right visit order | values in sorted order |
| Height | Longest root-to-leaf path | chain has height n |
| Balance | Keeps height logarithmic | AVL, red-black trees |

## Key Concepts Comparison
- **List vs. linked list**: A list gives O(1) indexing but O(n) middle inserts. A linked list gives O(1) head inserts but O(n) access anywhere else.
- **Stack vs. queue**: A stack returns the newest item first (LIFO). A queue returns the oldest item first (FIFO).
- **List as stack vs. list as queue**: `append` plus `pop()` is O(1); `pop(0)` shifts everything and is O(n). Use `deque` for queues.
- **Min-heap vs. max-heap**: `heapq` is a min-heap only. Negate priorities to return the largest first.
- **Hash table vs. BST**: Hash tables answer lookups in expected O(1) without order. A BST keeps order and traverses in sorted order in O(log n) when balanced.
- **Balanced tree vs. degenerate tree**: A balanced tree has logarithmic height. Sorted insertion makes a chain with linear height and O(n) search.

## Critical Syntax / Templates
```python
# Linked list walk
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


def to_list(head):
    values = []
    current = head
    while current is not None:
        values.append(current.value)
        current = current.next
    return values


head = Node(1)
head.next = Node(2)
print(to_list(head))
```

```python
# Stack with a list
stack = []
stack.append("a")
stack.append("b")
print(stack.pop())
print(stack)
```

```python
# Queue with deque
from collections import deque

queue = deque(["Ana", "Ben"])
queue.append("Cid")
print(queue.popleft())
print(list(queue))
```

```python
# Min-heap priority queue
import heapq

tasks = [(3, "email"), (1, "alarm")]
heapq.heapify(tasks)
print(heapq.heappop(tasks))
print(heapq.heappop(tasks))
```

```python
# BST search and traversal
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


def contains(node, target):
    while node is not None:
        if target == node.value:
            return True
        if target < node.value:
            node = node.left
        else:
            node = node.right
    return False


def in_order_list(node, result=None):
    if result is None:
        result = []
    if node is not None:
        in_order_list(node.left, result)
        result.append(node.value)
        in_order_list(node.right, result)
    return result


root = None
for value in [10, 5, 15]:
    root = insert(root, value)
print(contains(root, 15))
print(in_order_list(root))
```
