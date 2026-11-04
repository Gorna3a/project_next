---
id: "py-les-concurrency-concepts-and-gil"
type: "theory"
title: "Concurrency Concepts and the GIL"
moduleId: "py-mod-17-concurrency"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "concurrency", "gil", "parallelism"]
---

# Concept Overview

Concurrency means several tasks make progress during the same period. Parallelism means several tasks run at the same instant on different processors.

A concurrent program can interleave tasks even on one processor. A parallel program needs more than one processor or core to run tasks at the same instant.

Check the current Python documentation for free-threaded builds. In free-threaded builds, the Global Interpreter Lock is removed or changed. This lesson describes the standard CPython GIL behavior.

## Key Principles & Frameworks

### Concurrency vs parallelism

Concurrency is about structure: tasks can overlap in time. Parallelism is about execution: tasks overlap at the same moment.

A text diagram labels two tasks that run one after another, then two tasks that run at the same time:

```text
Concurrency:  Task A  Task B  Task A  Task B
Parallelism:  Task A  Task B   (same moment)
              Task C  Task D
```

Concurrency does not guarantee parallelism. Parallelism requires separate execution resources.

### CPU-bound vs I/O-bound work

CPU-bound work spends most time computing. Examples are parsing, compression, and number crunching.

I/O-bound work spends most time waiting for devices, files, or networks. Examples are reading files, waiting for a server, and sleeping.

Threads help I/O-bound work because one thread can wait while another thread runs. Threads usually do not speed up CPU-bound Python work in standard CPython.

### The Global Interpreter Lock

The Global Interpreter Lock, or GIL, allows only one thread to run Python bytecode at a time in standard CPython. A thread releases the GIL when it waits for I/O or sleeps.

This means threads can wait at the same time, but they do not execute Python code at the same time. For CPU-bound work, non-Python extensions may release the GIL, but ordinary Python code does not.

```python
def total(values):
    result = 0
    for value in values:
        result = result + value
    return result

print(total([1, 2, 3]))
```

Output:

```text
6
```

### Race condition

A race condition happens when the result depends on the order in which tasks run. Two threads can read the same counter, update it, and write it back. One update can overwrite the other.

The fix is to protect shared state with a lock, or to avoid shared state by using pure functions and sorted results.

## Common Pitfalls & Anti-Patterns
- **Assuming threads speed up CPU-bound code**: In standard CPython the GIL prevents parallel Python bytecode execution.
- **Ignoring race conditions**: Shared state without a lock makes results depend on timing.
- **Confusing concurrency with parallelism**: A program can be concurrent without running tasks at the same instant.
- **Adding threads for every problem**: More threads add locking, ordering, and lifecycle problems.
- **Assuming the GIL never changes**: Check the current docs for free-threaded builds and implementation differences.
- **Not joining threads or awaiting tasks**: Work can be lost when the program ends before tasks finish.

## Quick Summary
- Concurrency is overlap in time. Parallelism is execution at the same moment.
- CPU-bound work needs computation. I/O-bound work waits for external events.
- The GIL lets only one thread run Python bytecode at a time in standard CPython.
- Threads mainly help I/O-bound work.
- Shared state needs locks or a design without shared state.
- Always join threads and await tasks.
- Check current docs for free-threaded builds before relying on GIL details.
