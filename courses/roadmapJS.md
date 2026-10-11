# roadmapJS.md: JavaScript Course Build Roadmap (for the AI author)

> **You are the AI author.** This file is your complete work order for building the course
> "JavaScript Fundamentals" for PixelCode. Follow Section 7 (Execution Protocol) step by step.
> Never skip ahead, and never generate more than one step per reply.

---

## 1. Inputs You Must Have Before Starting

The human will attach these. If any is missing, ask for it and stop.

- `_spec.md` (shared enums, ordering rule, test DSL)
- The 8 templates: `course.md`, `module.md`, `theory-lesson.md`, `workshop.md`, `lab.md`, `quiz.md`, `review.md`, `certification-project.md`
- `lastUpdated` date to use (format `YYYY-MM-DD`)

## 2. Global Rules (apply to every file)

1. Follow each template EXACTLY: same frontmatter fields, same order, same heading structure.
2. Replace every `[PLACEHOLDER]`. Delete every `<!-- Instruction for AI/Author -->` comment and every `# [REQUIRED]` / `# [OPTIONAL]` comment from final output.
3. Use only enum values from `_spec.md`. Every generated file gets `status: "draft"`, `language: "en"`.
4. IDs are kebab-case and exactly as listed in Section 5. Never invent or rename IDs.
5. `order` values are exactly as listed in Section 5.
6. **Concept ledger rule:** a lesson, workshop, lab, or quiz may only use concepts introduced in the same or earlier lessons (see "Introduces" column). Exceptions are the **preview allowances** in 2.8.
7. Teach one concept per lesson. Theory lessons are 10-20 minutes. Short sentences. Explain jargon on first use.
8. **Preview allowances (usable before formally taught, with a one-line explanation):**
   `console.log()`, template literals, `+ - * /`, and string concatenation (from Module 2 on).
9. **Runtime:** JavaScript (ES2023) in a sandbox. Either Node 20 or a browser-like environment.
   - No network (any `fetch` in tests is mocked), no `Date.now()`/`Math.random()` in graded code, no user input unless the test supplies it.
   - Modules 1-5 graded code is scripts, so use `output-equals` / `output-contains`.
   - From Module 6 on, use `function-returns` / `function-throws`.
   - Module 11 uses `dom-selector` tests.
10. Every solution you write MUST pass its own tests. Trace each test against the solution before output. Fix any mismatch silently.
11. Labs and workshops must never leak the answer in instructions or hints. Hints go from conceptual to specific.
12. Tests use ONLY the test types in `_spec.md`. Weights are integers. Mark essential tests `required: true`.
13. Counts per module: 3-6 theory lessons, 1 workshop (3-5 steps), 1 lab, 1 review, 1 quiz (8 questions mixing `single`, `multiple`, `true-false`, `code-output`).
14. Every theory lesson includes the pitfalls listed for that module in Section 5, plus any you consider important.
15. Tone: clear, encouraging, no filler, no emojis.
16. **Parser contract:** an import script parses these files mechanically. Name every file `<id>.md`. Never rename or reorder headings, never change frontmatter keys, and keep exactly the structures defined in `_spec.md` ("Parser contract"): `## Step N: Title` in workshops, `<!-- meta: {...} -->` in quiz questions, `> **Hint N:**` lines in labs, the rubric table columns, and fenced `json` test blocks. Do not leave YAML comments in frontmatter.

## 3. Course Metadata (use to fill `course.md`)

```yaml
id: "javascript-fundamentals"
type: "course"
title: "JavaScript Fundamentals"
slug: "javascript-fundamentals"
domain: "Web Development"
difficulty: "beginner"
status: "draft"
language: "en"
estimatedHours: 40
version: "1.0.0"
tags: ["javascript", "programming", "web", "es6"]
prerequisites: []
description: "Learn JavaScript from your first line of code to asynchronous programming, classes, and the DOM, with hands-on workshops, labs, and a certification project."
```

Learning objectives (use these, polished): write and run JavaScript programs; use variables, types, operators, and control flow correctly; design reusable functions; model data with arrays, objects, and JSON; handle errors; use closures, `this`, and classes; write asynchronous code with promises and `async/await`; manipulate the DOM.
Prerequisite knowledge: none. Basic computer literacy only.

