---
id: "py-quiz-getting-started"
type: "quiz"
title: "Getting Started Knowledge Check"
moduleId: "py-mod-01-getting-started"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "basics", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
What does it mean that Python is an interpreted language?

- [x] An interpreter reads and executes the source code.
- [ ] The source code must be converted into an executable before every run.
- [ ] The browser compiles the code before the page loads.
- [ ] The code can run only on the operating system where it was written.

*Explanation*: The Python interpreter reads source files and executes them. Some implementations compile to an intermediate form internally, but you do not run a separate build step.

---

## Question 2
<!-- meta: {"type":"true-false","points":1} -->
Python 2 and Python 3 are fully compatible with each other.

- [ ] True
- [x] False

*Explanation*: Python 3 introduced incompatible changes, including print as a function. Python 2 reached end of life in 2020.

---

## Question 3
<!-- meta: {"type":"single","points":1} -->
In the REPL, what happens when you enter a bare expression such as `"hello"`?

- [x] The REPL echoes the value's representation.
- [ ] Nothing is displayed.
- [ ] The expression is saved to a file.
- [ ] The expression is treated as a comment.

*Explanation*: The REPL evaluates the expression and prints its representation. In a script, a bare expression does not produce output; you need print().

---

## Question 4
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
print("A", "B", sep="-")
```

- [x] `A-B`
- [ ] `A B`
- [ ] `AB`
- [ ] `A` and `B` on separate lines

*Explanation*: sep controls the text placed between multiple values. The default separator is a space.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
print("Hello", end="")
print("World")
```

- [x] `HelloWorld`
- [ ] `Hello World`
- [ ] `Hello` and `World` on separate lines
- [ ] `WorldHello`

*Explanation*: The first print has an empty end, so it does not add a newline. The second print writes World and then ends the line.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
Which character begins a comment in Python?

- [x] `#`
- [ ] `//`
- [ ] `--`
- [ ] `<!--`

*Explanation*: A single # starts a comment that continues to the end of the line. The other forms are used by different languages.

---

## Question 7
<!-- meta: {"type":"multiple","points":2} -->
Which practices follow PEP 8? Select all that apply.

- [x] Use four spaces per indentation level.
- [x] Keep lines within 79 characters.
- [ ] Mix tabs and spaces when the alignment looks correct.
- [x] Put a space after the `#` in a comment.

*Explanation*: PEP 8 recommends four-space indentation, short lines, and a space after #. Tabs and spaces must never be mixed.

---

## Question 8
<!-- meta: {"type":"true-false","points":1} -->
Python uses braces `{}` to define code blocks.

- [ ] True
- [x] False

*Explanation*: Python uses indentation to define blocks. Braces define dictionaries and sets, which are covered later.
