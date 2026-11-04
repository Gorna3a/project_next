---
id: "py-quiz-collections"
type: "quiz"
title: "Collections Knowledge Check"
moduleId: "py-mod-06-collections"
order: 10
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "collections", "lists", "dictionaries", "quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
Which collection is ordered and immutable?

- [x] Tuple
- [ ] List
- [ ] Set
- [ ] Dictionary

*Explanation*: Tuples keep their item order and cannot be changed after creation. Lists are ordered but mutable, sets are unordered, and dictionaries map keys to values.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
items = [1, 2]
items.append([3, 4])
print(len(items))
```

- [x] `3`
- [ ] `2`
- [ ] `4`
- [ ] `[1, 2, 3, 4]`

*Explanation*: append adds its argument as one item, so the list becomes [1, 2, [3, 4]] with length 3. extend would add the values separately.

---

## Question 3
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
numbers = [3, 1, 2]
result = numbers.sort()
print(result)
print(numbers)
```

- [x] `None` then `[1, 2, 3]`
- [ ] `[1, 2, 3]` then `[1, 2, 3]`
- [ ] `None` then `[3, 1, 2]`
- [ ] `[3, 1, 2]` then `None`

*Explanation*: sort changes the list in place and returns None. The original list is sorted after the call.

---

## Question 4
<!-- meta: {"type":"true-false","points":1} -->
`{}` creates an empty set.

- [ ] True
- [x] False

*Explanation*: {} creates an empty dictionary. Use set() for an empty set.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
value = (5)
print(type(value))
```

- [x] `<class 'int'>`
- [ ] `<class 'tuple'>`
- [ ] `<class 'list'>`
- [ ] `<class 'set'>`

*Explanation*: Parentheses alone do not create a tuple. (5) is the integer 5; (5,) is a one-item tuple.

---

## Question 6
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
student = {"name": "Sam"}
print(student.get("score", 0))
```

- [x] `0`
- [ ] `None`
- [ ] `"score"`
- [ ] It raises `KeyError`

*Explanation*: The key "score" is missing, so get returns the supplied default 0. Square brackets would raise KeyError.

---

## Question 7
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
numbers = {1, 2, 2, 3}
print(len(numbers))
```

- [x] `3`
- [ ] `2`
- [ ] `4`
- [ ] It raises an error

*Explanation*: A set removes duplicates, so it contains 1, 2, and 3. Its length is 3.

---

## Question 8
<!-- meta: {"type":"multiple","points":2} -->
Which statements about collections are true? Select all that apply.

- [x] `b = a` makes both names refer to the same list object.
- [x] `a[:]` creates a shallow copy of a list.
- [x] Dictionary keys must be hashable.
- [ ] `[[0] * 3] * 3` creates three independent rows.
- [ ] `b = a[:]` deep-copies nested lists.
- [ ] Removing items from a list while iterating over it is the safest way to filter the list.

*Explanation*: Assignment aliases the object, and a slice copies only the outer list. Keys must be hashable. Multiplying a nested list repeats references to one row, shallow copies share inner lists, and filtering should build a new list instead of removing during iteration.
