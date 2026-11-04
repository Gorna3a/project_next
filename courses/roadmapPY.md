# roadmapPY.md: Python Course Build Roadmap (for the AI author)

> **You are the AI author.** This file is your complete work order for building the course
> "Python Programming" for PixelCode. Follow Section 7 (Execution Protocol) step by step.
> Never skip ahead, and never generate more than one step per reply.

Source: the roadmap.sh Python roadmap (`python.pdf`). Section 4 maps every roadmap topic to a module.

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
4. IDs are kebab-case and exactly as listed in Section 5, with one platform requirement: prefix every Python module, lesson, workshop, lab, review, and quiz ID with `py-` (for example, `py-mod-01-getting-started`). The JavaScript course already uses several identical base IDs, and document IDs must be unique across the platform. Never invent or rename the base ID.
5. `order` values are exactly as listed in Section 5.
6. **Concept ledger rule:** a lesson, workshop, lab, or quiz may only use concepts introduced in the same or earlier lessons (see "Introduces" column). Exceptions are the **preview allowances** in 2.8.
7. Teach one concept per lesson. Theory lessons are 10-20 minutes. Short sentences. Explain jargon on first use.
8. **Preview allowances (usable before formally taught, with a one-line explanation):**
   - From Module 2 on: `print()`, f-strings, `+ - * /`, string concatenation, `len()`.
   - Module 8 only: the custom exception template `class ValidationError(Exception): pass` (classes are taught in Module 9) and `with open(...) as f` (explain it as "closes the file automatically"; the full `with` protocol is taught in Module 11).
   - Module 9 only: decorator syntax such as `@property`, `@staticmethod`, `@classmethod`, `@dataclass`, `@abstractmethod` (explain it as "modifies the function or class below it"; decorators are taught in Module 11).
9. **Runtime:** Python 3.12 in a sandbox, standard library only.
   - No network, no installed third-party packages (`pytest`, `pydantic`, `mypy`, `black`, `ruff`, `requests` and similar are NOT available). Lessons about them show commands and snippets in non-graded `bash`, `toml` or `text` code blocks. Graded code never imports them.
   - No `datetime.now()`, `date.today()`, `time.time()`, `random`, or `input()` in graded code unless the test supplies the input. Use fixed dates and fixed values.
   - Modules 1-4 graded code is scripts, so use `output-equals` / `output-contains`.
   - From Module 5 on, use `function-returns` / `function-throws`. Modules 8, 15 and 16 may also use `file-exists` / `file-contains`. For file tests, the student script itself must create the file when it runs (top-level code), because tests run against the workspace after the script executes.
   - `function-returns`: `call` is a single valid Python expression. `expected` must be JSON-representable. Tuples compare as lists, so make functions return lists, or wrap in `list(...)` / `sorted(...)` inside `call`. Never return a set to a test. Wrap floats in `round(..., 2)` inside `call`.
   - Concurrency tests (Module 17) must be deterministic: sort results, use `asyncio.sleep(0)` instead of real delays, and never test `multiprocessing` output.
10. Every solution you write MUST pass its own tests. Trace each test against the solution before output. Fix any mismatch silently.
11. Labs and workshops must never leak the answer in instructions or hints. Hints go from conceptual to specific.
12. Tests use ONLY the test types in `_spec.md`. Weights are integers. Mark essential tests `required: true`.
13. Counts per module: 3-6 theory lessons, 1 workshop (3-5 steps), 1 lab, 1 review, 1 quiz (8 questions mixing `single`, `multiple`, `true-false`, `code-output`).
14. Every theory lesson includes the pitfalls listed for that module in Section 5, plus any you consider important.
15. Tone: clear, encouraging, no filler, no emojis.
16. **Parser contract:** an import script parses these files mechanically. Name every file `<id>.md`. Never rename or reorder headings, never change frontmatter keys, and keep exactly the structures defined in `_spec.md` ("Parser contract"): `## Step N: Title` in workshops, `<!-- meta: {...} -->` in quiz questions, `> **Hint N:**` lines in labs, the rubric table columns, and fenced `json` test blocks. Do not leave YAML comments in frontmatter.
17. **Python style in all code blocks:** PEP 8, 4-space indentation (never tabs), `snake_case` names, `PascalCase` classes, double-quoted strings used consistently. Fence every Python block as `python`. Do not use type hints before Module 9 (dataclass fields only) and Module 16 (general use).

