---
id: "py-les-recursion"
type: "theory"
title: "Recursion"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 18
tags: ["python", "recursion", "call-stack", "memoization"]
---

# Concept Overview

Recursion is a technique where a function calls itself to solve a smaller version of the same problem. Each call handles one small step and relies on the next call to finish the rest. This pattern works well for problems that repeat at smaller sizes, such as summing list elements or computing factorials.

A base case is the condition that stops the recursion. It returns a value directly without calling the function again. Without a base case, calls continue forever and Python eventually raises an error.

## Key Principles & Frameworks

### Base case and recursive case

Every recursive function has two parts. The base case handles the smallest input. The recursive case makes progress toward that base case by calling the function with a smaller argument.

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(0))
print(factorial(4))
```

Output:

```text
1
24
```

`factorial(0)` returns `1` directly. For larger values, each call multiplies `n` by the result of the smaller call.

### The call stack

When a function calls another function, Python remembers the paused call and returns to it when the inner call finishes. The set of paused calls forms the call stack. Each call is stored as a frame with its local variables.

```python
def countdown(n):
    if n == 0:
        print("done")
        return
    print(n)
    countdown(n - 1)

countdown(3)
```

Output:

```text
3
2
1
done
```

For `countdown(3)`, the call stack grows as calls for `2`, `1`, and `0` are made. After the call for `0` returns, each paused frame resumes.

### Recursion limit

Python limits the depth of the call stack to protect memory. When the limit is exceeded, Python raises `RecursionError`. The default limit is 1000 frames. A recursion depth larger than that suggests missing progress toward a base case or a data structure that is too deep for simple recursion.

```python
import sys

print(sys.getrecursionlimit())
```

Output:

```text
1000
```

The value is a frame count, not the number of times a function may call itself in a row.

### Memoization and `functools.cache`

Repeated subproblems waste work. Memoization stores results of previous calls in a dictionary. The dictionary is called a cache. The `functools.cache` decorator adds memoization automatically.

```python
from functools import cache

@cache
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(6))
```

Output:

```text
8
```

`fibonacci(6)` returns `8`. The cache ensures each value from `0` to `6` is computed only once.

### Tracing recursive calls

A useful skill is to trace each call on paper. Write down the arguments, the branch taken, and the returned value. This makes it easier to find missing base cases and wrong progress steps.

```python
def sum_list(items):
    if not items:
        return 0
    return items[0] + sum_list(items[1:])

print(sum_list([3, 1, 4]))
```

Output:

```text
8
```

The base case returns `0` for an empty list. Each recursive call adds the first element and processes the rest.

## Common Pitfalls & Anti-Patterns
- **Missing base case**: A function that never reaches a stopping condition calls itself forever until `RecursionError` is raised.
- **Exponential recursion without memoization**: Some problems, such as naive Fibonacci, repeat the same subproblems many times. The number of calls grows exponentially and the program becomes very slow.
- **No progress toward the base case**: Passing the same argument to the recursive call means the call never gets smaller.
- **Ignoring the call stack**: Deep recursion uses memory for each frame. Very deep inputs can exceed the recursion limit even when the logic is correct.
- **Modifying mutable arguments unexpectedly**: Slicing a list creates a new list. Removing items from the original list changes shared state.
- **Forgetting the return value**: A recursive call whose result is ignored discards the computed answer.
- **Printing instead of returning**: Print statements help debugging but do not supply values to the caller.
- **Using recursion for a simple loop**: Iterative code with a loop is often clearer and uses constant extra space when recursion adds no structure.
- **Assuming recursion is always faster**: Function calls have overhead. Speed depends on the algorithm, not on recursion alone.
- **Missing memoization for overlapping subproblems**: Store results when the same calls appear repeatedly.

## Quick Summary
- Recursion calls the function with smaller inputs.
- The base case stops recursion and returns a value directly.
- Each recursive call must make progress toward the base case.
- Paused calls live on the call stack.
- Python raises `RecursionError` when the stack limit is exceeded.
- Memoization stores results to avoid repeating work.
- `functools.cache` adds memoization automatically.
- Trace calls to check arguments, branches, and return values.
- Add memoization when repeated subproblems make the code slow.
- Prefer a loop when recursion adds no structural benefit.
