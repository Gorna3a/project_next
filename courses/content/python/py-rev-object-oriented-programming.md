---
id: "py-rev-object-oriented-programming"
type: "review"
title: "Object-Oriented Programming Quick Reference"
moduleId: "py-mod-09-object-oriented-programming"
order: 8
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
covers: ["py-les-classes-and-objects", "py-les-methods-and-dunder-methods", "py-les-inheritance", "py-les-encapsulation-and-properties", "py-les-dataclasses-and-composition", "py-ws-bank-account", "py-lab-class-hierarchy"]
tags: ["python", "oop", "classes", "inheritance", "reference"]
---

# Quick Reference Summary

## Core Terminology / Formula Matrix
| Term / Command | Definition / Formula | Common Usage |
| :--- | :--- | :--- |
| Class | A blueprint for objects | `class Student:` |
| Instance | One object created from a class | `Student("Ana")` |
| `__init__` | Initializer called after an instance is created | Setting up attributes |
| `self` | The current instance | First parameter of an instance method |
| Instance attribute | State stored on one object | `self.name = name` |
| Class attribute | State shared through the class | `school = "PixelCode"` |
| Method | A function defined in a class | `def greet(self):` |
| Dunder method | A special method with double underscores | `__str__`, `__eq__` |
| `__str__` | Human-readable string for `print()` | Displaying an object |
| `__repr__` | Developer-facing representation | Debugging, containers |
| `__eq__` | Defines `==` | Comparing field values |
| `__hash__` | Defines `hash(obj)` | Dictionary keys and sets |
| `__lt__` | Defines `<` | Sorting objects |
| `__len__` | Defines `len(obj)` | Collection size |
| `__getitem__` | Defines `obj[index]` | Indexed access |
| `__contains__` | Defines `item in obj` | Membership tests |
| `__add__` | Defines `obj + other` | Combining values |
| Inheritance | A subclass reuses a base class | `class Manager(Employee):` |
| Base class | The parent being inherited from | `Employee` |
| Subclass | The child that extends the parent | `Manager` |
| `super()` | Access the parent implementation | `super().__init__(...)` |
| Overriding | Replacing a parent method in a subclass | A subclass `describe` |
| `isinstance` | Checks an object against a class and its subclasses | `isinstance(manager, Employee)` |
| `issubclass` | Checks one class against another | `issubclass(Manager, Employee)` |
| MRO | Method resolution order | `Manager.__mro__` |
| `_name` | Internal-by-convention attribute | `self._balance` |
| `__name` | Name-mangled attribute | `self.__code` becomes `self._Class__code` |
| Property | Attribute-like access backed by methods | `@property` |
| Setter | Validation or transformation on assignment | `@name.setter` |
| `@staticmethod` | Method with no `self` or `cls` | Related helper |
| `@classmethod` | Method that receives `cls` | Alternative constructor |
| Dataclass | Class with generated methods from fields | `@dataclass` |
| `field(default_factory=...)` | Per-instance mutable default | `field(default_factory=list)` |
| Composition | One object contains another | `Car` contains `Engine` |
| `ABC` | Abstract base class marker | `class Shape(ABC):` |
| `@abstractmethod` | Method subclasses must implement | `def area(self): ...` |

