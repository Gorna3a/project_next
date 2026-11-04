---
id: "py-quiz-environments-and-packaging"
type: "quiz"
title: "Environments and Packaging Knowledge Check"
moduleId: "py-mod-15-environments-and-packaging"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "pip", "venv", "packaging", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type": "single", "points": 1} -->
What is the safest way to install a package into the same interpreter that runs your program?

- [x] `python -m pip install requests`
- [ ] `pip install requests`
- [ ] `python install requests`
- [ ] Copy the package folder into the project

> **Hint:** One form guarantees pip and Python use the same interpreter.

*Explanation*: `python -m pip` runs pip through the current interpreter. Bare `pip` can point at a different interpreter.

---

## Question 2
<!-- meta: {"type": "multiple", "points": 2} -->
Which statements about virtual environments are true?

- [x] A venv has its own installed packages
- [x] `python -m venv .venv` creates one
- [ ] A venv should be committed to version control
- [ ] Packages installed globally appear inside every venv

> **Hint:** Think about isolation and what belongs in version control.

*Explanation*: A venv isolates its own packages. The `.venv` directory should not be committed. Global packages do not automatically appear inside a venv.

---

## Question 3
<!-- meta: {"type": "true-false", "points": 1} -->
True or False: Lock files, such as `poetry.lock`, record exact resolved dependency versions so teams install identical sets.

- [x] True
- [ ] False

*Explanation*: Lock files store the resolved versions. Tools install from the lock file instead of solving again.

---

## Question 4
<!-- meta: {"type": "single", "points": 1} -->
Where are the `dependencies` list and `requires-python` field declared in `pyproject.toml`?

- [x] Under the `[project]` table
- [ ] Under `[tool.ruff]`
- [ ] Under `[build-system]`
- [ ] At the top level without a table

*Explanation*: `[project]` holds name, version, requires-python, and dependencies. Tool and build settings live in their own tables.

---

## Question 5
<!-- meta: {"type": "code-output", "points": 1} -->
What does this code print?

```python
line = "pytest==8.3.4"
name = line.split("==")[0]
print(name)
```

- [ ] pytest==8.3.4
- [ ] 8.3.4
- [x] pytest
- [ ] True

*Explanation*: `split("==")` returns `["pytest", "8.3.4"]`. Index 0 is `pytest`.

---

## Question 6
<!-- meta: {"type": "single", "points": 1} -->
What is typosquatting?

- [x] Publishing packages with names one letter off popular packages
- [ ] Pinning exact versions in requirements.txt
- [ ] Splitting pyproject.toml into many files
- [ ] Running pip with sudo

*Explanation*: Typosquatters publish near-miss names such as `reqeusts` to catch misspelled installs.

---

## Question 7
<!-- meta: {"type": "true-false", "points": 1} -->
True or False: `python -m pip freeze` inside an active venv writes the venv packages into `requirements.txt`.

- [x] True
- [ ] False

*Explanation*: Freeze captures the active interpreter packages. Inside the venv, that captures the project set.

---

## Question 8
<!-- meta: {"type": "multiple", "points": 2} -->
Which practices make a pinned `requirements.txt` reproducible?

- [x] Exact `==` versions for each package
- [x] Created with `python -m pip freeze` inside the venv
- [ ] Listing packages without any versions
- [ ] Freezing from the global interpreter

*Explanation*: Exact pins plus freeze inside the project venv reproduce the same installs. Unpinned entries and global freeze drift.
