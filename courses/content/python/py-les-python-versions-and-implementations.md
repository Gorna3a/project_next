---
id: "py-les-python-versions-and-implementations"
type: "theory"
title: "Python Versions and Implementations"
moduleId: "py-mod-01-getting-started"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 15
tags: ["python", "versions", "cpython", "pep"]
---

# Concept Overview

Python has changed over time. The version number tells you which language features, fixes, and compatibility guarantees to expect. New code should target Python 3, and this course uses Python 3.12.

A Python implementation is the program that runs your source code. CPython is the reference implementation and the one most people mean when they say "Python." Other implementations exist, and they can differ in performance, platform support, and the version of the language they support.

## Key Principles & Frameworks

### Version numbers

Python versions use the form `MAJOR.MINOR.PATCH`, such as `3.12.10`.

- **Major** versions can introduce incompatible changes. The move from Python 2 to Python 3 is the major example.
- **Minor** versions add features while remaining compatible with earlier releases in the same major line. Python 3.11 to 3.12 is a minor update.
- **Patch** versions contain bug and security fixes. Python 3.12.9 to 3.12.10 is a patch update.

Compare each part as an integer, not as a decimal. Python 3.10 is newer than Python 3.9, even though `10` is smaller than `9` after a decimal point.

### Python 2 versus Python 3

Python 2 and Python 3 are different language lines. Python 2 reached end of life on January 1, 2020, and it no longer receives security fixes. Its libraries have largely moved on.

Key differences include:

- Python 3 uses the `print()` function. Python 2 allowed a `print` statement without parentheses.
- Python 3 handles text as Unicode by default. Python 2 drew a sharper line between byte strings and Unicode strings.
- Python 3 changed integer division behavior. This course teaches the Python 3 rules.
- Python 3 is the only line supported by current libraries and tooling.

Some operating systems still provide a `python` command that points to Python 2. If that happens, use `python3` or the Windows `py` launcher instead. The important habit is to check the version before you install packages or run a project.

### Common implementations

- **CPython** is the reference implementation, written in C. It is the default on most systems and the implementation used in this course.
- **PyPy** is an alternative implementation with a just-in-time compiler. It can speed up long-running pure-Python programs, but it may support new Python versions later than CPython and can behave differently with C extensions.
- **Jython** runs on the Java Virtual Machine. It is useful in Java environments but has not kept pace with modern Python.
- **IronPython** targets the .NET runtime.
- **MicroPython** is a small implementation for microcontrollers.

Portable Python code uses the language and standard library rather than details specific to one implementation. That code can usually move between CPython and PyPy with little or no change.

### Checking the version

Use a command that matches your system:

```bash
python --version
python3 --version
py --version
```

A typical result is:

```text
Python 3.12.10
```

The commands may point to different installations. On Windows, the `py` launcher selects from installed versions, and `py -3.12` requests a specific minor version.

### PEPs

A **Python Enhancement Proposal**, or **PEP**, is a design document that describes a proposed feature, a process, or general information. The PEP process gives ideas a public place for discussion and a permanent record of decisions.

Important examples:

- **PEP 1** describes the PEP process itself.
- **PEP 8** is the style guide for Python code.
- **PEP 20** collects the design principles known as "The Zen of Python."
- **PEP 484** introduced type hints.

PEP numbers are stable. A PEP can be Draft, Accepted, Final, Rejected, or Withdrawn. Not every PEP is a rule you must follow; many are proposals or explanations. PEP 8 is widely adopted because consistent style makes code easier to read.

## Common Pitfalls & Anti-Patterns
- **Treating version numbers as decimals**: Python 3.10 is newer than Python 3.9.
- **Using Python 2 for new code**: It is retired and receives no security fixes.
- **Assuming `python` means Python 3**: Check the version. Use `python3` or `py` when the plain command is the wrong installation.
- **Thinking PyPy is a different language**: It is another implementation of Python with different performance tradeoffs.
- **Assuming every PEP is mandatory**: PEPs include proposals, process documents, and informational guides.
- **Ignoring patch updates**: Patch releases fix bugs and security issues. Test them, but do not skip them indefinitely.
- **Using brand-new syntax without checking the target version**: A feature may not exist in the Python version your users run.

## Quick Summary
- Python versions use `MAJOR.MINOR.PATCH`; compare each part as an integer.
- Use Python 3. Python 2 reached end of life in 2020.
- CPython is the reference implementation; PyPy is a JIT alternative.
- Check your interpreter with `python --version`, `python3 --version`, or `py --version`.
- PEPs document proposals, processes, and standards such as PEP 8.