## 4. Module Overview

| Order | Module ID | Title | Difficulty | Est. hours |
| :-- | :--- | :--- | :--- | :--- |
| 1 | `mod-01-getting-started` | Getting Started | beginner | 2 |
| 2 | `mod-02-variables-and-scope` | Variables & Scope Basics | beginner | 3 |
| 3 | `mod-03-data-types-and-conversion` | Data Types & Conversion | beginner | 3 |
| 4 | `mod-04-operators-and-comparison` | Operators & Comparison | beginner | 3 |
| 5 | `mod-05-control-flow` | Control Flow | beginner | 3 |
| 6 | `mod-06-functions` | Functions | beginner | 4 |
| 7 | `mod-07-arrays-objects-json` | Arrays, Objects & JSON | intermediate | 5 |
| 8 | `mod-08-errors-and-strict-mode` | Errors & Strict Mode | intermediate | 3 |
| 9 | `mod-09-closures-this-classes` | Closures, `this` & Classes | intermediate | 5 |
| 10 | `mod-10-asynchronous-javascript` | Asynchronous JavaScript | intermediate | 5 |
| 11 | `mod-11-modules-iterators-dom` | Modules, Iterators & the DOM | intermediate | 4 |
| 12 | `mod-12-under-the-hood` | Under the Hood (advanced, optional) | advanced | 3 |

Each module's `courseId` is `javascript-fundamentals`. Each module's `prerequisites` is the previous module ID (Module 1: `[]`). Module 12 is optional. Mark this in its description, and the capstone must NOT require it.

## 5. Module Blueprints

Content order inside every module: theory lessons → workshop → lab → review → quiz. Review `covers` lists every lesson, the workshop, and the lab of that module.

### Module 1: `mod-01-getting-started`
Pitfalls to cover: confusing Java with JavaScript; thinking browser JS and Node are identical.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-what-is-javascript` | theory | what JS is, history, where it runs |
| 2 | `les-javascript-versions` | theory | ECMAScript, versions, compatibility |
| 3 | `les-running-javascript` | theory | browser console, `<script>`, Node, `console.log` |
| 4 | `ws-first-script` | workshop | print text, multiple values, comments (3 steps) |
| 5 | `lab-greeting-printer` | lab | print a formatted greeting from given constants |
| 6 | `rev-getting-started` | review | |
| 7 | `quiz-getting-started` | quiz | |

### Module 2: `mod-02-variables-and-scope`
Pitfalls: `var` leaking out of blocks; `const` objects are still mutable; using a variable before declaration; reassigning `const`; accidental globals.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-declaring-variables` | theory | `var`, `let`, `const`, assignment |
| 2 | `les-variable-naming-rules` | theory | naming rules, conventions (camelCase) |
| 3 | `les-scope-basics` | theory | block, function, global scope |
| 4 | `les-hoisting` | theory | hoisting of `var`/`let`/`const`, TDZ |
| 5 | `ws-tip-calculator` | workshop | variables + arithmetic + template literals |
| 6 | `lab-fix-the-scope` | lab | repair a script with scope/declaration bugs |
| 7 | `rev-variables-and-scope` | review | |
| 8 | `quiz-variables-and-scope` | quiz | |

