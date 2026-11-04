---
id: "py-les-reading-and-writing-files"
type: "theory"
title: "Reading and Writing Files"
moduleId: "py-mod-08-exceptions-and-files"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "files", "pathlib", "encoding"]
---

# Concept Overview

Files let a program keep data after it stops running. Python's built-in `open` function returns a file object that can read text from a file or write text to one. The mode you pass to `open` decides whether the file is read, overwritten, appended to, or created.

Two habits prevent most file bugs: use `with open(...) as file:` so the file closes automatically, and pass `encoding="utf-8"` for text files. The `pathlib` module provides a cleaner way to build paths and to read or write small text files in one call.

## Key Principles & Frameworks

### Writing and reading text

```python
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("first line\nsecond line\n")

with open("notes.txt", "r", encoding="utf-8") as file:
    content = file.read()

print(content)
```

Output:

```text
first line
second line
```

The `"w"` mode opens the file for writing. If the file exists, its previous contents are erased; if it does not exist, Python creates it. `write` does not add a newline automatically, so the `\n` characters are explicit.

The `"r"` mode opens the file for reading. `read()` returns the entire file as one string.

### The with statement

`with open(...) as file:` closes the file automatically when the block ends, even if an exception occurs. The full context-manager protocol is covered in Module 11; for now, read the line as "open this file and close it when the block finishes."

```python
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("hello")

print(file.closed)
```

Output:

```text
True
```

Without `with`, you must call `file.close()` yourself. If an error happens before the close, the file can stay open longer than intended. Prefer `with` for every file operation.

### Reading line by line

`readline()` returns one line at a time, including its trailing newline:

```python
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("first\nsecond\nthird\n")

with open("notes.txt", "r", encoding="utf-8") as file:
    print(file.readline().strip())
    print(file.readline().strip())
```

Output:

```text
first
second
```

`strip()` removes the newline for display. Without it, each `print` would add another newline and leave a blank line between entries.

A `for` loop reads one line per pass and is the usual choice for a whole file:

```python
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("first\nsecond\nthird\n")

with open("notes.txt", "r", encoding="utf-8") as file:
    for line in file:
        print(line.strip())
```

Output:

```text
first
second
third
```

`readlines()` returns a list of all lines instead:

```python
with open("notes.txt", "w", encoding="utf-8") as file:
    file.write("a\nb\n")

with open("notes.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

print(lines)
```

Output:

```text
['a\n', 'b\n']
```

Each list item still includes its newline. Use `read()` for one string, `readline()` for one line, `readlines()` for a list, or a `for` loop when you do not need the whole file in memory.

### File modes

| Mode | Purpose | File exists | File missing |
| :--- | :--- | :--- | :--- |
| `"r"` | Read | Opens it | Raises `FileNotFoundError` |
| `"w"` | Write | Erases and overwrites it | Creates it |
| `"a"` | Append | Writes at the end | Creates it |
| `"x"` | Exclusive create | Raises `FileExistsError` | Creates it |

`"r"` is the default when no mode is given. Add `"b"` for binary mode, such as `"rb"` or `"wb"`; binary files return and accept `bytes` instead of text. Use binary mode for images or other non-text data, not for ordinary text files.

Append mode preserves existing content:

```python
with open("log.txt", "w", encoding="utf-8") as file:
    file.write("start\n")

with open("log.txt", "a", encoding="utf-8") as file:
    file.write("next\n")

with open("log.txt", "r", encoding="utf-8") as file:
    print(file.read())
```

Output:

```text
start
next
```

Write mode replaces the old content:

```python
with open("data.txt", "w", encoding="utf-8") as file:
    file.write("old\n")

with open("data.txt", "w", encoding="utf-8") as file:
    file.write("new\n")

with open("data.txt", "r", encoding="utf-8") as file:
    print(file.read())
```

Output:

```text
new
```

If the old data matters, use `"a"` or read the file before opening it with `"w"`.

### Handling a missing file

