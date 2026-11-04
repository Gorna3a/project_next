---
id: "py-les-threading"
type: "theory"
title: "Threading"
moduleId: "py-mod-17-concurrency"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "concurrency", "threading", "locks"]
---

# Concept Overview

The `threading` module runs functions in separate threads within one Python process. All threads share the same memory.

A thread can wait for I/O while another thread runs. Sharing memory makes threads useful, but it also creates race conditions. Locks protect shared state.

## Key Principles & Frameworks

### Creating a thread

Create a `threading.Thread` with a target function, then call `start()`:

```python
import threading

def greet(name, out):
    out.append("hi " + name)

out = []
thread = threading.Thread(target=greet, args=("ana", out))
thread.start()
thread.join()
print(out)
```

Output:

```text
['hi ana']
```

`join()` waits for the thread to finish. Without `join()`, the program can end before the thread finishes.

### Lock for shared state

A `threading.Lock` allows one thread to enter a protected section at a time:

```python
import threading

lock = threading.Lock()
state = {"value": 0}

def increment():
    with lock:
        state["value"] = state["value"] + 1

print(state["value"])
```

The `with lock:` block makes the read-modify-write update atomic with respect to other threads that use the same lock.

### ThreadPoolExecutor

A thread pool reuses a fixed number of threads. `ThreadPoolExecutor.map` applies a pure function to each item:

```python
from concurrent.futures import ThreadPoolExecutor

def square(number):
    return number * number

with ThreadPoolExecutor(max_workers=2) as pool:
    results = list(pool.map(square, [1, 2, 3]))
print(sorted(results))
```

Output:

```text
[1, 4, 9]
```

`map` returns results in input order, but callers should still sort results when order is not part of the task.

### Deadlocks and lock ordering

A deadlock happens when two threads each hold a lock and wait for the other lock. Deadlocks do not recover by themselves.

Always take locks in the same global order. When a function needs two locks, document the order and follow it everywhere.

## Common Pitfalls & Anti-Patterns
- **Race conditions on shared state**: Updates from several threads can overwrite each other.
- **Forgetting `join()`**: The program can exit before threads finish.
- **Lock ordering deadlocks**: Two threads taking locks in different orders can wait forever.
- **Assuming threads speed up CPU-bound code**: The GIL still limits Python bytecode execution.
- **Sharing mutable state without a lock**: Dictionaries and counters need protection.
- **Creating too many threads**: Pools bound the number of worker threads.
- **Ignoring exceptions in threads**: Capture or propagate errors by design.

## Quick Summary
- `threading.Thread` runs a target function in a new thread.
- Always call `join()` to wait for completion.
- `threading.Lock` protects shared state.
- `ThreadPoolExecutor.map` maps a pure function over items.
- Keep one lock ordering everywhere to avoid deadlocks.
- Sort results when completion order is not deterministic.