## 3. Course Metadata (use to fill `course.md`)

```yaml
id: "python-programming"
type: "course"
title: "Python Programming"
slug: "python-programming"
domain: "Programming"
difficulty: "beginner"
status: "draft"
language: "en"
estimatedHours: 65
version: "1.0.0"
tags: ["python", "programming", "oop", "algorithms"]
prerequisites: []
description: "Learn Python from your first script to object-oriented design, decorators, algorithms, and data structures, with hands-on workshops, labs, and a certification project."
```

Learning objectives (use these, polished): write and run Python programs; use variables, types, operators, and control flow correctly; design reusable functions; model data with lists, tuples, sets, and dictionaries; handle exceptions and work with files and JSON; build classes with inheritance and special methods; write Pythonic code with comprehensions, generators, decorators, and context managers; analyze algorithms and implement core data structures; manage environments and packages, add type hints, and test your code.
Prerequisite knowledge: none. Basic computer literacy only.

## 4. Module Overview

| Order | Module ID | Title | Difficulty | Est. hours |
| :-- | :--- | :--- | :--- | :--- |
| 1 | `mod-01-getting-started` | Getting Started | beginner | 2 |
| 2 | `mod-02-variables-and-data-types` | Variables & Data Types | beginner | 4 |
| 3 | `mod-03-operators-and-conditionals` | Operators & Conditionals | beginner | 3 |
| 4 | `mod-04-loops` | Loops | beginner | 3 |
| 5 | `mod-05-functions` | Functions | beginner | 4 |
| 6 | `mod-06-collections` | Lists, Tuples, Sets & Dictionaries | beginner | 5 |
| 7 | `mod-07-modules-and-standard-library` | Modules & the Standard Library | intermediate | 3 |
| 8 | `mod-08-exceptions-and-files` | Exceptions & Files | intermediate | 4 |
| 9 | `mod-09-object-oriented-programming` | Object-Oriented Programming | intermediate | 5 |
| 10 | `mod-10-iteration-and-functional-tools` | Iteration & Functional Tools | intermediate | 4 |
| 11 | `mod-11-decorators-and-context-managers` | Decorators & Context Managers | intermediate | 4 |
| 12 | `mod-12-regular-expressions` | Regular Expressions | intermediate | 3 |
| 13 | `mod-13-recursion-and-algorithms` | Recursion & Algorithms | intermediate | 5 |
| 14 | `mod-14-data-structures` | Data Structures | intermediate | 5 |
| 15 | `mod-15-environments-and-packaging` | Environments & Packaging | intermediate | 3 |
| 16 | `mod-16-typing-testing-and-quality` | Typing, Testing & Code Quality | intermediate | 4 |
| 17 | `mod-17-concurrency` | Concurrency (advanced, optional) | advanced | 4 |

Each module's `courseId` is `python-programming`. Each module's `prerequisites` is the previous module ID (Module 1: `[]`). Module 17 is optional. Mark this in its description, and the capstone must NOT require it.

### Roadmap Coverage Map (python.pdf to modules)

| Roadmap topic | Module |
| :--- | :-- |
| Basic Syntax | 1 |
| Variables and Data Types, Type Casting | 2 |
| Conditionals | 3 |
| Loops | 4 |
| Functions, Builtin Functions | 5 |
| Lists, Tuples, Sets, Dictionaries | 6 |
| Modules | 7 |
| Exceptions | 8 |
| Object Oriented Programming (Classes, Inheritance, Methods, Dunder) | 9 |
| Lambdas, Iterators, List Comprehensions, Generator Expressions | 10 |
| Decorators, Context Manager | 11 |
| Regular Expressions | 12 |
| Recursion, Sorting Algorithms | 13 |
| Arrays and Linked Lists, Heaps/Stacks/Queues, Hash Tables, Binary Search Tree | 14 |
| Package Managers (PyPI/Pip, Conda, Poetry), Configuration (uv, pyproject.toml, Pipenv, virtualenv, pyenv) | 15 |
| Static Typing (Pydantic, mypy, pyright, pyre), Code Formatting (ruff, black, yapf), Documentation (Sphinx), Testing (doctest, nose, pytest, unittest, tox) | 16 |
| Concurrency (GIL, Threading, Multiprocessing, Asynchrony) | 17 |
| Learn a Framework (Flask, Django, FastAPI, Pyramid, Plotly Dash, Tornado, Sanic, aiohttp, gevent) | 17 (overview lesson only) |
| DevOps | Out of scope (belongs to a separate course) |

