---
id: "py-les-arrays-and-linked-lists"
type: "theory"
title: "Arrays and Linked Lists"
moduleId: "py-mod-14-data-structures"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 15
tags: ["python", "data-structures", "arrays", "linked-lists"]
---

# Concept Overview

A Python list is a dynamic array: a block of references that can grow as items are added. Reading or writing an item by index is `O(1)`. Adding to the end is `O(1)` on average, because the list usually has spare capacity. Inserting or removing in the middle, or at the front, costs `O(n)` because later items must shift one position to fill the gap.

A singly linked list stores each value in a node that points to the next node. It never shifts items, but there is no direct index access: reaching any node means starting from the head and following links. Traversal, insert, and delete all cost `O(n)` time except for work at the head.

## Key Principles & Frameworks

### Lists: fast indexing, costly inserts in the middle

```python
items = [10, 20, 30]

print(items[0])
print(items[-1])
items.append(40)
print(items)
```

Output:

```text
10
30
[10, 20, 30, 40]
```

`items[0]` and `items[-1]` are constant time. `append` adds to the end. Inserting near the start shifts everything after it:

```python
items = [20, 30]
items.insert(0, 10)
print(items)
```

Output:

```text
[10, 20, 30]
```

`insert(0, 10)` pushes `20` and `30` one slot right. Removing from the front has the same cost: `pop(0)` shifts all remaining items left, so removing repeatedly from the front is `O(n)` per removal.

### The `array` module: compact fixed-type storage

The standard `array` module stores values of one C type in a compact block, using far less memory than a list of Python objects:

```python
from array import array

values = array("i", [1, 2, 3])
print(values[1])
print(len(values))
```

Output:

```text
2
3
```

The `"i"` type code means signed C integers. Values are converted on storage and converted back on access. The trade-off is flexibility: every item has the same type, and the array offers few of the operations lists support.

### Linked lists: one link, one direction

Each node holds a value and a reference to the next node. The final node's `next` is `None`:

```python
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
head.next.next = Node(3)
print(to_list(head))
```

Output:

```text
[1, 2, 3]
```

The list looks like this:

```text
head
  |
  v
[1] -> [2] -> [3] -> None
```

`to_list` walks the chain and collects values. That walk is `O(n)`: every step visits one node.

### Insert and delete

Inserting before the head is `O(1)`: create a node, point it at the old head, hand the new node back. Deleting the second node only rewires one link:

```python
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
head.next.next = Node(3)

inserted = Node(0)
inserted.next = head
print(to_list(inserted))

head.next = head.next.next
print(to_list(head))
```

Output:

```text
[0, 1, 2, 3]
[1, 3]
```

The insert does two assignments. The delete replaces `head.next` (the `2` node) with the node after it. Neither operation moves other nodes.

## Common Pitfalls & Anti-Patterns
- **Removing from the front of a list is O(n)**: `pop(0)` shifts every later item. Use a `deque` instead when you remove from the front often.
- **Losing the head of a linked list**: if you advance a variable that was the only reference to the start, the whole chain becomes unreachable. Keep the head in a separate variable.
- **Expecting O(1) indexing in a linked list**: there is no array to index. Reaching the k-th node costs `O(k)`.
- **Treating `array` as a general list replacement**: the type code fixes one C type, and the module lacks most list methods. It saves memory, not code effort.

## Quick Summary
- A list gives `O(1)` indexing and average `O(1)` appends, but `O(n)` inserts and removals away from the end.
- The `array` module stores one fixed C type compactly, at the cost of flexibility.
- A singly linked list node holds a value plus a `next` link; `None` ends the chain.
- Inserting before the head and rewiring one link are `O(1)`; any other position costs a full walk.
