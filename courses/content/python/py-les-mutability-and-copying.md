---
id: "py-les-mutability-and-copying"
type: "theory"
title: "Mutability and Copying"
moduleId: "py-mod-06-collections"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "collections", "mutability", "copying", "aliasing"]
---

# Concept Overview

Some Python values can change in place, and some cannot. Lists, dictionaries, and sets are mutable. Numbers, strings, booleans, `None`, and tuples are immutable. The distinction matters when two names refer to the same object.

Assignment does not copy an object. It binds a name to an object. If two names refer to the same mutable object, a change made through one name is visible through the other. This is called aliasing.

## Key Principles & Frameworks

### Assignment binds, it does not copy

```python
a = [1, 2, 3]
b = a

b.append(4)

print(a)
print(b)
print(a is b)
```

Output:

```text
[1, 2, 3, 4]
[1, 2, 3, 4]
True
```

`b = a` does not create a second list. It makes `b` another name for the same list. `a is b` is `True` because both names refer to one object. Mutating through `b` changes what `a` sees.

### Rebinding versus mutating

Assigning a new object to a name is different from changing the old object:

```python
numbers = [1, 2]
alias = numbers

numbers = [3, 4]

print(alias)
print(numbers)
```

Output:

```text
[1, 2]
[3, 4]
```

`alias` still refers to the original list. The assignment `numbers = [3, 4]` rebinds only `numbers` to a new list; it does not mutate the original object.

### Shallow copies with slicing

A slice creates a new list:

```python
a = [1, 2, 3]
b = a[:]

b.append(4)

print(a)
print(b)
print(a is b)
```

Output:

```text
[1, 2, 3]
[1, 2, 3, 4]
False
```

The lists are equal in content at first but are different objects. Changing `b` no longer affects `a`.

The same shallow copy can be made with `.copy()` or `list()`:

```python
a = [1, 2, 3]
b = a.copy()
c = list(a)

print(a == b)
print(a is b)
print(a == c)
print(a is c)
```

Output:

```text
True
False
True
False
```

`==` compares values, while `is` compares identity. Copies are equal in value but distinct objects.

### Nested lists and shared rows

A shallow copy duplicates only the outer list. Nested objects are still shared. A common bug comes from multiplying a list that contains a list:

```python
grid = [[0] * 3] * 3
grid[0][0] = 1

print(grid)
```

Output:

```text
[[1, 0, 0], [1, 0, 0], [1, 0, 0]]
```

`[[0] * 3] * 3` creates one inner list and repeats three references to it. Changing one row changes all three because there is only one row object.

Build each row separately:

```python
grid = []
for row in range(3):
    grid.append([0] * 3)

grid[0][0] = 1
print(grid)
```

Output:

```text
[[1, 0, 0], [0, 0, 0], [0, 0, 0]]
```

Each `[0] * 3` creates a fresh inner list. The outer list now holds three distinct rows.

### Shallow copies still share nested objects

Slicing and `.copy()` are shallow. They copy the outer list but not the objects inside it:

```python
original = [[1, 2], [3, 4]]
copied = original[:]

copied[0][0] = 9

print(original)
print(copied)
```

Output:

```text
[[9, 2], [3, 4]]
[[9, 2], [3, 4]]
```

Both outer lists are distinct, but `original[0]` and `copied[0]` refer to the same inner list. Module 7 introduces `copy.deepcopy` for recursively independent copies.

### Immutable values

Immutable objects cannot be changed in place:

```python
text = "cat"
# text[0] = "b" raises TypeError.

point = (1, 2)
# point[0] = 3 raises TypeError.
```

Reassigning the name is allowed:

```python
text = "cat"
text = text.upper()
print(text)
```

Output:

```text
CAT
```

`text.upper()` creates a new string, and the name is rebound to it. The original string is unchanged.

### Mutable arguments

Because lists are mutable, a function that changes a list argument changes the caller's list:

```python
def add_item(items):
    items.append("new")


values = ["old"]
add_item(values)
print(values)
```

Output:

```text
['old', 'new']
```

The function receives a reference to the same list. If a function should not affect the caller, pass a copy or build and return a new list.

## Common Pitfalls & Anti-Patterns
- **Thinking `b = a` copies a list**: It creates another name for the same object.
- **Creating a grid with `[[0] * 3] * 3`**: Every row refers to the same inner list.
- **Expecting a shallow copy to isolate nested lists**: Only the outer list is copied.
- **Using `is` to compare values**: Use `==` for equality and `is` for identity.
- **Trying to mutate a string or tuple in place**: They are immutable; create a new value instead.
- **Forgetting that functions can mutate list arguments**: Pass a copy if the caller's data must stay unchanged.
- **Assuming reassignment changes aliases**: Rebinding a name does not mutate the old object.
- **Using `.copy()` when a deep copy is required**: Nested objects remain shared; Module 7 covers `copy.deepcopy`.
- **Confusing equal values with the same object**: Two lists can be equal without being identical.

## Quick Summary
- Mutable: lists, dictionaries, sets. Immutable: numbers, strings, tuples, booleans, `None`.
- Assignment binds a name to an object; it does not copy.
- Two names can refer to the same mutable object, which is aliasing.
- `a[:]`, `a.copy()`, and `list(a)` make shallow copies.
- `==` compares values; `is` compares identity.
- `[[0] * 3] * 3` shares one inner row; build rows separately.
- Shallow copies share nested objects.
- Rebinding a name does not mutate the original object.
- Functions can mutate mutable arguments.