## 5. Module Blueprints

Content order inside every module: theory lessons → workshop → lab → review → quiz. Review `covers` lists every lesson, the workshop, and the lab of that module.

### Module 1: `mod-01-getting-started`
Pitfalls to cover: confusing Python 2 with Python 3; indentation errors; thinking the interactive shell (REPL) and scripts behave identically (the REPL echoes values); `python` vs `python3` pointing to different installations.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-what-is-python` | theory | what Python is, history, interpreted language, where it is used |
| 2 | `les-python-versions-and-implementations` | theory | Python 3 vs 2, version numbers, CPython and PyPy, PEPs |
| 3 | `les-running-python` | theory | the REPL, running a script, `print`, comments |
| 4 | `les-basic-syntax` | theory | indentation and blocks, statements, line continuation, case sensitivity, PEP 8 basics |
| 5 | `ws-first-script` | workshop | print text, multiple values with `sep`/`end`, comments (3 steps) |
| 6 | `lab-greeting-printer` | lab | print a formatted greeting from given constants |
| 7 | `rev-getting-started` | review | |
| 8 | `quiz-getting-started` | quiz | |

### Module 2: `mod-02-variables-and-data-types`
Pitfalls: `/` always returns a float; `0.1 + 0.2`; `"5" + 1` raises `TypeError`; `int("3.5")` raises `ValueError`; strings are immutable; empty containers and `0` are falsy; a name is a label for an object, not a box.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-variables-and-naming` | theory | assignment, dynamic typing, naming rules, `snake_case`, constants by convention, multiple assignment, swapping |
| 2 | `les-numbers` | theory | `int`, `float`, `complex` (brief), underscores in literals, float precision |
| 3 | `les-strings` | theory | quotes, escapes, multiline strings, indexing, slicing, immutability, common methods, f-strings |
| 4 | `les-booleans-and-none` | theory | `bool`, `None`, truthy and falsy values |
| 5 | `les-type-casting` | theory | `type()`, `int()`, `float()`, `str()`, `bool()`, implicit int-to-float conversion |
| 6 | `ws-type-inspector` | workshop | inspect and convert values |
| 7 | `lab-type-conversion-report` | lab | convert given string constants to numbers and print a report using f-strings and `type()` |
| 8 | `rev-variables-and-data-types` | review | |
| 9 | `quiz-variables-and-data-types` | quiz | |

No `if` and no `try` yet. Safe parsing of invalid input is taught in Module 8.

### Module 3: `mod-03-operators-and-conditionals`
Pitfalls: `==` vs `is`; `=` instead of `==` in a condition (a `SyntaxError` in Python); `and`/`or` return operands, not always booleans; `/` vs `//` and floor division of negatives; missing colon or inconsistent indentation; a `match` case does not fall through.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-arithmetic-and-assignment-operators` | theory | `+ - * / // % **`, compound assignment, precedence, `divmod` |
| 2 | `les-comparison-and-identity-operators` | theory | `== != < > <= >=`, chained comparison, `is`/`is not`, `in`/`not in` (strings only for now) |
| 3 | `les-logical-operators-and-ternary` | theory | `and`, `or`, `not`, short-circuit evaluation, conditional expression |
| 4 | `les-conditionals` | theory | `if`/`elif`/`else`, nested conditions, indentation |
| 5 | `les-match-statement` | theory | `match`/`case`: literals, or-patterns, guards, wildcard `_` (Python 3.10+) |
| 6 | `ws-comparison-playground` | workshop | evaluate and predict comparisons |
| 7 | `lab-eligibility-checker` | lab | decide eligibility from given constants using operators and conditionals |
| 8 | `rev-operators-and-conditionals` | review | |
| 9 | `quiz-operators-and-conditionals` | quiz | |

Move bitwise operators, the walrus operator `:=`, and integer interning (`is` deep dive) into the review sheet only.

