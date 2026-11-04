---
id: "py-les-comprehensions"
type: "theory"
title: "Comprehensions"
moduleId: "py-mod-10-iteration-and-functional-tools"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "comprehensions", "lists", "dicts", "sets"]
---

# Concept Overview

A comprehension builds a new collection by transforming and filtering items from an existing iterable. Python supports list, dictionary, and set comprehensions. They are often shorter and clearer than an explicit loop with `append`, and they keep the transformation and the source collection in one place.

Comprehensions should stay readable. A comprehension with several conditions and nested loops can become harder to understand than a normal loop.

## Key Principles & Frameworks

### List comprehensions

A list comprehension has an expression, a `for` clause, and an optional `if` clause:

```python
numbers = [1, 2, 3, 4]
squares = [number * number for number in numbers]
print(squares)
```

Output:

```text
[1, 4, 9, 16]
```

The expression comes first, then the loop. The result is a new list.

### Filtering with if

An `if` at the end keeps only items that pass the test:

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = [number for number in numbers if number % 2 == 0]
print(evens)
```

Output:

```text
[2, 4, 6]
```

The `if` filters; it does not change the value. Use an `if` expression when the value itself should change.

### if expressions

An `if` expression can choose between two values:

```python
numbers = [1, 2, 3, 4]
labels = ["even" if number % 2 == 0 else "odd" for number in numbers]
print(labels)
```

Output:

```text
['odd', 'even', 'odd', 'even']
```

The `if ... else ...` comes before the `for`. This is different from a filtering `if`, which comes after the `for`.

### Dictionary comprehensions

A dictionary comprehension builds a dictionary from key-value pairs:

```python
words = ["apple", "banana", "cherry"]
lengths = {word: len(word) for word in words}
print(lengths)
```

Output:

```text
{'apple': 5, 'banana': 6, 'cherry': 6}
```

The expression before `for` is `key: value`. If two items produce the same key, the later value replaces the earlier one.

### Set comprehensions

A set comprehension builds a set and removes duplicates:

```python
numbers = [1, 2, 2, 3, 3, 3]
unique_squares = {number * number for number in numbers}
print(sorted(unique_squares))
```

Output:

```text
[1, 4, 9]
```

Sets have no order, so the example sorts the result for a stable display. Set comprehensions are useful for collecting unique transformed values.

### Nested loops

A comprehension can contain more than one `for` clause. The loops run left to right, like nested loops:

```python
matrix = [[1, 2], [3, 4]]
flattened = [value for row in matrix for value in row]
print(flattened)
```

Output:

```text
[1, 2, 3, 4]
```

The first `for` is the outer loop and the second is the inner loop. Reversing the order changes the result.

### Cartesian products

Nested comprehensions can build combinations:

```python
pairs = [(x, y) for x in [1, 2] for y in ["a", "b"]]
print(pairs)
```

Output:

```text
[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

Each combination of `x` and `y` becomes one item. The leftmost `for` changes slowest.

### Filtering nested results

A condition can apply to the inner loop or to a combined result:

```python
matrix = [[1, 2], [3, 4], [5, 6]]
large_values = [value for row in matrix for value in row if value > 3]
print(large_values)
```

Output:

```text
[4, 5, 6]
```

The `if` filters the final value. Keep the order of clauses the same as the equivalent nested loops.

### Readability comes first

Comprehensions are best when the expression and loop are short. An explicit loop is clearer when the logic involves multiple steps, side effects, or several conditions:

```python
# Clear as a comprehension:
squares = [number * number for number in range(5)]

# Clearer as a loop:
results = []
for number in range(5):
    value = number * number
    if value % 2 == 0:
        results.append(value)
```

If you have to read a comprehension twice to understand it, rewrite it as a loop.

## Common Pitfalls & Anti-Patterns
- **Overly nested comprehensions**: More than two `for` clauses or several conditions becomes hard to read. Use a loop.
- **Confusing filtering `if` with an `if` expression**: `if` after `for` filters items. `if ... else` before `for` changes each value.
- **Forgetting that a comprehension builds a full list**: A list comprehension creates every item immediately. Use a generator expression for lazy evaluation.
- **Shadowing an outer variable**: In Python 3 the loop variable stays inside the comprehension, but reusing a name can still confuse readers. Choose clear names.
- **Building a dictionary with duplicate keys**: Later values overwrite earlier ones silently.
- **Assuming set order**: Sets are unordered. Sort the result when order matters.
- **Adding side effects**: A comprehension should build a value, not print, append to an outer list, or mutate state.
- **Using a comprehension when a generator is enough**: For a single pass over large data, a generator expression avoids building a list.
- **Writing a comprehension that is longer than the equivalent loop**: Shorter is not always clearer.
- **Forgetting parentheses for a generator expression**: `(n * n for n in numbers)` is a generator; `[n * n for n in numbers]` is a list.

## Quick Summary
- List comprehensions build lists: `[expression for item in iterable]`.
- A trailing `if` filters items.
- An `if ... else` before `for` chooses a value for each item.
- Dictionary comprehensions build `{key: value for item in iterable}`.
- Set comprehensions build `{expression for item in iterable}` and remove duplicates.
- Multiple `for` clauses nest left to right.
- Comprehensions should stay short and side-effect free.
- Use a generator expression when you only need one pass and want lazy evaluation.
- Use an explicit loop when readability suffers.
- Sets have no guaranteed order.