### Module 3: `mod-03-data-types-and-conversion`
Pitfalls: `typeof null`; `NaN !== NaN`; `0.1 + 0.2`; `"5" + 1` vs `"5" - 1`; falsy values.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-primitive-types` | theory | string, number, boolean, null, undefined, bigint, symbol |
| 2 | `les-typeof-and-special-values` | theory | `typeof`, `NaN`, `Infinity`, `null` vs `undefined` |
| 3 | `les-explicit-conversion` | theory | `Number()`, `String()`, `Boolean()`, `parseInt`, `parseFloat` |
| 4 | `les-implicit-coercion` | theory | coercion vs conversion, truthy/falsy |
| 5 | `ws-type-inspector` | workshop | inspect and convert values |
| 6 | `lab-safe-number-parser` | lab | convert given string inputs to numbers, report invalid ones |
| 7 | `rev-data-types` | review | |
| 8 | `quiz-data-types` | quiz | |

### Module 4: `mod-04-operators-and-comparison`
Pitfalls: `==` coercion surprises; chained comparisons (`1 < 2 < 3`); `||` vs `??`; integer vs float division; operator precedence.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-arithmetic-assignment-operators` | theory | arithmetic, compound assignment, `++`/`--`, `**`, `%` |
| 2 | `les-equality-and-comparison` | theory | `==`, `===`, `Object.is`, `<`, `>`, `<=`, `>=` |
| 3 | `les-logical-and-conditional-operators` | theory | `&&`, `\|\|`, `!`, `??`, ternary, short-circuit |
| 4 | `les-other-operators` | theory | unary, string, comma, bitwise (overview), BigInt operators |
| 5 | `ws-comparison-playground` | workshop | evaluate and predict comparisons |
| 6 | `lab-eligibility-checker` | lab | decide eligibility from given constants using operators only |
| 7 | `rev-operators` | review | |
| 8 | `quiz-operators` | quiz | |

Move deep-dive items (`isLooselyEqual`, `isStrictlyEqual`, `SameValueZero`, equality algorithms) into the review sheet only.

### Module 5: `mod-05-control-flow`
Pitfalls: off-by-one in loops; infinite loops; missing `break` in `switch`; assignment `=` inside `if`.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-conditionals` | theory | `if`/`else if`/`else`, `switch` |
| 2 | `les-loops` | theory | `for`, `while`, `do...while` |
| 3 | `les-break-continue-patterns` | theory | `break`, `continue`, nested loops, common patterns |
| 4 | `ws-fizzbuzz-and-friends` | workshop | classic loop/conditional exercises |
| 5 | `lab-number-patterns` | lab | print number/star patterns with loops |
| 6 | `rev-control-flow` | review | |
| 7 | `quiz-control-flow` | quiz | |

(`for...in` and `for...of` are taught in Module 7 together with arrays and objects.)

### Module 6: `mod-06-functions`
Pitfalls: forgetting `return`; confusing parameters and arguments; mutating inputs; missing base case in recursion; arrow functions are not hoisted like declarations. Do not teach `this` in arrow functions here (Module 9).

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-function-basics` | theory | declarations, expressions, parameters, `return`, function hoisting |
| 2 | `les-arrow-functions` | theory | arrow syntax, implicit return |
| 3 | `les-default-and-rest-parameters` | theory | default params, rest, spread in calls |
| 4 | `les-recursion` | theory | recursion, base case, call stack basics |
| 5 | `les-iifes-and-arguments` | theory | IIFEs, the `arguments` object, built-in functions overview |
| 6 | `ws-utility-library` | workshop | build 3-5 small utility functions |
| 7 | `lab-recursive-toolkit` | lab | factorial, fibonacci, sum of digits (`function-returns` tests) |
| 8 | `rev-functions` | review | |
| 9 | `quiz-functions` | quiz | |

From this module on, labs use `function-returns` tests.

### Module 7: `mod-07-arrays-objects-json`
Pitfalls: `sort()` is lexicographic by default; `map`/`filter` do not mutate but `sort`/`reverse` do; copying by reference vs value; `JSON.stringify` drops `undefined`/functions; forgetting `reduce`'s initial value.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-arrays` | theory | creating, indexing, `push`/`pop`/`slice`/`splice`, destructuring |
| 2 | `les-array-methods` | theory | `map`, `filter`, `reduce`, `find`, `some`, `every`, `sort`, callbacks |
| 3 | `les-objects` | theory | literals, properties, methods shorthand, spread, destructuring, `Object.keys/values/entries` |
| 4 | `les-iterating-collections` | theory | `for...of`, `for...in`, when to use which |
| 5 | `les-map-and-set` | theory | `Map`, `Set`, `WeakMap`/`WeakSet` (brief) |
| 6 | `les-json` | theory | `JSON.stringify`, `JSON.parse`, structured data |
| 7 | `ws-student-records` | workshop | process an array of objects with array methods |
| 8 | `lab-inventory-report` | lab | summarize inventory data and return JSON |
| 9 | `rev-arrays-objects-json` | review | include typed arrays as a short note |
| 10 | `quiz-arrays-objects-json` | quiz | |

