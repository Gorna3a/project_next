---
id: "py-mod-06-collections"
type: "module"
title: "Module 6: Lists, Tuples, Sets & Dictionaries"
courseId: "python-programming"
order: 6
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "collections", "lists", "dictionaries"]
prerequisites: ["py-mod-05-functions"]
description: "Store and organize data with lists, tuples, sets, and dictionaries, then iterate, transform, and copy collections safely."
---

# Module Overview

Real programs work with groups of values: a list of scores, a tuple of coordinates, a set of unique tags, or a dictionary of student records. Python's built-in collections cover these shapes, and each one makes a different trade-off between order, mutability, and lookup speed.

This module begins with lists and their core methods, then moves to tuples and unpacking. Sets handle uniqueness and set algebra, while dictionaries map keys to values. The iteration lesson connects the four types with `enumerate`, `zip`, `sorted`, `reversed`, `any`, `all`, and the numeric built-ins. The final lesson explains aliasing and copying, including the nested-list bug caused by `[[0] * 3] * 3`.

The workshop processes a list of dictionaries, and the lab summarizes inventory data and returns a dictionary. Both use `function-returns` tests, so the functions you write are checked directly.

## What You Will Be Able To Do
- Create, index, slice, and modify lists
- Add, remove, sort, and reverse list items
- Use tuples for fixed data and unpack their values
- Handle the one-item tuple syntax correctly
- Build sets, remove duplicates, and use union, intersection, and difference
- Create dictionaries and read values safely with `get`
- Iterate over keys, values, and items
- Use `enumerate`, `zip`, `sorted`, `reversed`, `any`, and `all`
- Explain aliasing and make shallow copies of lists
- Avoid shared nested lists and modification-during-iteration bugs
