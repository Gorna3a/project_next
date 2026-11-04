---
id: "lab-class-hierarchy"
type: "lab"
title: "A Class Hierarchy"
moduleId: "mod-09-closures-this-classes"
order: 7
difficulty: "intermediate"
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
estimatedMinutes: 35
passingScorePercent: 100
revealSolutionAfterAttempts: 3
tags: ["classes","inheritance","super","prototypes"]
---

# Objective

Build a small shape hierarchy that shares behavior through inheritance.

Definitions:
- `Shape` is the base class. Its constructor stores a `name`. Its `area()` method throws an `Error` because the base shape has no area formula. Its `describe()` method returns `"<name> has area <area>"`.
- `Rectangle` extends `Shape`. Its constructor takes `width` and `height`, sets the name to `"Rectangle"`, and stores both dimensions. Its `area()` returns `width * height`.
- `Square` extends `Rectangle`. Its constructor takes one `side`, calls the parent constructor with `side, side`, and sets the name to `"Square"`.
- `Triangle` extends `Shape`. Its constructor takes `base` and `height`, sets the name to `"Triangle"`, and stores both values. Its `area()` returns `(base * height) / 2`.

## Requirements
- Use `extends` and `super` for both subclasses
- Override `area()` where a formula exists
- Reuse `describe()` from `Shape` instead of duplicating it
- `new Shape(...).area()` must throw an `Error`
- Instances must behave correctly with `instanceof`

## Starter State / Workspace
```js
// Implement Shape, Rectangle, Square, and Triangle below
```

## Evaluation Tests
```json
[
  { "type": "function-returns", "call": "new Rectangle(4, 5).area()", "expected": 20, "message": "Rectangle area should be width * height", "weight": 2, "required": true },
  { "type": "function-returns", "call": "new Rectangle(4, 5).describe()", "expected": "Rectangle has area 20", "message": "Rectangle should reuse Shape.describe()", "weight": 2, "required": true },
  { "type": "function-returns", "call": "new Square(3).area()", "expected": 9, "message": "Square area should use the inherited Rectangle formula", "weight": 2, "required": true },
  { "type": "function-returns", "call": "new Square(3).describe()", "expected": "Square has area 9", "message": "Square should set its own name", "weight": 2, "required": true },
  { "type": "function-returns", "call": "new Triangle(6, 4).area()", "expected": 12, "message": "Triangle area should be (base * height) / 2", "weight": 2, "required": true },
  { "type": "function-returns", "call": "new Triangle(6, 4).describe()", "expected": "Triangle has area 12", "message": "Triangle should reuse Shape.describe()", "required": true },
  { "type": "function-throws", "call": "new Shape(\"Blob\").area()", "errorType": "Error", "message": "The base Shape area should throw", "required": true },
  { "type": "function-returns", "call": "new Square(3) instanceof Rectangle", "expected": true, "message": "A Square should be an instance of Rectangle" },
  { "type": "function-returns", "call": "new Rectangle(4, 5) instanceof Shape", "expected": true, "message": "A Rectangle should be an instance of Shape" },
  { "type": "code-contains", "value": "extends", "message": "Use extends for inheritance" },
  { "type": "code-contains", "value": "super", "message": "Use super to call the parent constructor" }
]
```

## Hints
> [!TIP]
> **Hint 1:** Define `Shape` first. `describe()` can call `this.area()` so subclasses only need to implement the formula.

> [!TIP]
> **Hint 2:** In `Rectangle`, call `super("Rectangle")` before assigning `this.width` and `this.height`.

> [!TIP]
> **Hint 3:** In `Square`, call `super(side, side)` and then set `this.name = "Square"` so `describe()` uses the right name.

## Reference Solution
```js
class Shape {
  constructor(name) {
    this.name = name;
  }

  area() {
    throw new Error("Area must be implemented by a subclass");
  }

  describe() {
    return `${this.name} has area ${this.area()}`;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super("Rectangle");
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(side) {
    super(side, side);
    this.name = "Square";
  }
}

class Triangle extends Shape {
  constructor(base, height) {
    super("Triangle");
    this.base = base;
    this.height = height;
  }

  area() {
    return (this.base * this.height) / 2;
  }
}
```
