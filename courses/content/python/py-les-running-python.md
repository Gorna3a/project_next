---
id: "py-les-running-python"
type: "theory"
title: "Running Python: REPL, Scripts, and print"
moduleId: "py-mod-01-getting-started"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "repl", "scripts", "print", "comments"]
---

# Concept Overview

You can run Python in two main ways: interactively in the REPL, or by executing a script file. The REPL is useful for quick experiments and checking small pieces of behavior. Scripts are for programs you keep, run repeatedly, and share.

The difference matters because the two modes display results differently. The REPL echoes the value of a bare expression; a script does not. In a script, `print()` is what produces visible output.

## Key Principles & Frameworks

### The REPL

The REPL stands for **Read, Evaluate, Print, Loop**. Start it by running `python` or `python3` with no file name. You will see a prompt like this:

```text
Python 3.12.10
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

The `>>>` prompt means the REPL is ready for one statement or expression. Type a value and press Enter:

```text
>>> "hello"
'hello'
>>> print("hello")
hello
```

The first line is a bare string expression. The REPL evaluates it and echoes its representation, which includes the quotes. The second line calls `print()`, which writes the text without quotes.

The REPL remembers names and values for the current session. When you exit, that state is discarded. Exit with `exit()` or `quit()`. On Windows you can also press Ctrl+Z and then Enter; on macOS and Linux, press Ctrl+D.

The REPL is not a good place for a long program. It is best for small experiments: checking a value, testing a syntax rule, or confirming how a built-in behaves.

### Running a script

A script is a text file containing Python source code. By convention, the file ends with `.py`. Create a file named `hello.py` with this content:

```python
print("Hello, world!")
```

Run it from a terminal:

```bash
python hello.py
```

The output is:

```text
Hello, world!
```

The interpreter reads the file from top to bottom and executes each statement. If the file contains a bare expression, the script does not echo its value. Only `print()` writes to standard output.

Run the command from the directory that contains the file, or provide a path:

```bash
python path/to/hello.py
```

If your system only exposes Python 3 as `python3`, use:

```bash
python3 hello.py
```

### The print function

`print()` writes its arguments to standard output and adds a newline at the end by default.

```python
print("Hello")
print("World")
```

Output:

```text
Hello
World
```

Multiple arguments are separated by a space by default:

```python
print("Hello", "World")
```

Output:

```text
Hello World
```

The workshop shows how to change the separator with `sep` and the line ending with `end`. `print()` with no arguments writes a blank line.

The quotes around a string mark where the text starts and ends. They are not part of the output.

### Comments

A comment starts with `#` and continues to the end of the line. Python ignores it.

```python
# Print a startup message.
print("Ready")
```

Comments can also follow a statement:

```python
print("Ready")  # Show that the program started.
```

Use comments to explain why something is done, not to restate the code. Keep them accurate; an outdated comment is worse than no comment. A comment does not produce output.

Python has no separate block-comment syntax. Write consecutive `#` lines when you need several lines of explanation.

## Common Pitfalls & Anti-Patterns
- **Expecting a script to echo bare expressions**: Only the REPL does that. Use `print()` in scripts.
- **Expecting REPL state to survive**: Names and values disappear when the session ends.
- **Running the script from the wrong directory**: Use the correct path or change to the file's directory.
- **Saving the file with the wrong extension**: Windows may hide extensions and produce `hello.py.txt`. Show known file extensions and verify the name.
- **Using Python 2 print syntax**: `print "Hello"` is invalid in Python 3. Use `print("Hello")`.
- **Thinking comments are output**: Comments are ignored by the interpreter.
- **Leaving debugging prints in a program**: They are easy to add and easy to forget. Remove them when the investigation ends.

## Quick Summary
- The REPL reads, evaluates, and echoes values interactively.
- Scripts are `.py` files run by the interpreter from top to bottom.
- Scripts do not echo bare expressions; use `print()` for output.
- `print()` adds a newline by default; multiple arguments are separated by spaces.
- Comments start with `#` and are ignored by Python.
