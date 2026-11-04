---
id: "py-ws-fizzbuzz-and-friends"
type: "workshop"
title: "FizzBuzz and Friends"
moduleId: "py-mod-04-loops"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
tags: ["python", "loops", "range", "while", "fizzbuzz"]
---

# Workshop Overview

You will build one script that exercises every loop form in this module. It starts with countdowns and even numbers, adds the classic FizzBuzz sequence, computes a sum with `while`, and finishes with `continue`, `break`, and a nested star pattern.

Each step keeps the previous output and appends a new section. Run the script after every step to confirm the earlier sections still work.

---

## Step 1: Countdown and even numbers

### Instructions
Print the section labels and values exactly as shown:

- `Countdown:` followed by `10` down to `1`, then `Liftoff!`
- `Even numbers:` followed by the even numbers from `2` through `10`, one per line

Use `range` for both loops.

### Hints
1. For a countdown, use a negative step such as `range(10, 0, -1)`.
2. The stop value is excluded, so the even numbers through `10` use `range(2, 11, 2)`.
3. Print each value on its own line; no `end` argument is needed here.

### Starter State / Code
```python
# Print the countdown and even-number sections below.
```

### Solution State / Code
```python
print("Countdown:")
for number in range(10, 0, -1):
    print(number)
print("Liftoff!")

print("Even numbers:")
for number in range(2, 11, 2):
    print(number)
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Countdown:\n10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nLiftoff!\nEven numbers:\n2\n4\n6\n8\n10", "message": "Print the countdown and even numbers exactly", "weight": 2, "required": true },
  { "type": "output-contains", "value": "Liftoff!", "message": "End the countdown with Liftoff!", "required": true },
  { "type": "code-contains", "value": "range(10, 0, -1)", "message": "Use a negative step for the countdown", "required": true },
  { "type": "code-contains", "value": "range(2, 11, 2)", "message": "Use a step of 2 and include 10", "required": true }
]
```

---

## Step 2: FizzBuzz

### Instructions
Keep the countdown output. Add a `FizzBuzz:` section for the numbers `1` through `20`:

- Multiples of both `3` and `5` print `FizzBuzz`
- Multiples of `3` print `Fizz`
- Multiples of `5` print `Buzz`
- All other numbers print the number itself

Check the combined case before the single cases.

### Hints
1. A number divisible by both `3` and `5` is divisible by `15`.
2. Use `if`/`elif`/`else` so exactly one line prints per number.
3. Keep the loop range inclusive of `20`: `range(1, 21)`.

### Starter State / Code
```python
print("Countdown:")
for number in range(10, 0, -1):
    print(number)
print("Liftoff!")

print("Even numbers:")
for number in range(2, 11, 2):
    print(number)

# Add the FizzBuzz section below.
```

### Solution State / Code
```python
print("Countdown:")
for number in range(10, 0, -1):
    print(number)
print("Liftoff!")

print("Even numbers:")
for number in range(2, 11, 2):
    print(number)

print("FizzBuzz:")
for number in range(1, 21):
    if number % 15 == 0:
        print("FizzBuzz")
    elif number % 3 == 0:
        print("Fizz")
    elif number % 5 == 0:
        print("Buzz")
    else:
        print(number)
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "FizzBuzz:\n1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz", "message": "Print the full FizzBuzz sequence from 1 to 20", "weight": 3, "required": true },
  { "type": "code-contains", "value": "number % 15 == 0", "message": "Check the combined case first", "required": true },
  { "type": "code-contains", "value": "number % 3 == 0", "message": "Check multiples of 3", "required": true },
  { "type": "code-contains", "value": "number % 5 == 0", "message": "Check multiples of 5", "required": true },
  { "type": "code-contains", "value": "elif ", "message": "Use an elif chain so only one line prints per number", "required": true }
]
```

---

## Step 3: Sum and average with while

### Instructions
Keep the previous output. Add a `Sum and average:` section that uses a `while` loop to add the numbers `1` through `100`, then prints:

```text
Sum: 5050
Average: 50.5
```

Compute the average as `total / 100`.

### Hints
1. Initialize `total = 0` and `number = 1` before the loop.
2. Loop while `number <= 100`.
3. Add to `total`, then increment `number`; both updates are required.

### Starter State / Code
```python
print("Countdown:")
for number in range(10, 0, -1):
    print(number)
print("Liftoff!")

print("Even numbers:")
for number in range(2, 11, 2):
    print(number)

print("FizzBuzz:")
for number in range(1, 21):
    if number % 15 == 0:
        print("FizzBuzz")
    elif number % 3 == 0:
        print("Fizz")
    elif number % 5 == 0:
        print("Buzz")
    else:
        print(number)

# Add the while-loop sum section below.
```

