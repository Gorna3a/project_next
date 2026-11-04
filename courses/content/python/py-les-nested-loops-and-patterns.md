---
id: "py-les-nested-loops-and-patterns"
type: "theory"
title: "Nested Loops and Pattern Building"
moduleId: "py-mod-04-loops"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "loops", "nested-loops", "patterns", "accumulators"]
---

# Concept Overview

A nested loop is a loop inside another loop. The outer loop controls the rows, and the inner loop controls the items within each row. Nested loops are the standard way to build grids, tables, and text patterns.

The other essential loop skill is combining results. A counter records how many times something happened, and an accumulator builds a running total. Together with nested loops, they turn repetition into useful data.

## Key Principles & Frameworks

### How nested loops execute

For every single pass of the outer loop, the inner loop runs completely:

```python
for row in range(1, 4):
    for column in range(1, 4):
        print(f"row {row}, column {column}")
```

Output:

```text
row 1, column 1
row 1, column 2
row 1, column 3
row 2, column 1
row 2, column 2
row 2, column 3
row 3, column 1
row 3, column 2
row 3, column 3
```

The outer loop runs three times. Each time, the inner loop runs three times, for nine lines total. The inner loop starts over from its first value on every outer pass.

### Building a grid

Printing without a newline lets the inner loop build one row:

```python
for row in range(1, 4):
    for column in range(1, 4):
        if column > 1:
            print(" ", end="")
        print(f"{row * column:2}", end="")
    print()
```

Output:

```text
 1  2  3
 2  4  6
 3  6  9
```

The `print(..., end="")` keeps the cursor on the same line. The empty `print()` after the inner loop moves to the next row. This combination is the core of every text grid.

### Triangles: letting the inner range depend on the outer variable

A triangle changes the number of inner repetitions for each row. Use the outer variable as part of the inner range:

```python
for row in range(1, 6):
    for star in range(row):
        print("*", end="")
    print()
```

Output:

```text
*
**
***
****
*****
```

Row `1` runs the inner loop once, row `2` runs it twice, and so on. The inner `range(row)` is what creates the growing width.

The same shape can hold numbers:

```python
for row in range(1, 5):
    for column in range(1, row + 1):
        if column > 1:
            print(" ", end="")
        print(column, end="")
    print()
```

Output:

```text
1
1 2
1 2 3
1 2 3 4
```

The outer loop controls how many numbers appear. The inner loop prints `1` through `row`.

### Counters

A counter starts at a known value, usually zero, and increments when a condition is met:

```python
count = 0

for number in range(1, 21):
    if number % 3 == 0:
        count += 1

print(count)
```

Output:

```text
6
```

The multiples of `3` from `1` to `20` are `3`, `6`, `9`, `12`, `15`, and `18`. The counter records that there are six of them.

### Accumulators

An accumulator combines each value into a running result. For a sum, start at `0` and add:

```python
total = 0

for number in range(1, 11):
    total += number

print(total)
```

Output:

```text
55
```

For a product, start at `1` and multiply. Starting a product at `0` would make every result `0`:

```python
product = 1

for number in range(1, 6):
    product *= number

print(product)
```

Output:

```text
120
```

The starting value is the identity for the operation: `0` for addition, `1` for multiplication.

### Accumulating across nested loops

An accumulator can live outside both loops and collect from every inner pass:

```python
total = 0

for row in range(1, 4):
    for column in range(1, 4):
        total += row * column

print(total)
```

Output:

```text
36
```

The outer loop runs three times, and the inner loop runs three times per row. The accumulator adds all nine products: `1 + 2 + 3 + 2 + 4 + 6 + 3 + 6 + 9`, which is `36`.

If the accumulator were reset inside the outer loop, each row's total would overwrite the previous one. Placement matters.

### Common pattern shapes

| Pattern | Shape | Typical use |
| :--- | :--- | :--- |
| Counter | `count += 1` inside a condition | Counting matches |
| Sum accumulator | `total += value` | Adding a series |
| Product accumulator | `product *= value` | Multiplying a series |
| Grid | Outer rows, inner columns | Tables and coordinates |
| Triangle | Inner range depends on the outer variable | Star and number patterns |
| Running text | `end=""` inside, `print()` after | One line built from parts |

### Choosing direct iteration

When the loop only needs values, iterate the iterable directly:

```python
text = "abc"

for character in text:
    print(character)
```

Output:

```text
a
b
c
```

Use `range(len(text))` only when the index itself is needed:

```python
text = "abc"

for index in range(len(text)):
    print(f"{index}: {text[index]}")
```

Output:

```text
0: a
1: b
2: c
```

The indexed version is longer and easier to get wrong. Direct iteration states the intent more clearly.

## Common Pitfalls & Anti-Patterns
- **Resetting an accumulator inside the outer loop**: The total starts over on every row and earlier values are lost. Initialize it before the outer loop.
- **Forgetting the newline after a row**: The whole grid prints on one line. Call `print()` after the inner loop.
- **Printing a newline inside the inner loop**: Each item lands on its own line, so no row is formed.
- **Using the wrong inner range**: A triangle needs `range(row)` or `range(1, row + 1)`, not a fixed range.
- **Starting a product at zero**: Every product becomes zero. Start at `1`.
- **Expecting `break` to exit both loops**: It exits only the inner loop. Use a flag or restructure the code.
- **Confusing row and column variables**: Name them for their roles so the pattern stays readable.
- **Using `range(len(text))` unnecessarily**: Iterate the string directly unless indexes are required.
- **Nesting too deeply**: More than two or three levels is hard to follow. Extract repeated work into a function once Module 5 introduces them.

## Quick Summary
- The inner loop runs completely for each pass of the outer loop.
- Use `end=""` to build a line and an empty `print()` to end a row.
- Triangles use an inner range that depends on the outer variable.
- Counters start at `0` and increment on matches.
- Sum accumulators start at `0`; product accumulators start at `1`.
- Initialize accumulators before the loops, not inside them.
- Prefer direct iteration over `range(len(...))` unless indexes are needed.
