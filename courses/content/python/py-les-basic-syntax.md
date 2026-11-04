---
id: "py-les-basic-syntax"
type: "theory"
title: "Basic Syntax: Indentation, Statements, and PEP 8"
moduleId: "py-mod-01-getting-started"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "syntax", "indentation", "pep8"]
---

# Concept Overview

Python's syntax is small, but layout carries meaning. Indentation defines blocks, statements normally occupy one line, and names are case-sensitive. PEP 8 is the style guide that keeps Python code consistent and readable.

This lesson focuses on the rules you need before writing larger programs. Later modules introduce block statements such as conditions, loops, functions, and classes. The indentation rule you learn here applies to all of them.

## Key Principles & Frameworks

### Statements

A statement is one instruction to the interpreter. Most statements occupy their own line.

```python
print("Report")
print("------")
print("Status: ready")
```

Blank lines are ignored by Python and can separate logical sections. Semicolons can place several simple statements on one line, but that style is discouraged because it hides structure.

```python
print("Report"); print("------")
```

The line above is valid, but the three-line version is easier to read and edit.

### Indentation and blocks

Python uses indentation, not braces, to group statements into a block. A block begins after a header line that ends with a colon (`:`). Every line in the block uses the same indentation.

The standard indentation is four spaces per level. Do not use tabs, and never mix tabs with spaces. Configure your editor to insert four spaces when you press Tab. Mixing the two can raise `TabError` or produce an `IndentationError`.

An indented line without a header that introduces a block is an error:

```python
print("Start")
    print("This line is indented without a block")
```

Running that file produces an error like:

```text
IndentationError: unexpected indent
```

The second line is indented, but no header precedes it. Python reports the error before running the program.

Later modules introduce headers such as conditions, loops, and function definitions. For now, remember two rules:

1. A header ends with a colon.
2. The block below the header is indented by four spaces.

A block ends when the indentation returns to the previous level.

### Line continuation

A long statement can span several lines. The preferred method is implicit continuation inside parentheses, brackets, or braces:

```python
print(
    "A long message can be split "
    "across several lines."
)
```

Adjacent string literals are joined automatically. The output is one line:

```text
A long message can be split across several lines.
```

The second method is an explicit backslash at the end of the line:

```python
print("This line continues " \
      "on the next line.")
```

The backslash must be the last character on the line. A space after it breaks the continuation. PEP 8 recommends parentheses over backslashes when the syntax allows it, because parentheses are easier to read and edit.

### Case sensitivity

Python is case-sensitive. These are three different names:

```text
name
Name
NAME
```

Keywords and built-in names use lowercase. `print` works; `Print` does not. Conditions, loops, and definitions also use lowercase keywords such as `if`, `for`, and `def`. Writing `If` produces a `NameError` because Python looks for a name rather than a keyword. Later modules introduce those statements.

Be consistent with capitalization in your own names. The naming conventions for variables, functions, and classes are covered as those features appear.

### PEP 8 basics

PEP 8 is Python's official style guide. It is not enforced by the interpreter, but most Python projects follow it because consistent style makes code easier to read.

The basics that apply now:

- Use four spaces per indentation level.
- Limit lines to 79 characters. Comments and docstrings should stay within 72.
- Avoid trailing whitespace.
- Use blank lines to separate logical sections.
- Put a space after `#` in a comment.
- Write comments as complete sentences when they explain a decision.
- Do not put multiple statements on one line with semicolons.
- Use parentheses for line continuation instead of a backslash when possible.

PEP 8 also defines naming and spacing conventions. You will apply those rules as you learn variables, operators, functions, and classes.

## Common Pitfalls & Anti-Patterns
- **Mixing tabs and spaces**: The indentation may look aligned but is not. Configure the editor to insert spaces.
- **Using an inconsistent indent width**: Python requires exact alignment within a block. Use four spaces consistently.
- **Indenting without a block header**: An unexpected indent raises `IndentationError`.
- **Forgetting the colon**: Block headers must end with `:`.
- **Using braces for blocks**: Python uses indentation. Braces define dictionaries and sets in later modules.
- **Leaving a space after a backslash**: The continuation breaks. Remove trailing spaces.
- **Writing overlong lines**: Wrap the statement in parentheses.
- **Chaining statements with semicolons**: It is legal but hurts readability.
- **Getting capitalization wrong**: `Print` is not `print`, and `If` is not `if`.

## Quick Summary
- A statement is one instruction, usually on its own line.
- Indentation defines blocks; use four spaces per level and never mix tabs and spaces.
- A block header ends with a colon, and the block below it is indented.
- Use parentheses for implicit line continuation; a backslash works but is less preferred.
- Python is case-sensitive.
- PEP 8 recommends four-space indentation, short lines, no trailing whitespace, and clear comments.