### Module 8: `mod-08-errors-and-strict-mode`
Pitfalls: swallowing errors in empty `catch`; throwing strings instead of Error objects; `return` inside `finally`; strict-mode silent-failure differences.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-try-catch-finally` | theory | `try`, `catch`, `finally`, error flow |
| 2 | `les-throw-and-error-objects` | theory | `throw`, `Error`, subclasses, custom errors (basic), `error.message`/`name` |
| 3 | `les-strict-mode` | theory | `"use strict"`, what it changes |
| 4 | `ws-safe-json-parser` | workshop | wrap risky parsing with error handling |
| 5 | `lab-validation-errors` | lab | throw correct errors; use `function-throws` and `function-returns` |
| 6 | `rev-errors-and-strict-mode` | review | |
| 7 | `quiz-errors-and-strict-mode` | quiz | |

### Module 9: `mod-09-closures-this-classes`
Pitfalls: closures in loops with `var`; losing `this` when passing methods as callbacks; arrow functions vs `this`; forgetting `new`; modifying prototypes of built-ins.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-lexical-scope-and-closures` | theory | lexical scoping, closures, practical uses |
| 2 | `les-this-keyword` | theory | `this` in methods, functions, alone, event handlers, arrow functions |
| 3 | `les-call-apply-bind` | theory | explicit binding, function borrowing |
| 4 | `les-prototypes-and-inheritance` | theory | prototype chain, prototypal inheritance, `Object.create` |
| 5 | `les-classes` | theory | `class`, `constructor`, `extends`, `super`, `static`, getters/setters, private fields |
| 6 | `ws-counter-and-bank-account` | workshop | closures then classes for the same problem |
| 7 | `lab-class-hierarchy` | lab | build a small inheritance hierarchy |
| 8 | `rev-closures-this-classes` | review | |
| 9 | `quiz-closures-this-classes` | quiz | |

### Module 10: `mod-10-asynchronous-javascript`
Pitfalls: forgetting `await`; `await` inside `forEach`; unhandled rejections; callback hell; assuming `setTimeout(fn, 0)` runs immediately; not returning promises from `.then`.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-event-loop` | theory | call stack, task/microtask queues, event loop |
| 2 | `les-callbacks-and-timers` | theory | `setTimeout`, `setInterval`, callbacks, callback hell |
| 3 | `les-promises` | theory | creating, chaining, `catch`, `Promise.all`/`allSettled`/`race` |
| 4 | `les-async-await` | theory | `async`/`await`, error handling with `try/catch` |
| 5 | `les-fetch-and-apis` | theory | `fetch`, status handling, JSON responses; `XMLHttpRequest` as a short historical note |
| 6 | `ws-promise-pipeline` | workshop | chain promise-returning functions (timer-based, deterministic) |
| 7 | `lab-retry-with-async-await` | lab | retry logic against a mocked `fetch` |
| 8 | `rev-asynchronous-javascript` | review | |
| 9 | `quiz-asynchronous-javascript` | quiz | |

All timers in tests must be deterministic. Use mocked or fake timers and a mocked `fetch`.

### Module 11: `mod-11-modules-iterators-dom`
Pitfalls: mixing CommonJS and ESM; forgetting to remove event listeners; `querySelector` returning `null`; `innerHTML` and XSS; generators are lazy.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-modules-commonjs-esm` | theory | `require`/`module.exports`, `import`/`export` |
| 2 | `les-iterators-and-generators` | theory | iterator protocol, `function*`, `yield` |
| 3 | `les-dom-selecting-and-changing` | theory | `querySelector`, creating/updating elements, `textContent` |
| 4 | `les-dom-events` | theory | `addEventListener`, event object, delegation |
| 5 | `les-browser-devtools` | theory | Elements, Console, Network, Sources tabs; debugging basics |
| 6 | `ws-todo-dom` | workshop | DOM-driven to-do list (`dom-selector` tests) |
| 7 | `lab-event-toggle-list` | lab | toggle list items via events |
| 8 | `rev-modules-iterators-dom` | review | |
| 9 | `quiz-modules-iterators-dom` | quiz | |

