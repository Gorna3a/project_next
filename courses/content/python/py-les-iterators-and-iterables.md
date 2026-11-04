---
id: "py-les-iterators-and-iterables"
type: "theory"
title: "Iterators and Iterables"
moduleId: "py-mod-10-iteration-and-functional-tools"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "iterators", "iterables", "iter", "next"]
---

# Concept Overview

An iterable is an object that can be looped over. A list, tuple, string, dictionary, set, file, and generator are all iterables. An iterator is the object that actually produces values one at a time. The `for` loop calls `iter()` to get an iterator, then calls `next()` repeatedly until the iterator raises `StopIteration`.

Understanding this protocol explains why some objects can be looped over more than once, why iterators are consumed, and how to write your own iterable or iterator.

## Key Principles & Frameworks

### iter() and next()

`iter()` returns an iterator for an iterable. `next()` asks that iterator for the next value:

```python
numbers = [10, 20, 30]
iterator = iter(numbers)

print(next(iterator))
print(next(iterator))
print(next(iterator))

try:
    print(next(iterator))
except StopIteration:
    print("No more items")
```

Output:

```text
10
20
30
No more items
```

Each `next()` advances the iterator. After the last value, `next()` raises `StopIteration`, which signals the end of the sequence.

### How a for loop works

A `for` loop is shorthand for the iterator protocol:

```python
numbers = [10, 20, 30]
iterator = iter(numbers)

while True:
    try:
        value = next(iterator)
    except StopIteration:
        break
    print(value)
```

Output:

```text
10
20
30
```

The loop calls `iter()` once, then `next()` until `StopIteration`. This is why any object that supports the protocol can be used in a `for` loop.

### Iterables can be looped over again

An iterable creates a fresh iterator each time:

```python
numbers = [1, 2, 3]

print(*numbers)

print(*numbers)
```

Output:

```text
1 2 3
1 2 3
```

A list is iterable but not an iterator. Each `for` loop calls `iter(numbers)` and gets a new iterator starting at the beginning.

### An iterator is consumed once

An iterator remembers its position and cannot be restarted:

```python
numbers = [1, 2, 3]
iterator = iter(numbers)

print(list(iterator))
print(list(iterator))
```

Output:

```text
[1, 2, 3]
[]
```

The first `list()` consumes the iterator. The second call finds no values left. Create a new iterator with `iter(numbers)` to loop again.

### Strings and dictionaries are iterables

Strings yield one character at a time. Dictionaries yield their keys by default:

```python
print(*"abc")

student = {"name": "Ana", "score": 92}
print(*student)
```

Output:

```text
a b c
name score
```

Use `student.values()` or `student.items()` when you need values or key-value pairs.

### Writing an iterable class

An object is iterable when its `__iter__` method returns an iterator. A simple pattern is to return `self` and implement `__next__`:

```python
class CountUp:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.limit:
            raise StopIteration
        value = self.current
        self.current += 1
        return value


print(list(CountUp(4)))
```

Output:

```text
[0, 1, 2, 3]
```

`CountUp` is both an iterable and an iterator. Because `__iter__` returns `self`, it can be used once. Calling `list()` again on the same object returns an empty list.

### Separating iterable and iterator

A reusable iterable returns a new iterator object each time `__iter__` is called:

```python
class NumberRange:
    def __init__(self, start, stop):
        self.start = start
        self.stop = stop

    def __iter__(self):
        return NumberRangeIterator(self.start, self.stop)


class NumberRangeIterator:
    def __init__(self, start, stop):
        self.current = start
        self.stop = stop

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        value = self.current
        self.current += 1
        return value


numbers = NumberRange(1, 4)
print(list(numbers))
print(list(numbers))
```

Output:

```text
[1, 2, 3]
[1, 2, 3]
```

`NumberRange` can be looped over many times because each call to `iter()` creates a fresh `NumberRangeIterator`.

### Detecting an iterator

An object is an iterator if it has a `__next__` method. `iter()` on an iterator returns the same object:

```python
numbers = [1, 2, 3]
iterator = iter(numbers)

print(iterator is iter(iterator))
print(hasattr(iterator, "__next__"))
```

Output:

```text
True
True
```

This is why an iterator cannot be restarted: `iter()` does not create a new one.

## Common Pitfalls & Anti-Patterns
- **Consuming an iterator twice**: The second loop sees no values. Create a new iterator or store the values in a list.
- **Confusing iterables and iterators**: A list is iterable; `iter(list)` returns an iterator. Only iterators have `__next__`.
- **Forgetting `StopIteration`**: A custom `__next__` must raise `StopIteration` when there are no more values.
- **Raising `StopIteration` inside a generator function**: In Python 3.7+, this becomes `RuntimeError`. Use `return` instead.
- **Modifying a list while iterating over it**: This can skip items or raise `RuntimeError`. Build a new list instead.
- **Assuming `next()` has a default**: `next(iterator)` raises `StopIteration` at the end. Use `next(iterator, default)` to supply a fallback.
- **Implementing `__iter__` without returning an iterator**: `__iter__` must return an object with `__next__`.
- **Returning a different object from `__iter__` without implementing `__next__` on it**: The returned object must support the protocol.
- **Using an iterator after it is exhausted**: It stays exhausted. There is no reset method.
- **Assuming dictionary iteration order is arbitrary**: Dictionaries preserve insertion order in Python 3.7 and later.

## Quick Summary
- An iterable supports `iter()` and can be looped over.
- An iterator produces values with `next()` and raises `StopIteration` at the end.
- `for` loops use `iter()` and `next()` internally.
- Iterables can be looped over many times.
- Iterators are consumed once.
- Strings yield characters; dictionaries yield keys by default.
- `__iter__` returns an iterator; `__next__` returns the next value.
- Returning `self` from `__iter__` makes a single-use iterator.
- Returning a separate iterator object allows repeated iteration.
- `iter(iterator)` returns the same iterator.
- Use `next(iterator, default)` to avoid `StopIteration`.
- Do not modify a collection while iterating over it.
- Raise `StopIteration` only from `__next__`, not from a generator.
