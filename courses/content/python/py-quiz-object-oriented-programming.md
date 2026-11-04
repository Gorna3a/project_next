---
id: "py-quiz-object-oriented-programming"
type: "quiz"
title: "Object-Oriented Programming Knowledge Check"
moduleId: "py-mod-09-object-oriented-programming"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "oop", "classes", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
In an instance method, what does `self` refer to?

- [x] The current instance
- [ ] The class itself
- [ ] The module that defines the class
- [ ] The name of the method

*Explanation*: Python passes the current instance as the first argument of an instance method. By convention, that parameter is named `self`.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

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

- [x] `['Ana', 'Ben']` then `['Ana', 'Ben']`
- [ ] `['Ana']` then `['Ben']`
- [ ] `[]` then `[]`
- [ ] It raises `AttributeError`

*Explanation*: `members` is a class attribute, so both instances share the same list. Defining `members` inside `__init__` would give each instance its own list.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
When both methods are defined, `print(book)` uses `__str__` and `repr(book)` uses `__repr__`.

- [x] True
- [ ] False

*Explanation*: `print()` and `str()` prefer `__str__`. `repr()` and the display of containers use `__repr__`.

---

## Question 4
<!-- meta: {"type":"multiple","points":2} -->
Which statements about `__eq__` and `__hash__` are correct? Select all that apply.

- [x] Defining `__eq__` makes instances unhashable unless `__hash__` is also defined
- [x] Equal objects should have equal hashes
- [x] `__eq__` can return `NotImplemented` for an unsupported type
- [ ] `__hash__` must return a string
- [ ] `__eq__` must return `NotImplemented` for every comparison

*Explanation*: Python sets `__hash__` to `None` when a class defines `__eq__`, because equal objects need equal hashes. Return `NotImplemented` when the other operand is unsupported. Hashes are integers, not strings.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
class Employee:
    def __init__(self, name):
        self.name = name


class Manager(Employee):
    def __init__(self, name, team_size):
        super().__init__(name)
        self.team_size = team_size

    def describe(self):
        return f"Manager {self.name} leads {self.team_size}"


print(Manager("Ana", 4).describe())
print(isinstance(Manager("Ana", 4), Employee))
```

- [x] `Manager Ana leads 4` then `True`
- [ ] `Manager Ana leads 4` then `False`
- [ ] `Employee Ana` then `True`
- [ ] It raises `AttributeError`

*Explanation*: `super().__init__(name)` sets the inherited `name` attribute. `isinstance` returns `True` because a `Manager` is also an `Employee`.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
What happens when a class defines `__eq__` but does not define `__hash__`?

- [x] Instances become unhashable
- [ ] Instances keep the default hash
- [ ] `__eq__` is ignored
- [ ] Python raises `SyntaxError`

*Explanation*: Python cannot safely keep the identity-based default hash after value equality is introduced, so it sets `__hash__` to `None`. Define `__hash__` when instances must work as dictionary keys or set members.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
class Counter:
    def __init__(self):
        self._value = 0

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, new_value):
        if new_value < 0:
            raise ValueError("negative")
        self._value = new_value


counter = Counter()
counter.value = 5
print(counter.value)
try:
    counter.value = -1
except ValueError as error:
    print(str(error))
```

- [x] `5` then `negative`
- [ ] `0` then `negative`
- [ ] `5` then `ValueError`
- [ ] `-1` then `negative`

*Explanation*: The setter runs when `counter.value` is assigned. It accepts `5`, then raises `ValueError` for `-1`, whose message is printed by the handler.

---

## Question 8
<!-- meta: {"type":"single","points":1} -->
Which dataclass field safely gives every instance its own list?

- [x] `items: list = field(default_factory=list)`
- [ ] `items: list = []`
- [ ] `items = []`
- [ ] `items: list = field(default=list)`

*Explanation*: `default_factory=list` calls `list()` for each instance, so each object gets a fresh list. A plain list default is shared, and `default=list` uses the list class itself as the default value.
