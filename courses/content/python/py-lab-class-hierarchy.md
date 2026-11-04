---
id: "py-lab-class-hierarchy"
type: "lab"
title: "Class Hierarchy"
moduleId: "py-mod-09-object-oriented-programming"
order: 7
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 50
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["python", "oop", "inheritance", "abstract-classes", "shapes"]
---

# Objective

Build a small shape hierarchy with an abstract base class. `Shape` defines the contract, `Rectangle` and `Circle` implement it, and `Square` specializes `Rectangle`. You will also write two helpers that work with any shape through the shared interface.

The tests call your classes and functions directly. Keep the code free of prompts and printed output.

## Requirements
- Import `ABC` and `abstractmethod` from `abc`, and `math`.
- Define `Shape(ABC)` with an abstract `area` method. Add a concrete `describe` method that returns `CLASSNAME area=AREA`, where `AREA` is `round(self.area(), 2)`. For example, a `Rectangle` with area `12` returns `Rectangle area=12`.
- Define `Rectangle(Shape)` with `__init__(self, width, height)`. Raise `ValueError("width and height must be positive")` when either dimension is zero or negative. Store `width` and `height`, and implement `area` and `perimeter`. The perimeter is `2 * (width + height)`.
- Define `Square(Rectangle)` with `__init__(self, side)`. Reuse the rectangle initializer by calling `super().__init__(side, side)`. Do not define its own `area` or `perimeter`.
- Define `Circle(Shape)` with `__init__(self, radius)`. Raise `ValueError("radius must be positive")` when the radius is zero or negative. Implement `area` as `math.pi * radius ** 2` and `perimeter` as `2 * math.pi * radius`.
- Define `total_area(shapes)`. Sum the area of every shape in the list and return the total rounded to two decimal places.
- Define `largest(shapes)`. Return the shape with the largest area. Return `None` for an empty list. Do not use `max()` with a key.
- Do not print inside the classes or functions.
- Do not use list comprehensions or lambdas.

## Starter State / Workspace
```python
import math
from abc import ABC, abstractmethod

# Define Shape, Rectangle, Square, Circle, total_area, and largest below.
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "Rectangle(3, 4).area()", "expected": 12, "message": "Rectangle area should be width times height", "weight": 2, "required": true },
  { "type": "function-returns", "call": "Rectangle(3, 4).perimeter()", "expected": 14, "message": "Rectangle perimeter should be 2 * (width + height)", "weight": 2, "required": true },
  { "type": "function-returns", "call": "Rectangle(3, 4).describe()", "expected": "Rectangle area=12", "message": "describe should include the class name and rounded area", "required": true },
  { "type": "function-returns", "call": "Square(5).area()", "expected": 25, "message": "Square should inherit area from Rectangle", "weight": 2, "required": true },
  { "type": "function-returns", "call": "Square(5).perimeter()", "expected": 20, "message": "Square should inherit perimeter from Rectangle", "required": true },
  { "type": "function-returns", "call": "Square(5).describe()", "expected": "Square area=25", "message": "Square should use its own class name in describe", "required": true },
  { "type": "function-returns", "call": "round(Circle(2).area(), 2)", "expected": 12.57, "message": "Circle area should use math.pi and the radius squared", "weight": 2, "required": true },
  { "type": "function-returns", "call": "round(Circle(2).perimeter(), 2)", "expected": 12.57, "message": "Circle perimeter should be 2 * pi * radius", "required": true },
  { "type": "function-returns", "call": "Circle(2).describe()", "expected": "Circle area=12.57", "message": "describe should round the computed area to two places", "required": true },
  { "type": "function-returns", "call": "isinstance(Square(5), Rectangle)", "expected": true, "message": "Square should be a Rectangle", "required": true },
  { "type": "function-returns", "call": "issubclass(Circle, Shape)", "expected": true, "message": "Circle should be a Shape", "required": true },
  { "type": "function-throws", "call": "Rectangle(0, 4)", "errorType": "ValueError", "message": "A zero width should raise ValueError", "weight": 2, "required": true },
  { "type": "function-throws", "call": "Circle(-1)", "errorType": "ValueError", "message": "A negative radius should raise ValueError", "required": true },
  { "type": "function-throws", "call": "Shape()", "errorType": "TypeError", "message": "The abstract Shape should not be instantiable", "weight": 2, "required": true },
  { "type": "function-returns", "call": "total_area([Rectangle(2, 3), Square(4), Circle(1)])", "expected": 25.14, "message": "total_area should sum every shape and round to two places", "weight": 2, "required": true },
  { "type": "function-returns", "call": "total_area([])", "expected": 0, "message": "The total for an empty list should be zero", "required": true },
  { "type": "function-returns", "call": "type(largest([Rectangle(2, 3), Square(4), Circle(1)])).__name__", "expected": "Square", "message": "largest should return the shape with the greatest area", "weight": 2, "required": true },
  { "type": "function-returns", "call": "largest([]) is None", "expected": true, "message": "largest should return None for an empty list", "required": true },
  { "type": "code-contains", "value": "from abc import ABC, abstractmethod", "message": "Import ABC and abstractmethod", "required": true },
  { "type": "code-contains", "value": "class Shape(ABC)", "message": "Make Shape an abstract base class", "required": true },
  { "type": "code-contains", "value": "@abstractmethod", "message": "Mark area as abstract", "required": true },
  { "type": "code-contains", "value": "class Square(Rectangle)", "message": "Make Square a Rectangle subclass", "required": true },
  { "type": "code-contains", "value": "super().__init__(side, side)", "message": "Reuse the rectangle initializer from Square", "required": true }
]
```

## Hints
> [!TIP]
> **Hint 1:** `Shape` needs `class Shape(ABC):` and an `area` method decorated with `@abstractmethod`. The `describe` method can call `self.area()` because every concrete subclass must provide it.

> [!TIP]
> **Hint 2:** Validate dimensions before storing them in `Rectangle.__init__` and `Circle.__init__`. A square is a rectangle with equal width and height, so its initializer can be one `super().__init__` call.

> [!TIP]
> **Hint 3:** For `total_area`, start at `0`, loop over the shapes, add `shape.area()`, and return `round(total, 2)`. For `largest`, return `None` when the list is empty, then loop through the remaining shapes and keep the one with the bigger area.

> [!TIP]
> **Hint 4:** `describe` uses `type(self).__name__` so a `Square` reports `Square`, not `Rectangle`. Keep the area rounded to two decimal places in the string.

## Reference Solution
```python
import math
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    def describe(self):
        return f"{type(self).__name__} area={round(self.area(), 2)}"


class Rectangle(Shape):
    def __init__(self, width, height):
        if width <= 0 or height <= 0:
            raise ValueError("width and height must be positive")
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)


class Circle(Shape):
    def __init__(self, radius):
        if radius <= 0:
            raise ValueError("radius must be positive")
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

    def perimeter(self):
        return 2 * math.pi * self.radius


def total_area(shapes):
    total = 0
    for shape in shapes:
        total += shape.area()
    return round(total, 2)


def largest(shapes):
    if not shapes:
        return None

    best = shapes[0]
    for shape in shapes[1:]:
        if shape.area() > best.area():
            best = shape
    return best
```
