---
id: "les-browser-devtools"
type: "theory"
title: "Browser DevTools"
moduleId: "mod-11-modules-iterators-dom"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 15
tags: ["javascript","devtools","debugging","browser"]
---

# Concept Overview

Browser DevTools are the fastest way to inspect what the page actually contains, what network requests it makes, and what your JavaScript is doing. The Elements, Console, Network, and Sources panels cover most day-to-day debugging.

## Key Principles & Frameworks

The **Elements** panel shows the live DOM and CSS. Use it to inspect an element, check its classes and computed styles, and temporarily edit markup. Changes made here are not saved to your source files.

The **Console** panel runs JavaScript in the page context and displays logs and errors. `console.log`, `console.table`, `console.warn`, and `console.error` help you inspect values. The console can also select elements with `$0` after you click them in Elements.

The **Network** panel records requests. Check the request URL, method, status, response body, and timing. Filter by Fetch/XHR, preserve the log across navigation, and throttle the network to test slow connections. A failed request may be a server error, a CORS block, or a client-side bug.

The **Sources** panel lets you set breakpoints, step through code, inspect scope, and watch expressions. A breakpoint pauses execution at a line so you can inspect the actual values instead of guessing.

A practical debugging loop:
1. Reproduce the problem consistently.
2. Inspect the DOM or network evidence.
3. Set a breakpoint or add a focused log.
4. Step through the relevant code and compare actual values with expectations.
5. Fix the cause, then verify the original scenario.

The **Application** panel is useful for storage, cookies, and service workers. The **Performance** panel records runtime work and is covered in Module 12.

## Common Pitfalls & Anti-Patterns
- **Debugging only with `console.log`**: Logs are useful, but breakpoints show scope and call order without editing code.
- **Trusting a stale console**: Clear it or preserve the log deliberately, and remember that old output may be from an earlier run.
- **Editing the DOM and expecting the source to change**: Elements edits are temporary. Update the HTML or JavaScript source.
- **Ignoring the Network status code**: A 404, 500, or CORS failure explains many "the data is missing" bugs.
- **Forgetting to disable breakpoints**: A leftover breakpoint makes the page appear frozen on reload.

## Quick Summary
- Elements inspects and edits the live DOM and CSS.
- Console runs code and shows logs and errors.
- Network shows requests, statuses, responses, and timing.
- Sources provides breakpoints, stepping, scope, and watches.
- Debug by reproducing, inspecting evidence, pausing, and verifying the fix.
