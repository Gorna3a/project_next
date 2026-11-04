---
id: "py-lab-async-batch-runner"
type: "lab"
title: "Async Batch Runner"
moduleId: "py-mod-17-concurrency"
order: 7
difficulty: "advanced"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 35
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "concurrency", "asyncio", "lab"]
---

# Objective

Write a function that runs a batch of coroutines and returns the results sorted. Each coroutine yields control with `asyncio.sleep(0)` and returns a value. The outer function starts the event loop once and returns a sorted list.

The tests call your function directly. Keep the implementation free of prompts and printed output. Use only `asyncio.sleep(0)` as a delay. Never use `time.sleep`, read the clock, or use randomness.

## Requirements
- Import `asyncio`.
- Define an async helper `batch_value(value)` that awaits `asyncio.sleep(0)` and returns `value * 2`.
- Define an async helper `run_batch(values)` that awaits `asyncio.gather` over a list of `batch_value` calls and returns the results as a sorted list.
- Define `run_sorted(values)` that returns `asyncio.run(run_batch(values))`.
- Do not print inside the functions.
- Do not use `time.sleep`, `random`, `datetime.now`, `time.time`, or `input`.

## Starter State / Workspace
```python
import asyncio

# Define batch_value, run_batch, and run_sorted below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "run_sorted([1, 2, 3])", "expected": [2, 4, 6], "message": "run_sorted should return doubled values sorted", "weight": 2, "required": true },
  { "type": "function-returns", "call": "run_sorted([3, 1, 2])", "expected": [2, 4, 6], "message": "run_sorted should sort the results", "required": true },
  { "type": "function-returns", "call": "run_sorted([])", "expected": [], "message": "An empty list should return an empty list", "required": true },
  { "type": "function-returns", "call": "run_sorted([5])", "expected": [10], "message": "A single value should be doubled", "required": true },
  { "type": "function-returns", "call": "run_sorted([-2, 0, 7])", "expected": [-4, 0, 14], "message": "run_sorted should handle negative numbers and zero", "required": true },
  { "type": "function-returns", "call": "asyncio.run(run_batch([1, 2]))", "expected": [2, 4], "message": "run_batch should return sorted results when run", "required": true },
  { "type": "function-returns", "call": "asyncio.run(batch_value(4))", "expected": 8, "message": "batch_value should return the doubled value", "required": true },
  { "type": "code-contains", "value": "async def batch_value", "message": "Define batch_value as a coroutine", "required": true },
  { "type": "code-contains", "value": "async def run_batch", "message": "Define run_batch as a coroutine", "required": true },
  { "type": "code-contains", "value": "def run_sorted(values)", "message": "Define run_sorted", "required": true },
  { "type": "code-contains", "value": "asyncio.gather", "message": "Use asyncio.gather", "required": true },
  { "type": "code-contains", "value": "asyncio.sleep(0)", "message": "Use asyncio.sleep(0) instead of a real delay", "required": true },
  { "type": "code-not-contains", "value": "time.sleep", "message": "Do not use blocking time.sleep", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** An `async def` function returns a coroutine when called, and `await` runs it.

> [!TIP]
> **Hint 2:** `asyncio.gather` takes several coroutines as arguments and returns all their results in input order.

> [!TIP]
> **Hint 3:** The outer sync function can start the event loop once with `asyncio.run` on the batch coroutine.

> [!TIP]
> **Hint 4:** `run_batch` can build the coroutine list with a list comprehension, then return `sorted(results)`.

> [!TIP]
> **Hint 5:** The doubled result of `value * 2` keeps the tests deterministic because no real delay or clock is involved.

## Reference Solution
```python
import asyncio


async def batch_value(value):
    await asyncio.sleep(0)
    return value * 2


async def run_batch(values):
    results = await asyncio.gather(*[batch_value(value) for value in values])
    return sorted(results)


def run_sorted(values):
    return asyncio.run(run_batch(values))
```
