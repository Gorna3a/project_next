---
id: "py-les-classes-and-objects"
type: "theory"
title: "Classes and Objects"
moduleId: "py-mod-09-object-oriented-programming"
order: 1
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 20
tags: ["python", "oop", "classes", "objects", "attributes"]
---

# Concept Overview

A class is a blueprint for a kind of object. It describes which attributes an object has and which methods it can run. An instance is one object built from that blueprint. If `Student` is the class, `ana` and `ben` can be two instances with their own names and scores.

Classes keep related data and behavior together. Instead of passing a dictionary and a separate set of functions everywhere, you define one type that owns both. This module builds that idea from the ground up, starting with `__init__`, `self`, instance attributes, class attributes, and methods.

## Key Principles & Frameworks

### Defining a class

Use the `class` keyword and a capitalized name:

```python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def speak(self):
        return f"{self.name} says woof"


dog = Dog("Rex", 3)
print(dog.name)
print(dog.age)
print(dog.speak())
```

Output:

```text
Rex
3
Rex says woof
```

`Dog` is the class. `dog` is an instance. Calling `Dog("Rex", 3)` creates the instance and runs `__init__`.

### __init__ and self

`__init__` is the initializer. Python calls it automatically after creating a new instance. It receives the new object as its first argument, named `self` by convention, followed by the arguments you passed to the class.

`self.name = name` creates an instance attribute named `name` on that particular object. `self` is not a keyword; it is an ordinary parameter that points to the current instance.

When you call `dog.speak()`, Python passes `dog` as `self`. The call is equivalent to `Dog.speak(dog)`.

### Methods can change state

A method is a function defined inside a class. It can read and update the instance's attributes:

```python
class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1

    def increment_twice(self):
        self.increment()
        self.increment()


counter = Counter()
counter.increment_twice()
print(counter.value)
```

Output:

```text
2
```

`increment_twice` calls `self.increment()` twice. Methods can call other methods through `self`.

### Instance attributes belong to one object

Each instance has its own attribute values:

```python
class Student:
    def __init__(self, name):
        self.name = name


ana = Student("Ana")
ben = Student("Ben")
ana.name = "Ana Maria"

print(ana.name)
print(ben.name)
```

Output:

```text
Ana Maria
Ben
```

Changing `ana.name` does not affect `ben.name`. The two instances hold separate state.

### Class attributes are shared

An attribute defined directly in the class body belongs to the class and is visible through every instance:

```python
class Student:
    school = "PixelCode"

    def __init__(self, name):
        self.name = name


ana = Student("Ana")
ben = Student("Ben")

print(ana.school)
print(ben.school)
print(Student.school)
```

Output:

```text
PixelCode
PixelCode
PixelCode
```

`school` is a class attribute. It is useful for values that are the same for every instance, such as a school name, a version number, or a constant.

### Assignment creates an instance attribute

Reading `ana.school` finds the class attribute. Assigning `ana.school = ...` creates a new instance attribute that shadows the class attribute for that object only:

```python
class Student:
    school = "PixelCode"

    def __init__(self, name):
        self.name = name


ana = Student("Ana")
ben = Student("Ben")
ana.school = "Another School"

print(ana.school)
print(ben.school)
print(Student.school)
```

Output:

```text
Another School
PixelCode
PixelCode
```

The class attribute is unchanged. `ana` now has its own `school` entry.

### A mutable class attribute is shared by every instance

A list or dictionary defined in the class body is one object shared by all instances:

```python
class Team:
    members = []

    def add(self, name):
        self.members.append(name)


red = Team()
blue = Team()
red.add("Ana")
blue.add("Ben")

print(red.members)
print(blue.members)
```

Output:

```text
['Ana', 'Ben']
['Ana', 'Ben']
```

Both teams show both names because `members` is the same list. Create mutable state inside `__init__` instead:

```python
class Team:
    def __init__(self):
        self.members = []

    def add(self, name):
        self.members.append(name)


red = Team()
blue = Team()
red.add("Ana")
blue.add("Ben")

print(red.members)
print(blue.members)
```

Output:

```text
['Ana']
['Ben']
```

Each call to `Team()` now creates a fresh list.

### Class attributes for constants

Class attributes are a good place for values shared by every instance:

```python
class Invoice:
    tax_rate = 0.2

    def __init__(self, subtotal):
        self.subtotal = subtotal

    def total(self):
        return round(self.subtotal * (1 + self.tax_rate), 2)


print(Invoice(100).total())
```

Output:

```text
120.0
```

The method reads `self.tax_rate`, which finds the class attribute. If a subclass needs a different rate, it can override the class attribute without changing the method.

### Instance attributes versus class attributes

| Attribute | Defined | Belongs to | Shared |
| :--- | :--- | :--- | :--- |
| Instance attribute | `self.name = ...` in a method, usually `__init__` | One instance | No |
| Class attribute | Directly in the class body | The class | Yes, unless shadowed |
| Method | `def` inside the class body | The class | Yes |

Use instance attributes for state that can differ between objects. Use class attributes for constants or defaults that genuinely apply to all instances.

## Common Pitfalls & Anti-Patterns
- **Forgetting `self` in a method signature**: `def speak():` cannot access the instance. Use `def speak(self):`.
- **Forgetting `self.` when assigning state**: `name = name` creates a local variable. Use `self.name = name`.
- **Defining mutable state in the class body**: A shared list or dictionary leaks data between instances. Initialize it in `__init__`.
- **Confusing class and instance attributes**: Reading an attribute may find the class value, but assigning it usually creates an instance value.
- **Using a class attribute for per-object state**: A counter or list in the class body is shared. Use `self` for state that belongs to one object.
- **Calling a method without an instance**: `Dog.speak()` is missing the `self` argument. Call `dog.speak()` or pass an instance explicitly.
- **Naming the class in lowercase**: Class names use `PascalCase`; instances use `snake_case`.
- **Putting every helper inside the class**: If a function does not need instance state, a plain function is often clearer.
- **Forgetting parentheses when creating an instance**: `dog = Dog` assigns the class, not an object. Use `Dog(...)`.

## Quick Summary
- A class is a blueprint; an instance is one object built from it.
- `__init__` initializes a new instance.
- `self` refers to the current instance and must be the first parameter of an instance method.
- `self.name = value` creates an instance attribute.
- Instance attributes are separate for each object.
- Class attributes are shared and are defined in the class body.
- Assigning through an instance shadows a class attribute for that instance.
- Mutable class attributes are shared; create lists and dictionaries in `__init__`.
- Methods are functions that receive the instance through `self`.
- Use class attributes for constants and instance attributes for per-object state.