## Key Concepts Comparison
- **Class vs. instance**: A class is the blueprint; an instance is one object with its own state.
- **Instance attribute vs. class attribute**: Instance attributes belong to one object. Class attributes are shared, unless an instance shadows them by assignment.
- **Mutable class attribute vs. instance attribute**: A list in the class body is shared by every instance. A list created in `__init__` is separate per instance.
- **`self` vs. `cls`**: `self` is the current instance; `cls` is the current class in a class method.
- **Instance method vs. class method vs. static method**: Instance methods receive `self`, class methods receive `cls`, and static methods receive neither.
- **`__str__` vs. `__repr__`**: `__str__` is readable text for users. `__repr__` is an unambiguous representation for developers.
- **`__eq__` vs. identity**: `==` compares values when `__eq__` is defined. `is` compares whether two names point to the same object.
- **`__eq__` vs. `__hash__`**: Equal objects must have equal hashes. Defining `__eq__` makes instances unhashable unless `__hash__` is also defined.
- **`__lt__` vs. other comparisons**: `__lt__` enables `<` and sorting. Other comparisons need their own methods or `functools.total_ordering`.
- **Inheritance vs. composition**: Inheritance models is-a. Composition models has-a and is usually better for deep or replaceable behavior.
- **`isinstance` vs. exact type**: `isinstance` accepts subclasses; `type(obj) is Class` rejects them.
- **`issubclass` vs. `isinstance`**: `issubclass` checks classes. `isinstance` checks objects.
- **`_name` vs. `__name`**: A single underscore is a convention. Double underscores trigger name mangling, not security.
- **Property vs. plain attribute**: Use a plain attribute until validation or computation is needed. A property runs code on access.
- **Read-only property vs. property with setter**: A getter-only property cannot be assigned. Add `@name.setter` to allow validated changes.
- **Dataclass vs. ordinary class**: Dataclasses generate data methods from fields. Ordinary classes fit behavior-heavy designs.
- **Dataclass default vs. `default_factory`**: Plain defaults are shared; `default_factory` creates a new value per instance for mutable types.
- **ABC vs. ordinary base class**: An ABC can declare abstract methods that subclasses must implement before instantiation.

## Critical Syntax / Templates
```python
# Class, initializer, and instance attributes
class Student:
    school = "PixelCode"

    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"{self.name} at {self.school}"


student = Student("Ana")
print(student.describe())
```

```python
# Class attribute shadowing and a per-instance list
class Team:
    members = []

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

```python
# Display, equality, hashing, and ordering
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Point({self.x!r}, {self.y!r})"

    def __eq__(self, other):
        if type(other) is not Point:
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

    def __lt__(self, other):
        return (self.x, self.y) < (other.x, other.y)


print(Point(1, 2) == Point(1, 2))
print(sorted([Point(2, 1), Point(1, 2)]))
```

```python
# Collection behavior
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
```

```python
# Inheritance, super(), and overriding
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def describe(self):
        return f"{self.name} earns {self.salary}"


class Manager(Employee):
    def __init__(self, name, salary, team_size):
        super().__init__(name, salary)
        self.team_size = team_size

    def describe(self):
        return super().describe() + f" and leads {self.team_size} people"


manager = Manager("Ana", 5000, 4)
print(manager.describe())
print(isinstance(manager, Employee))
print(issubclass(Manager, Employee))
```

```python
# Property with validation and a read-only computed property
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32


temperature = Temperature(20)
print(temperature.celsius)
print(temperature.fahrenheit)
```

```python
# Static method and class method
class Student:
    school = "PixelCode"

    def __init__(self, name):
        self.name = name

    @staticmethod
    def is_valid_name(name):
        return bool(name.strip())

    @classmethod
    def from_line(cls, line):
        name = line.split(",")[0].strip()
        return cls(name)


print(Student.is_valid_name("Ana"))
print(Student.from_line("Ana, 92").name)
```

```python
# Dataclass with a safe mutable default
from dataclasses import dataclass, field


@dataclass
class Order:
    customer: str
    items: list = field(default_factory=list)

    def add(self, item):
        self.items.append(item)


order = Order("Ana")
order.add("Book")
print(order)
print(Order("Ben").items)
```

```python
# Composition
class Engine:
    def __init__(self, horsepower):
        self.horsepower = horsepower

    def start(self):
        return f"engine with {self.horsepower} hp started"


class Car:
    def __init__(self, model, horsepower):
        self.model = model
        self.engine = Engine(horsepower)

    def start(self):
        return f"{self.model}: {self.engine.start()}"


print(Car("Pixel", 150).start())
```

```python
# Abstract base class
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    def describe(self):
        return f"{type(self).__name__} area={round(self.area(), 2)}"


class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


print(Square(4).describe())
```

```text
# Bank account hierarchy from the workshop
BankAccount
  SavingsAccount
  CheckingAccount

# Shape hierarchy from the lab
Shape (abstract)
  Rectangle
    Square
  Circle
```
