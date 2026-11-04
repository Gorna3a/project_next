---
id: "les-fetch-and-apis"
type: "theory"
title: "Fetch and APIs"
moduleId: "mod-10-asynchronous-javascript"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 25
tags: ["javascript","fetch","api","json"]
---

# Concept Overview

`fetch` is the browser's standard way to make HTTP requests. It returns a promise for a `Response` object. You then check the status and read the body, usually as JSON. A network failure rejects the promise, but an HTTP error such as 404 or 500 does not; you must check `response.ok` yourself.

## Key Principles & Frameworks

Call `fetch` with a URL, then await the response. Check `response.ok` before reading the body.

```js
async function getUser(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  return response.json();
}

getUser("https://example.com/api/user/1")
  .then((user) => console.log(user.name))
  .catch((error) => console.log(error.message));
```

`response.json()` also returns a promise, so it must be awaited or returned. `fetch` rejects for network-level failures such as a dropped connection or an invalid URL; it resolves for HTTP error statuses.

Send data with a POST request by providing method, headers, and a JSON body.

```js
async function createUser(user) {
  const response = await fetch("https://example.com/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Could not create user: " + response.status);
  }

  return response.json();
}
```

Before `fetch` was widely available, browsers used `XMLHttpRequest`. It is event-based and more verbose, but you may still encounter it in older code. New code should use `fetch`.

## Common Pitfalls & Anti-Patterns
- **Forgetting to check `response.ok`**: A 404 or 500 still resolves the fetch promise. Check the status before trusting the body.
- **Forgetting to await `response.json()`**: The method returns a promise, not the parsed object.
- **Assuming `fetch` rejects on HTTP errors**: It only rejects on network-level failures unless you throw yourself.
- **Ignoring CORS**: Browsers block cross-origin responses unless the server sends the right CORS headers.
- **Putting secrets in frontend code**: Anything shipped to the browser is visible. Keep API keys on the server.
- **Not handling network errors**: Wrap the request in `try`/`catch` or attach `.catch` to the promise.

## Quick Summary
- `fetch` returns a promise for a `Response`.
- Network failures reject; HTTP error statuses do not.
- Check `response.ok` or `response.status` before reading the body.
- `response.json()` returns a promise.
- Use `fetch` for new code; `XMLHttpRequest` is the older event-based API.
