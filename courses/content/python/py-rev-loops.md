---
id: "py-rev-loops"
type: "review"
title: "Loops Quick Reference"
moduleId: "py-mod-04-loops"
order: 7
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-for-loops-and-range", "py-les-while-loops", "py-les-break-continue-else", "py-les-nested-loops-and-patterns", "py-ws-fizzbuzz-and-friends", "py-lab-number-patterns"]
tags: ["python", "loops", "range", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| `for` | Runs a block once per item in an iterable | Visiting strings and ranges |
| `range(stop)` | Integers from `0` up to but not including `stop` | Fixed repetition |
| `range(start, stop)` | Integers from `start` up to but not including `stop` | Counting with a custom start |
| `range(start, stop, step)` | Same, advancing by `step` | Skipping or counting down |
| Stop exclusivity | The stop value is never produced | Avoiding off-by-one bugs |
| `while` | Repeats while a condition is truthy | Condition-driven repetition |
| Counter | A variable incremented on each match | Counting iterations or matches |
| Sentinel | A special value that ends a loop | Processing until a marker |
| `break` | Exits the nearest enclosing loop | Early search exit |
| `continue` | Skips the rest of the current iteration | Filtering items in place |
| Loop `else` | Runs after a normal finish, skipped by `break` | Search-and-report logic |
| `pass` | Does nothing | Placeholder for an empty block |
| Nested loop | A loop inside another loop | Rows, columns, and patterns |
| Accumulator | A running total or product | Summing or multiplying a series |
| Off-by-one | Including or excluding one value too many or too few | `range` bounds |
| Infinite loop | A loop whose condition never becomes false | Missing or wrong update |

## Key Concepts Comparison
- **`for` vs. `while`**: `for` visits an iterable or repeats a known count. `while` repeats while a condition holds and is better when the number of passes is unknown.
- **Stop-exclusive vs. inclusive**: `range(1, 5)` produces `1` through `4`. For `1` through `5`, use `range(1, 6)`.
- **Positive vs. negative step**: A positive step counts up and needs `start < stop`; a negative step counts down and needs `start > stop`.
- **`break` vs. `continue`**: `break` leaves the loop. `continue` skips only the current iteration and keeps looping.
- **Loop `else` vs. `if` `else`**: A loop `else` aligns with the loop and runs only after a normal finish. An `if` `else` belongs to its `if`.
- **`break` vs. `return`**: `break` exits one loop. `return` exits a function and is introduced in Module 5.
- **Counter vs. accumulator**: A counter increments by a fixed amount, usually `1`. An accumulator combines a changing value, such as `total += number`.
- **Direct iteration vs. `range(len(...))`**: Iterate the iterable directly when only values are needed. Use indexes only when positions matter.
- **`while` vs. `while True`**: A normal `while` expresses its exit in the header. `while True` is safe only when the body guarantees a `break`.

## Critical Syntax / Templates
```python
# for over a string
for character in "Python":
    print(character)

# range forms
for number in range(5):          # 0 1 2 3 4
    print(number)
for number in range(2, 6):       # 2 3 4 5
    print(number)
for number in range(0, 10, 2):   # 0 2 4 6 8
    print(number)
for number in range(10, 0, -2):  # 10 8 6 4 2
    print(number)

# while with a counter and accumulator
number = 1
total = 0
while number <= 10:
    total += number
    number += 1
print(total)

# sentinel loop
number = 20
while number != 0:
    print(number)
    number //= 2

# break
for number in range(1, 10):
    if number % 7 == 0:
        print(f"Found {number}")
        break

# continue
for number in range(1, 10):
    if number % 2 == 0:
        continue
    print(number)

# loop else
for number in range(2, 10):
    if number % 7 == 0:
        print(f"Found {number}")
        break
else:
    print("Not found")

# pass as a placeholder
for number in range(3):
    if number == 1:
        pass
    else:
        print(number)

# nested grid
for row in range(1, 4):
    for column in range(1, 4):
        print(f"({row},{column})", end=" ")
    print()

# growing star triangle
for row in range(1, 6):
    for star in range(row):
        print("*", end="")
    print()

# inverted star triangle
for row in range(5, 0, -1):
    for star in range(row):
        print("*", end="")
    print()

# counter pattern
count = 0
for number in range(1, 21):
    if number % 3 == 0:
        count += 1
print(count)
```
