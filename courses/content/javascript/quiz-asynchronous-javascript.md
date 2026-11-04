---
id: "quiz-asynchronous-javascript"
type: "quiz"
title: "Asynchronous JavaScript Knowledge Check"
moduleId: "mod-10-asynchronous-javascript"
order: 9
status: "draft"
language: "en"
lastUpdated: "2026-10-20"
passingScorePercent: 80
shuffleQuestions: true
shuffleOptions: true
tags: ["javascript","async","promises","fetch","quiz"]
---

# Questions

## Question 1
<!-- meta: {"type":"code-output","points":1} -->
What order does this code print?

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

- [ ] A, B, C, D
- [x] A, D, C, B
- [ ] A, D, B, C
- [ ] A, C, D, B

*Explanation*: Synchronous logs run first. The promise microtask runs before the timer task, so the order is A, D, C, B.

---

## Question 2
<!-- meta: {"type":"true-false","points":1} -->
`setTimeout(fn, 0)` runs `fn` immediately.

- [ ] True
- [x] False

*Explanation*: A zero delay queues the callback as a task. It runs after the current code and all microtasks, not immediately.

---

## Question 3
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
Promise.resolve(2)
  .then((value) => value * 3)
  .then((value) => console.log(value));
```

- [ ] 2
- [ ] 3
- [x] 6
- [ ] A Promise

*Explanation*: The first then returns 2 * 3, and the next then receives 6 and logs it.

---

## Question 4
<!-- meta: {"type":"single","points":1} -->
What happens when one promise passed to `Promise.all` rejects?

- [ ] The result array contains the error
- [x] `Promise.all` rejects with that error
- [ ] The other promises are cancelled
- [ ] `Promise.all` waits for every promise and then fulfills

*Explanation*: Promise.all rejects as soon as any input rejects. The other operations are not cancelled.

---

## Question 5
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
async function getNumber() {
  return 5;
}

getNumber().then((value) => console.log(value));
```

- [x] 5
- [ ] A Promise object
- [ ] undefined
- [ ] Nothing

*Explanation*: An async function returns a promise that fulfills with the returned value, so the then callback logs 5.

---

## Question 6
<!-- meta: {"type":"single","points":1} -->
Why does `await` inside `forEach` fail to wait for each async callback?

- [ ] `forEach` does not allow async functions
- [x] `forEach` ignores the promises returned by the callback
- [ ] `await` only works in loops
- [ ] `forEach` runs in parallel and rejects

*Explanation*: forEach does not await or collect callback return values. Use for...of or Promise.all with map.

---

## Question 7
<!-- meta: {"type":"single","points":1} -->
What does `fetch` do when the server responds with 404?

- [ ] It rejects with a 404 error
- [x] It resolves with a response whose `ok` is false
- [ ] It retries the request
- [ ] It throws a SyntaxError

*Explanation*: fetch resolves for HTTP error statuses. Check response.ok or response.status yourself.

---

## Question 8
<!-- meta: {"type":"code-output","points":1} -->
What does this code print?

```js
async function load() {
  try {
    await Promise.reject(new Error("fail"));
    return "ok";
  } catch (error) {
    return "caught";
  }
}

load().then((value) => console.log(value));
```

- [ ] ok
- [x] caught
- [ ] fail
- [ ] An unhandled rejection

*Explanation*: The rejected await is caught by the catch block, which returns "caught".
