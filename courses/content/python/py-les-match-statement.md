---
id: "py-les-match-statement"
type: "theory"
title: "The match Statement"
moduleId: "py-mod-03-operators-and-conditionals"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "match", "case", "pattern-matching"]
---

# Concept Overview

The `match` statement chooses a block by comparing a value against a series of patterns. It is useful when one value has several well-defined forms, such as a command word, a status code, or a menu choice.

`match` was added in Python 3.10. This course uses Python 3.12, so it is available. Each `case` is checked from top to bottom, and only the first matching case runs.

## Key Principles & Frameworks

### Basic syntax

```python
command = "start"

match command:
    case "start" | "go":
        print("Starting")
    case "stop" | "halt":
        print("Stopping")
    case _:
        print("Unknown command")
```

Output:

```text
Starting
```

The value after `match` is tested against each `case`. A literal pattern such as `"start"` matches when the value is equal to that literal. The `|` symbol separates alternatives inside one pattern: `"start" | "go"` matches either word.

The final `case _:` is a wildcard. It matches any value and acts as the default. The underscore does not create a usable variable.

### Literal patterns

Literal patterns can be strings, numbers, booleans, or `None`:

```python
status = 404

match status:
    case 200:
        print("OK")
    case 404:
        print("Not found")
    case 500:
        print("Server error")
    case _:
        print("Other status")
```

Output:

```text
Not found
```

Matching uses equality. `case 200` behaves like an equality check against `200`, but the pattern syntax is separate from an ordinary expression.

### Or-patterns

Use `|` to combine alternatives in one case:

```python
answer = "Y"

match answer:
    case "y" | "Y" | "yes" | "Yes":
        print("Confirmed")
    case "n" | "N" | "no" | "No":
        print("Declined")
    case _:
        print("Unrecognized answer")
```

Output:

```text
Confirmed
```

Every alternative in the pattern is a literal. The case runs once if any alternative matches.

### Guards

A guard adds an `if` condition to a case. The case matches only when the pattern matches and the guard is truthy:

```python
age = 15

match age:
    case value if value < 13:
        print("Child")
    case value if value < 20:
        print("Teenager")
    case _:
        print("Adult")
```

Output:

```text
Teenager
```

`case value` is a capture pattern: it matches any value and binds that value to the name `value`. The guard then tests the captured value. The first case fails because `15 < 13` is false. The second case matches, and its guard is true.

Guards are useful for ranges and for conditions that depend on the matched value. Keep them simple; if the logic grows complex, an `if`/`elif` chain may be clearer.

### No fall-through

Unlike a C-style `switch`, `match` does not fall through from one case to the next. After a case runs, the `match` statement ends.

```python
value = 2

match value:
    case 1:
        print("One")
    case 2:
        print("Two")
    case 3:
        print("Three")
```

Output:

```text
Two
```

Only `Two` is printed. The `case 3` block does not run after `case 2`.

### When no case matches

If no pattern matches and there is no wildcard, the `match` statement does nothing:

```python
color = "purple"

match color:
    case "red":
        print("Stop")
    case "green":
        print("Go")
```

There is no output. Add `case _:` when every value needs a response.

### match versus if

Use `match` when you are dispatching on the shape or value of one expression and the cases are easy to list. Use `if`/`elif`/`else` when conditions involve ranges, multiple unrelated values, or complex logic.

A two-way choice is usually clearer with `if`:

```python
is_ready = True

if is_ready:
    print("Start")
else:
    print("Wait")
```

`match` earns its place with several literal alternatives, especially when guards or or-patterns keep the cases readable.

## Common Pitfalls & Anti-Patterns
- **Expecting fall-through**: Only the first matching case runs. There is no implicit move to the next case.
- **Forgetting the wildcard**: Without `case _:`, an unmatched value produces no output and no error.
- **Putting the wildcard first**: `case _:` matches everything, so later cases can never run. Put it last.
- **Using a guard that never sees the intended value**: Cases and guards run top to bottom. Order the specific cases before general ones.
- **Assuming a capture name compares to an existing variable**: A bare name in a pattern captures the matched value; it does not compare against a variable with that name.
- **Overusing match for a simple two-way decision**: An `if`/`else` is usually clearer.
- **Forgetting the colon or indentation**: `match` and each `case` use the same block rules as `if`.
- **Using `|` as logical or outside a pattern**: In ordinary expressions, use `or`. The `|` symbol is a pattern separator inside `case` and a bitwise operator elsewhere.
- **Running on Python older than 3.10**: `match` is a syntax error there. This course targets Python 3.12.

## Quick Summary
- `match` compares one value against ordered `case` patterns.
- Literal patterns match exact values; `|` combines alternatives.
- A guard adds `if condition` to a case and tests the captured value.
- `case _:` is a wildcard and should be last.
- The first matching case runs, and there is no fall-through.
- Use `match` for clear value dispatch and `if`/`elif` for complex conditions.
