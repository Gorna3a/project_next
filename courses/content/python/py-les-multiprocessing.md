---
id: "py-les-multiprocessing"
type: "theory"
title: "Multiprocessing"
moduleId: "py-mod-17-concurrency"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "concurrency", "multiprocessing", "processes"]
---

# Concept Overview

The `multiprocessing` module runs functions in separate processes. Each process has separate memory.

Processes can use separate processors at the same time. This fits CPU-bound work better than threads in standard CPython.

This lesson is concept only. The workshop and lab do not test multiprocessing output.

## Key Principles & Frameworks

### Processes vs threads

Threads share memory. Processes do not share memory by default.

Sharing memory is fast but risky. Separate memory is safer for parallel computation but needs data to be sent between processes.

```text
Threads:    one process, shared memory
Processes:  many processes, separate memory
```

Use threads for waiting and shared state with locks. Use processes for heavy computation that must run at the same time.

### ProcessPoolExecutor

`ProcessPoolExecutor` runs a top-level function in worker processes:

```python
from concurrent.futures import ProcessPoolExecutor

def area(width, height):
    return width * height

print(area(3, 4))
```

Output:

```text
12
```

In real code, the function is submitted to a `ProcessPoolExecutor`. The function must be available at module top level so the worker process can import it.

### Pickling limits

Data sent to a worker process is pickled. Only picklable objects can cross the boundary.

Lambda functions, closures, and objects without a stable pickle form do not work. Keep worker functions simple, top-level, and pure.

### The main-module guard

On some platforms a new process imports the main module again. Unprotected code can run again in every worker.

Always put multiprocessing entry code under the main-module guard:

```python
def work(value):
    return value + 1

if __name__ == "__main__":
    values = [1, 2, 3]
    print([work(value) for value in values])
```

Output:

```text
[2, 3, 4]
```

The guard prevents workers from rerunning the program.

## Common Pitfalls & Anti-Patterns
- **Forgetting the main-module guard**: Workers reimport the module and can start extra processes or rerun code.
- **Using nested functions as process targets**: They cannot be pickled and imported in a worker.
- **Sharing unsynchronized state**: Processes do not share memory, so counters need explicit communication.
- **Assuming process startup is free**: Forking or importing a process is heavier than starting a thread.
- **Testing multiprocessing output**: Output can vary by platform and scheduling. This module does not test it.
- **Passing unpicklable objects**: Keep arguments simple and serializable.

## Quick Summary
- Processes have separate memory and can run at the same time.
- `ProcessPoolExecutor` maps functions across worker processes.
- Worker functions must be top-level and picklable.
- Always use `if __name__ == "__main__":`.
- Use multiprocessing for CPU-bound work, not for simple waiting.
- This lesson is concept only and is not graded.
