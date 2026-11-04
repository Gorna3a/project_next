---
id: "py-quiz-recursion-and-algorithms"
type: "quiz"
title: "Recursion and Algorithms Knowledge Check"
moduleId: "py-mod-13-recursion-and-algorithms"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["python", "recursion", "algorithms", "quiz", "big-o"]
---

# Questions

## Question 1
<!-- meta: {"type":"single","points":1} -->
What is a base case in a recursive function?

- [x] The condition that stops recursion and returns a value directly
- [ ] The first recursive call
- [ ] The largest possible input
- [ ] The call stack

*Explanation*: The base case handles the smallest input without calling the function again. Without it, recursion never stops and Python raises `RecursionError`.

---

## Question 2
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(4))
```

- [ ] `4`
- [ ] `8`
- [ ] `12`
- [x] `24`

*Explanation*: `4 * 3 * 2 * 1 = 24`. The base case returns `1` when `n` reaches `0`.

---

## Question 3
<!-- meta: {"type":"true-false","points":1} -->
Binary search can be used correctly on an unsorted list.

- [ ] True
- [x] False

*Explanation*: Binary search requires sorted data so each comparison can safely discard half the range. Unsorted input can produce wrong answers.

---

## Question 4
<!-- meta: {"type":"multiple","points":2} -->
Which statements about Big-O notation are correct? Select all that apply.

- [x] Big-O describes growth, not exact running time
- [x] Nested loops can produce `O(n squared)` time
- [x] Binary search runs in `O(log n)` time
- [ ] `O(1)` means the code takes no time
- [ ] Big-O always describes the best case

*Explanation*: Big-O ignores constants and describes growth with input size. Nested loops multiply costs. `O(1)` still takes constant time, and comparisons usually use the worst case.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
data = [2, 4, 6, 8, 10]
low = 0
high = len(data) - 1
while low <= high:
    middle = (low + high) // 2
    if data[middle] == 6:
        print(middle)
        break
    if data[middle] < 6:
        low = middle + 1
    else:
        high = middle - 1
```

- [x] `2`
- [ ] `1`
- [ ] `3`
- [ ] `-1`

*Explanation*: The first midpoint is index `2`, and `data[2]` is `6`. The loop prints `2` and breaks.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
Which statement about `sorted` and `list.sort` is correct?

- [ ] Both return a new sorted list
- [ ] Both sort the list in place
- [x] `sorted` returns a new list, while `list.sort()` sorts in place and returns `None`
- [ ] `list.sort()` returns a new sorted list

*Explanation*: `sorted(numbers)` creates and returns a new list. `numbers.sort()` sorts the existing list and returns `None`.

---

## Question 7
<!-- meta: {"type":"multiple","points":2} -->
Which statements about sorting algorithms are correct? Select all that apply.

- [x] Bubble, selection, and insertion sorts run in `O(n squared)` worst-case time
- [x] Merge sort runs in `O(n log n)` time in all cases
- [x] Python's built-in sort is stable
- [ ] Merge sort uses no extra space
- [ ] Quicksort always beats merge sort in the worst case

*Explanation*: The three elementary sorts all have quadratic worst cases. Merge sort has a guaranteed `O(n log n)` bound and needs extra space. Quicksort can degrade to `O(n squared)` with poor pivots.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```python
def total(items):
    if not items:
        return 0
    return items[0] + total(items[1:])

print(total([3, 1, 4]))
```

- [ ] `3`
- [ ] `7`
- [x] `8`
- [ ] It raises `RecursionError`

*Explanation*: The base case returns `0` for an empty list. The sums are `3 + 1 + 4 = 8`.
