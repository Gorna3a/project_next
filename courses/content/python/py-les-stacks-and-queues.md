---
id: "py-les-stacks-and-queues"
type: "theory"
title: "Stacks and Queues"
moduleId: "py-mod-14-data-structures"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 15
tags: ["python", "data-structures", "stacks", "queues", "deque"]
---

# Concept Overview

A stack is last-in, first-out (LIFO): the most recently added item is removed first. A queue is first-in, first-out (FIFO): the oldest item is removed first. Both hide the underlying storage and expose only two operations per side: put an item in and take one out.

Python has no built-in stack class. A plain list works well as a stack because `append` and `pop()` both touch the end. For a queue, a list is a poor choice, because removing from the front shifts every later item. The `collections.deque` type supports removal from either end in `O(1)`.

## Key Principles & Frameworks

### Stacks: the end of the list

A stack pushes onto the top and pops from the top. Both operations are constant time:

```python
stack = []
stack.append("a")
stack.append("b")
stack.append("c")
print(stack[-1])
print(stack.pop())
print(stack)
```

Output:

```text
c
c
['a', 'b']
```

The last item pushed (`"c"`) is the first one popped. Index `-1` shows the top. A stack works well for undo history, parsing parentheses, and depth-first search.

### Queues: both ends matter

A queue adds at the back and removes from the front. A list makes removal expensive:

```python
people = ["Ana", "Ben", "Cid"]
person = people.pop(0)
print(person)
print(people)
```

Output:

```text
Ana
['Ben', 'Cid']
```

`pop(0)` shifts `"Ben"` and `"Cid"` one slot left. That shift costs `O(n)` per removal. With few items it hardly matters, but it is exactly the pattern a queue should avoid.

### `deque`: O(1) at both ends

`deque` is a double-ended queue from the `collections` module. `append` and `popleft` are `O(1)`:

```python
from collections import deque

queue = deque(["Ana", "Ben", "Cid"])
queue.append("Dee")
print(queue.popleft())
print(list(queue))
```

Output:

```text
Ana
['Ben', 'Cid', 'Dee']
```

`popleft` removes `"Ana"` from the front without shifting the rest. `append` adds `"Dee"` at the back. `deque` also supports `appendleft` and `pop` for work at the opposite end.

### Choosing between them

```python
stack = []
stack.append("first")
stack.append("second")
print(stack.pop())
print(stack.pop())
```

Output:

```text
second
first
```

Use a stack when the newest item is needed first. Use a queue when the oldest item is needed first, such as a ticket line, a print spooler, or a breadth-first search. `deque` with `maxlen` also works as a fixed-size sliding window.

## Common Pitfalls & Anti-Patterns
- **Using a list as a queue**: `pop(0)` costs `O(n)` because the rest of the list shifts left. Use `deque.popleft()` for `O(1)` front removal.
- **Forgetting which end is the top**: `append` and `pop()` with no argument both use the end of the list. That pair is the stack convention.
- **Calling `pop()` on an empty stack**: it raises `IndexError`. Check `if stack` first when emptiness is possible.
- **Ignoring `deque` maxlen behavior**: a `deque` created with `maxlen` silently drops items from the opposite end once it is full.

## Quick Summary
- A stack follows LIFO: push with `append`, pop from the end of a list.
- A queue follows FIFO: add at the back, remove from the front.
- Lists make `append` and `pop()` fast but make `pop(0)` `O(n)`.
- `deque` gives `O(1)` `append` and `popleft` for proper queues.