### Module 4: `mod-04-loops`
Pitfalls: off-by-one with `range`; infinite `while` loops; forgetting to update the loop variable; the loop `else` clause confusing readers; `range(len(x))` when direct iteration is simpler.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-for-loops-and-range` | theory | `for`, `range(start, stop, step)`, iterating over a string |
| 2 | `les-while-loops` | theory | `while`, counters, sentinel values, avoiding infinite loops |
| 3 | `les-break-continue-else` | theory | `break`, `continue`, loop `else`, `pass` |
| 4 | `les-nested-loops-and-patterns` | theory | nested loops, accumulators, common patterns |
| 5 | `ws-fizzbuzz-and-friends` | workshop | classic loop and conditional exercises |
| 6 | `lab-number-patterns` | lab | print number and star patterns with loops |
| 7 | `rev-loops` | review | |
| 8 | `quiz-loops` | quiz | |

(`enumerate`, `zip`, and iteration over lists and dictionaries are taught in Module 6.)

### Module 5: `mod-05-functions`
Pitfalls: forgetting `return` (the function returns `None`); `print` vs `return`; mutable default arguments; confusing parameters and arguments; shadowing built-ins such as `sum` or `max`; assigning to a global without `global`. Do not teach recursion (Module 13), lambdas (Module 10), or closures (Module 11) here.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-function-basics` | theory | `def`, parameters, `return`, `None`, docstrings, calling functions |
| 2 | `les-arguments-and-parameters` | theory | positional, keyword, default values, keyword-only parameters (brief) |
| 3 | `les-args-and-kwargs` | theory | `*args`, `**kwargs`, unpacking arguments in calls |
| 4 | `les-scope-and-legb` | theory | local, enclosing, global, built-in scope, `global`, `nonlocal` |
| 5 | `les-builtin-functions` | theory | `abs`, `round`, `min`, `max`, `sum` with `range`, `pow`, `divmod`, `isinstance`, `help`, `dir` |
| 6 | `ws-utility-library` | workshop | build 3-5 small utility functions using only numbers and strings |
| 7 | `lab-string-and-number-helpers` | lab | clamp, average of `*args`, palindrome check (`function-returns` tests) |
| 8 | `rev-functions` | review | |
| 9 | `quiz-functions` | quiz | |

From this module on, labs use `function-returns` tests. (`sorted`, `any`, `all`, `enumerate`, `zip` are taught in Module 6.)

### Module 6: `mod-06-collections`
Pitfalls: `b = a` copies a reference, not the list; `[[0] * 3] * 3` shares rows; `sort()` returns `None` while `sorted()` returns a new list; a one-item tuple needs a trailing comma; `{}` is an empty dict, not an empty set; `KeyError` vs `.get()`; modifying a list while iterating over it; dictionary keys must be hashable.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-lists` | theory | creating, indexing, slicing, `append`/`extend`/`insert`/`pop`/`remove`/`sort`/`reverse`, `in`, nested lists |
| 2 | `les-tuples-and-unpacking` | theory | tuples, immutability, packing and unpacking, starred unpacking |
| 3 | `les-sets` | theory | set literals, `add`/`discard`, union, intersection, difference, removing duplicates, `frozenset` (brief) |
| 4 | `les-dictionaries` | theory | creating, access, `get`, `keys`/`values`/`items`, `update`, `setdefault`, `\|` merge, nested dictionaries |
| 5 | `les-iterating-collections` | theory | `for` over collections, `enumerate`, `zip`, `sorted`, `reversed`, `any`, `all`, `min`/`max`/`sum` over a collection |
| 6 | `les-mutability-and-copying` | theory | mutable vs immutable, aliasing, shallow copies with `[:]`, `.copy()`, `list()` |
| 7 | `ws-student-records` | workshop | process a list of dictionaries |
| 8 | `lab-inventory-report` | lab | summarize inventory data and return a dictionary |
| 9 | `rev-collections` | review | |
| 10 | `quiz-collections` | quiz | |

Do not use `key=` in `sort`/`sorted` here (Module 10). (`copy.deepcopy`, `Counter`, `defaultdict`, `deque`, and `namedtuple` are taught in Module 7.)

### Module 7: `mod-07-modules-and-standard-library`
Pitfalls: naming your own file after a standard module (for example `math.py` or `random.py`); `from x import *`; a module's top-level code runs on import; forgetting the `if __name__ == "__main__":` guard; circular imports.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-importing-modules` | theory | `import`, `from ... import`, `as`, `dir`, `help`, import caching, the module search path |
| 2 | `les-standard-library-tour` | theory | `math`, `statistics`, `datetime` (fixed dates only), `copy`, `collections`, `pprint`, `textwrap`; `random` explained but never graded |
| 3 | `les-writing-modules-and-packages` | theory | your own modules, `__name__`, `if __name__ == "__main__":`, packages and `__init__.py`, absolute vs relative imports |
| 4 | `ws-stdlib-explorer` | workshop | use `math`, `statistics`, and `datetime` on given data (3 steps) |
| 5 | `lab-date-and-math-helpers` | lab | helper functions built on the standard library |
| 6 | `rev-modules-and-standard-library` | review | |
| 7 | `quiz-modules-and-standard-library` | quiz | |

