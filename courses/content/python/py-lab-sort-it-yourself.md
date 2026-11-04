---
id: "py-lab-sort-it-yourself"
type: "lab"
title: "Sort It Yourself"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 7
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "sorting", "merge-sort", "lab", "algorithms"]
---

# Objective

Implement a sorting function without using the built-in sorting tools. You will write a sort that returns a new sorted list while leaving the input list unchanged. The tests call your function directly. Keep the implementation free of prompts and printed output.

## Requirements
- Define `sort_numbers(numbers)` that returns a new list with the numbers in ascending order.
- The input list must stay unchanged after the function runs.
- The returned list must be sorted in ascending order.
- Do not use `sorted(` anywhere in your code.
- Do not use `.sort(` anywhere in your code.
- Handle empty lists and single-element lists.
- Do not print inside the functions.

## Starter State / Workspace
```python
# Define sort_numbers below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "sort_numbers([3, 1, 2])", "expected": [1, 2, 3], "message": "sort_numbers should sort a small list", "weight": 2, "required": true },
  { "type": "function-returns", "call": "sort_numbers([5, 2, 9, 1, 7])", "expected": [1, 2, 5, 7, 9], "message": "sort_numbers should sort a longer list", "weight": 2, "required": true },
  { "type": "function-returns", "call": "sort_numbers([])", "expected": [], "message": "An empty input should return an empty list", "required": true },
  { "type": "function-returns", "call": "sort_numbers([4])", "expected": [4], "message": "A single-element input should return that element", "required": true },
  { "type": "function-returns", "call": "sort_numbers([3, 1, 3, 2])", "expected": [1, 2, 3, 3], "message": "Duplicates should be preserved", "weight": 2, "required": true },
  { "type": "function-returns", "call": "sort_numbers([-2, 0, -5, 3])", "expected": [-5, -2, 0, 3], "message": "Negative numbers should sort correctly", "required": true },
  { "type": "code-not-contains", "value": "sorted(", "message": "Do not use sorted(", "weight": 2, "required": true },
  { "type": "code-not-contains", "value": ".sort(", "message": "Do not use .sort(", "weight": 2, "required": true },
  { "type": "code-contains", "value": "def sort_numbers(numbers)", "message": "Define sort_numbers(numbers)", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** A simple approach keeps inserting each number into the correct position of the growing result list.

> [!TIP]
> **Hint 2:** Create the result as a new empty list and loop over the input values.

> [!TIP]
> **Hint 3:** Use a second loop that shifts every result element larger than the current value one position right.

> [!TIP]
> **Hint 4:** Place the current value in the freed slot. Return the result list at the end.

## Reference Solution
```python
def sort_numbers(numbers):
    result = []
    for value in numbers:
        position = len(result)
        while position > 0 and result[position - 1] > value:
            position -= 1
        result.insert(position, value)
    return result
```