Reading a file that does not exist raises `FileNotFoundError`:

```python
try:
    with open("missing.txt", "r", encoding="utf-8") as file:
        print(file.read())
except FileNotFoundError:
    print("The file does not exist.")
```

Output:

```text
The file does not exist.
```

Catch this error only when a missing file is an expected case. If the file is required for the program to work, let the exception propagate with its clear message.

### Encoding

Text files store bytes, and an encoding maps between bytes and characters. Pass `encoding="utf-8"` explicitly:

```python
with open("names.txt", "w", encoding="utf-8") as file:
    file.write("Ana\nBen\n")

with open("names.txt", "r", encoding="utf-8") as file:
    print(file.read())
```

Output:

```text
Ana
Ben
```

UTF-8 handles text in many languages and is the most portable choice. Relying on the platform default can produce different results on different machines, and a mismatch between the writing and reading encodings can corrupt characters or raise `UnicodeDecodeError`.

### Newlines

`write` does not add line breaks. Forgetting them joins separate writes into one line:

```python
with open("words.txt", "w", encoding="utf-8") as file:
    file.write("alpha")
    file.write("beta")

with open("words.txt", "r", encoding="utf-8") as file:
    print(file.read())
```

Output:

```text
alphabeta
```

Add `\n` at the end of each line, or write a list of lines with `writelines` after adding newlines yourself.

### pathlib basics

`pathlib.Path` represents a file system path and provides convenience methods:

```python
from pathlib import Path

path = Path("notes.txt")
path.write_text("hello\n", encoding="utf-8")

print(path.exists())
print(path.name)
print(path.suffix)
print(path.read_text(encoding="utf-8").strip())
```

Output:

```text
True
notes.txt
.txt
hello
```

`Path.write_text` and `Path.read_text` are shortcuts for small files. They open, transfer the text, and close the file for you.

The `/` operator joins path parts without hard-coding a separator:

```python
from pathlib import Path

folder = Path("data")
path = folder / "notes.txt"

print(path.name)
print(path.parent.name)
```

Output:

```text
notes.txt
data
```

`Path` is also useful for checking `.exists()`, getting `.name` and `.suffix`, and building paths that work on Windows, macOS, and Linux. For larger files, use `open` with a `Path` object: `open(path, "r", encoding="utf-8")`.

## Common Pitfalls & Anti-Patterns
- **Forgetting to close a file**: Use `with open(...) as file:` so cleanup happens automatically.
- **Opening with `"w"` when you meant `"a"`**: Write mode erases existing content immediately.
- **Omitting `encoding`**: The platform default varies. Pass `encoding="utf-8"` for text files.
- **Forgetting newlines when writing**: Separate writes run together. Add `\n`.
- **Expecting `read()` to return a list**: It returns one string. Use `readlines()` or a loop for lines.
- **Comparing lines without removing newlines**: Call `.strip()` when the newline is not part of the value.
- **Assuming a relative path starts beside the script**: Relative paths use the current working directory. Build absolute paths with `pathlib` when needed.
- **Using binary mode for text**: `"rb"` returns `bytes`, not `str`.
- **Opening with `"x"` without handling an existing file**: It raises `FileExistsError`.
- **Ignoring a missing file when it matters**: Handle `FileNotFoundError` only when absence is expected.

## Quick Summary
- `open(path, mode, encoding="utf-8")` returns a file object.
- `"r"` reads, `"w"` overwrites, `"a"` appends, and `"x"` creates exclusively.
- Use `with open(...) as file:` so the file closes automatically.
- `read()` returns one string; `readline()` returns one line; `readlines()` returns a list; a loop reads line by line.
- `write()` does not add newlines.
- Pass `encoding="utf-8"` for text files.
- Reading a missing file raises `FileNotFoundError`.
- `pathlib.Path` builds paths and offers `read_text`, `write_text`, `exists`, `name`, and `suffix`.
- File tests in the lab run after your script, so create the report file at the top level.
