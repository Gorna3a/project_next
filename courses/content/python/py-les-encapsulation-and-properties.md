---
id: "py-les-encapsulation-and-properties"
type: "theory"
title: "Encapsulation and Properties"
moduleId: "py-mod-09-object-oriented-programming"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 25
tags: ["python", "oop", "encapsulation", "properties", "classmethod"]
---

# Concept Overview

Encapsulation means keeping an object's state and the rules for changing it together. Callers should use methods or properties instead of editing internal attributes directly. That lets the class validate changes, preserve invariants, and change its internals later without breaking every caller.

Python does not enforce private attributes the way some languages do. It uses naming conventions, properties, and methods to make the intended boundary clear. This lesson covers `_name` and `__name`, `@property` with a setter, `@staticmethod`, and `@classmethod`. The decorator syntax is previewed here: a line beginning with `@` modifies the function or class below it.

## Key Principles & Frameworks

### One underscore means internal by convention

A leading underscore marks an attribute or method as internal:

```python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount

    def balance(self):
        return self._balance


account = BankAccount(100)
account.deposit(50)
print(account.balance())
print(account._balance)
```

Output:

```text
150
150
```

`_balance` is still accessible. The underscore is a signal to other programmers: this is an implementation detail, so do not depend on it. Python's philosophy is "we are all consenting adults"; the convention communicates intent rather than enforcing secrecy.

### Two underscores trigger name mangling

A double leading underscore changes the attribute's stored name. Python rewrites `self.__code` inside `Vault` to `self._Vault__code`:

```python
class Vault:
    def __init__(self):
        self.__code = "1234"

    def check(self, code):
        return code == self.__code


vault = Vault()
print(vault.check("1234"))
try:
    print(vault.__code)
except AttributeError as error:
    print(str(error))
```

Output:

```text
True
'Vault' object has no attribute '__code'
```

Name mangling prevents accidental access and avoids name clashes in subclasses. It is not security. Anyone who knows the class name can still reach `_Vault__code`. Use a single underscore for normal internal state and reserve double underscores for rare name-collision cases.

### Properties control attribute access

A property lets a method be read like an attribute. The `@property` decorator turns the getter below it into a property, and `@name.setter` registers a setter for the same property:

```python
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


temperature = Temperature(20)
print(temperature.celsius)
temperature.celsius = 25
print(temperature.celsius)
try:
    temperature.celsius = -300
except ValueError as error:
    print(str(error))
```

Output:

```text
20
25
below absolute zero
```

Callers write `temperature.celsius`, not `temperature.celsius()`. The getter and setter run automatically. The setter validates the value before storing it in `_celsius`.

Always assign to the underlying attribute inside a setter, such as `self._celsius = value`. Writing `self.celsius = value` inside the setter calls the setter again and causes infinite recursion.

### Read-only properties

A property with only a getter cannot be assigned:

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius


circle = Circle(3)
print(circle.radius)
try:
    circle.radius = 4
except AttributeError as error:
    print(str(error))
```

Output:

```text
3
property 'radius' of 'Circle' object has no setter
```

Use a read-only property for values that callers may inspect but must not change directly. If the value can change, add a setter with validation.

### Properties can compute values

A property does not have to store anything. It can calculate a value from other attributes:

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height


rectangle = Rectangle(3, 4)
print(rectangle.area)
```

Output:

```text
12
```

`area` is always derived from the current width and height. There is no separate stored value to keep in sync.

### Static methods

A static method does not receive `self` or the class. It behaves like a regular function that is grouped with the class for organization:

```python
class MathTools:
    @staticmethod
    def add(a, b):
        return a + b


print(MathTools.add(2, 3))
```

Output:

```text
5
```

Use `@staticmethod` when the function is related to the class conceptually but does not need instance or class state. If it does not belong with the class at all, a module-level function is simpler.

### Class methods

A class method receives the class as its first argument, named `cls` by convention:

```python
class Student:
    school = "PixelCode"

    def __init__(self, name):
        self.name = name

    @classmethod
    def from_line(cls, line):
        name = line.split(",")[0].strip()
        return cls(name)

    @classmethod
    def school_name(cls):
        return cls.school


student = Student.from_line("Ana, 92")
print(student.name)
print(Student.school_name())

class Graduate(Student):
    pass


graduate = Graduate.from_line("Ben, 88")
print(type(graduate).__name__)
```

Output:

```text
Ana
PixelCode
Graduate
```

`from_line` is an alternative constructor. Because it uses `cls(name)` instead of `Student(name)`, a subclass that inherits it creates an instance of the subclass. `school_name` reads a class attribute through `cls`.

### Choosing the right method type

| Method type | First parameter | Can access instance | Can access class | Typical use |
| :--- | :--- | :--- | :--- | :--- |
| Instance method | `self` | Yes | Yes, through `self` | Reading or changing one object |
| Class method | `cls` | No | Yes | Alternative constructors, class-level settings |
| Static method | None | No | No | Related helper with no shared state |

Start with an instance method. Move to a class method when the operation is about the class as a whole, and to a static method when the helper needs neither the instance nor the class.

## Common Pitfalls & Anti-Patterns
- **Treating a single underscore as privacy**: `_balance` is still accessible. The underscore is a convention, not enforcement.
- **Assuming double underscores are secure**: Name mangling only renames the attribute. It does not prevent access.
- **Assigning the property name inside its own setter**: `self.celsius = value` in the setter calls the setter again and recurses. Assign to the underlying `_celsius`.
- **Forgetting to add a setter**: A getter-only property is read-only. Assigning to it raises `AttributeError`.
- **Calling a property like a method**: Use `obj.value`, not `obj.value()`, when `value` is a property.
- **Using a property for an expensive operation**: Callers expect attribute access to be cheap. Use a normal method when the work is heavy or has side effects.
- **Making every attribute a property**: Plain attributes are fine until validation or computation is needed.
- **Forgetting `self` in an instance method**: A method that needs object state must accept `self`.
- **Using `@classmethod` when an instance method is needed**: A class method has no access to one object's state.
- **Using static methods for everything**: They cannot access instance or class state, and a module function may be clearer.

## Quick Summary
- Encapsulation keeps state and the rules for changing it together.
- `_name` marks an attribute as internal by convention.
- `__name` is name-mangled to `_Class__name`; it is not true privacy.
- `@property` exposes a method as an attribute.
- `@name.setter` validates or transforms assigned values.
- Assign to the underlying attribute inside a setter to avoid recursion.
- A getter-only property is read-only.
- Properties can compute values from other attributes.
- `@staticmethod` receives neither `self` nor `cls`.
- `@classmethod` receives `cls` and is useful for alternative constructors.
- Prefer plain attributes until you need validation or computed values.
