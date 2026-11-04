---
id: "py-les-methods-and-dunder-methods"
type: "theory"
title: "Methods and Dunder Methods"
moduleId: "py-mod-09-object-oriented-programming"
order: 2
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "oop", "dunder-methods", "operator-overloading"]
---

# Concept Overview

Python uses special methods to connect your classes to built-in syntax and functions. Names with two leading and two trailing underscores, such as `__str__` and `__len__`, are called special methods or dunder methods. You rarely call them directly; Python calls them for you when you print an object, compare two objects, sort a list, or use an operator.

This lesson covers the dunder methods that make an object feel natural in Python: `__str__` and `__repr__` for display, `__eq__` and `__lt__` for comparison, `__len__`, `__contains__`, and `__getitem__` for collection behavior, and `__add__` for the `+` operator. This practice is called operator overloading.

## Key Principles & Frameworks

### __str__ for people

`__str__` returns the readable text used by `print()` and `str()`:

```python
class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __str__(self):
        return f"{self.title} ({self.pages} pages)"


book = Book("Python Basics", 320)
print(book)
print(str(book))
```

Output:

```text
Python Basics (320 pages)
Python Basics (320 pages)
```

The method must return a string. If it returns something else, `print()` raises `TypeError`.

### __repr__ for developers

`__repr__` returns an unambiguous representation, ideally one that looks like the code that would recreate the object. It is used by `repr()`, the interactive prompt, and the display of containers:

```python
class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __str__(self):
        return f"{self.title} ({self.pages} pages)"

    def __repr__(self):
        return f"Book({self.title!r}, {self.pages!r})"


book = Book("Python Basics", 320)
print(book)
print(repr(book))
print([book])
```

Output:

```text
Python Basics (320 pages)
Book('Python Basics', 320)
[Book('Python Basics', 320)]
```

The `!r` conversion in the f-string inserts the `repr()` of the title, so the string gains quotes. A list displays its items with `repr()`, which is why the list output shows `Book('Python Basics', 320)` instead of the friendly text.

If a class defines only `__repr__`, `print()` falls back to it:

```python
class Label:
    def __init__(self, text):
        self.text = text

    def __repr__(self):
        return f"Label({self.text!r})"


print(Label("home"))
```

Output:

```text
Label('home')
```

Define both methods when the two audiences need different text. Use `__repr__` for debugging and `__str__` for user-facing output.

### __eq__ for equality

By default, two instances of the same class compare as unequal unless they are the same object. Define `__eq__` to compare their data:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if type(other) is not Point:
            return NotImplemented
        return self.x == other.x and self.y == other.y


print(Point(1, 2) == Point(1, 2))
print(Point(1, 2) == Point(3, 4))
print(Point(1, 2) == "point")
```

Output:

```text
True
False
False
```

`NotImplemented` is a special signal, not an exception. It tells Python to let the other operand try its own comparison. If neither side can compare, Python falls back to identity and returns `False`. Return `NotImplemented` rather than raising an error when the other type is unsupported.

### __eq__ and __hash__

Instances are hashable by default. When a class defines `__eq__`, Python sets `__hash__` to `None` because equal objects must have equal hashes, and the default hash is based on identity:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if type(other) is not Point:
            return NotImplemented
        return self.x == other.x and self.y == other.y


try:
    print(hash(Point(1, 2)))
except TypeError as error:
    print(str(error))
```

Output:

```text
unhashable type: 'Point'
```

If instances need to work as dictionary keys or set members, define `__hash__` consistently with `__eq__`:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if type(other) is not Point:
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))


print(Point(1, 2) == Point(1, 2))
print(hash(Point(1, 2)) == hash(Point(1, 2)))
```

Output:

```text
True
True
```

The hash uses the same fields as equality. If two points are equal, their tuples are equal, so their hashes are equal.

### __lt__ for ordering

`sorted()`, `min()`, and `max()` use `__lt__` to order objects:

```python
class Version:
    def __init__(self, number):
        self.number = number

    def __lt__(self, other):
        return self.number < other.number

    def __repr__(self):
        return f"Version({self.number})"


versions = [Version(3), Version(1), Version(2)]
print(Version(2) < Version(3))
print(sorted(versions))
```

Output:

```text
True
[Version(1), Version(2), Version(3)]
```

`__lt__` should return a boolean. If you need all comparisons, define the others or use `functools.total_ordering`, which is covered later. Do not invent an ordering that surprises users.

### __len__, __contains__, and __getitem__

These methods make an object behave like a collection:

```python
class Playlist:
    def __init__(self, songs):
        self.songs = songs

    def __len__(self):
        return len(self.songs)

    def __getitem__(self, index):
        return self.songs[index]

    def __contains__(self, song):
        return song in self.songs


playlist = Playlist(["Intro", "Skyline", "Outro"])
print(len(playlist))
print(playlist[1])
print("Skyline" in playlist)
print("Missing" in playlist)
```

Output:

```text
3
Skyline
True
False
```

`len(playlist)` calls `__len__`. `playlist[1]` calls `__getitem__`. The `in` operator calls `__contains__` when it exists. Return an integer from `__len__`; negative values raise `ValueError`.

### __add__ for the plus operator

`__add__` defines what `+` means for your type:

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __str__(self):
        return f"({self.x}, {self.y})"


print(Vector(1, 2) + Vector(3, 4))
```

Output:

```text
(4, 6)
```

`Vector(...) + Vector(...)` calls `__add__` on the left operand and passes the right operand as `other`. Return a new object instead of modifying the left operand; `+` should not surprise users by changing its inputs.

### Operator overloading should be intuitive

Overloading works best when the operator already has an obvious meaning. Use `+` for combining values, `<` for a natural order, and `len()` for a countable size. Avoid giving `+` a destructive or unrelated meaning. Clear method names are better than clever operators.

## Common Pitfalls & Anti-Patterns
- **Confusing `__str__` and `__repr__`**: `__str__` is for users and `print()`; `__repr__` is for developers and debugging. Define both when they differ.
- **Returning a non-string from `__str__` or `__repr__`**: Both must return strings, or Python raises `TypeError`.
- **Defining `__eq__` without `__hash__`**: Instances become unhashable. Define `__hash__` when objects must work in sets or as dictionary keys.
- **Defining an inconsistent `__hash__`**: Equal objects must have equal hashes. Hash the same fields that equality compares.
- **Raising an error from `__eq__` for an unknown type**: Return `NotImplemented` and let Python try the other operand.
- **Making `__lt__` return a non-boolean**: Comparison operators expect a truth value.
- **Mutating the left operand in `__add__`**: `a + b` should produce a new value, not change `a`.
- **Overloading operators with surprising meanings**: A confusing `+` or `<` makes code harder to read than a named method.
- **Forgetting that `__len__` must return a non-negative integer**: Return `len(self.items)`, not the items themselves.
- **Calling dunder methods directly**: Use `str(obj)`, `len(obj)`, or `obj == other`; Python calls the right method.

## Quick Summary
- Dunder methods connect classes to Python syntax and built-ins.
- `__str__` returns readable text for `print()`.
- `__repr__` returns a developer-facing representation for debugging and containers.
- `__eq__` defines `==`; return `NotImplemented` for unsupported types.
- Defining `__eq__` makes instances unhashable unless you also define `__hash__`.
- `__lt__` defines `<` and enables sorting.
- `__len__`, `__contains__`, and `__getitem__` provide collection behavior.
- `__add__` defines `+`; return a new object instead of mutating the left operand.
- Operator overloading is best when the operator's meaning is obvious.