### Solution State / Code
```python
print("Countdown:")
for number in range(10, 0, -1):
    print(number)
print("Liftoff!")

print("Even numbers:")
for number in range(2, 11, 2):
    print(number)

print("FizzBuzz:")
for number in range(1, 21):
    if number % 15 == 0:
        print("FizzBuzz")
    elif number % 3 == 0:
        print("Fizz")
    elif number % 5 == 0:
        print("Buzz")
    else:
        print(number)

print("Sum and average:")
total = 0
number = 1
while number <= 100:
    total += number
    number += 1
print(f"Sum: {total}")
print(f"Average: {total / 100}")
```

### Evaluation Tests
```json
[
  { "type": "output-contains", "value": "Sum and average:\nSum: 5050\nAverage: 50.5", "message": "Compute and print the sum and average", "weight": 2, "required": true },
  { "type": "code-contains", "value": "while number <= 100", "message": "Use a while loop through 100", "required": true },
  { "type": "code-contains", "value": "total += number", "message": "Accumulate the running total", "required": true },
  { "type": "code-contains", "value": "number += 1", "message": "Update the counter so the loop ends", "required": true }
]
```

---

## Step 4: break, continue, and a nested pattern

### Instructions
Keep the previous output. Add three sections:

- `Odd numbers:` followed by the odd numbers from `1` through `9`, using `continue` to skip the even ones
- `First multiple of 7 above 20:` followed by the first multiple, found with a `while True` loop and `break`
- `Star triangle:` followed by four rows of stars, growing from `1` star to `4` stars, using nested loops

The final output should end with:

```text
Odd numbers:
1
3
5
7
9
First multiple of 7 above 20:
21
Star triangle:
*
**
***
****
```

### Hints
1. Put the `continue` before the `print` so even numbers never reach it.
2. Start `candidate` at `21`; the first value that is divisible by `7` is the answer.
3. The inner star loop can use `range(row)` so each row prints one more star.

### Starter State / Code
```python
print("Countdown:")
for number in range(10, 0, -1):
    print(number)
print("Liftoff!")

print("Even numbers:")
for number in range(2, 11, 2):
    print(number)

print("FizzBuzz:")
for number in range(1, 21):
    if number % 15 == 0:
        print("FizzBuzz")
    elif number % 3 == 0:
        print("Fizz")
    elif number % 5 == 0:
        print("Buzz")
    else:
        print(number)

print("Sum and average:")
total = 0
number = 1
while number <= 100:
    total += number
    number += 1
print(f"Sum: {total}")
print(f"Average: {total / 100}")

# Add the break, continue, and star sections below.
```

### Solution State / Code
```python
print("Countdown:")
for number in range(10, 0, -1):
    print(number)
print("Liftoff!")

print("Even numbers:")
for number in range(2, 11, 2):
    print(number)

print("FizzBuzz:")
for number in range(1, 21):
    if number % 15 == 0:
        print("FizzBuzz")
    elif number % 3 == 0:
        print("Fizz")
    elif number % 5 == 0:
        print("Buzz")
    else:
        print(number)

print("Sum and average:")
total = 0
number = 1
while number <= 100:
    total += number
    number += 1
print(f"Sum: {total}")
print(f"Average: {total / 100}")

print("Odd numbers:")
for number in range(1, 10):
    if number % 2 == 0:
        continue
    print(number)

print("First multiple of 7 above 20:")
candidate = 21
while True:
    if candidate % 7 == 0:
        print(candidate)
        break
    candidate += 1

print("Star triangle:")
for row in range(1, 5):
    for star in range(row):
        print("*", end="")
    print()
```

### Evaluation Tests
```json
[
  { "type": "output-equals", "value": "Countdown:\n10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nLiftoff!\nEven numbers:\n2\n4\n6\n8\n10\nFizzBuzz:\n1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nSum and average:\nSum: 5050\nAverage: 50.5\nOdd numbers:\n1\n3\n5\n7\n9\nFirst multiple of 7 above 20:\n21\nStar triangle:\n*\n**\n***\n****", "message": "The complete script should produce every section exactly", "weight": 4, "required": true },
  { "type": "output-contains", "value": "Odd numbers:\n1\n3\n5\n7\n9", "message": "Skip even numbers with continue", "required": true },
  { "type": "output-contains", "value": "First multiple of 7 above 20:\n21", "message": "Find the first multiple of 7 above 20", "required": true },
  { "type": "output-contains", "value": "Star triangle:\n*\n**\n***\n****", "message": "Print four growing star rows", "required": true },
  { "type": "code-contains", "value": "continue", "message": "Use continue to skip even numbers", "required": true },
  { "type": "code-contains", "value": "break", "message": "Use break to stop at the first multiple", "required": true },
  { "type": "code-contains", "value": "for star in range(row)", "message": "Use a nested loop whose length depends on the row", "required": true }
]
```