Third-party packages and `pip` are taught in Module 15. Graded code in this module is single-file; show multi-file layouts in non-graded `text` blocks.

### Module 8: `mod-08-exceptions-and-files`
Pitfalls: bare `except:`; swallowing errors with `pass`; catching `Exception` too broadly; wrong order of `except` clauses; `return` inside `finally`; forgetting to close files; overwriting data by opening with `"w"`; omitting `encoding`; raising a string instead of an exception.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-try-except-else-finally` | theory | tracebacks, `try`, `except`, `else`, `finally`, common built-in exceptions |
| 2 | `les-raising-and-custom-exceptions` | theory | `raise`, `raise ... from`, `assert`, custom exception template, `str(error)` |
| 3 | `les-reading-and-writing-files` | theory | `open`, modes, `read`/`readline`/`write`, `with`, `encoding`, `pathlib` basics |
| 4 | `les-json-and-csv-files` | theory | `json.dumps`/`loads`/`dump`/`load`, `csv.reader`/`writer`, what JSON cannot represent |
| 5 | `ws-safe-number-parser` | workshop | wrap risky conversions in `try/except` and split valid from invalid input (3 steps) |
| 6 | `lab-file-report-validator` | lab | validate rows with the right exceptions and write a report file (`function-throws`, `function-returns`, `file-contains`) |
| 7 | `rev-exceptions-and-files` | review | |
| 8 | `quiz-exceptions-and-files` | quiz | |

### Module 9: `mod-09-object-oriented-programming`
Pitfalls: forgetting `self`; mutable class attributes shared by all instances; confusing class and instance attributes; forgetting `super().__init__()`; defining `__eq__` without `__hash__`; `__str__` vs `__repr__`; deep inheritance hierarchies where composition fits better.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-classes-and-objects` | theory | `class`, `__init__`, `self`, instance vs class attributes, methods |
| 2 | `les-methods-and-dunder-methods` | theory | `__str__`, `__repr__`, `__eq__`, `__lt__`, `__len__`, `__add__`, `__contains__`, `__getitem__`, operator overloading |
| 3 | `les-inheritance` | theory | subclasses, `super()`, overriding, `isinstance`/`issubclass`, method resolution order, multiple inheritance (brief) |
| 4 | `les-encapsulation-and-properties` | theory | `_name` and `__name` conventions, `@property` with setter, `@staticmethod`, `@classmethod` |
| 5 | `les-dataclasses-and-composition` | theory | `@dataclass`, default fields, composition vs inheritance, `abc.ABC` and `@abstractmethod` (brief) |
| 6 | `ws-bank-account` | workshop | build a class, then a subclass, step by step |
| 7 | `lab-class-hierarchy` | lab | build a small inheritance hierarchy |
| 8 | `rev-object-oriented-programming` | review | |
| 9 | `quiz-object-oriented-programming` | quiz | |

Do not teach `__iter__`/`__next__` (Module 10) or `__enter__`/`__exit__` (Module 11) here.

