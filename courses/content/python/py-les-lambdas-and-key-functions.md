---
id: "py-les-lambdas-and-key-functions"
type: "theory"
title: "Lambdas and Key Functions"
moduleId: "py-mod-10-iteration-and-functional-tools"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "lambda", "sorted", "map", "filter"]
---

# Concept Overview

A lambda is a small anonymous function written as a single expression. It is useful when a function is needed for a short time, such as a key function for sorting or a transformation passed to another function. Python also provides `map`, `filter`, and `functools.reduce` for applying functions to collections.

These tools are most useful for short, clear operations. When the logic grows beyond one expression, a named function with `def` is easier to read and test.

## Key Principles & Frameworks

### Lambda syntax

A lambda has parameters, a colon, and one expression. The expression's value is returned automatically:

```python
double = lambda value: value * 2
print(double(5))
print((lambda a, b: a + b)(3, 4))
```

Output:

```text
10
7
```

A lambda cannot contain statements, assignments, or multiple lines. It is limited to one expression. If you need more, use `def`.

### Do not assign lambdas to names

Assigning a lambda to a name is usually a mistake:

```python
# Avoid:
# double = lambda value: value * 2

# Prefer:
def double(value):
    return value * 2


print(double(5))
```

Output:

```text
10
```

A `def` gives the function a real name, a docstring, and a traceback-friendly name. Use `lambda` only where a function is passed directly and used once.

### Key functions for sorting

`sorted()` and `list.sort()` accept a `key` function. Python calls it once for each item and sorts by the returned value:

```python
words = ["banana", "apple", "cherry"]
print(sorted(words, key=len))
print(sorted(words, key=lambda word: word[-1]))
```

Output:

```text
['apple', 'banana', 'cherry']
['banana', 'apple', 'cherry']
```

The first call sorts by word length. The second sorts by the last letter. The key function receives one item and returns a comparable value.

`min()` and `max()` accept the same `key` argument:

```python
scores = {"Ana": 92, "Ben": 78, "Chen": 88}
print(min(scores, key=scores.get))
print(max(scores, key=scores.get))
```

Output:

```text
Ben
Ana
```

`min` and `max` compare the key values, then return the original item. Here the items are dictionary keys.

### Sorting in place

`list.sort()` sorts the list itself and returns `None`. `sorted()` returns a new list:

```python
numbers = [3, 1, 4, 1, 5]
numbers.sort(key=lambda number: -number)
print(numbers)
print(sorted([3, 1, 4], key=lambda number: -number))
```

Output:

```text
[5, 4, 3, 1, 1]
[4, 3, 1]
```

Use `sorted()` when you need the original order. Use `list.sort()` when you can replace the list.

### map transforms each item

`map(function, iterable)` applies a function to every item and returns an iterator:

```python
numbers = [1, 2, 3]
doubled = map(lambda number: number * 2, numbers)
print(list(doubled))
```

Output:

```text
[2, 4, 6]
```

`map` is lazy. It does not compute values until they are requested. Wrap it in `list()` when you need all results at once.

### filter keeps matching items

`filter(function, iterable)` keeps items for which the function returns a truthy value:

```python
numbers = [1, 2, 3, 4, 5]
evens = filter(lambda number: number % 2 == 0, numbers)
print(list(evens))
```

Output:

```text
[2, 4]
```

Like `map`, `filter` returns an iterator and computes values lazily.

### functools.reduce combines items

`reduce(function, iterable)` repeatedly applies a two-argument function to combine all items into one value:

```python
from functools import reduce

numbers = [1, 2, 3, 4]
print(reduce(lambda total, number: total + number, numbers))
print(reduce(lambda total, number: total + number, numbers, 10))
```

Output:

```text
10
20
```

The first call adds 1 + 2 + 3 + 4. The second starts with 10, then adds each number, producing 20. An optional third argument supplies the starting value.

### When to prefer comprehensions

`map` and `filter` are powerful, but a comprehension is often clearer:

```python
numbers = [1, 2, 3, 4]
print([number * 2 for number in numbers])
print([number for number in numbers if number % 2 == 0])
```

Output:

```text
[2, 4, 6, 8]
[2, 4]
```

Use `map` and `filter` when the transformation is already a named function. Use a comprehension when the expression is short and reads naturally.

## Common Pitfalls & Anti-Patterns
- **Assigning a lambda to a name**: Use `def` for reusable functions. A lambda has no docstring and a poor traceback name.
- **Writing a multi-statement lambda**: Lambdas hold one expression. Move complex logic into a named function.
- **Forgetting that `map` and `filter` return iterators**: Wrap them in `list()` when you need all values or need to iterate twice.
- **Using `map` or `filter` with a function that has side effects**: The lazy result may never run if you do not consume it.
- **Returning an incomparable key**: The key function must return values that support the comparison used by the sort.
- **Sorting by a key that is expensive**: The key function runs once per item, so keep it cheap.
- **Confusing `sorted()` with `list.sort()`**: `sorted()` returns a new list. `list.sort()` changes the list and returns `None`.
- **Forgetting the initial value in `reduce`**: An empty iterable without an initial value raises `TypeError`.
- **Overusing `reduce`**: A simple loop or `sum()` is often clearer than a clever reduction.
- **Using `lambda` where a built-in function already exists**: Prefer `str.lower` over `lambda value: value.lower()`.

## Quick Summary
- `lambda parameters: expression` creates a small anonymous function.
- Use `def` for reusable or multi-line functions.
- `sorted(iterable, key=...)` and `list.sort(key=...)` sort by a key function.
- `min()` and `max()` accept a `key` function.
- `map(function, iterable)` applies a function to every item and returns an iterator.
- `filter(function, iterable)` keeps items that pass a test and returns an iterator.
- `functools.reduce(function, iterable, start)` combines items into one value.
- Wrap lazy results in `list()` when you need all values.
- Comprehensions are often clearer than `map` and `filter`.
- Keep lambda expressions short and readable.
