---
id: "py-mod-12-regular-expressions"
type: "module"
title: "Module 12: Regular Expressions"
courseId: "python-programming"
order: 12
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "regex", "text", "patterns"]
prerequisites: ["py-mod-11-decorators-and-context-managers"]
description: "Search, validate, extract, and transform text with regular expressions and Python's re module."
---

# Module Overview

Regular expressions describe patterns in text. They let you find substrings, validate input, extract structured data, and transform text without writing long loops. Python's `re` module evaluates these patterns and returns match objects with positions and captured groups.

This module starts with pattern syntax: literals, character classes, quantifiers, anchors, and raw strings. The second lesson covers the `re` module functions, including `search`, `match`, `fullmatch`, `findall`, `finditer`, `sub`, `split`, and `compile`. The third lesson covers capturing groups, named groups, non-capturing groups, alternation, greedy and lazy quantifiers, and brief lookaheads and lookbehinds.

The workshop extracts emails, phone numbers, and dates from a fixed block of text. The lab parses log lines into dictionaries with a compiled pattern and named groups.

## What You Will Be Able To Do
- Write regular expressions using raw strings
- Use character classes, quantifiers, and anchors
- Distinguish greedy and lazy matching
- Search, match, and fully match strings with the `re` module
- Find all matches and iterate over match objects
- Replace and split text with patterns
- Compile patterns for reuse
- Apply flags such as `IGNORECASE` and `MULTILINE`
- Capture and name groups
- Use non-capturing groups and alternation
- Apply brief lookahead and lookbehind assertions
- Avoid calling methods on `None` matches
- Recognize when regex is the wrong tool