### Module 10: `mod-10-iteration-and-functional-tools`
Pitfalls: overly nested comprehensions; a generator can be consumed only once; `map` and `filter` return lazy iterators; building a full list when a generator expression is enough; assigning a `lambda` to a name instead of using `def`; forgetting `StopIteration` ends iteration.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-lambdas-and-key-functions` | theory | `lambda`, `key=` in `sorted`/`min`/`max`/`sort`, `map`, `filter`, `functools.reduce` |
| 2 | `les-comprehensions` | theory | list, dict, and set comprehensions, conditions, nested comprehensions |
| 3 | `les-iterators-and-iterables` | theory | iterable vs iterator, `iter()`, `next()`, `__iter__`, `__next__`, `StopIteration` |
| 4 | `les-generators-and-generator-expressions` | theory | `yield`, generator functions, generator expressions, lazy evaluation, `yield from` |
| 5 | `ws-data-pipeline` | workshop | transform records with comprehensions, lambdas, and generators (4 steps) |
| 6 | `lab-lazy-sequences` | lab | write generators (tests wrap them in `list(...)`) |
| 7 | `rev-iteration-and-functional-tools` | review | include `itertools` essentials (`chain`, `islice`, `groupby`, `product`) as a short note |
| 8 | `quiz-iteration-and-functional-tools` | quiz | |

### Module 11: `mod-11-decorators-and-context-managers`
Pitfalls: closures in loops capture variables, not values (late binding); forgetting `functools.wraps`; not returning the wrapper's result; decorators run at definition time; stacking order of decorators; forgetting `yield` in a `@contextmanager` function; accidentally swallowing exceptions in `__exit__`.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-first-class-functions-and-closures` | theory | functions as values, nested functions, closures, `nonlocal` revisited |
| 2 | `les-decorators` | theory | `@decorator` syntax, wrapper functions, `*args`/`**kwargs`, `functools.wraps`, stacking |
| 3 | `les-decorators-with-arguments` | theory | decorator factories, class-based decorators (brief), `functools.cache` |
| 4 | `les-context-managers` | theory | the `with` protocol, `__enter__`/`__exit__`, `contextlib.contextmanager`, `contextlib.suppress` |
| 5 | `ws-call-counter-and-timer` | workshop | write decorators and a context manager (deterministic, no real clock) |
| 6 | `lab-validation-decorators` | lab | validate arguments with a decorator factory |
| 7 | `rev-decorators-and-context-managers` | review | |
| 8 | `quiz-decorators-and-context-managers` | quiz | |

### Module 12: `mod-12-regular-expressions`
Pitfalls: forgetting raw strings; greedy vs lazy quantifiers; `match` vs `search` vs `fullmatch`; calling `.group()` on `None`; unescaped special characters such as `.`; catastrophic backtracking; using regex to parse nested structures such as HTML.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-regex-basics` | theory | literals, character classes, quantifiers, anchors, raw strings |
| 2 | `les-the-re-module` | theory | `search`, `match`, `fullmatch`, `findall`, `finditer`, `sub`, `split`, `compile`, flags |
| 3 | `les-groups-and-lookarounds` | theory | capturing, named, and non-capturing groups, alternation, lookahead and lookbehind (brief), greedy vs lazy |
| 4 | `ws-text-extractor` | workshop | extract emails, phone numbers, and dates from given text (3 steps) |
| 5 | `lab-log-parser` | lab | parse given log lines into structured data |
| 6 | `rev-regular-expressions` | review | |
| 7 | `quiz-regular-expressions` | quiz | |

### Module 13: `mod-13-recursion-and-algorithms`
Pitfalls: missing base case and `RecursionError`; exponential recursion without memoization; off-by-one errors in binary search; running binary search on unsorted data; confusing best case with worst case; assuming Big-O gives exact running time.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-recursion` | theory | recursion, base case, call stack, recursion limit, memoization with a dictionary and `functools.cache` |
| 2 | `les-complexity-and-big-o` | theory | time and space complexity, O(1), O(log n), O(n), O(n log n), O(n squared), analyzing loops |
| 3 | `les-searching-algorithms` | theory | linear search, binary search (iterative and recursive) |
| 4 | `les-elementary-sorting` | theory | bubble, selection, insertion sort, stability, `sorted` vs `list.sort`, Timsort (note) |
| 5 | `les-efficient-sorting` | theory | divide and conquer, merge sort, quicksort, comparing complexities |
| 6 | `ws-recursion-and-search` | workshop | factorial, fibonacci with memoization, recursive sum, binary search (4 steps) |
| 7 | `lab-sort-it-yourself` | lab | implement a sort; `code-not-contains` bans `sorted(` and `.sort(` |
| 8 | `rev-recursion-and-algorithms` | review | |
| 9 | `quiz-recursion-and-algorithms` | quiz | |

