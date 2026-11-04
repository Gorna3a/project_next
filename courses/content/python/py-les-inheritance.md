---
id: "py-les-inheritance"
type: "theory"
title: "Inheritance"
moduleId: "py-mod-09-object-oriented-programming"
order: 3
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "oop", "inheritance", "super", "mro"]
---

# Concept Overview

Inheritance lets a new class reuse and extend an existing class. The existing class is the base class or parent; the new class is the subclass or child. The subclass inherits the parent's attributes and methods, then adds or overrides behavior.

Inheritance models an "is-a" relationship. A manager is an employee, a square is a shape, and a savings account is a bank account. When that relationship is not true, composition is usually a better fit. This lesson covers subclassing, `super()`, overriding, `isinstance`, `issubclass`, and the method resolution order.

## Key Principles & Frameworks

### Creating a subclass

Put the parent class in parentheses after the subclass name:

```python
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
print(manager.name)
print(manager.describe())
```

Output:

```text
Ana
Ana earns 5000 and leads 4 people
```

`Manager` inherits `name` and `salary` from `Employee`. It also inherits the original `describe` method, but overrides it with a new version.

### super() calls the parent implementation

`super().__init__(name, salary)` runs `Employee.__init__` on the current object. It sets up the inherited attributes before `Manager` adds `team_size`. This avoids duplicating the parent's initialization code.

`super().describe()` calls the parent's `describe` method and returns its string. The subclass then extends that result. Use `super()` when you want the parent's behavior as part of the child's behavior.

A subclass that defines `__init__` must call `super().__init__(...)` when the parent needs to initialize state. Forgetting it leaves inherited attributes unset:

```python
class Employee:
    def __init__(self, name):
        self.name = name


class Manager(Employee):
    def __init__(self, team_size):
        self.team_size = team_size


manager = Manager(4)
try:
    print(manager.name)
except AttributeError as error:
    print(str(error))
```

Output:

```text
'Manager' object has no attribute 'name'
```

### Overriding methods

A subclass can replace a parent method entirely, or call the parent version and add to it:

```python
class Animal:
    def speak(self):
        return "..."


class Dog(Animal):
    def speak(self):
        return "Woof"


print(Animal().speak())
print(Dog().speak())
```

Output:

```text
...
Woof
```

The subclass method has the same name and signature as the parent method. Python looks for the method on the instance's class first, then moves up the hierarchy.

### isinstance and issubclass

`isinstance(object, ClassName)` checks whether an object is an instance of a class or any of its subclasses:

```python
class Employee:
    pass


class Manager(Employee):
    pass


manager = Manager()
print(isinstance(manager, Manager))
print(isinstance(manager, Employee))
print(isinstance(manager, object))
print(issubclass(Manager, Employee))
print(issubclass(Employee, Manager))
```

Output:

```text
True
True
True
True
False
```

`issubclass(Child, Parent)` checks the classes themselves. Every class is a subclass of `object`, the root of Python's class hierarchy.

`isinstance` is usually better than comparing `type(obj) is ClassName` because it respects subclasses. Use an exact type check only when a subclass must be rejected.

### The method resolution order

When you access a method, Python searches the class and its ancestors in a fixed order called the method resolution order, or MRO:

```python
class Employee:
    pass


class Manager(Employee):
    pass


for cls in Manager.__mro__:
    print(cls.__name__)
```

Output:

```text
Manager
Employee
object
```

The MRO starts with the most specific class and ends with `object`. `Manager.__mro__` is a tuple of classes. You can inspect it when a method seems to resolve to an unexpected place.

### Multiple inheritance in brief

A class can inherit from more than one base class:

```python
class A:
    def label(self):
        return "A"


class B(A):
    def label(self):
        return "B"


class C(A):
    def label(self):
        return "C"


class D(B, C):
    pass


print(D().label())
for cls in D.__mro__:
    print(cls.__name__)
```

Output:

```text
B
D
B
C
A
object
```

Python checks `D`, then `B`, then `C`, then `A`, then `object`. `B` comes before `C` because it appears first in `class D(B, C)`. The MRO follows the C3 linearization rules, which keep a consistent left-to-right order and avoid visiting a class before its subclasses.

Multiple inheritance is useful but easy to misuse. Prefer a single base class and small mixins, or use composition. If two parents define the same method, the MRO decides which one wins.

### Inheritance is an is-a relationship

Use inheritance when the subclass genuinely is a specialized version of the parent:

- A `Manager` is an `Employee`.
- A `SavingsAccount` is a `BankAccount`.
- A `Square` is a `Shape`.

Do not use inheritance only to reuse a method. If a `Car` has an `Engine`, `Car` should contain an `Engine` object, not inherit from it. Composition is covered in the final lesson.

Deep hierarchies become fragile because a change near the top can affect many subclasses. Keep hierarchies shallow and give each level a clear responsibility.

## Common Pitfalls & Anti-Patterns
- **Forgetting `super().__init__()`**: Inherited attributes stay unset. Call the parent initializer when the parent needs it.
- **Using inheritance for a has-a relationship**: A car has an engine, so it should contain one. Inheritance means is-a.
- **Overriding without understanding the parent**: Read the parent method and keep its contract, including return type and side effects.
- **Deep inheritance hierarchies**: Many levels make behavior hard to trace. Prefer shallow trees or composition.
- **Checking exact types instead of `isinstance`**: `type(obj) is Parent` rejects valid subclass instances. Use `isinstance` unless you truly need an exact type.
- **Assuming the first parent always wins**: The MRO decides lookup order, and multiple inheritance can surprise you. Inspect `__mro__` when needed.
- **Forgetting that every class inherits from `object`**: Methods such as `__str__` and `__eq__` ultimately come from `object`.
- **Changing a parent method's behavior for every subclass**: A broad change can break children. Add a new method or override deliberately.
- **Calling a parent method with the wrong arguments**: Keep signatures compatible when overriding.
- **Using multiple inheritance for unrelated concepts**: Prefer composition or a focused mixin.

## Quick Summary
- A subclass inherits attributes and methods from a base class.
- `class Child(Parent):` creates a subclass.
- `super().__init__(...)` runs the parent's initializer.
- `super().method()` reuses the parent's implementation.
- Overriding replaces a parent method in the subclass.
- `isinstance(obj, Class)` respects subclasses; `issubclass(Child, Parent)` checks classes.
- The MRO is the order Python uses to find methods.
- Multiple inheritance follows the MRO; keep it simple and inspect `__mro__` when needed.
- Inheritance models an is-a relationship; composition models has-a.
- Keep hierarchies shallow and purposeful.
