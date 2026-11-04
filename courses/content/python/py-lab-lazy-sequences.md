---
id: "py-lab-lazy-sequences"
type: "lab"
title: "Lazy Sequences"
moduleId: "py-mod-10-iteration-and-functional-tools"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "generators", "iterators", "lazy-evaluation"]
---

# Objective

Write generator functions that produce values lazily. Each function should yield one value at a time instead of building a full list. The tests wrap your generators in `list(...)`.

Keep the implementations free of prompts and printed output.

## Requirements
- Define `count_up(start, stop)` that yields integers from `start` up to, but not including, `stop`.
- Define `running_total(numbers)` that yields the cumulative sum after each number.
- Define `take(iterable, count)` that yields at most the first `count` items from `iterable`.
- Define `unique_in_order(items)` that yields items while skipping consecutive duplicates.
- Define `flatten(nested)` that yields every item from every inner iterable. Use `yield from`.
- Do not build or return a list inside any generator.
- Do not print inside the functions.

## Starter State / Workspace
```python
# Define count_up, running_total, take, unique_in_order, and flatten below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "list(count_up(2, 6))", "expected": [2, 3, 4, 5], "message": "count_up should yield values from start to stop", "weight": 2, "required": true },
  { "type": "function-returns", "call": "list(count_up(0, 0))", "expected": [], "message": "An empty range should yield nothing", "required": true },
  { "type": "function-returns", "call": "list(count_up(5, 3))", "expected": [], "message": "A reversed range should yield nothing", "required": true },
  { "type": "function-returns", "call": "list(running_total([1, 2, 3, 4]))", "expected": [1, 3, 6, 10], "message": "running_total should yield each cumulative sum", "weight": 2, "required": true },
  { "type": "function-returns", "call": "list(running_total([]))", "expected": [], "message": "An empty input should yield nothing", "required": true },
  { "type": "function-returns", "call": "list(running_total([5]))", "expected": [5], "message": "A single value should yield itself", "required": true },
  { "type": "function-returns", "call": "list(take([10, 20, 30, 40], 2))", "expected": [10, 20], "message": "take should yield the first count items", "weight": 2, "required": true },
  { "type": "function-returns", "call": "list(take([10, 20], 5))", "expected": [10, 20], "message": "take should stop early at the end of the iterable", "required": true },
  { "type": "function-returns", "call": "list(take([10, 20, 30], 0))", "expected": [], "message": "A count of zero should yield nothing", "required": true },
  { "type": "function-returns", "call": "list(unique_in_order([1, 1, 2, 2, 2, 3, 1]))", "expected": [1, 2, 3, 1], "message": "unique_in_order should skip consecutive duplicates", "weight": 2, "required": true },
  { "type": "function-returns", "call": "list(unique_in_order([]))", "expected": [], "message": "An empty input should yield nothing", "required": true },
  { "type": "function-returns", "call": "list(unique_in_order([\"a\", \"a\", \"b\", \"a\"]))", "expected": ["a", "b", "a"], "message": "unique_in_order should work with strings", "required": true },
  { "type": "function-returns", "call": "list(flatten([[1, 2], [3], [4, 5]]))", "expected": [1, 2, 3, 4, 5], "message": "flatten should yield every nested item", "weight": 2, "required": true },
  { "type": "function-returns", "call": "list(flatten([]))", "expected": [], "message": "An empty input should yield nothing", "required": true },
  { "type": "function-returns", "call": "list(flatten([[], [1], []]))", "expected": [1], "message": "flatten should handle empty inner iterables", "required": true },
  { "type": "code-contains", "value": "yield", "message": "Use yield to make the functions generators", "required": true },
  { "type": "code-contains", "value": "yield from", "message": "Use yield from in flatten", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** `count_up` can use a `while` loop that yields `current` and then increments it. Stop when `current >= stop`.

> [!TIP]
> **Hint 2:** `running_total` keeps a `total` variable, adds each number, and yields the new total. `take` can call `iter(iterable)` and use `next()` inside a loop.

> [!TIP]
> **Hint 3:** `unique_in_order` remembers the previous value with a sentinel such as `None` or a unique object. Yield an item only when it differs from the previous one.

> [!TIP]
> **Hint 4:** `flatten` can loop over the outer iterable and use `yield from` on each inner iterable. This delegates the yielding to the inner sequence.

## Reference Solution
```python
def count_up(start, stop):
    current = start
    while current < stop:
        yield current
        current += 1


def running_total(numbers):
    total = 0
    for number in numbers:
        total += number
        yield total


def take(iterable, count):
    iterator = iter(iterable)
    collected = 0
    while collected < count:
        try:
            yield next(iterator)
        except StopIteration:
            return
        collected += 1


def unique_in_order(items):
    previous = object()
    for item in items:
        if item != previous:
            yield item
            previous = item


def flatten(nested):
    for group in nested:
        yield from group
```
