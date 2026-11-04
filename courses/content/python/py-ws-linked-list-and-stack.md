---
id: "py-ws-linked-list-and-stack"
type: "workshop"
title: "Linked List and Stack"
moduleId: "py-mod-14-data-structures"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 45
tags: ["python", "data-structures", "linked-lists", "stacks", "workshop"]
---

# Workshop Overview

You will build a singly linked list from nodes, then use it as the storage for a stack. The linked list provides `add_to_front`, `to_list`, and `remove_by_value`. The stack built on top provides `push`, `pop`, and `peek`.

Each step keeps the previous code. The tests call the classes directly, so the methods must return the values described.

---

## Step 1: Create the node and the list

### Instructions
Define a `Node` class with `__init__(self, value)` that stores `value` and sets `next` to `None`.

Define `LinkedList` with `__init__(self)` that sets `self.head` to `None`, and `add_to_front(self, value)`. `add_to_front` creates a `Node`, points it at the current head, and updates `self.head` to the new node.

Print a list built from three values.

### Hints
1. A node needs two attributes: the stored `value` and the `next` link.
2. The head of a fresh list is `None`, not a node.
3. Add to the front by making the new node's `next` point at the old head first.

### Starter State / Code
```python
# Define Node and LinkedList below.

def make_list(values):
    result = LinkedList()
    for value in values:
        result.add_to_front(value)
    return result
```

### Solution State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node


lst = LinkedList()
lst.add_to_front(1)
lst.add_to_front(2)
lst.add_to_front(3)
print(lst.head.value)
print(lst.head.next.value)
print(lst.head.next.next.value)
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "LinkedList().head", "expected": null, "message": "A fresh list should have a None head", "required": true },
  { "type": "function-returns", "call": "Node(7).value", "expected": 7, "message": "Node should store the given value", "required": true },
  { "type": "function-returns", "call": "Node(7).next", "expected": null, "message": "A fresh node should link to None", "required": true },
  { "type": "code-contains", "value": "class Node", "message": "Define the Node class", "required": true },
  { "type": "code-contains", "value": "class LinkedList", "message": "Define the LinkedList class", "required": true }
]
```

---

## Step 2: Convert to a list

### Instructions
Keep `Node` and `LinkedList`. Add `to_list(self)` that walks from `self.head` following `next` links and returns the values in order.

Print the resulting lists.

### Hints
1. Start with `current = self.head` and stop when `current` is `None`.
2. Append `current.value` on each step, then move with `current = current.next`.
3. Return the collected list.

### Starter State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node
```

### Solution State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def to_list(self):
        values = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return values


lst = LinkedList()
lst.add_to_front(1)
lst.add_to_front(2)
lst.add_to_front(3)
print(lst.to_list())
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "make_list([1, 2, 3]).to_list()", "expected": [3, 2, 1], "message": "to_list should return values from front to back", "required": true },
  { "type": "function-returns", "call": "LinkedList().to_list()", "expected": [], "message": "to_list on an empty list should return an empty list", "required": true },
  { "type": "code-contains", "value": "def to_list(self)", "message": "Add the to_list method", "required": true }
]
```

---

## Step 3: Remove by value

### Instructions
Keep `Node`, `LinkedList` with `add_to_front` and `to_list`. Add `remove_by_value(self, value)` that removes the first node with that value and returns `True`, or returns `False` when the value is absent.

Print lists before and after removals.

### Hints
1. Handle the head case separately: if `self.head` holds the value, move `self.head` forward.
2. Otherwise walk with a `previous` node pointing at the current one.
3. The walk stops at `None` when the value never appears.

### Starter State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def to_list(self):
        values = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return values
```

### Solution State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def to_list(self):
        values = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return values

    def remove_by_value(self, value):
        if self.head is not None and self.head.value == value:
            self.head = self.head.next
            return True
        previous = self.head
        current = self.head
        while current is not None:
            if current.value == value:
                previous.next = current.next
                return True
            previous = current
            current = current.next
        return False


lst = LinkedList()
lst.add_to_front(1)
lst.add_to_front(2)
lst.add_to_front(3)
print(lst.to_list())
print(lst.remove_by_value(2))
print(lst.to_list())
print(lst.remove_by_value(9))
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "make_list([1, 2, 3]).remove_by_value(3)", "expected": true, "message": "Removing the head should return True", "required": true },
  { "type": "function-returns", "call": "make_list([1, 2, 3]).remove_by_value(2)", "expected": true, "message": "Removing a middle value should return True", "required": true },
  { "type": "function-returns", "call": "make_list([1, 2, 3]).remove_by_value(9)", "expected": false, "message": "Removing a missing value should return False", "required": true },
  { "type": "code-contains", "value": "def remove_by_value(self, value)", "message": "Add the remove_by_value method", "required": true }
]
```

---

## Step 4: Build the stack

### Instructions
Keep `Node` and `LinkedList`. Define `Stack` with `__init__(self)` that creates `self.items = LinkedList()`. Add `push(self, value)` that calls `self.items.add_to_front(value)`, `pop(self)` that removes and returns the head value, or returns `None` when empty, and `peek(self)` that returns the head value without removing it, or `None` when empty.

Print push results, peeks, and pops.

### Hints
1. The front of the linked list is the top of the stack.
2. `peek` only reads `self.items.head` and its `.value`.
3. `pop` reads the same value, then advances the head.

### Starter State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def to_list(self):
        values = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return values

    def remove_by_value(self, value):
        if self.head is not None and self.head.value == value:
            self.head = self.head.next
            return True
        previous = self.head
        current = self.head
        while current is not None:
            if current.value == value:
                previous.next = current.next
                return True
            previous = current
            current = current.next
        return False


def make_list(values):
    result = LinkedList()
    for value in values:
        result.add_to_front(value)
    return result
```

