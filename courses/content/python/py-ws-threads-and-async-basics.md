---
id: "py-ws-threads-and-async-basics"
type: "workshop"
title: "Threads and Async Basics"
moduleId: "py-mod-17-concurrency"
order: 6
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 40
tags: ["python", "concurrency", "threading", "asyncio"]
---

# Workshop Overview

You will build three functions step by step. Each step keeps the previous functions. Every function returns its result instead of printing it, so the tests call them directly.

The three steps are: a thread pool that maps a pure function over numbers, an `asyncio.gather` call with `asyncio.sleep(0)`, and a `Lock`-protected counter. All tests are deterministic: results are sorted, delays use `asyncio.sleep(0)`, and no test reads the clock or checks multiprocessing output.

---

## Step 1: Thread Pool Over Pure Functions

### Instructions
Define a pure function `square(number)` that returns `number * number`. Then define `pool_squares(numbers)` that maps `square` over `numbers` with `ThreadPoolExecutor` and returns the results as a sorted list.

### Hints
1. A pure function takes a value and returns a new value without side effects.
2. Use `ThreadPoolExecutor` from `concurrent.futures` and its mapping method with your function and the input list.
3. Convert the mapping result to a list and call `sorted` on it before returning.

### Starter State / Code
```python
# Define square and pool_squares below.
```

### Solution State / Code
```python
from concurrent.futures import ThreadPoolExecutor

def square(number):
    return number * number

def pool_squares(numbers):
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(square, numbers))
    return sorted(results)
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "pool_squares([1, 2, 3])", "expected": [1, 4, 9], "message": "pool_squares should return sorted squares", "weight": 2, "required": true },
  { "type": "function-returns", "call": "pool_squares([3, 1, 2])", "expected": [1, 4, 9], "message": "pool_squares should sort results", "required": true },
  { "type": "function-returns", "call": "pool_squares([])", "expected": [], "message": "An empty list should return an empty list", "required": true },
  { "type": "function-returns", "call": "pool_squares([4, -2, 3])", "expected": [4, 9, 16], "message": "pool_squares should handle negative numbers", "required": true },
  { "type": "function-returns", "call": "square(5)", "expected": 25, "message": "square should return the square of its argument", "required": true },
  { "type": "code-contains", "value": "ThreadPoolExecutor", "message": "Use ThreadPoolExecutor", "required": true },
  { "type": "code-contains", "value": ".map", "message": "Use the executor mapping method", "required": true },
  { "type": "code-not-contains", "value": "multiprocessing", "message": "Do not use multiprocessing in this workshop", "required": true }
]
```

---

## Step 2: Asyncio Gather With Sleep Zero

### Instructions
Keep the previous functions. Define an async helper `scaled(value)` that yields control with `asyncio.sleep(0)` and returns `value * 10`. Define `gather_scaled(values)` that awaits all `scaled` calls with `asyncio.gather` and returns the results as a sorted list.

### Hints
1. An `async def` function returns a coroutine when called.
2. Inside the helper, `await asyncio.sleep(0)` yields control without a real delay.
3. Build one inner coroutine that gathers the helpers, then run it with `asyncio.run` in the outer function.

### Starter State / Code
```python
from concurrent.futures import ThreadPoolExecutor

def square(number):
    return number * number

def pool_squares(numbers):
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(square, numbers))
    return sorted(results)

# Define scaled and gather_scaled below.
```

### Solution State / Code
```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

def square(number):
    return number * number

def pool_squares(numbers):
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(square, numbers))
    return sorted(results)

async def scaled(value):
    await asyncio.sleep(0)
    return value * 10

def gather_scaled(values):
    async def main():
        results = await asyncio.gather(*[scaled(value) for value in values])
        return sorted(results)
    return asyncio.run(main())
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "gather_scaled([1, 2, 3])", "expected": [10, 20, 30], "message": "gather_scaled should return scaled values", "weight": 2, "required": true },
  { "type": "function-returns", "call": "gather_scaled([3, 1, 2])", "expected": [10, 20, 30], "message": "gather_scaled should return sorted results", "required": true },
  { "type": "function-returns", "call": "gather_scaled([])", "expected": [], "message": "An empty list should return an empty list", "required": true },
  { "type": "function-returns", "call": "gather_scaled([5])", "expected": [50], "message": "A single value should be scaled", "required": true },
  { "type": "code-contains", "value": "asyncio.gather", "message": "Use asyncio.gather", "required": true },
  { "type": "code-contains", "value": "asyncio.sleep(0)", "message": "Use asyncio.sleep(0) instead of a real delay", "required": true },
  { "type": "code-contains", "value": "asyncio.run", "message": "Use asyncio.run to start the event loop", "required": true },
  { "type": "code-not-contains", "value": "time.sleep", "message": "Do not use blocking time.sleep", "required": true }
]
```

---

## Step 3: Lock-Protected Counter

### Instructions
Keep the previous functions. Define `count_with_lock(n)` that creates `n` threads, each incrementing a shared counter once inside a `threading.Lock`. The function starts and joins every thread, then returns the final counter value.

### Hints
1. A lock lets one thread at a time enter a protected section.
2. Each thread should update the shared value only inside a `with lock:` block.
3. Create threads in a list, call `start` on each, then call `join` on each before returning the value.

### Starter State / Code
```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

def square(number):
    return number * number

def pool_squares(numbers):
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(square, numbers))
    return sorted(results)

async def scaled(value):
    await asyncio.sleep(0)
    return value * 10

def gather_scaled(values):
    async def main():
        results = await asyncio.gather(*[scaled(value) for value in values])
        return sorted(results)
    return asyncio.run(main())

# Define count_with_lock below.
```

### Solution State / Code
```python
import asyncio
import threading
from concurrent.futures import ThreadPoolExecutor

def square(number):
    return number * number

def pool_squares(numbers):
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(square, numbers))
    return sorted(results)

async def scaled(value):
    await asyncio.sleep(0)
    return value * 10

def gather_scaled(values):
    async def main():
        results = await asyncio.gather(*[scaled(value) for value in values])
        return sorted(results)
    return asyncio.run(main())

def count_with_lock(n):
    lock = threading.Lock()
    state = {"value": 0}
    def increment():
        with lock:
            state["value"] = state["value"] + 1
    threads = [threading.Thread(target=increment) for _ in range(n)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    return state["value"]
```

### Evaluation Tests
```json
[
  { "type": "function-returns", "call": "count_with_lock(5)", "expected": 5, "message": "count_with_lock should count five increments", "weight": 2, "required": true },
  { "type": "function-returns", "call": "count_with_lock(0)", "expected": 0, "message": "count_with_lock with zero threads should return 0", "required": true },
  { "type": "function-returns", "call": "count_with_lock(12)", "expected": 12, "message": "count_with_lock should count twelve increments", "required": true },
  { "type": "code-contains", "value": "threading.Lock", "message": "Use threading.Lock", "required": true },
  { "type": "code-contains", "value": "with lock:", "message": "Protect the update with the lock", "required": true },
  { "type": "code-contains", "value": "join()", "message": "Join every thread", "required": true },
  { "type": "code-not-contains", "value": "multiprocessing", "message": "Do not use multiprocessing in this workshop", "required": true }
]
```
