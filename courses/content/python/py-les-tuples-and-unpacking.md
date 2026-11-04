---
id: "py-les-tuples-and-unpacking"
type: "theory"
title: "Tuples and Unpacking"
moduleId: "py-mod-06-collections"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "collections", "tuples", "unpacking"]
---

# Concept Overview

A tuple is an ordered, immutable collection. Ordered means the items keep their positions; immutable means the tuple itself cannot grow, shrink, or have an item replaced after creation.

Tuples are useful for fixed groups of values, such as coordinates, RGB colors, or a function that returns two related results. Their small size and immutability also make them safe to share.

## Key Principles & Frameworks

### Creating tuples

Tuples usually use parentheses:

```python
point = (3, 5)
print(point[0])
print(point[-1])
print(point[0:2])
```

Output:

```text
3
5
(3, 5)
```

Indexing and slicing work like lists. A slice of a tuple is a new tuple.

Parentheses are optional when the comma is present:

```python
point = 3, 5
print(point)
```

Output:

```text
(3, 5)
```

The comma is what creates the tuple, not the parentheses. This matters most for one-item tuples.

### The one-item tuple

A one-item tuple needs a trailing comma:

```python
print(type((5)))
print(type((5,)))
```

Output:

```text
<class 'int'>
<class 'tuple'>
```

`(5)` is just the integer `5` in parentheses. `(5,)` is a tuple containing one item. Forgetting the comma is a common source of bugs, especially when a function is expected to receive a tuple.

### Immutability

A tuple cannot be changed after creation:

```python
point = (3, 5)
# point[0] = 7 raises TypeError.
```

The error protects the fixed structure. If the values need to change, use a list instead. If a tuple contains a mutable object, such as a list, that inner object can still change; immutability applies to the tuple's own slots.

### Packing and unpacking

Creating a tuple from several values is called packing. Assigning its items to separate names is called unpacking:

```python
point = (3, 5)
x, y = point

print(x)
print(y)
```

Output:

```text
3
5
```

The number of names must match the number of items. Unpacking three values into two names raises `ValueError`, and so does the reverse.

Unpacking also makes swapping easy:

```python
a, b = 1, 2
a, b = b, a

print(a)
print(b)
```

Output:

```text
2
1
```

The right-hand side is evaluated first, so both original values are available before either name is reassigned.

### Starred unpacking

A starred name collects the remaining items into a list:

```python
first, *middle, last = [1, 2, 3, 4, 5]

print(first)
print(middle)
print(last)
```

Output:

```text
1
[2, 3, 4]
5
```

Only one starred name is allowed in a single unpacking target. It can collect zero items:

```python
first, *rest = (1,)

print(first)
print(rest)
```

Output:

```text
1
[]
```

The starred name always receives a list, even when it is empty.

### Returning several values

A function can return a tuple by separating values with commas:

```python
def min_max(numbers):
    return min(numbers), max(numbers)


low, high = min_max([4, 1, 9])
print(low)
print(high)
```

Output:

```text
1
9
```

The function returns a tuple, and the caller unpacks it. This pattern is common when one calculation produces several related results.

### Tuple methods

Tuples support a small set of methods, including `count` and `index`:

```python
values = (1, 2, 2, 3)

print(values.count(2))
print(values.index(3))
```

Output:

```text
2
3
```

`count` returns how many times a value appears, and `index` returns the position of the first match. Use a list if you need methods that modify the collection.

## Common Pitfalls & Anti-Patterns
- **Forgetting the trailing comma in a one-item tuple**: `(5)` is an integer; `(5,)` is a tuple.
- **Trying to change a tuple item**: Tuples are immutable and raise `TypeError` on item assignment.
- **Assuming parentheses create a tuple**: The comma does. `3, 5` is a tuple even without parentheses.
- **Unpacking the wrong number of values**: The names and items must match, unless a starred name collects the rest.
- **Expecting a starred name to be a tuple**: It receives a list.
- **Using more than one starred name in a target**: Python allows only one.
- **Using a tuple when the data must change**: Choose a list for append, remove, or item replacement.
- **Forgetting that nested mutability leaks through**: A tuple can hold a list, and that list can still change.
- **Using `(5)` where a one-item tuple is required by an API**: Add the comma.

## Quick Summary
- Tuples are ordered and immutable.
- Indexing and slicing work like lists, but slices return tuples.
- A trailing comma creates a one-item tuple.
- Packing groups values; unpacking assigns them to names.
- Unpacking requires matching counts unless a starred name collects the rest.
- A starred name receives a list, possibly empty.
- Functions commonly return tuples when they produce several related values.
- Use lists when the collection needs to change.
