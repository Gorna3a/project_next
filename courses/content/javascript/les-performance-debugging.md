---
id: "les-performance-debugging"
type: "theory"
title: "Performance Debugging"
moduleId: "mod-12-under-the-hood"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 20
tags: ["javascript","performance","profiling"]
---

# Concept Overview

Performance work starts with measurement, not guessing. A slow page may be spending time in JavaScript, layout, rendering, or network requests. DevTools and the `performance` API help you find the actual hotspot before you change code.

## Key Principles & Frameworks

Use `performance.now()` for high-resolution timing around a suspected operation.

```js
const start = performance.now();

let total = 0;
for (let i = 0; i < 100000; i += 1) {
  total += i;
}

const end = performance.now();
console.log("Elapsed:", end - start, "ms");
```

`console.time` and `console.timeEnd` provide a quick labeled measurement.

```js
console.time("buildReport");
const report = [1, 2, 3].map((value) => value * 2);
console.timeEnd("buildReport");
```

The DevTools **Performance** panel records a trace. It shows the call stack, scripting, rendering, painting, and idle time. Use the flame chart to find long tasks, then inspect the bottom-up view to see which functions dominate.

A practical optimization loop:
1. Define a measurable scenario and a target.
2. Record or time the current behavior.
3. Find the largest hotspot.
4. Change one thing.
5. Measure again with the same scenario.

Common improvements include choosing a better data structure, avoiding repeated work, batching DOM updates, and reducing unnecessary network requests. For example, a `Set` lookup is faster than scanning an array with `includes` inside a loop when the data grows.

Do not optimize code that is not on the hot path. A clever micro-optimization in a function that runs once is usually worth less than removing a repeated DOM update or an unnecessary request.

## Common Pitfalls & Anti-Patterns
- **Optimizing before measuring**: You may make the code harder to read without improving the actual bottleneck.
- **Measuring an unrealistic scenario**: Use data sizes and interaction patterns that resemble production.
- **Ignoring rendering and network costs**: Not every slow page is a JavaScript problem.
- **Micro-optimizing cold code**: Focus on hotspots that dominate the measured time.
- **Assuming one benchmark generalizes**: Engines, devices, and data shapes vary. Re-measure after changes.

## Quick Summary
- Measure before optimizing and re-measure after each change.
- `performance.now()` and `console.time` provide quick timings.
- The Performance panel shows scripting, rendering, and painting.
- Optimize the largest hotspot, not the most interesting line.
- Prefer algorithmic and data-structure improvements over micro-optimizations.
