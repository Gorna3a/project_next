---
id: "py-mod-17-concurrency"
type: "module"
title: "Module 17: Concurrency"
courseId: "python-programming"
order: 17
difficulty: "advanced"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "concurrency", "asyncio", "threading"]
prerequisites: ["py-mod-16-typing-testing-and-quality"]
description: "Optional advanced module: run work concurrently with threads, processes, and asyncio, and choose the right tool for CPU-bound and I/O-bound work. Module 17 is optional and not required for the certification project."
---

# Module Overview

Module 17 is an optional module. You can skip it without losing any prerequisite for the certification project. It is for readers who want to understand how Python programs share work across threads, processes, and async tasks.

Concurrency means multiple tasks make progress in the same time period. Parallelism means multiple tasks run at the exact same moment. This module covers threads for I/O-bound work, processes for CPU-bound work, and `asyncio` for cooperative async tasks. It also surveys the major Python web frameworks so you can judge when a sync or an async framework fits a project.

The workshop combines a thread pool, `asyncio.gather` with `asyncio.sleep(0)`, and a `Lock`-protected counter. The lab runs a batch of coroutines and returns sorted results.

## What You Will Be Able To Do
- Distinguish concurrency from parallelism
- Distinguish CPU-bound work from I/O-bound work
- Explain the Global Interpreter Lock (GIL)
- Create and join threads with `threading.Thread`
- Protect shared state with `threading.Lock`
- Map pure functions over a `ThreadPoolExecutor`
- Explain when `multiprocessing` fits and what the main-module guard does
- Write `async def` coroutines and `await` them
- Run coroutines with `asyncio.run` and combine them with `asyncio.gather`
- Choose between sync and async Python web frameworks
