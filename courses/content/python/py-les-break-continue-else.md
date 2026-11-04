---
id: "py-les-break-continue-else"
type: "theory"
title: "break, continue, and the Loop else"
moduleId: "py-mod-04-loops"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "loops", "break", "continue", "else"]
---

# Concept Overview

Not every loop should run to completion. Sometimes a result is found early, and sometimes one item should be skipped. Python provides `break` to leave a loop and `continue` to skip the rest of the current pass.

A `for` or `while` loop can also have an `else` block. It runs only when the loop finishes normally, meaning it was not stopped by `break`. The `pass` statement is a placeholder that does nothing, useful when a block is syntactically required but no action is needed yet.

## Key Principles & Frameworks

### break

`break` exits the nearest enclosing loop immediately:

```python
for number in range(1, 10):
    if number % 7 == 0:
        print(f"Found {number}")
        break
```

Output:

```text
Found 7
```

The loop stops at `7`. Values `8` and `9` are never visited. Any code after the loop continues normally.

`break` only leaves one loop. In nested loops, it exits the innermost loop that contains it:

```python
for row in range(1, 4):
    for column in range(1, 4):
        if column == 2:
            break
        print(f"{row},{column}")
```

Output:

```text
1,1
2,1
3,1
```

The inner loop stops at column `2` on every row, but the outer loop continues to the next row.

### continue

`continue` skips the rest of the current iteration and moves to the next one:

```python
for number in range(1, 10):
    if number % 2 == 0:
        continue
    print(number)
```

Output:

```text
1
3
5
7
9
```

Even numbers reach `continue`, so the print is skipped for them. The loop itself does not stop.

In a `while` loop, `continue` jumps back to the condition check. Any update placed after `continue` is skipped, which can cause an infinite loop:

```python
# count = 0
# while count < 5:
#     if count == 2:
#         continue
#     count += 1
#
# When count reaches 2, the update is skipped forever.
```

Put the update before the `continue`, or restructure the condition so the update always runs.

### while True with break

A common pattern is an intentional loop that exits from the inside:

```python
count = 0

while True:
    count += 1
    if count == 3:
        break

print(count)
```

Output:

```text
3
```

`while True` is readable when the exit condition is easier to express inside the body than in the header. It is safe only when every path through the body can eventually reach a `break`. Use it sparingly and keep the exit near the top.

### The loop else clause

A `for` or `while` loop may have an `else` block. It runs when the loop finishes normally, not when `break` stops it:

```python
for number in range(2, 10):
    if number % 7 == 0:
        print(f"Found {number}")
        break
else:
    print("Not found")
```

Output:

```text
Found 7
```

Because the loop breaks, the `else` is skipped. If no multiple is found, the loop ends normally and the `else` runs:

```python
for number in range(2, 7):
    if number % 7 == 0:
        print(f"Found {number}")
        break
else:
    print("Not found")
```

Output:

```text
Not found
```

The `else` belongs to the loop, not to the `if`. Indentation determines that: it aligns with `for`, not with `if`.

### while else

The same rule applies to `while`:

```python
count = 1

while count <= 3:
    print(count)
    count += 1
else:
    print("Loop finished")
```

Output:

```text
1
2
3
Loop finished
```

The condition becomes false, so the loop ends normally and the `else` runs. A `break` skips it:

```python
count = 1

while count <= 5:
    if count == 3:
        break
    print(count)
    count += 1
else:
    print("Loop finished")

print("After the loop")
```

Output:

```text
1
2
After the loop
```

`Loop finished` is not printed because the loop was stopped by `break`.

### pass

`pass` does nothing. It exists so a block can be syntactically valid while the actual work is added later:

```python
for number in range(3):
    if number == 1:
        pass
    else:
        print(number)
```

Output:

```text
0
2
```

The `if` block needs at least one statement, and `pass` satisfies that requirement without changing behavior. A comment alone would not be enough.

### Readability advice

Loop `else` is correct but unfamiliar to many readers. Use it when the "search and report" meaning is clear. If a teammate might misread it, a flag variable is often easier to follow:

```python
found = False

for number in range(2, 7):
    if number % 7 == 0:
        found = True
        break

if found:
    print("Found")
else:
    print("Not found")
```

Output:

```text
Not found
```

Both versions are valid. Choose the one that makes the intent obvious to the next reader.

## Common Pitfalls & Anti-Patterns
- **Thinking `break` exits every loop**: It exits only the nearest enclosing loop.
- **Forgetting that `break` skips the loop `else`**: The `else` runs only after a normal finish.
- **Attaching `else` to the wrong block**: It aligns with the loop header, not with an inner `if`.
- **Skipping an update after `continue` in a `while` loop**: This can create an infinite loop.
- **Using `continue` when a simple `if` would do**: Sometimes wrapping the print in an `if` is clearer.
- **Writing `while True` without a guaranteed exit**: Every path must be able to reach a `break`.
- **Believing `pass` exits or skips something**: It does nothing at all.
- **Using `break` to leave nested loops and expecting both to end**: Use a flag or a function to exit multiple levels.
- **Overusing loop `else`**: If it needs explanation, prefer a flag variable.

## Quick Summary
- `break` exits the nearest enclosing loop immediately.
- `continue` skips the rest of the current iteration and starts the next one.
- In a `while` loop, make sure an update is not skipped by `continue`.
- A loop `else` runs after a normal finish and is skipped by `break`.
- `while True` is acceptable when the body guarantees an exit.
- `pass` is a no-op placeholder that keeps a block valid.
- Choose loop `else` or a flag based on which is clearer to read.
