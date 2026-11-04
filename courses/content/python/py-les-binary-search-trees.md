---
id: "py-les-binary-search-trees"
type: "theory"
title: "Binary Search Trees"
moduleId: "py-mod-14-data-structures"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 15
tags: ["python", "data-structures", "binary-search-trees", "traversal", "search"]
---

# Concept Overview

A binary search tree (BST) is a tree in which every node obeys one rule: all values in its left subtree are smaller than the node, and all values in its right subtree are larger. The root has no restriction. That rule makes search possible by comparison: at each node, the target is either found, or the search moves left or right and discards half the tree.

The performance of a BST depends on its shape. A balanced tree has average search cost `O(log n)`. An unbalanced tree can degenerate into a list, where search costs `O(n)`. Python does not ship a built-in BST; you build one from nodes.

## Key Principles & Frameworks

### Nodes and the BST rule

Each node stores a value plus a left and a right child, either a node or `None`. An empty tree is represented by `None`:

```python
class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    if root is None:
        return BSTNode(value)
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


root = None
for value in [10, 5, 20]:
    root = insert(root, value)
print(contains(root, 5))
print(contains(root, 7))
```

Output:

```text
True
False
```

`contains` walks from the root: `5` is smaller than `10`, so the search moves left and finds it. `7` also moves left, then falls off the bottom and returns `False`.

### Insert

Insert walks down exactly as search does, until it reaches a `None` position, where the new node becomes a leaf:

```python
class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    if root is None:
        return BSTNode(value)
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


root = None
for value in [10, 5, 20, 15]:
    root = insert(root, value)
print(contains(root, 15))
print(contains(root, 7))
```

Output:

```text
True
False
```

Each new value follows the comparison chain to its slot. Duplicate values are ignored by this version, because neither branch is taken.

### In-order traversal

Visiting left subtree, node, then right subtree visits every value in sorted order. The BST rule guarantees it: everything left is smaller, everything right is larger:

```python
class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    if root is None:
        return BSTNode(value)
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

Output:

```text
[5, 10, 15, 20]
```

For the tree built above, the order is `5`, then `10`, then `15`, then `20`. Traversal visits every node, so it costs `O(n)` time and `O(h)` recursion space, where `h` is the height.

### Balance

Height is the longest path from the root to a leaf. Inserting values in sorted order grows one branch per insertion:

```python
class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):
    if root is None:
        return BSTNode(value)
    if value < root.value:
        root.left = insert(root.left, value)
    elif value > root.value:
        root.right = insert(root.right, value)
    return root


root = None
for value in [1, 2, 3, 4]:
    root = insert(root, value)

height = 0
node = root
while node is not None:
    height += 1
    node = node.right
print(height)
```

Output:

```text
4
```

The tree is a chain of four nodes. Each search compares every value: `O(n)`. A balanced four-node tree would be only 3 levels deep with logarithmic search. Self-balancing trees such as AVL and red-black trees rotate nodes to keep the height logarithmic.

## Common Pitfalls & Anti-Patterns
- **An unbalanced BST degenerating to a list**: inserting sorted data builds a chain, so search degrades to `O(n)`. Use a balanced tree for large ordered data, or balance the insertions.
- **Mixing up the comparison direction**: values smaller than the node belong left, larger values right. Reversing the branches breaks both search and in-order order.
- **Returning `None` from insert for the empty case**: inserting into `None` must return the new node so the caller can attach it to a parent.
- **Expecting `contains` to check the whole subtree**: the BST rule means only one branch can hold the target. Scanning both branches wastes the one property that makes search fast.

## Quick Summary
- A BST stores values so left subtree values are smaller and right subtree values are larger.
- Search, insert, and contains each follow comparisons down one branch.
- In-order traversal (left, node, right) yields values in sorted order.
- Height decides cost: balanced trees search in `O(log n)`, degenerate chains in `O(n)`.
