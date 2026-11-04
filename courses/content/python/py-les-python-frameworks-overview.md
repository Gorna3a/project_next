---
id: "py-les-python-frameworks-overview"
type: "theory"
title: "Python Frameworks Overview"
moduleId: "py-mod-17-concurrency"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "concurrency", "frameworks", "web"]
---

# Concept Overview

Python web frameworks can be sync or async. Sync frameworks run one request at a time in a worker. Async frameworks await many requests in one event loop.

Frameworks also differ in scope: some are small routers, others are full batteries-included platforms. Choosing a framework is a design decision, not a concurrency shortcut.

This lesson is concept only. The workshop and lab do not test framework code.

## Key Principles & Frameworks

### Sync frameworks: Flask, Django, Pyramid, Plotly Dash

Flask is a small sync framework with a router and minimal defaults. Django is a large sync framework with an ORM, admin, auth, and migration tools. Pyramid is a middle-sized sync framework that lets you add components as needed. Plotly Dash builds interactive dashboards from a sync foundation.

Sync frameworks pair well with blocking libraries. The server uses threads or workers for concurrent requests.

### Async frameworks: FastAPI, Tornado, Sanic, aiohttp, gevent

FastAPI is an async framework built on `asyncio` with automatic API schemas. Tornado started as an async networking library and grew into a framework. Sanic is an async framework that runs on `asyncio`. aiohttp is an async client and server library. gevent uses greenlets to make blocking calls look async.

Async frameworks fit services that wait for many external calls at once. They need async-native libraries for database and HTTP access.

### How to choose

Ask three questions: how many requests wait at once, which libraries are available, and how much framework support do you need.

Many requests that wait on the network favor async. Blocking database code and mature sync libraries favor sync frameworks or threads. Need for an ORM and admin favors Django. Need for a small router favors Flask.

```text
Many waiting requests  -> async framework
Blocking libraries     -> sync framework or threads
Need full platform     -> Django
Need small router       -> Flask
```

## Common Pitfalls & Anti-Patterns
- **Using async without async libraries**: Blocking calls stop the event loop.
- **Assuming async is always faster**: Async helps waiting, not heavy computing.
- **Chosing a framework by hype**: Choose by request pattern, libraries, and team skill.
- **Mixing sync and async access**: Every I/O call in async code must be awaitable.
- **Ignoring deployment workers**: Sync and async frameworks scale differently.
- **Forgetting that frameworks do not fix races**: Shared state still needs synchronization.

## Quick Summary
- Sync frameworks include Flask, Django, Pyramid, and Plotly Dash.
- Async frameworks include FastAPI, Tornado, Sanic, aiohttp, and gevent.
- Async fits many waiting requests. Sync fits blocking libraries.
- Django is a full platform. Flask is a small router.
- This lesson is concept only and is not graded.
