import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const seedChallenges = [
  // ─── Easy (5) ────────────────────────────────────────────────────────────────
  {
    title: "JavaScript Array Method",
    description: "Which array method creates a new array with the results of calling a function for every element?",
    difficulty: "easy",
    language: "javascript",
    xp: 50,
    correctAnswer: "1",
    options: {
      "0": "forEach()",
      "1": "map()",
      "2": "filter()",
      "3": "reduce()"
    },
    explanations: {
      "1": "map() transforms each element and returns a new array of the same length. forEach() only iterates without returning."
    },
    hint: "Think about which method is used to transform data from one shape to another.",
    tags: ["basics", "arrays"]
  },
  {
    title: "Python List Indexing",
    description: "In Python, what does my_list[-1] return?",
    difficulty: "easy",
    language: "python",
    xp: 50,
    correctAnswer: "0",
    options: {
      "0": "The last element",
      "1": "The first element",
      "2": "An IndexError",
      "3": "The second-to-last element"
    },
    explanations: {
      "0": "Negative indices count from the end of the list. -1 is the last item, -2 is second-to-last, etc."
    },
    hint: "Negative indexing is a Python superpower — try counting from the end of the list.",
    tags: ["basics", "lists"]
  },
  {
    title: "SQL NULL Comparison",
    description: "In SQL, how do you correctly check if a column value is NULL?",
    difficulty: "easy",
    language: "sql",
    xp: 50,
    correctAnswer: "3",
    options: {
      "0": "= NULL",
      "1": "ISNULL(column)",
      "2": "column <> NULL",
      "3": "IS NULL"
    },
    explanations: {
      "3": "NULL is not a value — it represents 'unknown'. Use 'IS NULL' or 'IS NOT NULL' to check for it."
    },
    hint: "NULL isn't equal to anything — even NULL isn't equal to NULL.",
    tags: ["basics", "queries"]
  },
  {
    title: "HTML Tag Purpose",
    description: "Which HTML tag is used to define a hyperlink?",
    difficulty: "easy",
    language: "html",
    xp: 50,
    correctAnswer: "1",
    options: {
      "0": "<link>",
      "1": "<a>",
      "2": "<href>",
      "3": "<nav>"
    },
    explanations: {
      "1": "The <a> (anchor) tag creates hyperlinks. <link> is used in the <head> for stylesheet references."
    },
    hint: "Think about the 'anchor' element that makes text clickable.",
    tags: ["basics", "html"]
  },
  {
    title: "Git Staging Area",
    description: "Which Git command stages changes for the next commit?",
    difficulty: "easy",
    language: "git",
    xp: 50,
    correctAnswer: "2",
    options: {
      "0": "git commit",
      "1": "git push",
      "2": "git add",
      "3": "git stage"
    },
    explanations: {
      "2": "git add moves changes from the working directory to the staging area. git commit then saves them to the repository."
    },
    hint: "You need to tell Git which files you want to include before you commit them.",
    tags: ["basics", "git"]
  },
  // ─── Medium (5) ──────────────────────────────────────────────────────────────
  {
    title: "JavaScript Closure Behavior",
    description: "What will the following code log? for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }",
    difficulty: "medium",
    language: "javascript",
    xp: 100,
    correctAnswer: "0",
    options: {
      "0": "3 3 3",
      "1": "0 1 2",
      "2": "undefined undefined undefined",
      "3": "1 2 3"
    },
    explanations: {
      "0": "var has function scope, not block scope. By the time setTimeout runs, the loop has finished and i is 3."
    },
    hint: "var behaves differently from let inside loops. Think about when the callback actually executes.",
    tags: ["closures", "async", "scope"]
  },
  {
    title: "Python Mutable Defaults",
    description: "What is the output? def add(x, items=[]): items.append(x); return items. Then call add(1) and add(2).",
    difficulty: "medium",
    language: "python",
    xp: 100,
    correctAnswer: "1",
    options: {
      "0": "[1] then [2]",
      "1": "[1] then [1, 2]",
      "2": "[1] then [2] — each call gets a new list",
      "3": "Error — lists can't be default arguments"
    },
    explanations: {
      "1": "Default arguments are evaluated once at function definition, not each call. The same list is reused, so items persist across calls."
    },
    hint: "Default arguments in Python are created once — not every time the function is called.",
    tags: ["functions", "gotchas"]
  },
  {
    title: "TypeScript Utility Types",
    description: "Which TypeScript utility type makes all properties of an interface optional?",
    difficulty: "medium",
    language: "typescript",
    xp: 100,
    correctAnswer: "0",
    options: {
      "0": "Partial<T>",
      "1": "Optional<T>",
      "2": "Pick<T, K>",
      "3": "Omit<T, K>"
    },
    explanations: {
      "0": "Partial<T> returns a type with all properties set to optional. It's equivalent to adding ? to every property."
    },
    hint: "Think about the word that means 'not all parts are required'.",
    tags: ["utility-types", "intermediate"]
  },
  {
    title: "React State Batching",
    description: "In React 18, what happens when you call setCount(c => c+1) three times in the same event handler?",
    difficulty: "medium",
    language: "javascript",
    xp: 100,
    correctAnswer: "2",
    options: {
      "0": "The component re-renders three times",
      "1": "Only the first call takes effect — the rest are ignored",
      "2": "Count increases by 3 in a single render",
      "3": "It throws a warning about too many state updates"
    },
    explanations: {
      "2": "React 18 auto-batches state updates within event handlers. Using the functional updater form queues each update, resulting in a final increment of 3."
    },
    hint: "Updates are batched, but order matters when you use the function form of the setter.",
    tags: ["react", "state"]
  },
  {
    title: "Rust Ownership",
    description: "After moving a value in Rust (let y = x), what happens to the original variable x?",
    difficulty: "medium",
    language: "rust",
    xp: 100,
    correctAnswer: "1",
    options: {
      "0": "x still holds the value — both x and y are valid",
      "1": "x is invalidated and cannot be used until reassigned",
      "2": "x is automatically cloned — both are valid",
      "3": "x becomes a reference to y"
    },
    explanations: {
      "1": "Rust's ownership rules mean that after a move, the original variable is dropped. This prevents double-free errors at compile time."
    },
    hint: "Rust prevents two variables from owning the same memory. One must give up its ownership.",
    tags: ["ownership", "memory"]
  },
  // ─── Hard (3) ────────────────────────────────────────────────────────────────
  {
    title: "JavaScript Event Loop Order",
    description: "What logs first? console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C'));",
    difficulty: "hard",
    language: "javascript",
    xp: 200,
    correctAnswer: "0",
    options: {
      "0": "A, C, B",
      "1": "A, B, C",
      "2": "C, A, B",
      "3": "C, B, A"
    },
    explanations: {
      "0": "Synchronous code runs first (A). Microtasks (Promise.then) run before macrotasks (setTimeout). So C logs before B."
    },
    hint: "Not all async callbacks are equal — microtasks have priority over macrotasks.",
    tags: ["async", "event-loop", "advanced"]
  },
  {
    title: "SQL Injection Prevention",
    description: "Which approach BEST prevents SQL injection when building a dynamic query?",
    difficulty: "hard",
    language: "sql",
    xp: 200,
    correctAnswer: "3",
    options: {
      "0": "Escaping single quotes with backslashes",
      "1": "Using client-side validation to block special characters",
      "2": "Checking the input length before querying",
      "3": "Using parameterized queries / prepared statements"
    },
    explanations: {
      "3": "Parameterized queries separate SQL logic from data, so user input is never interpreted as code. Escaping is error-prone and bypassable."
    },
    hint: "The correct approach separates SQL code from user-supplied data entirely — not just filtering it.",
    tags: ["security", "database", "advanced"]
  },
  {
    title: "Python Generator Memory",
    description: "What is the key advantage of a generator (yield) over returning a full list?",
    difficulty: "hard",
    language: "python",
    xp: 200,
    correctAnswer: "1",
    options: {
      "0": "Generators run faster in all cases",
      "1": "Generators produce items lazily — one at a time — saving memory",
      "2": "Generators can be indexed like lists",
      "3": "Generators automatically cache results for reuse"
    },
    explanations: {
      "1": "Generators yield values on demand without storing the entire sequence in memory. This is crucial for large or infinite datasets."
    },
    hint: "The advantage is about when values are produced, not how fast they run. Think about infinite sequences.",
    tags: ["generators", "memory", "advanced"]
  },
  // ─── Expert (2) ──────────────────────────────────────────────────────────────
  {
    title: "JavaScript Prototype Chain",
    description: "What does ({} instanceof Object) && (Object.create(null) instanceof Object) evaluate to?",
    difficulty: "expert",
    language: "javascript",
    xp: 350,
    correctAnswer: "2",
    options: {
      "0": "true && true = true",
      "1": "false && false = false",
      "2": "true && false = false",
      "3": "false && true = false"
    },
    explanations: {
      "2": "Object.create(null) creates an object with no prototype chain, so it's not an instance of Object. {} has Object.prototype so it is."
    },
    hint: "Not all objects inherit from Object.prototype. How do you create one without a prototype?",
    tags: ["prototypes", "advanced", "objects"]
  },
  {
    title: "TypeScript Conditional Types",
    description: "Given type IsString<T> = T extends string ? 'yes' : 'no', what is IsString<'hello'>?",
    difficulty: "expert",
    language: "typescript",
    xp: 350,
    correctAnswer: "0",
    options: {
      "0": "'yes'",
      "1": "'no'",
      "2": "boolean",
      "3": "string"
    },
    explanations: {
      "0": "Conditional types distribute over unions. Since 'hello' extends string, the true branch is taken, yielding the literal type 'yes'."
    },
    hint: "The condition checks if the input type extends the constraint. What does 'hello' extend?",
    tags: ["generics", "advanced", "types"]
  },
];

export const seedInitialChallenges = async () => {
  const colRef = collection(db, 'challenges');
  const results = await Promise.all(
    seedChallenges.map(async (c) => {
      return addDoc(colRef, {
        ...c,
        createdAt: serverTimestamp(),
      });
    })
  );

  return results.length;
};
