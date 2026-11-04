---
id: "py-les-what-is-python"
type: "theory"
title: "What Is Python?"
moduleId: "py-mod-01-getting-started"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 15
tags: ["python", "basics", "history", "interpreted"]
---

# Concept Overview

Python is a general-purpose programming language created by Guido van Rossum and first released in 1991. It is designed to be readable: its syntax uses words and indentation instead of heavy punctuation, so a Python program often looks close to a description of the task.

Python is used in many areas, including web backends, automation, data analysis, machine learning, scientific computing, education, and prototyping. It is not limited to one domain. The same language can drive a small script that renames files and a large production service.

Python is an interpreted language. You write source code in a file, usually with a `.py` extension, and a program called the Python interpreter reads and runs it. Some implementations compile your source to an intermediate form first, but you do not run a separate build step to produce an executable. This keeps the edit-run cycle short and lets the same source run on Windows, macOS, and Linux as long as a compatible interpreter is installed.

## Key Principles & Frameworks

Python's design favors readability, explicitness, and practicality. The language gives you a small set of core rules and a large standard library for common tasks.

The main ideas are:

1. **Readability first.** Clear code is easier to review, test, and maintain. Python uses indentation to show structure and avoids unnecessary punctuation.
2. **General-purpose.** Python is not tied to one kind of program. It supports scripting, web services, data processing, networking, testing, and more.
3. **Batteries included.** The standard library ships with modules for files, JSON, dates, regular expressions, and many other tasks. Third-party packages extend it further.
4. **Cross-platform.** The same source can run on different operating systems when it avoids platform-specific behavior.
5. **Large ecosystem.** Python has a broad community and package index, so many common problems already have a well-tested library.

A short history:

- Guido van Rossum began work on Python in the late 1980s.
- Python 0.9.0 was released in 1991.
- Python 2.0 arrived in 2000.
- Python 3.0 arrived in 2008.
- Python 2 reached end of life on January 1, 2020.

The name comes from the comedy group Monty Python, not from the snake. The language also has a short set of design principles, often summarized as "readability counts" and "simple is better than complex."

The interpreted workflow looks like this:

```text
source file (hello.py)  ->  Python interpreter  ->  program output
```

You edit the source file, run it with the interpreter, and read the output. There is no separate executable to build before each run.

Python is not a markup language such as HTML, a database, or a single framework. Tools such as Django and Flask are projects written in Python; they are not the language itself.

## Common Pitfalls & Anti-Patterns
- **Thinking Python is only for data science**: Python is general-purpose. Web services, automation, command-line tools, and tests are all common uses.
- **Confusing Python with a framework**: Django, Flask, and FastAPI are libraries built with Python, not separate languages.
- **Assuming interpreted means errors appear only at runtime**: Python reports syntax and indentation errors when it parses the file, before running the program.
- **Believing the snake is the namesake**: The name honors Monty Python.
- **Treating Python 2 as a safe default**: Python 2 is retired. New code should target Python 3.
- **Expecting a separate compile step**: You normally run the source directly with the interpreter.

## Quick Summary
- Python is a readable, general-purpose, interpreted language.
- Guido van Rossum created it, and the first public release arrived in 1991.
- It is used for web development, automation, data work, AI, science, and education.
- A Python interpreter runs source files, usually with a `.py` extension.
- The standard library and third-party ecosystem cover a wide range of tasks.
