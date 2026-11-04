---
id: "py-quiz-concurrency"
type: "quiz"
title: "Concurrency Knowledge Check"
moduleId: "py-mod-17-concurrency"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "concurrency", "asyncio", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
What is the difference between concurrency and parallelism?

- [x] Concurrency overlaps tasks in time; parallelism runs tasks at the same instant
- [ ] Concurrency always needs multiple processors; parallelism never does
- [ ] Concurrency means tasks run at the same instant; parallelism overlaps in time
- [ ] Concurrency and parallelism are exactly the same concept

*Explanation*: Concurrency is about interleaving tasks during a period. Parallelism is about executing tasks at the same moment on separate resources.

---

## Question 2
<!-- meta: {"type":"multiple","points":2} -->
Which statements about threads and locks are correct? Select all that apply.

- [x] `join()` waits for a thread to finish
- [x] A `threading.Lock` protects shared state
- [x] Taking locks in one global order helps avoid deadlocks
- [ ] Threads always speed up CPU-bound Python code
- [ ] Sharing state without a lock is always safe

*Explanation*: `join()` waits for completion, locks make shared updates atomic, and one lock order prevents circular waits. The GIL still limits CPU-bound work, and shared state without a lock can race.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
In standard CPython, multiple threads can execute Python bytecode at exactly the same instant.

- [ ] True
- [x] False

*Explanation*: The Global Interpreter Lock allows only one thread to run Python bytecode at a time in standard CPython. Check current docs for free-threaded builds.

---

## Question 4
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
from concurrent.futures import ThreadPoolExecutor

def square(number):
    return number * number

with ThreadPoolExecutor(max_workers=2) as pool:
    results = list(pool.map(square, [1, 2, 3]))
print(sorted(results))
```

- [x] `[1, 4, 9]`
- [ ] `[1, 2, 3]`
- [ ] `[3, 6, 9]`
- [ ] `[9, 4, 1]`

*Explanation*: `square` maps 1, 2, and 3 to 1, 4, and 9. Sorting gives `[1, 4, 9]`.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
import asyncio

async def doubled(value):
    await asyncio.sleep(0)
    return value * 2

async def main():
    results = await asyncio.gather(doubled(1), doubled(2), doubled(3))
    return sorted(results)

print(asyncio.run(main()))
```

- [x] `[2, 4, 6]`
- [ ] `[1, 2, 3]`
- [ ] `[2, 2, 2]`
- [ ] It prints nothing because coroutines never run

*Explanation*: `asyncio.sleep(0)` yields control with no real delay. Each coroutine returns its doubled value, and `gather` collects all results before sorting.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
Which pitfall happens when you forget `await` in async code?

- [x] The coroutine is created but never runs
- [ ] The coroutine runs twice
- [ ] The event loop crashes immediately
- [ ] The return value is doubled

*Explanation*: Calling an `async def` function only creates a coroutine. Without `await`, the body never executes.

---

## Question 7
<!-- meta: {"type":"multiple","points":2} -->
Which statements about multiprocessing and async are correct? Select all that apply.

- [x] Processes have separate memory by default
- [x] Worker functions for processes must be top-level and picklable
- [x] `if __name__ == "__main__":` guards multiprocessing entry code
- [x] Blocking `time.sleep` should not be used inside async code
- [ ] Multiprocessing output should be tested directly in this module

*Explanation*: Processes do not share memory, need picklable top-level functions, and need the main-module guard. `time.sleep` blocks the event loop, and this module never tests multiprocessing output for reliability reasons.

---

## Question 8
<!-- meta: {"type":"true-false","points":1} -->
Using `time.sleep(1)` inside an async function is a good way to wait without blocking other async tasks.

- [ ] True
- [x] False

*Explanation*: `time.sleep` blocks the event loop and stops every other task. Use `await asyncio.sleep(0)` for cooperative yields in this module.
