---
id: "py-les-dataclasses-and-composition"
type: "theory"
title: "Dataclasses and Composition"
moduleId: "py-mod-09-object-oriented-programming"
order: 5
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "oop", "dataclasses", "composition", "abstract-base-classes"]
---

# Concept Overview

Many classes exist mainly to hold a few fields: a product with a name and price, a point with coordinates, or an order with a customer and items. Writing `__init__`, `__repr__`, and `__eq__` by hand for every one of them is repetitive. Python's `dataclasses` module generates those methods from annotated fields.

Not every relationship should be inheritance. A car has an engine, but a car is not an engine. Composition builds a class by containing other objects, which keeps responsibilities separate and avoids fragile hierarchies. This lesson covers dataclasses, mutable defaults, composition, and abstract base classes.

## Key Principles & Frameworks

### Creating a dataclass

The `@dataclass` decorator reads the annotated fields and generates `__init__`, `__repr__`, and `__eq__`:

```python
from dataclasses import dataclass


@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0


product = Product("Keyboard", 49.99)
print(product)
print(product == Product("Keyboard", 49.99))
```

Output:

```text
Product(name='Keyboard', price=49.99, quantity=0)
True
```

The generated initializer accepts the fields in order. The generated representation shows the class name and each field. The generated equality compares the field values.

Type hints such as `str`, `float`, and `int` are required for dataclass fields because the decorator uses them to discover the fields. This module uses hints only in dataclass definitions; general type hints are covered in Module 16.

### Defaults and field order

Fields with defaults must come after fields without defaults:

```python
from dataclasses import dataclass


@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0


print(Product("Keyboard", 49.99).quantity)
```

Output:

```text
0
```

A field without a default after a field with a default causes a `TypeError` when the class is defined. Put required fields first and optional fields last.

### Mutable defaults need default_factory

A list, dictionary, or set cannot be a plain dataclass default:

```python
from dataclasses import dataclass


try:
    @dataclass
    class Order:
        items: list = []
except ValueError as error:
    print(str(error))
```

Output:

```text
mutable default <class 'list'> for field items is not allowed: use default_factory
```

Even if Python allowed it, every instance would share the same list. Use `field(default_factory=list)` so a new list is created for each instance:

```python
from dataclasses import dataclass, field


@dataclass
class Order:
    customer: str
    items: list = field(default_factory=list)


order = Order("Ana")
order.items.append("Book")
print(order.items)
print(Order("Ben").items)
```

Output:

```text
['Book']
[]
```

`default_factory` takes a callable, such as `list` or `dict`, and calls it once per instance. This is the dataclass equivalent of writing `self.items = []` in `__init__`.

### Dataclasses can have methods

A dataclass can define ordinary methods alongside its fields:

```python
from dataclasses import dataclass


@dataclass
class Rectangle:
    width: float
    height: float

    def area(self):
        return self.width * self.height


print(Rectangle(3, 4).area())
```

Output:

```text
12
```

Use a dataclass when the class is primarily a data container. Add methods for behavior that clearly belongs to the data. If the class is mostly behavior with little state, an ordinary class is usually clearer.

### Composition

Composition means one object contains another object and delegates work to it:

```python
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


car = Car("Pixel", 150)
print(car.start())
```

Output:

```text
Pixel: engine with 150 hp started
```

`Car` has an `Engine`. It does not inherit from `Engine`, because a car is not a kind of engine. The engine can be replaced, tested, or reused in another vehicle without changing the car's inheritance tree.

### Composition versus inheritance

| Relationship | Use | Example |
| :--- | :--- | :--- |
| Is-a | Inheritance | A `Manager` is an `Employee` |
| Has-a | Composition | A `Car` has an `Engine` |
| Uses-a | A parameter or local object | A `Report` uses a formatter |

Inheritance is appropriate when the subclass is genuinely a specialized version of the parent and can honor the parent's contract. Composition is usually better when one object merely uses another, when the hierarchy would become deep, or when behavior needs to be swapped at runtime.

### Abstract base classes

An abstract base class defines a contract that subclasses must implement. `abc.ABC` marks the base class, and `@abstractmethod` marks methods that must be overridden:

```python
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self):
        pass


class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


print(Square(4).area())
try:
    Shape()
except TypeError:
    print("Shape cannot be instantiated")
```

Output:

```text
16
Shape cannot be instantiated
```

`Shape` cannot be instantiated because it still has an abstract method. A subclass must implement every abstract method before it can be instantiated. Abstract base classes document intent and catch incomplete implementations early.

This is a brief introduction. Module 16 revisits typing and interfaces, and larger programs often combine abstract base classes with composition.

## Common Pitfalls & Anti-Patterns
- **Using a mutable dataclass default**: `items: list = []` raises an error and would share state if allowed. Use `field(default_factory=list)`.
- **Putting a required field after a default field**: Dataclass fields with defaults must come last.
- **Forgetting type hints on dataclass fields**: The decorator discovers fields from annotations. A field without one is not included.
- **Using a dataclass for behavior-heavy classes**: Dataclasses fit data containers. Use an ordinary class when behavior and lifecycle dominate.
- **Choosing inheritance for a has-a relationship**: A car has an engine. Contain it instead of subclassing it.
- **Building deep inheritance trees for reuse**: Composition keeps responsibilities separate and is easier to change.
- **Instantiating an abstract class**: A class with unimplemented abstract methods raises `TypeError`.
- **Forgetting to implement an abstract method in a subclass**: The subclass remains abstract and cannot be instantiated.
- **Treating dataclass equality as identity**: Generated equality compares field values. Two different objects with equal fields compare equal.
- **Assuming dataclass fields are validated**: Generated initializers do not validate values. Add `__post_init__` or properties when validation is needed.

## Quick Summary
- `@dataclass` generates `__init__`, `__repr__`, and `__eq__` from annotated fields.
- Dataclass fields require type hints.
- Required fields come before fields with defaults.
- Use `field(default_factory=list)` for mutable defaults.
- Dataclasses can include ordinary methods.
- Composition builds a class by containing another object.
- Inheritance models is-a; composition models has-a.
- Prefer composition when a hierarchy would become deep or behavior must be swapped.
- `abc.ABC` and `@abstractmethod` define a contract for subclasses.
- Abstract classes cannot be instantiated until every abstract method is implemented.
