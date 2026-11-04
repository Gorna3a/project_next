---
id: "lab-retry-with-async-await"
type: "lab"
title: "Retry with async/await"
moduleId: "mod-10-asynchronous-javascript"
order: 7
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 40
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["async","await","fetch","retry","errors"]
---

# Objective

Build two helpers for working with a mocked fetch function.

Definitions:
- `fetchJson(fetchFn, url)` calls `fetchFn(url)`, checks `response.ok`, and returns the parsed JSON body. If the response is not ok, throw `new Error("Request failed with status " + response.status)`.
- `fetchWithRetry(fetchFn, url, attempts = 3)` tries `fetchJson` up to `attempts` times. Return the first successful value. If every attempt fails, throw the last error. Do not retry after a success.

## Requirements
- Use `async`/`await` and `try`/`catch`
- Treat non-ok HTTP responses as failures
- Stop immediately when a request succeeds
- Retry only after a failure
- Throw the last error when all attempts fail

## Starter State / Workspace
```js
// Implement fetchJson and fetchWithRetry below
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "fetchJson(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: 1 }) }), '/user')", "expected": { "id": 1 }, "message": "fetchJson should return parsed JSON on success", "weight": 2, "required": true },
  { "type": "function-throws", "call": "fetchJson(() => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) }), '/user')", "errorType": "Error", "message": "fetchJson should throw for a non-ok response", "weight": 2, "required": true },
  { "type": "function-throws", "call": "fetchJson(() => Promise.reject(new Error('offline')), '/user')", "errorType": "Error", "message": "fetchJson should propagate a network rejection" },
  { "type": "function-returns", "call": "(() => { let calls = 0; const mockFetch = () => { calls += 1; if (calls < 3) { return Promise.resolve({ ok: false, status: 500 }); } return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: 1 }) }); }; return fetchWithRetry(mockFetch, '/user', 3).then((data) => ({ data, calls })); })()", "expected": { "data": { "id": 1 }, "calls": 3 }, "message": "fetchWithRetry should succeed after two failures", "weight": 2, "required": true },
  { "type": "function-returns", "call": "(() => { let calls = 0; const mockFetch = () => { calls += 1; return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: 1 }) }); }; return fetchWithRetry(mockFetch, '/user', 3).then((data) => ({ data, calls })); })()", "expected": { "data": { "id": 1 }, "calls": 1 }, "message": "fetchWithRetry should stop after the first success" },
  { "type": "function-throws", "call": "fetchWithRetry(() => Promise.resolve({ ok: false, status: 500 }), '/user', 2)", "errorType": "Error", "message": "fetchWithRetry should throw when every attempt fails", "required": true },
  { "type": "code-contains", "value": "await", "message": "Use await to sequence the requests" },
  { "type": "code-contains", "value": "try", "message": "Use try/catch for retry handling" }
]
```

## Hints
> [!TIP]
> **Hint 1:** In `fetchJson`, `await fetchFn(url)`, then check `response.ok` before calling `response.json()`.

> [!TIP]
> **Hint 2:** In `fetchWithRetry`, keep `let lastError` outside a loop and update it in the `catch` block.

> [!TIP]
> **Hint 3:** `return await fetchJson(...)` inside the `try` exits the function immediately on success, so no further attempts run.

## Reference Solution
```js
async function fetchJson(fetchFn, url) {
  const response = await fetchFn(url);

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  return response.json();
}

async function fetchWithRetry(fetchFn, url, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetchJson(fetchFn, url);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}
```