### Module 14: `mod-14-data-structures`
Pitfalls: removing from the front of a list is O(n); losing the head of a linked list; using a list as a queue; unhashable dictionary keys; an unbalanced BST degenerating into a list; `heapq` is a min-heap only; assuming dictionary lookups are always O(1).

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-arrays-and-linked-lists` | theory | lists as dynamic arrays, the `array` module (note), singly linked list: node, traverse, insert, delete |
| 2 | `les-stacks-and-queues` | theory | LIFO and FIFO, list as a stack, `collections.deque` as a queue, use cases |
| 3 | `les-heaps-and-priority-queues` | theory | `heapq`, min-heap, priority queue, heap sort (overview) |
| 4 | `les-hash-tables` | theory | hashing, collisions, how `dict` and `set` work, `__hash__`, hashability |
| 5 | `les-binary-search-trees` | theory | nodes, insert, search, in-order traversal, balance |
| 6 | `ws-linked-list-and-stack` | workshop | build a linked list, then a stack on top of it (4 steps) |
| 7 | `lab-bst-toolkit` | lab | BST insert, contains, and in-order list |
| 8 | `rev-data-structures` | review | |
| 9 | `quiz-data-structures` | quiz | |

### Module 15: `mod-15-environments-and-packaging`
Pitfalls: installing packages globally; committing a virtual environment to version control; not pinning versions; mixing `pip` and `conda` in one environment; `pip` installing into a different interpreter than `python`; installing packages without checking the name (typosquatting).

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-pip-and-pypi` | theory | PyPI, `python -m pip install`/`uninstall`/`freeze`/`list`/`show`, `requirements.txt`, version specifiers |
| 2 | `les-virtual-environments` | theory | why isolate, `venv`, `virtualenv`, activation, `pyenv` for Python versions |
| 3 | `les-modern-project-tools` | theory | Pipenv, Poetry, uv, Conda: lock files and when to choose which |
| 4 | `les-pyproject-toml` | theory | `[project]`, dependencies, `[build-system]`, tool configuration tables |
| 5 | `les-choosing-and-trusting-packages` | theory | evaluating a package, pinning, hashes, supply-chain risks |
| 6 | `ws-project-config-builder` | workshop | write `requirements.txt` and `pyproject.toml` (3 steps, `file-contains` tests) |
| 7 | `lab-requirements-doctor` | lab | repair a broken project configuration (`file-contains`, `file-exists`) |
| 8 | `rev-environments-and-packaging` | review | |
| 9 | `quiz-environments-and-packaging` | quiz | |

Nothing is installed in the sandbox. Show commands as non-graded `bash` blocks.

