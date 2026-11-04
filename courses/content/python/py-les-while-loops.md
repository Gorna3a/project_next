---
id: "py-les-while-loops"
type: "theory"
title: "While Loops"
moduleId: "py-mod-04-loops"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "loops", "while", "sentinel"]
---

# Concept Overview

A `while` loop repeats a block as long as a condition remains truthy. The condition is checked before every pass. If it is false at the start, the body never runs. If it never becomes false, the loop never ends.

`while` is the right choice when the number of repetitions is not known in advance. A counter or a changing value usually controls the loop, and each pass must move that value toward the stopping condition.

## Key Principles & Frameworks

### The basic form

```python
count = 1

while count <= 5:
    print(count)
    count += 1
```

Output:

```text
1
2
3
4
5
```

The sequence is:

1. Check `count <= 5`.
2. If true, run the body.
3. Print `count`.
4. Increase `count`.
5. Return to step 1.

When `count` becomes `6`, the condition is false and the loop ends. The condition is tested once more after the final pass, which is why the loop can stop.

### A loop that never runs

Because the condition is checked first, a `while` loop may run zero times:

```python
count = 10

while count < 5:
    print(count)
    count += 1

print("Finished")
```

Output:

```text
Finished
```

The condition is false immediately, so the body is skipped. This is a valid way to express "do this only while the condition holds."

### Counters and accumulators

A counter tracks how many times something happens. An accumulator combines values into a running result. Both follow the same three-part structure:

```python
number = 1
total = 0

while number <= 10:
    total += number
    number += 1

print(total)
```

Output:

```text
55
```

- `number` is the counter that controls the loop.
- `total` is the accumulator that gathers the sum.
- The update `number += 1` guarantees progress toward the exit.

A countdown reverses the direction:

```python
count = 5

while count > 0:
    print(count)
    count -= 1

print("Liftoff!")
```

Output:

```text
5
4
3
2
1
Liftoff!
```

### Sentinel values

A sentinel is a special value that signals the loop to stop. The loop keeps processing until it sees the sentinel:

```python
number = 20

while number != 0:
    print(number)
    number //= 2
```

Output:

```text
20
10
5
2
1
```

Here `0` is the sentinel. Each pass halves the number with floor division, so the value eventually reaches `0`.

Sentinels are useful when a sequence has a natural end marker. In programs that read input, the marker might be an empty string or the word `"quit"`. This course avoids `input()` in graded code, so the sentinel examples use fixed starting values.

### Processing a number digit by digit

A `while` loop can peel digits off a number:

```python
number = 4728
total = 0

while number > 0:
    total += number % 10
    number //= 10

print(total)
```

Output:

```text
21
```

`number % 10` extracts the last digit, and `number //= 10` removes it. The loop stops when no digits remain. The same pattern reverses a number or counts its digits.

### Avoiding infinite loops

An infinite loop happens when the condition never becomes false. The most common cause is forgetting to update the variable in the condition:

```python
# count = 1
# while count <= 5:
#     print(count)
#
# count is never changed, so this loop runs forever.
```

A second cause is updating the wrong name or updating in the wrong direction:

```python
# count = 1
# while count <= 5:
#     print(count)
#     count -= 1
#
# count moves away from the exit condition.
```

A third cause is a condition that is always true, such as `while True`. That form is legitimate only when the body contains a `break`, which the next lesson covers.

When experimenting, run loops that might be infinite in a terminal you can interrupt with `Ctrl+C`. Before running a loop, ask: which value changes, and when does the condition become false?

### while versus for

Use `for` when you are visiting items in an iterable or repeating a known number of times. Use `while` when repetition depends on a condition that changes during the loop.

```python
# for: the count is known
for number in range(1, 4):
    print(number)

# while: the stopping point depends on the value
number = 100
while number > 10:
    number //= 3

print(number)
```

Output:

```text
1
2
3
3
```

The `while` loop divides `100` repeatedly until the result is no longer greater than `10`: `100`, then `33`, then `11`, then `3`. The number of passes is not obvious from the starting values, which is exactly when `while` fits.

## Common Pitfalls & Anti-Patterns
- **Forgetting to update the loop variable**: The condition never changes, so the loop never ends.
- **Updating in the wrong direction**: `count -= 1` moves away from `count <= 5` instead of toward it.
- **Updating the wrong variable**: A typo in the name leaves the condition variable untouched.
- **Using `while` when `for` is simpler**: If you are iterating a known range, a `for` loop is clearer.
- **Getting the boundary wrong**: `while count < 5` and `while count <= 5` run different numbers of times.
- **Assuming the body always runs**: A `while` loop can run zero times.
- **Changing the condition variable in several places**: Keep one clear update so the exit is easy to trace.
- **Using floating-point counters**: Repeated addition of `0.1` accumulates error. Prefer integer counters.
- **Relying on an external event to stop the loop**: Always know how the condition becomes false before running the code.

## Quick Summary
- `while` checks its condition before each pass.
- A false condition at the start means zero iterations.
- Counters and accumulators need a clear update that makes progress.
- A sentinel is a special value that ends the loop.
- Infinite loops usually come from a missing or incorrect update.
- Use `for` for known sequences and `while` for condition-driven repetition.
- Before running a `while` loop, identify the value that changes and the condition that stops it.
