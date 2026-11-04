---
id: "py-les-for-loops-and-range"
type: "theory"
title: "For Loops and range"
moduleId: "py-mod-04-loops"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "loops", "for", "range"]
---

# Concept Overview

A `for` loop runs its block once for each item in an iterable. A string is an iterable of characters, so a `for` loop can visit each letter in order. `range` is an iterable of integers, so a `for` loop can also run a fixed number of times.

`range` takes up to three arguments: a start, a stop, and a step. The stop value is never included. That single rule explains most off-by-one errors with loops.

## Key Principles & Frameworks

### Iterating over a string

```python
for letter in "Python":
    print(letter)
```

Output:

```text
P
y
t
h
o
n
```

On each pass, the next character is assigned to `letter`, and the indented block runs. When the string runs out, the loop ends. The loop variable does not have to be called `letter`; choose a name that describes one item.

The loop variable still exists after the loop finishes:

```python
for number in range(3):
    print(number)

print(f"After the loop, number is {number}")
```

Output:

```text
0
1
2
After the loop, number is 2
```

It holds the last value it received. Code that runs after the loop should not assume the name is undefined, but it also should not rely on that leftover value for new logic without setting it first.

### range with one argument

`range(stop)` starts at `0` and stops before `stop`:

```python
for number in range(5):
    print(number)
```

Output:

```text
0
1
2
3
4
```

Five values are printed: `0`, `1`, `2`, `3`, and `4`. There is no `5`. The stop value is an exclusive upper bound.

### range with start and stop

`range(start, stop)` begins at `start` and stops before `stop`:

```python
for number in range(2, 6):
    print(number)
```

Output:

```text
2
3
4
5
```

The number of values is `stop - start`, which is `4` here. If `stop` is less than or equal to `start` and the step is positive, the range is empty and the loop body never runs:

```python
for number in range(5, 0):
    print(number)

print("Done")
```

Output:

```text
Done
```

An empty range is not an error. It simply produces no iterations.

### range with a step

The third argument is the step. A positive step counts upward:

```python
for number in range(0, 10, 2):
    print(number)
```

Output:

```text
0
2
4
6
8
```

A negative step counts downward:

```python
for number in range(10, 0, -2):
    print(number)
```

Output:

```text
10
8
6
4
2
```

With a negative step, `start` must be greater than `stop`. `range(0, 10, -1)` is empty because counting down from `0` can never reach `10`.

A step of zero is invalid:

```python
# range(0, 10, 0) raises ValueError.
```

### range objects are lazy

`range` does not build all its numbers in memory at once. It produces them as the loop asks for them. Printing a range shows its parameters rather than its values:

```python
print(range(5))
print(range(2, 10, 3))
```

Output:

```text
range(0, 5)
range(2, 10, 3)
```

The loop is what drives the sequence. This makes `range` efficient even for very large values.

### Avoiding off-by-one errors

Because the stop value is excluded, the loop that prints `1` through `5` is:

```python
for number in range(1, 6):
    print(number)
```

Output:

```text
1
2
3
4
5
```

Using `range(1, 5)` would stop at `4`. A reliable formula for inclusive bounds is `range(first, last + 1)`.

The same rule applies with a step. `range(1, 10, 2)` produces `1`, `3`, `5`, `7`, and `9`. To include `10` in a list of even numbers, you would use `range(2, 11, 2)`.

### Iterating by index

Sometimes you need the position of each character as well as the character itself. A `for` loop can iterate over positions from `range(len(text))`:

```python
text = "cat"

for index in range(len(text)):
    print(f"{index}: {text[index]}")
```

Output:

```text
0: c
1: a
2: t
```

This works, but it is more complex than it needs to be when the index is not required. Prefer direct iteration:

```python
text = "cat"

for character in text:
    print(character)
```

Output:

```text
c
a
t
```

Use `range(len(text))` only when the index is part of the result. Module 6 introduces `enumerate`, which provides both the index and the value without manual indexing.

## Common Pitfalls & Anti-Patterns
- **Expecting the stop value to be included**: `range(5)` produces `0` through `4`.
- **Using the wrong inclusive bound**: For `1` through `5`, use `range(1, 6)`.
- **Miscounting with a step**: `range(0, 10, 3)` produces `0`, `3`, `6`, and `9`, not `0`, `3`, `6`, `9`, and `12`.
- **Counting the wrong direction**: A negative step needs `start > stop`, and a positive step needs `start < stop`.
- **Using a zero step**: `range(0, 10, 0)` raises `ValueError`.
- **Using non-integer arguments**: `range(1.5, 5)` raises `TypeError`.
- **Using `range(len(text))` when direct iteration is simpler**: Let the string provide its characters unless you need indexes.
- **Assuming the loop variable disappears**: It keeps its last value after the loop.
- **Changing the loop variable inside the body**: The next iteration overwrites it. Use a separate accumulator or counter instead.

## Quick Summary
- `for` runs a block once per item in an iterable.
- Strings yield their characters one at a time.
- `range(stop)` counts from `0` up to but not including `stop`.
- `range(start, stop)` and `range(start, stop, step)` control the bounds and direction.
- The stop value is always excluded.
- `range` objects are lazy and produce values on demand.
- Prefer direct iteration over a string; use `range(len(text))` only when indexes are needed.
