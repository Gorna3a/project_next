---
id: "py-rev-concurrency"
type: "review"
title: "Concurrency Quick Reference"
moduleId: "py-mod-17-concurrency"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-concurrency-concepts-and-gil", "py-les-threading", "py-les-multiprocessing", "py-les-asyncio-basics", "py-les-python-frameworks-overview", "py-ws-threads-and-async-basics", "py-lab-async-batch-runner"]
tags: ["python", "concurrency", "reference", "asyncio"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Concurrency | Overlap in time | Tasks make progress in one period |
| Parallelism | Execution at the same moment | Tasks run on separate processors |
| CPU-bound work | Time spent computing | Parsing, compression, crunching |
| I/O-bound work | Time spent waiting | Files, network, sleep |
| GIL | Locks Python bytecode to one thread at a time | Standard CPython only |
| Free-threaded build | Build without the standard GIL | Check current docs |
| Race condition | Result depends on timing | Counter without a lock |
| `threading.Thread` | Run a function in a new thread | `Thread(target=fn, args=(x,))` |
| `join()` | Wait for a thread to finish | `thread.join()` |
| `threading.Lock` | Mutual exclusion for shared state | `with lock:` |
| `ThreadPoolExecutor` | Bounded pool of worker threads | `pool.map(fn, items)` |
| Process | Independent memory space | `multiprocessing.Process` |
| `ProcessPoolExecutor` | Map functions across worker processes | Needs top-level picklable functions |
| Pickling | Serialize objects for processes | Limits lambdas and closures |
| Main-module guard | Prevents worker reimport of entry code | `if __name__ == "__main__":` |
| Coroutine | `async def` function result | `await coro` runs it |
| `await` | Run a coroutine and yield control | `await asyncio.sleep(0)` |
| `asyncio.run` | Start an event loop for one coroutine | `asyncio.run(main())` |
| `asyncio.gather` | Await several coroutines together | `await asyncio.gather(a, b)` |
| Task | Wrapped coroutine for scheduling | `asyncio.create_task(coro)` |
| Deadlock | Two locks waited on in opposite orders | Keep one lock order |
| Sync framework | One request at a time per worker | Flask, Django, Pyramid |
| Async framework | Many waiting requests in one loop | FastAPI, aiohttp, Sanic |

## Key Concepts Comparison
- **Concurrency vs parallelism**: Concurrency overlaps tasks in time. Parallelism runs them at the same instant.
- **CPU-bound vs I/O-bound**: CPU-bound needs computation. I/O-bound waits for external events.
- **Threads vs processes**: Threads share memory and need locks. Processes have separate memory and need serialization.
- **Threads vs async**: Threads are preemptive and share memory. Async tasks are cooperative and interleave at `await` points.
- **Lock vs no lock**: A lock serializes access to shared state. No lock leaves a race condition.
- **Sequential `await` vs `asyncio.gather`**: Sequential `await` runs one coroutine at a time. `gather` starts several together.
- **Thread pool vs process pool**: Thread pool shares memory. Process pool needs picklable top-level functions.
- **Sync vs async framework**: Sync frameworks block per request. Async frameworks await many requests in one event loop.
- **GIL vs free-threaded build**: Standard CPython allows one bytecode thread at a time. Free-threaded builds change this guarantee, so check current docs.

## Critical Syntax / Templates
```python
# Thread with join
import threading

def worker(name, out):
    out.append("hi " + name)

out = []
thread = threading.Thread(target=worker, args=("ana", out))
thread.start()
thread.join()
print(out)
```

```python
# Lock-protected counter
import threading

lock = threading.Lock()
state = {"value": 0}

def increment():
    with lock:
        state["value"] = state["value"] + 1

print(state["value"])
```

```python
# Thread pool over a pure function
from concurrent.futures import ThreadPoolExecutor

def square(number):
    return number * number

with ThreadPoolExecutor(max_workers=2) as pool:
    results = list(pool.map(square, [1, 2, 3]))
print(sorted(results))
```

```python
# Async gather with sleep zero
import asyncio

async def scaled(value):
    await asyncio.sleep(0)
    return value * 10

async def main():
    results = await asyncio.gather(scaled(1), scaled(2))
    return sorted(results)

print(asyncio.run(main()))
```

```python
# Async batch runner pattern
import asyncio

async def batch_value(value):
    await asyncio.sleep(0)
    return value * 2

async def run_batch(values):
    results = await asyncio.gather(*[batch_value(v) for v in values])
    return sorted(results)

def run_sorted(values):
    return asyncio.run(run_batch(values))

print(run_sorted([1, 2, 3]))
```

```python
# Main-module guard for multiprocessing
def work(value):
    return value + 1

if __name__ == "__main__":
    print([work(value) for value in [1, 2, 3]])
```
