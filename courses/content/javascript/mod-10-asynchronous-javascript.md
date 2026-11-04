---
id: "mod-10-asynchronous-javascript"
type: "module"
title: "Module 10: Asynchronous JavaScript"
courseId: "javascript-fundamentals"
order: 10
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
tags: ["javascript","async","promises","fetch"]
prerequisites: ["mod-09-closures-this-classes"]
description: "Understand the event loop, work with timers and callbacks, chain promises, use async/await, and fetch data from APIs."
---

# Module Overview

JavaScript runs your code on a single call stack, yet it can wait for timers, network requests, and user input without freezing the page. The event loop makes that possible. This module explains how asynchronous work is scheduled, then teaches the tools you use to coordinate it: callbacks, promises, `async`/`await`, and `fetch`.

You will start with the event loop and timers, then build up to promise chains and API requests. The workshop assembles a multi-step promise pipeline, and the lab adds retry logic around a mocked `fetch`.

## What You Will Be Able To Do
- Explain how the call stack, task queue, and microtask queue cooperate
- Use timers and callbacks, and recognize callback hell
- Create, chain, and combine promises
- Write `async` functions with `await` and handle rejections with `try`/`catch`
- Fetch JSON from an API and check HTTP responses correctly
- Avoid common async mistakes such as `await` inside `forEach`
