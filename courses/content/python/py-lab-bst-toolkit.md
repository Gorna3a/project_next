---
id: "py-lab-bst-toolkit"
type: "lab"
title: "BST Toolkit"
moduleId: "py-mod-14-data-structures"
order: 7
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 35
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "data-structures", "binary-search-trees", "lab"]
---

# Objective

Build a small binary search tree toolkit. The tree stores integer values. Define a `Node` class whose `__init__(self, value)` stores `value` and sets `left` and `right` to `None`.

Define three module-level functions that take the root node as their first argument:

- `insert(root, value)` returns the (possibly new) root, adding `value` as a new leaf. Duplicate values are ignored.
- `contains(root, value)` returns `True` when `value` is present and `False` otherwise.
- `in_order_list(root)` returns the values in sorted order.

The tests build trees by calling `insert` and then call `contains` and `in_order_list` directly. Keep the implementation free of prompts and printed output.

## Requirements
- Define `class Node` with `__init__(self, value)` storing the value and two `None` children.
- `insert` must return the root so callers can write `root = insert(root, value)`.
- `insert` must ignore duplicate values: the tree must not gain a second node for an existing value.
- `contains` must follow the BST rule and return `False` for an empty tree.
- `in_order_list` must visit left subtree, node, then right subtree, so the result is sorted.
- Do not print inside the functions.

## Starter State / Workspace
```python
# Define Node, insert, contains, and in_order_list below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "contains(None, 5)", "expected": false, "message": "An empty tree contains nothing", "required": true },
  { "type": "function-returns", "call": "in_order_list(None)", "expected": [], "message": "An empty tree should traverse to an empty list", "required": true },
  { "type": "function-returns", "call": "in_order_list(build_tree([10, 5, 20, 15]))", "expected": [5, 10, 15, 20], "message": "In-order traversal should return sorted values", "weight": 2, "required": true },
  { "type": "function-returns", "call": "contains(build_tree([10, 5, 20, 15]), 15)", "expected": true, "message": "contains should find an inserted value", "weight": 2, "required": true },
  { "type": "function-returns", "call": "contains(build_tree([10, 5, 20, 15]), 7)", "expected": false, "message": "contains should return False for a missing value", "required": true },
  { "type": "function-returns", "call": "in_order_list(build_tree([50, 30, 70, 60, 80, 40]))", "expected": [30, 40, 50, 60, 70, 80], "message": "A larger tree should traverse in sorted order", "weight": 2, "required": true },
  { "type": "function-returns", "call": "in_order_list(build_tree([10, 10, 5, 10]))", "expected": [5, 10], "message": "Duplicate inserts should be ignored", "weight": 2, "required": true },
  { "type": "function-returns", "call": "contains(build_tree([10, 10]), 10)", "expected": true, "message": "The single inserted value should be found", "required": true },
  { "type": "function-returns", "call": "in_order_list(insert(None, 42))", "expected": [42], "message": "Inserting into an empty tree should return a one-node tree", "required": true },
  { "type": "function-returns", "call": "contains(insert(None, 42), 42)", "expected": true, "message": "The first inserted value should be found", "required": true },
  { "type": "code-contains", "value": "class Node", "message": "Define the Node class", "required": true },
  { "type": "code-contains", "value": "def insert(root, value)", "message": "Define insert", "required": true },
  { "type": "code-contains", "value": "def contains(root, value)", "message": "Define contains", "required": true },
  { "type": "code-contains", "value": "def in_order_list(root)", "message": "Define in_order_list", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** At each node, compare the value with the node's value to decide between the left and right subtree.

> [!TIP]
> **Hint 2:** In `insert`, the case `root is None` creates and returns a new `Node`.

> [!TIP]
> **Hint 3:** In `contains`, loop down the tree: move left when the target is smaller and right when it is larger, stopping at `None`.

> [!TIP]
> **Hint 4:** `in_order_list` can recurse into the left subtree, append the node's value, then recurse into the right subtree.

## Reference Solution
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


def contains(root, value):
    node = root
    while node is not None:
        if value == node.value:
            return True
        if value < node.value:
            node = node.left
        else:
            node = node.right
    return False


def in_order_list(root, result=None):
    if result is None:
        result = []
    if root is not None:
        in_order_list(root.left, result)
        result.append(root.value)
        in_order_list(root.right, result)
    return result


def build_tree(values):
    root = None
    for value in values:
        root = insert(root, value)
    return root
```