### Solution State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def to_list(self):
        values = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return values

    def remove_by_value(self, value):
        if self.head is not None and self.head.value == value:
            self.head = self.head.next
            return True
        previous = self.head
        current = self.head
        while current is not None:
            if current.value == value:
                previous.next = current.next
                return True
            previous = current
            current = current.next
        return False


def make_list(values):
    result = LinkedList()
    for value in values:
        result.add_to_front(value)
    return result


class Stack:
    def __init__(self):
        self.items = LinkedList()

    def push(self, value):
        self.items.add_to_front(value)

    def pop(self):
        if self.items.head is None:
            return None
        value = self.items.head.value
        self.items.head = self.items.head.next
        return value

    def peek(self):
        if self.items.head is None:
            return None
        return self.items.head.value


stack = Stack()
stack.push("a")
stack.push("b")
stack.push("c")
print(stack.peek())
print(stack.pop())
print(stack.peek())
print(stack.items.to_list())
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "Stack().peek()", "expected": null, "message": "peek on an empty stack should return None", "required": true },
  { "type": "function-returns", "call": "Stack().pop()", "expected": null, "message": "pop on an empty stack should return None", "required": true },
  { "type": "function-returns", "call": "stack_push_one().peek()", "expected": "a", "message": "peek should show the top value", "required": true },
  { "type": "function-returns", "call": "stack_push_two().pop()", "expected": "b", "message": "pop should return the most recently pushed value", "required": true },
  { "type": "code-contains", "value": "class Stack", "message": "Define the Stack class", "required": true },
  { "type": "code-contains", "value": "def push(self, value)", "message": "Add the push method", "required": true },
  { "type": "code-contains", "value": "def pop(self)", "message": "Add the pop method", "required": true },
  { "type": "code-contains", "value": "def peek(self)", "message": "Add the peek method", "required": true }
]
```

---

## Step 5: Test the finished stack

### Instructions
Keep `Node`, `LinkedList`, and `Stack` from the previous steps. Print the full trace: push three values, peek, pop twice, peek, then pop the last value and pop the empty stack.

### Hints
1. Last in, first out: the newest push is popped first.
2. An empty stack returns `None` from both `peek` and `pop`.
3. Walk the linked list with `stack.items.to_list()` to inspect the contents.

### Starter State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def to_list(self):
        values = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return values

    def remove_by_value(self, value):
        if self.head is not None and self.head.value == value:
            self.head = self.head.next
            return True
        previous = self.head
        current = self.head
        while current is not None:
            if current.value == value:
                previous.next = current.next
                return True
            previous = current
            current = current.next
        return False


class Stack:
    def __init__(self):
        self.items = LinkedList()

    def push(self, value):
        self.items.add_to_front(value)

    def pop(self):
        if self.items.head is None:
            return None
        value = self.items.head.value
        self.items.head = self.items.head.next
        return value

    def peek(self):
        if self.items.head is None:
            return None
        return self.items.head.value


def make_stack(values):
    result = Stack()
    for value in values:
        result.push(value)
    return result


def stack_push_one():
    result = Stack()
    result.push("a")
    return result


def stack_push_two():
    result = Stack()
    result.push("a")
    result.push("b")
    return result


def empty_stack():
    return Stack()
```

### Solution State / Code
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    def add_to_front(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def to_list(self):
        values = []
        current = self.head
        while current is not None:
            values.append(current.value)
            current = current.next
        return values

    def remove_by_value(self, value):
        if self.head is not None and self.head.value == value:
            self.head = self.head.next
            return True
        previous = self.head
        current = self.head
        while current is not None:
            if current.value == value:
                previous.next = current.next
                return True
            previous = current
            current = current.next
        return False


class Stack:
    def __init__(self):
        self.items = LinkedList()

    def push(self, value):
        self.items.add_to_front(value)

    def pop(self):
        if self.items.head is None:
            return None
        value = self.items.head.value
        self.items.head = self.items.head.next
        return value

    def peek(self):
        if self.items.head is None:
            return None
        return self.items.head.value


def make_stack(values):
    result = Stack()
    for value in values:
        result.push(value)
    return result


def stack_push_one():
    result = Stack()
    result.push("a")
    return result


def stack_push_two():
    result = Stack()
    result.push("a")
    result.push("b")
    return result


def empty_stack():
    return Stack()


stack = Stack()
stack.push("a")
stack.push("b")
stack.push("c")
print(stack.peek())
print(stack.pop())
print(stack.pop())
print(stack.peek())
print(stack.pop())
print(stack.pop())
print(stack.items.to_list())
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "make_stack([\"a\", \"b\", \"c\"]).items.to_list()", "expected": ["c", "b", "a"], "message": "Pushing a, b, c should leave c at the top", "weight": 2, "required": true },
  { "type": "function-returns", "call": "make_stack([\"a\", \"b\"]).pop()", "expected": "b", "message": "The last pushed value should pop first", "weight": 2, "required": true },
  { "type": "function-returns", "call": "make_stack([\"a\"]).pop()", "expected": "a", "message": "Popping the only value should return it", "required": true },
  { "type": "function-returns", "call": "Stack().pop()", "expected": null, "message": "Popping an empty stack should return None", "required": true }
]
```
