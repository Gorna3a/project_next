---
id: "py-lab-number-patterns"
type: "lab"
title: "Number Patterns"
moduleId: "py-mod-04-loops"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 30
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "loops", "patterns", "nested-loops"]
---

# Objective

Print a growing number triangle and an inverted star triangle using nested loops, then report how many numbers were printed.

The expected output is:

```text
1
1 2
1 2 3
1 2 3 4
1 2 3 4 5

*****
****
***
**
*
Total numbers printed: 15
```

## Requirements
- Keep the provided `rows = 5` constant.
- Use a nested `for` loop to print the number triangle, with one row per outer iteration.
- Separate numbers with a single space, but do not print a trailing space at the end of a row.
- Count every printed number with `total += 1` inside the number loops.
- Print one blank line between the two triangles.
- Use a second nested loop for the inverted star triangle, starting with `rows` stars and ending with one.
- Print exactly `Total numbers printed: 15` at the end.
- Do not hard-code the triangle rows or the total.

## Starter State / Workspace
```python
rows = 5
total = 0

# Print the number triangle, the blank line, the star triangle, and the total.
```

## Evaluation Tests
```json
[
  { "type": "output-equals", "value": "1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5\n\n*****\n****\n***\n**\n*\nTotal numbers printed: 15", "message": "The full output should match both triangles and the total", "weight": 4, "required": true },
  { "type": "output-contains", "value": "1 2 3 4 5", "message": "The final number row should contain 1 through 5", "required": true },
  { "type": "output-contains", "value": "*****\n****\n***\n**\n*", "message": "The star triangle should shrink from five stars to one", "required": true },
  { "type": "output-contains", "value": "Total numbers printed: 15", "message": "Count all 15 printed numbers", "required": true },
  { "type": "code-contains", "value": "for row in range(1, rows + 1)", "message": "Use rows to control the number triangle", "required": true },
  { "type": "code-contains", "value": "for column in range(1, row + 1)", "message": "Grow each number row with a nested loop", "required": true },
  { "type": "code-contains", "value": "for star in range(row)", "message": "Use a nested loop for the stars", "required": true },
  { "type": "code-contains", "value": "total += 1", "message": "Increment the total for every number printed", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** The outer number loop goes from `1` to `rows` inclusive. The inner loop goes from `1` to `row` inclusive.

> [!TIP]
> **Hint 2:** To avoid a trailing space, print a space before each number except the first one: `if column > 1: print(" ", end="")`. Finish the row with an empty `print()`.

> [!TIP]
> **Hint 3:** The star triangle uses `range(rows, 0, -1)` for the rows and `range(row)` for the stars. Remember the empty `print()` after each row.

## Reference Solution
```python
rows = 5
total = 0

for row in range(1, rows + 1):
    for column in range(1, row + 1):
        if column > 1:
            print(" ", end="")
        print(column, end="")
        total += 1
    print()

print()

for row in range(rows, 0, -1):
    for star in range(row):
        print("*", end="")
    print()

print(f"Total numbers printed: {total}")
```
