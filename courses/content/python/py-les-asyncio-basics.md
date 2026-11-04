---
id: "py-les-asyncio-basics"
type: "theory"
title: "Asyncio Basics"
moduleId: "py-mod-17-concurrency"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "concurrency", "asyncio", "async"]
---

# Concept Overview

`asyncio` runs cooperating tasks in one thread with an event loop. You describe tasks with `async def` and observe points where a task can yield control with `await`.

Unlike threads, async tasks do not run at the same instant. They interleave when they await something. This fits I/O-bound work that waits a lot and computes little.

## Key Principles & Frameworks

### Coroutines and await

An `async def` function returns a coroutine when called. The coroutine runs only when awaited.

```python
import asyncio

async def greet(name):
    await asyncio.sleep(0)
    return "hi " + name

print(asyncio.run(greet("ana")))
```

Output:

```text
hi ana
```

`asyncio.sleep(0)` yields control to the event loop without a real delay. That makes tests deterministic.

### asyncio.run

`asyncio.run(coro)` starts an event loop, runs the coroutine, and closes the loop. It takes one coroutine argument.

```python
import asyncio

async def add(a, b):
    await asyncio.sleep(0)
    return a + b

print(asyncio.run(add(2, 3)))
```

Output:

```text
5
```

### Tasks and asyncio.gather

`asyncio.gather` awaits several coroutines or tasks and returns their results together:

```python
import asyncio

async def value(number):
    await asyncio.sleep(0)
    return number * 10

async def main():
    results = await asyncio.gather(value(1), value(2), value(3))
    return sorted(results)

print(asyncio.run(main()))
```

Output:

```text
[10, 20, 30]
```

Because completion order is not part of the task, the example sorts the results.

### Threads vs async

Threads are preemptive and share memory with locks. Async tasks are cooperative and share no locks for ordinary Python code.

Use threads for blocking calls you cannot rewrite. Use async when you control the I/O calls and can await them.

## Common Pitfalls & Anti-Patterns
- **Forgetting `await`**: Calling a coroutine without awaiting it runs nothing.
- **Blocking `time.sleep` in async code**: It blocks the event loop and stops every task.
- **Using real delays in tests**: `asyncio.sleep(0)` keeps tests fast and deterministic.
- **Not awaiting tasks**: Work can be lost or a warning can appear.
- **Assuming async runs code in parallel**: Async tasks interleave in one thread.
- **Sorting mistakes**: `asyncio.gather` keeps input order, but event completion order can still vary by design.
- **Calling `asyncio.run` twice in a loop**: Keep one main coroutine per program entry.

## Quick Summary
- `async def` creates a coroutine. `await` runs it and yields control.
- `asyncio.run` starts an event loop for one main coroutine.
- `asyncio.gather` awaits several coroutines and returns all results.
- Use `asyncio.sleep(0)` for deterministic tests. Never use real delays.
- Never use blocking `time.sleep` inside async code.
- Always await coroutines and tasks.
