---
id: "py-mod-09-object-oriented-programming"
type: "module"
title: "Module 9: Object-Oriented Programming"
courseId: "python-programming"
order: 9
difficulty: "beginner"
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
tags: ["python", "oop", "classes", "inheritance", "dataclasses"]
prerequisites: ["py-mod-08-exceptions-and-files"]
description: "Model data and behavior with classes, inheritance, properties, dataclasses, composition, and abstract base classes."
---

# Module Overview

Object-oriented programming groups data and the operations that belong with it. A class describes the attributes and methods of a kind of object, and each instance holds its own state. This makes programs easier to reason about when they model real concepts such as accounts, shapes, or orders.

This module starts with classes and instances: `__init__`, `self`, methods, and the difference between instance and class attributes. The second lesson covers special methods such as `__str__`, `__repr__`, `__eq__`, `__lt__`, `__len__`, `__add__`, `__contains__`, and `__getitem__`. The third lesson introduces inheritance, `super()`, overriding, `isinstance`, `issubclass`, and the method resolution order. The fourth lesson explains encapsulation with `_name` and `__name`, properties with setters, static methods, and class methods. The final lesson covers dataclasses, mutable default fields, composition, and abstract base classes.

The workshop builds a bank account class and two subclasses step by step. The lab builds a small shape hierarchy with an abstract base class, a rectangle, a square, and a circle.

## What You Will Be Able To Do
- Define classes and create instances
- Initialize instance attributes with `__init__` and `self`
- Distinguish instance attributes from shared class attributes
- Avoid mutable class attributes that leak between instances
- Implement string, equality, ordering, length, addition, membership, and indexing behavior
- Explain the difference between `__str__` and `__repr__`
- Avoid defining `__eq__` without considering `__hash__`
- Build subclasses and call `super().__init__()`
- Override methods and reuse base behavior with `super()`
- Use `isinstance`, `issubclass`, and the method resolution order
- Apply the `_name` and `__name` conventions without treating them as true privacy
- Use `@property` with validation in a setter
- Use `@staticmethod` and `@classmethod`
- Create dataclasses with generated initialization, representation, and equality
- Use `field(default_factory=...)` for mutable defaults
- Prefer composition when an object has another object
- Define abstract base classes with `abc.ABC` and `@abstractmethod`
