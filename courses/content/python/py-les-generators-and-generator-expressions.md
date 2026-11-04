---
id: "py-les-generators-and-generator-expressions"
type: "theory"
title: "Generators and Generator Expressions"
moduleId: "py-mod-10-iteration-and-functional-tools"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "generators", "yield", "generator-expressions", "lazy-evaluation"]
---

# Concept Overview

A generator produces values one at a time instead of building a full list. A generator function contains `yield`; calling it returns a generator object that implements the iterator protocol. A generator expression is the lazy version of a list comprehension.

Generators are useful for large or infinite sequences, pipelines, and any case where you only need one value at a time. Their cost is that they can be consumed only once and do not support indexing or length.

## Key Principles & Frameworks

### Generator functions

A function with `yield` is a generator function. Calling it does not run its body; it returns a generator object:

```python
def count_up(limit):
    current = 0
    while current < limit:
        yield current
        current += 1


generator = count_up(4)
print(next(generator))
print(next(generator))
print(list(generator))
```

Output:

```text
0
1
[2, 3]
```

The first two `next()` calls run the function until the first two `yield` statements. `list()` consumes the rest. After that, the generator is exhausted.

### Generators are iterators

A generator implements `__iter__` and `__next__`, so it works in `for` loops and with `next()`:

```python
def count_up(limit):
    current = 0
    while current < limit:
        yield current
        current += 1


print(*count_up(4))
```

Output:

```text
0 1 2 3
```

Each loop iteration resumes the generator where it left off.

### Generators are consumed once

After a generator is exhausted, it stays exhausted:

```python
def count_up(limit):
    current = 0
    while current < limit:
        yield current
        current += 1


generator = count_up(3)
print(list(generator))
print(list(generator))
```

Output:

```text
[0, 1, 2]
[]
```

If you need the values again, create a new generator or store them in a list.

### Generator expressions

A generator expression looks like a list comprehension but uses parentheses:

```python
numbers = [1, 2, 3, 4]
squares = (number * number for number in numbers)

print(sum(squares))
print(list(squares))
```

Output:

```text
30
[]
```

`sum()` consumes the generator. The later `list()` finds no values left. Use parentheses around the expression when it is the only argument; otherwise the parentheses are required: `sum((n * n for n in numbers))`.

### Lazy evaluation

A generator computes each value only when requested. This is useful for large ranges:

```python
def squares(limit):
    for number in range(limit):
        yield number * number


generator = squares(1000000)
print(next(generator))
print(next(generator))
```

Output:

```text
0
1
```

Only the first two squares are computed. The rest are never generated. A list comprehension would create one million integers.

### yield from

`yield from` delegates to another iterable, yielding each of its values:

```python
def flatten(matrix):
    for row in matrix:
        yield from row


print(list(flatten([[1, 2], [3, 4], [5]])))
```

Output:

```text
[1, 2, 3, 4, 5]
```

`yield from row` is equivalent to a loop that yields each item, but it also handles nested generators and `send()` correctly. Use it to compose generators.

### Composing generators

Generators can be chained into a pipeline:

```python
def numbers():
    for value in range(1, 6):
        yield value


def doubled(source):
    for value in source:
        yield value * 2


def evens(source):
    for value in source:
        if value % 2 == 0:
            yield value


pipeline = doubled(evens(numbers()))
print(list(pipeline))
```

Output:

```text
[4, 8]
```

Each generator processes one value at a time. The whole pipeline uses little memory even for large inputs.

### Generator return values

A generator can use `return` to stop early. In Python 3, a `return value` in a generator raises `StopIteration` with that value, which is usually consumed by `yield from`:

```python
def first_three():
    for value in range(10):
        if value == 3:
            return
        yield value


print(list(first_three()))
```

Output:

```text
[0, 1, 2]
```

Use `return` to end generation. Do not raise `StopIteration` manually inside a generator.

### When not to use a generator

Generators do not support `len()`, indexing, or repeated iteration. If you need random access or a count, build a list. If you need to iterate several times, store the values.

## Common Pitfalls & Anti-Patterns
- **Consuming a generator twice**: The second use is empty. Create a new generator or convert to a list.
- **Calling `len()` on a generator**: Generators have no length. Count with `sum(1 for _ in generator)` if needed.
- **Indexing a generator**: Use `next()` repeatedly or convert to a list.
- **Raising `StopIteration` inside a generator**: Python turns this into `RuntimeError`. Use `return`.
- **Building a list when a generator is enough**: For a single pass, a generator expression saves memory.
- **Forgetting parentheses in a generator expression**: `sum(n * n for n in numbers)` works; `sum(n * n for n in numbers, 0)` does not because the comma belongs to `sum`.
- **Assuming a generator runs when created**: The body runs only when values are requested.
- **Mutating data while generating from it**: This can skip items or produce surprising values.
- **Using a generator for a small, reused collection**: A list is simpler when the data is small and needed more than once.
- **Hiding side effects in a generator**: Callers may never consume it, so side effects may never happen.

## Quick Summary
- A generator function contains `yield` and returns a generator object.
- Calling a generator function does not run its body.
- Generators implement the iterator protocol.
- Generators are consumed once.
- Generator expressions use parentheses and are lazy.
- `yield from` delegates to another iterable.
- Generators compute values only when requested.
- Generators do not support `len()`, indexing, or reuse.
- Use `return` to stop a generator early.
- Chain generators to build memory-efficient pipelines.
- Convert to a list when you need repeated access or a count.
- Keep side effects out of lazy generators unless consumption is guaranteed.
