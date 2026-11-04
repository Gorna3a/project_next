---
id: "py-les-strings"
type: "theory"
title: "Strings: Text, Indexing, and f-Strings"
moduleId: "py-mod-02-variables-and-data-types"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "strings", "f-strings", "slicing"]
---

# Concept Overview

A string is a sequence of text characters. Strings store names, messages, file contents, and any other textual data. Python strings are immutable: methods return new strings instead of changing the original.

You can create a string with single or double quotes. Use double quotes by default, and switch to single quotes when the text contains a double quote.

```python
greeting = "Hello"
name = 'Sam'
message = "It's ready."
```

## Key Principles & Frameworks

### Quotes, escapes, and multiline strings

Single and double quotes are equivalent. The choice is mostly about readability.

Escape sequences insert characters that would otherwise be difficult to type:

```python
print("Line one\nLine two")
print("A tab\tbetween")
print("A backslash: \\")
print("She said \"hello\".")
```

Output:

```text
Line one
Line two
A tab	between
A backslash: \
She said "hello".
```

A raw string treats backslashes literally, which is useful for Windows paths and regular expressions:

```python
path = r"C:\Users\Sam"
print(path)
```

Triple quotes create a multiline string:

```python
message = """This string
spans two lines."""
print(message)
```

The newline is part of the string. A triple-quoted string is still a string, not a comment.

### Indexing

Each character has an index. Indexing starts at `0`:

```python
word = "Python"
print(word[0])
print(word[1])
print(word[-1])
```

Output:

```text
P
y
n
```

A negative index counts from the end. `word[-1]` is the last character, `word[-2]` is the second-to-last, and so on.

An index outside the string is an error:

```python
# word[10] raises an IndexError.
```

### Slicing

A slice extracts a substring with `start:stop:step`. The `start` index is included, and the `stop` index is excluded.

```python
word = "Python"

print(word[1:4])
print(word[:3])
print(word[3:])
print(word[::2])
```

Output:

```text
yth
Pyt
hon
Pto
```

Omitted values use defaults: start at the beginning, stop at the end, and step by one. A negative step walks backward:

```python
print(word[::-1])
```

Output:

```text
nohtyP
```

### Immutability

Strings cannot be changed in place:

```python
word = "Python"

# word[0] = "J" raises TypeError.
```

To change a string, build a new one:

```python
word = "Python"
word = "J" + word[1:]
print(word)
```

Output:

```text
Jython
```

The concatenation creates a new string and rebinds `word`. The original string is unchanged.

### Common string methods

Methods are functions attached to a value. String methods return new values; they do not modify the original string.

```python
text = "  Hello, World!  "

print(text.strip())
print(text.lower())
print(text.upper())
print(text.replace("World", "Python"))
print(text.find("World"))
print(text.count("l"))
print(len(text))
```

Output:

```text
Hello, World!
  hello, world!  
  HELLO, WORLD!  
  Hello, Python!  
9
3
17
```

`strip()` removes leading and trailing whitespace. `lower()` and `upper()` change case. `replace()` substitutes every occurrence. `find()` returns the index of the first match or `-1` when the text is absent. `count()` counts occurrences. `len()` returns the number of characters, including spaces.

These methods do not change `text`. If you want to keep a result, assign it to a name:

```python
clean_text = text.strip()
print(clean_text)
```

### f-strings

An f-string embeds expressions inside a string. Prefix the string with `f` and put the expression in braces:

```python
name = "Sam"
score = 42

print(f"{name} scored {score} points.")
print(f"Next year: {score + 1}")
print(f"Name length: {len(name)}")
```

Output:

```text
Sam scored 42 points.
Next year: 43
Name length: 3
```

The expressions are evaluated when the string is created. You can use any expression that produces a value, including method calls and arithmetic.

To print literal braces, double them:

```python
print(f"Use {{braces}} for literal braces.")
```

Output:

```text
Use {braces} for literal braces.
```

### Concatenation

The `+` operator joins two strings:

```python
first_name = "Ada"
last_name = "Lovelace"
full_name = first_name + " " + last_name
print(full_name)
```

Output:

```text
Ada Lovelace
```

You cannot concatenate a string and a number directly:

```python
# "Age: " + 42 raises TypeError.
```

An f-string handles the conversion automatically:

```python
age = 42
print(f"Age: {age}")
```

The type-casting lesson later in this module covers `str()` and the other conversion functions in detail, including cases where you need an explicit conversion.

## Common Pitfalls & Anti-Patterns
- **Trying to change a character in place**: Strings are immutable. Build a new string instead.
- **Forgetting that indexing starts at `0`**: The first character is `text[0]`.
- **Expecting the slice stop index to be included**: `text[1:4]` returns characters at indexes 1, 2, and 3.
- **Forgetting the `f` prefix**: `"Hello, {name}"` prints the braces literally.
- **Mixing quote types incorrectly**: Use a different quote for the string or escape the inner quote.
- **Concatenating text and numbers**: `"Age: " + 42` raises `TypeError`. Convert the number with `str()`.
- **Assuming string methods modify the original**: They return new strings. Assign the result if you need it.
- **Using a comma as a thousands separator inside a number**: In text, commas are ordinary characters; format numbers deliberately when you need grouping.

## Quick Summary
- Strings are immutable sequences of text characters.
- Indexing starts at `0`; negative indexes count from the end.
- Slices use `start:stop:step`, and the stop index is excluded.
- Common methods include `strip`, `lower`, `upper`, `replace`, `find`, and `count`.
- f-strings embed expressions in text with `{...}`.
- `+` concatenates strings; convert non-string values first.