### Module 12: `mod-12-under-the-hood` (advanced, optional)
Pitfalls: accidental globals; forgotten timers/listeners; closures retaining large objects; premature optimization.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-memory-lifecycle-and-gc` | theory | allocate/use/release, garbage collection, reachability |
| 2 | `les-memory-leaks` | theory | common leak patterns and how to find them |
| 3 | `les-performance-debugging` | theory | profiling basics, measuring, avoiding premature optimization |
| 4 | `ws-leak-hunt` | workshop | identify and fix leaks in given code |
| 5 | `lab-optimize-the-loop` | lab | speed up code while keeping results identical (`function-returns` + `code-not-contains` for banned slow patterns) |
| 6 | `rev-under-the-hood` | review | |
| 7 | `quiz-under-the-hood` | quiz | |

## 6. Certification Project (generate last)

```yaml
id: "cert-javascript-fundamentals"
type: "certification-project"
title: "Library Management Toolkit"
scope: "course"
targetId: "javascript-fundamentals"
difficulty: "intermediate"
passingGradePercent: 80
estimatedHours: 4
```

Scenario: build a small library management toolkit as a single module of exported functions and one class.
Required skills: Modules 2-10 only (do not require Modules 11-12).
Deliverables: (1) a `Book`/`Library` class pair; (2) functions to search, filter, and report with array methods; (3) JSON export/import with validation errors; (4) an async `checkoutBook` using a mocked delay.
Rubric weights must sum to 100. At least two requirements are `required: true`. Tests use only `function-returns`, `function-throws`, `code-contains`, and `code-not-contains`.

## 7. Execution Protocol (follow in order, ONE step per reply)

After each step, end your reply with the **Handoff Block** (Section 8). Then STOP and wait for the human to say "next".

| Step | Do this | Output |
| :-- | :--- | :--- |
| 0 | Confirm the inputs in Section 1 are attached and restate the date and the 12 module IDs | A short checklist |
| 1 | Fill the `course.md` template from Section 3 | `javascript-fundamentals.md` |
| 2 | Module 1: the module file (`mod-01-getting-started.md`, from the `module.md` template), then all theory lessons | files, then Handoff |
| 3 | Module 1: workshop, lab | files, then Handoff |
| 4 | Module 1: review, quiz | files, then Handoff |
| 5-7 | Module 2 (same three sub-steps) | ... |
| ... | Repeat the three sub-steps (module+lessons / workshop+lab / review+quiz) for Modules 3-12 | ... |
| Last | Certification project | `cert-javascript-fundamentals.md`, then Handoff |
| Audit | Run the audit in Section 9 across everything | Problem list + corrected files only |

Large modules (6, 7, 9, 10, 11) may split theory lessons across two replies, but never split a single file.
Each file goes in its own code block, preceded by its filename on a line by itself (use the ID, e.g. `les-what-is-javascript.md`).

## 8. Handoff Block (append to the end of every reply)

```
HANDOFF
Completed: [list of IDs generated so far, in order]
Last step: [step number]
Next step: [step number + what it covers]
Concepts now available to students: [comma-separated, cumulative]
Open issues: [anything uncertain, or "none"]
```

If the conversation is restarted, the human will paste the latest Handoff Block along with this file. Resume from "Next step" without regenerating anything.

## 9. Final Audit Checklist

The human also runs a validator script that checks structure, enums, IDs, orders and test formats. Your audit covers what the script cannot: concept order, solutions versus tests, answer leaks, and writing quality.

Report only problems, then output corrected files:

- Missing or invalid frontmatter fields, or invalid enum values
- IDs that don't match Section 5 or their parents; duplicate or skipped `order` values
- Concepts used before they are introduced (check against the "Introduces" columns and the preview allowances)
- Solutions that fail their own tests, or tests using types not in `_spec.md`
- Hints or instructions that give away an answer
- Review `covers` that don't list real IDs
- Quiz not meeting the 8-question, mixed-type requirement
- Leftover placeholders or author comments
- Capstone requirements that depend on Modules 11-12, or weights that don't sum to 100
