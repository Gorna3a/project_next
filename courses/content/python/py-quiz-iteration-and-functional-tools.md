---
id: "py-quiz-iteration-and-functional-tools"
type: "quiz"
title: "Iteration & Functional Tools Knowledge Check"
moduleId: "py-mod-10-iteration-and-functional-tools"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "iteration", "comprehensions", "generators", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which expression is a generator expression?

- [x] `(number * number for number in numbers)`
- [ ] `[number * number for number in numbers]`
- [ ] `{number * number for number in numbers}`
- [ ] `number * number for number in numbers`

*Explanation*: Parentheses create a generator expression. Square brackets create a list, and braces create a set.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
numbers = [1, 2, 3, 4]
result = [number for number in numbers if number % 2 == 0]
print(result)
```

- [x] `[2, 4]`
- [ ] `[1, 3]`
- [ ] `[True, False, True, False]`
- [ ] `[2, 4, 6, 8]`

*Explanation*: The trailing `if` filters the items. Only even numbers are kept.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
A generator can be consumed more than once.

- [ ] True
- [x] False

*Explanation*: A generator implements the iterator protocol and remembers its position. After it is exhausted, it stays empty.

---

## Question 4
<!-- meta: {"type":"multiple","points":2} -->
Which statements are true? Select all that apply.

- [x] `map` and `filter` return iterators
- [x] A list comprehension builds the full list immediately
- [x] `yield from` delegates to another iterable
- [ ] A generator supports `len()` and indexing
- [ ] A lambda can contain multiple statements

*Explanation*: `map` and `filter` are lazy. List comprehensions build all values at once. Generators do not support `len()` or indexing. A lambda holds one expression.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def count_up(limit):
    current = 0
    while current < limit:
        yield current
        current += 1


generator = count_up(3)
print(next(generator))
print(list(generator))
print(list(generator))
```

- [x] `0` then `[1, 2]` then `[]`
- [ ] `0` then `[0, 1, 2]` then `[0, 1, 2]`
- [ ] `0` then `[1, 2]` then `[1, 2]`
- [ ] It raises `StopIteration`

*Explanation*: The first `next()` consumes `0`. `list()` consumes the rest. The final `list()` finds the generator already exhausted.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
What does `itertools.groupby` require to group all equal keys together?

- [x] The input must be sorted by the same key first
- [ ] The input must be a list, not a generator
- [ ] The key function must return a string
- [ ] The groups are returned as dictionaries

*Explanation*: `groupby` only groups consecutive items with the same key. Sort the input by the same key before grouping.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import itertools

rows = [("a", 1), ("a", 2), ("b", 3)]
print([key for key, group in itertools.groupby(rows, key=lambda row: row[0])])
```

- [x] `['a', 'b']`
- [ ] `['a', 'a', 'b']`
- [ ] `[1, 2, 3]`
- [ ] It raises `TypeError`

*Explanation*: `groupby` yields one key per consecutive run. Here there are two runs: `a` and `b`.

---

## Question 8
<!-- meta: {"type":"single","points":1} -->
When should you prefer a generator over a list comprehension?

- [x] When you need one pass over a large sequence and want to save memory
- [ ] When you need to index the result repeatedly
- [ ] When you need to know the length without consuming it
- [ ] When you need to iterate over the result several times

*Explanation*: Generators compute values lazily and use little memory. Lists are better for repeated access, indexing, or length.