### Module 16: `mod-16-typing-testing-and-quality`
Pitfalls: type hints are not enforced at runtime; overusing `Any`; `Optional` does not mean "has a default"; testing implementation instead of behavior; flaky tests that depend on time or randomness; confusing a formatter with a linter; stale docstrings.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-type-hints` | theory | annotations, `list[int]`, `X \| None`, `Callable`, `Any`, `TypedDict` (brief), hints not enforced at runtime |
| 2 | `les-type-checkers-and-pydantic` | theory | static checking with mypy, pyright, pyre vs runtime validation with Pydantic (concept only, not graded) |
| 3 | `les-code-formatting-and-linting` | theory | PEP 8, black, ruff, yapf, formatter vs linter |
| 4 | `les-docstrings-and-documentation` | theory | docstring styles, `help()`, Sphinx overview, `doctest` |
| 5 | `les-unit-testing-with-unittest` | theory | `unittest.TestCase`, assertions, `setUp`, test discovery, writing testable code |
| 6 | `les-pytest-and-tox` | theory | pytest style tests, fixtures, parametrize, tox for multiple environments; `nose` as a historical note (concept only, not graded) |
| 7 | `ws-typed-calculator-with-tests` | workshop | typed functions, doctests, and a `unittest` class (4 steps; `output-contains` for the test run, `code-contains` for annotations) |
| 8 | `lab-typed-stats-module` | lab | add type hints and doctests to a given module so every check passes |
| 9 | `rev-typing-testing-and-quality` | review | |
| 10 | `quiz-typing-testing-and-quality` | quiz | |

### Module 17: `mod-17-concurrency` (advanced, optional)
Pitfalls: race conditions on shared state; assuming threads speed up CPU-bound code; deadlocks; forgetting `await`; blocking calls such as `time.sleep` inside async code; forgetting `if __name__ == "__main__":` with `multiprocessing`; not joining threads or awaiting tasks.

| Order | ID | Type | Introduces |
| :-- | :--- | :--- | :--- |
| 1 | `les-concurrency-concepts-and-gil` | theory | concurrency vs parallelism, CPU-bound vs I/O-bound, the GIL (tell students to check current docs for free-threaded builds) |
| 2 | `les-threading` | theory | `threading.Thread`, `join`, `Lock`, race conditions, `ThreadPoolExecutor` |
| 3 | `les-multiprocessing` | theory | `multiprocessing`, `ProcessPoolExecutor`, pickling limits, the main-module guard (concept only, not graded) |
| 4 | `les-asyncio-basics` | theory | `async def`, `await`, `asyncio.run`, tasks, `asyncio.gather`, threads vs async |
| 5 | `les-python-frameworks-overview` | theory | sync frameworks (Flask, Django, Pyramid, Plotly Dash), async frameworks (FastAPI, Tornado, Sanic, aiohttp, gevent), how to choose (concept only, not graded) |
| 6 | `ws-threads-and-async-basics` | workshop | thread pool over pure functions, `asyncio.gather` with `asyncio.sleep(0)`, a `Lock`-protected counter (3 steps) |
| 7 | `lab-async-batch-runner` | lab | run a batch of coroutines and return sorted results (`function-returns` with `asyncio.run(...)` in `call`) |
| 8 | `rev-concurrency` | review | |
| 9 | `quiz-concurrency` | quiz | |

## 6. Certification Project (generate last)

```yaml
id: "cert-python-programming"
type: "certification-project"
title: "Expense Ledger Toolkit"
scope: "course"
targetId: "python-programming"
difficulty: "intermediate"
passingGradePercent: 80
estimatedHours: 4
```

Scenario: build a small expense ledger toolkit as a single module of functions and classes.
Required skills: Modules 2-11 only (do not require Modules 12-17).
Deliverables: (1) a `Transaction` dataclass and a `Ledger` class with `__len__` and `__iter__`; (2) functions that filter, group by category, and summarize using comprehensions and dictionary methods; (3) JSON export and import with a custom `LedgerError` for validation failures, plus `save_ledger` and `load_ledger` file functions; (4) a `validate_amount` decorator and a `Batch` context manager that rolls back the ledger when an exception occurs.
Rubric weights must sum to 100. At least two requirements are `required: true`. Tests use only `function-returns`, `function-throws`, `code-contains`, `code-not-contains`, `file-exists`, and `file-contains`.

## 7. Execution Protocol (follow in order, ONE step per reply)

After each step, end your reply with the **Handoff Block** (Section 8). Then STOP and wait for the human to say "next".

| Step | Do this | Output |
| :-- | :--- | :--- |
| 0 | Confirm the inputs in Section 1 are attached and restate the date and the 17 module IDs | A short checklist |
| 1 | Fill the `course.md` template from Section 3 | `python-programming.md` |
| 2 | Module 1: the module file (`mod-01-getting-started.md`, from the `module.md` template), then all theory lessons | files, then Handoff |
| 3 | Module 1: workshop, lab | files, then Handoff |
| 4 | Module 1: review, quiz | files, then Handoff |
| 5-7 | Module 2 (same three sub-steps) | ... |
| ... | Repeat the three sub-steps (module+lessons / workshop+lab / review+quiz) for Modules 3-17 | ... |
| Last | Certification project | `cert-python-programming.md`, then Handoff |
| Audit | Run the audit in Section 9 across everything | Problem list + corrected files only |

Large modules (6, 9, 13, 14, 16) may split theory lessons across two replies, but never split a single file.
Each file goes in its own code block, preceded by its filename on a line by itself (use the ID, e.g. `les-what-is-python.md`).

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
- `function-returns` tests whose `expected` is not JSON-representable, uses floats without `round`, or depends on a set or tuple
- Graded code that uses the network, the clock, `random`, `input()`, or a third-party package
- Python code blocks with tabs, wrong indentation, non-PEP 8 names, or type hints before Modules 9 and 16
- Hints or instructions that give away an answer
- Review `covers` that don't list real IDs
- Quiz not meeting the 8-question, mixed-type requirement
- Leftover placeholders or author comments
- Capstone requirements that depend on Modules 12-17, or weights that don't sum to 100
