---
id: "py-les-regex-basics"
type: "theory"
title: "Regex Basics"
moduleId: "py-mod-12-regular-expressions"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "regex", "patterns", "anchors", "character-classes"]
---

# Concept Overview

A regular expression is a pattern that describes a set of strings. Regular expressions are useful for finding, validating, and transforming text. Python's `re` module evaluates these patterns; this lesson covers the pattern syntax itself, and the next lesson covers the module.

Patterns are usually written as raw strings, such as `r"\d+"`, so backslashes are not treated as Python string escapes. A pattern combines literals, character classes, quantifiers, and anchors to match exactly the text you care about.

## Key Principles & Frameworks

### Raw strings

Use a raw string for every regular expression. The `r` prefix keeps backslashes as literal characters:

```python
pattern = r"\d+\.\d+"
print(pattern)
```

Output:

```text
\d+\.\d+
```

Without the raw string, `"\d"` is just `"d"` in Python, and `"\."` is `"."`. Raw strings make patterns readable and prevent accidental escapes.

### Literals and special characters

Most characters match themselves. A few characters have special meaning and must be escaped with a backslash to match literally:

```text
. ^ $ * + ? { } [ ] \ | ( )
```

For example, `r"3.14"` matches `3.14`, `3X14`, and `3 14` because `.` matches any character. Use `r"3\.14"` to match only `3.14`.

### Character classes

Square brackets define a set of allowed characters:

```text
[abc]      matches a, b, or c
[a-z]      matches any lowercase letter
[A-Z]      matches any uppercase letter
[0-9]      matches any digit
[^abc]     matches anything except a, b, or c
```

Ranges use a hyphen. Put a hyphen at the end or escape it to match a literal hyphen: `[a-z-]`.

### Shorthand character classes

Common classes have shorthand forms:

```text
\d    digit, same as [0-9]
\D    non-digit
\w    word character: letter, digit, or underscore
\W    non-word character
\s    whitespace: space, tab, newline
\S    non-whitespace
```

`\w` depends on the `re.UNICODE` flag by default, so it includes letters from many alphabets.

### Quantifiers

Quantifiers repeat the previous element:

```text
*       zero or more
+       one or more
?       zero or one
{3}     exactly three
{2,4}   between two and four
{3,}    three or more
```

For example, `r"\d{3}-\d{2}-\d{4}"` matches a pattern like `123-45-6789`. `r"colou?r"` matches both `color` and `colour`.

### Greedy matching

By default, quantifiers are greedy: they match as much as possible while still allowing the rest of the pattern to match. `r"a.*b"` applied to `aXbYb` matches the whole string `aXbYb`, not `aXb`. Lazy quantifiers, which match as little as possible, are covered in Lesson 3.

### Anchors

Anchors match positions, not characters:

```text
^       start of the string (or line with re.MULTILINE)
$       end of the string (or line with re.MULTILINE)
\b      word boundary
\B      non-word boundary
```

`r"^Hello"` matches only if `Hello` is at the beginning. `r"\bcat\b"` matches `cat` as a whole word but not `category` or `concatenate`.

### Combining pieces

A complete pattern combines these parts. For example, an email-like pattern can be written as:

```text
r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
```

This reads: one or more word-like characters, an `@`, one or more domain characters, a literal dot, and two or more letters. Real email validation is more involved, but this pattern is a useful starting point.

### Common mistakes

- Forgetting the raw string and losing backslashes.
- Using `.` when you mean a literal dot.
- Forgetting that `*` and `+` apply only to the previous element, not a whole group.
- Writing `[a-z]+` and expecting it to match uppercase letters.
- Assuming `^` and `$` match line boundaries by default; they match the whole string unless `re.MULTILINE` is used.

## Common Pitfalls & Anti-Patterns
- **Forgetting raw strings**: `"\d"` is just `"d"` in Python. Always use `r"..."`.
- **Unescaped dots**: `.` matches any character. Escape it as `\.` for a literal dot.
- **Greedy quantifiers**: `.*` can consume more than you intended. Use lazy `.*?` when needed.
- **Missing anchors**: A pattern without `^` and `$` can match a substring instead of the whole string.
- **Wrong character class**: `[A-z]` includes characters between `Z` and `a`. Use `[A-Za-z]`.
- **Escaping unnecessarily**: Escaping a non-special character such as `\#` is harmless but noisy.
- **Catastrophic backtracking**: Nested quantifiers such as `(a+)+` can be very slow. Keep patterns simple.
- **Using regex for nested structures**: HTML and JSON have nesting that regex cannot handle reliably.
- **Assuming `\w` is only ASCII**: By default it includes Unicode letters. Use the `re.ASCII` flag if needed.
- **Forgetting that `?` makes a quantifier lazy when placed after it**: `*?` and `+?` are lazy forms.

## Quick Summary
- Use raw strings for regular expressions.
- Literals match themselves; special characters must be escaped.
- Character classes match one character from a set.
- Shorthands: `\d`, `\w`, `\s`, and their uppercase negations.
- Quantifiers: `*`, `+`, `?`, `{n}`, `{n,m}`.
- Anchors: `^`, `$`, `\b`.
- `.` matches any character except a newline by default.
- Greedy quantifiers match as much as possible.
- Anchors make a pattern match the whole string or a word boundary.
- Regex is poor at parsing nested formats such as HTML.
- Keep patterns readable and test them against examples.
- The next lesson covers Python's `re` module functions.
