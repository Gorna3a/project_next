---
id: "py-rev-iteration-and-functional-tools"
type: "review"
title: "Iteration & Functional Tools Quick Reference"
moduleId: "py-mod-10-iteration-and-functional-tools"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-lambdas-and-key-functions", "py-les-comprehensions", "py-les-iterators-and-iterables", "py-les-generators-and-generator-expressions", "py-ws-data-pipeline", "py-lab-lazy-sequences"]
tags: ["python", "iteration", "comprehensions", "generators", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| `lambda` | Anonymous single-expression function | `lambda x: x * 2` |
| `key=` | Function used to derive a sort or comparison value | `sorted(words, key=len)` |
| `map` | Applies a function to every item and returns an iterator | `map(str.upper, words)` |
| `filter` | Keeps items that pass a test and returns an iterator | `filter(None, values)` |
| `reduce` | Combines all items into one value | `reduce(add, values, 0)` |
| List comprehension | Builds a list from an expression and loop | `[x * x for x in numbers]` |
| Dict comprehension | Builds a dictionary from key-value pairs | `{word: len(word) for word in words}` |
| Set comprehension | Builds a set and removes duplicates | `{x * x for x in numbers}` |
| Filtering `if` | Keeps items after the `for` clause | `[x for x in numbers if x > 0]` |
| `if` expression | Chooses a value before the `for` clause | `["even" if x % 2 == 0 else "odd" for x in numbers]` |
| Iterable | Object that supports `iter()` | Lists, strings, generators |
| Iterator | Object that produces values with `next()` | `iter(numbers)` |
| `iter()` | Returns an iterator for an iterable | `iterator = iter(numbers)` |
| `next()` | Returns the next value from an iterator | `next(iterator)` |
| `StopIteration` | Exception that ends iteration | Raised by `__next__` |
| `__iter__` | Returns an iterator | `def __iter__(self): return self` |
| `__next__` | Returns the next value | `def __next__(self): ...` |
| Generator function | Function containing `yield` | `def count_up(limit):` |
| `yield` | Produces a value and pauses the function | `yield current` |
| `yield from` | Delegates to another iterable | `yield from row` |
| Generator expression | Lazy version of a comprehension | `(x * x for x in numbers)` |
| `itertools.chain` | Yields items from several iterables in order | `chain(a, b)` |
| `itertools.islice` | Yields a slice of an iterable | `islice(source, 3)` |
| `itertools.groupby` | Groups consecutive equal keys | `groupby(rows, key=...)` |
| `itertools.product` | Cartesian product of iterables | `product("ab", "12")` |

## Key Concepts Comparison
- **Iterable vs. iterator**: An iterable can be looped over and may be reused. An iterator produces values once and remembers its position.
- **`iter(iterable)` vs. `iter(iterator)`**: The first creates a new iterator. The second returns the same iterator.
- **List comprehension vs. generator expression**: A comprehension builds the full list immediately. A generator expression produces values lazily.
- **`map`/`filter` vs. comprehension**: `map` and `filter` return lazy iterators. Comprehensions are often clearer for short expressions.
- **`lambda` vs. `def`**: A lambda is one expression with no name. A `def` can have statements, a docstring, and a useful traceback name.
- **Filtering `if` vs. `if` expression**: A trailing `if` filters items. A leading `if ... else` changes the value of every item.
- **Single-use iterator vs. reusable iterable**: Return `self` from `__iter__` for a single-use iterator. Return a separate iterator object for repeated use.
- **Generator vs. list**: A generator saves memory and computes lazily. A list supports indexing, length, and repeated iteration.
- **`yield` vs. `return`**: `yield` pauses and resumes. `return` ends the function.
- **`yield from` vs. a manual loop**: `yield from` delegates to another iterable and handles nested generators correctly.
- **`chain` vs. concatenation**: `chain` is lazy and works with any iterables. List concatenation builds a new list.
- **`islice` vs. slicing**: `islice` works on any iterable, including generators. Slicing requires a sequence.
- **`groupby` vs. grouping into a dictionary**: `groupby` only groups consecutive items and requires sorted input. A dictionary grouping collects all items.
- **`product` vs. nested loops**: `product` yields tuples and is useful for combinations and test cases.

## Critical Syntax / Templates
```python
# Lambda and key function
words = ["banana", "apple", "cherry"]
print(sorted(words, key=len))
print(sorted(words, key=lambda word: word[-1]))
```

```python
# map, filter, and reduce
from functools import reduce

numbers = [1, 2, 3, 4]
print(list(map(lambda number: number * 2, numbers)))
print(list(filter(lambda number: number % 2 == 0, numbers)))
print(reduce(lambda total, number: total + number, numbers))
```

```python
# List, dictionary, and set comprehensions
numbers = [1, 2, 2, 3]
print([number * number for number in numbers])
print({number: number * number for number in numbers})
print({number * number for number in numbers})
```

```python
# Filtering and if expressions
numbers = [1, 2, 3, 4]
print([number for number in numbers if number % 2 == 0])
print(["even" if number % 2 == 0 else "odd" for number in numbers])
```

```python
# Nested comprehension
matrix = [[1, 2], [3, 4]]
print([value for row in matrix for value in row])
```

```python
# Iterator protocol
numbers = [10, 20, 30]
iterator = iter(numbers)
print(next(iterator))
print(next(iterator, "done"))
```

```python
# Custom iterator
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

```python
# Generator function and generator expression
def count_up(limit):
    current = 0
    while current < limit:
        yield current
        current += 1


print(list(count_up(4)))
print(sum(number * number for number in range(4)))
```

```python
# yield from and a generator pipeline
def flatten(matrix):
    for row in matrix:
        yield from row


def doubled(source):
    for value in source:
        yield value * 2


print(list(flatten([[1, 2], [3, 4]])))
print(list(doubled(flatten([[1, 2], [3, 4]]))))
```

```python
# itertools essentials
import itertools

print(list(itertools.chain([1, 2], [3, 4])))
print(list(itertools.islice(range(10), 3)))
print(list(itertools.product("ab", "12")))

rows = [("a", 1), ("a", 2), ("b", 3)]
for key, group in itertools.groupby(rows, key=lambda row: row[0]):
    print(key, list(group))
```

```text
# groupby requires sorted input by the same key
```
