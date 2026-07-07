import type { SanityCourse, SanityLesson } from './sanity';

const block = (key: string, text: string, style = 'normal') => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
});

const code = (key: string, language: string, source: string) => ({
  _type: 'code',
  _key: key,
  language,
  code: source.trim(),
});

const quiz = (
  key: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  xp = 10
) => ({ _key: key, question, options, correctIndex, explanation, xp });

const courseSummaries: SanityCourse[] = [
  {
    _id: 'starter-python',
    title: 'Python Foundations',
    slug: 'python-foundations',
    shortDescription: 'Learn variables, control flow, functions, and small scripts with readable Python.',
    description: 'A beginner-friendly introduction to Python programming covering variables, conditionals, loops, functions, and more.',
    language: 'python',
    courseVersion: '1.0.0',
    level: 'beginner',
    tags: ['Syntax', 'Logic', 'Scripts'],
    learningObjectives: ['Write and run Python scripts', 'Use variables and data types', 'Control program flow with conditionals and loops', 'Create reusable functions'],
    prerequisites: [],
    totalLessons: 4,
    estimatedHours: 2.5,
    order: 1,
    status: 'published',
    publishedAt: '2026-05-02T00:00:00.000Z',
    thumbnail: undefined,
    thumbnailPrompt: 'A green python snake coiled around a graduation cap on a light blue background',
  },
  {
    _id: 'starter-javascript',
    title: 'JavaScript Web Basics',
    slug: 'javascript-web-basics',
    shortDescription: 'Build a practical base in JavaScript values, arrays, DOM events, and browser logic.',
    description: 'Learn JavaScript fundamentals for the browser, including variables, arrays, loops, and DOM event handling.',
    language: 'javascript',
    courseVersion: '1.0.0',
    level: 'beginner',
    tags: ['DOM', 'Events', 'Arrays'],
    learningObjectives: ['Work with JavaScript variables and data types', 'Manipulate arrays and use loops', 'Handle browser DOM events', 'Build interactive web page features'],
    prerequisites: ['Basic HTML knowledge'],
    totalLessons: 4,
    estimatedHours: 3,
    order: 2,
    status: 'published',
    publishedAt: '2026-05-02T00:00:00.000Z',
    thumbnail: undefined,
    thumbnailPrompt: 'A JavaScript logo with curly braces and DOM elements on a dark background',
  },
  {
    _id: 'starter-typescript',
    title: 'TypeScript for React',
    slug: 'typescript-for-react',
    shortDescription: 'Use TypeScript to model props, state, and API data before your components render.',
    description: 'Learn how to add type safety to your React components with TypeScript, covering props typing, state management, and API response shaping.',
    language: 'typescript',
    courseVersion: '1.0.0',
    level: 'intermediate',
    tags: ['Types', 'React', 'Safety'],
    learningObjectives: ['Type React component props with interfaces', 'Model component state with union types', 'Define API response shapes', 'Catch type errors before runtime'],
    prerequisites: ['Basic React knowledge', 'JavaScript fundamentals'],
    totalLessons: 4,
    estimatedHours: 3.5,
    order: 3,
    status: 'published',
    publishedAt: '2026-05-02T00:00:00.000Z',
    thumbnail: undefined,
    thumbnailPrompt: 'TypeScript text on a blue background with React component tree diagram',
  },
  {
    _id: 'starter-html-css',
    title: 'HTML & CSS Fundamentals',
    slug: 'html-css-fundamentals',
    shortDescription: 'Build structured web pages with semantic HTML, flexible layouts with CSS, and responsive design.',
    description: 'Learn how to create well-structured web pages using semantic HTML elements, style them with modern CSS (Flexbox, Grid), and make them look great on any device with responsive design techniques.',
    language: 'html',
    courseVersion: '1.0.0',
    level: 'beginner',
    tags: ['HTML', 'CSS', 'Layout', 'Responsive'],
    learningObjectives: ['Write semantic HTML5 markup', 'Style pages with Flexbox and CSS Grid', 'Build responsive layouts with media queries', 'Use CSS custom properties for maintainable styles'],
    prerequisites: [],
    totalLessons: 3,
    estimatedHours: 2.5,
    order: 4,
    status: 'published',
    publishedAt: '2026-05-02T00:00:00.000Z',
    thumbnail: undefined,
    thumbnailPrompt: 'A responsive web page mockup on a laptop and phone screen',
  },
  {
    _id: 'starter-sql',
    title: 'SQL & Databases',
    slug: 'sql-databases',
    shortDescription: 'Query, filter, join, and manage data with SQL — the universal language of databases.',
    description: 'Master the fundamentals of SQL: retrieve data with SELECT queries, filter with WHERE, combine tables with JOINs, aggregate with GROUP BY, and modify data with INSERT, UPDATE, and DELETE.',
    language: 'sql',
    courseVersion: '1.0.0',
    level: 'beginner',
    tags: ['SQL', 'Queries', 'Databases', 'Data'],
    learningObjectives: ['Write SELECT queries with filtering and sorting', 'Join multiple tables to combine related data', 'Aggregate data with GROUP BY and functions', 'Insert, update, and delete records safely'],
    prerequisites: [],
    totalLessons: 3,
    estimatedHours: 2.5,
    order: 5,
    status: 'published',
    publishedAt: '2026-05-02T00:00:00.000Z',
    thumbnail: undefined,
    thumbnailPrompt: 'A database server rack with flowing data streams in blue and green',
  },

];

const lessonDetails: SanityLesson[] = [
  {
    _id: 'starter-python-1',
    title: 'Values and Variables',
    slug: 'python-values-and-variables',
    order: 1,
    summary: 'Learn what variables are, how to assign values, and Python\'s basic data types.',
    objectives: ['Define a variable and assign different types of values', 'Use print() to display output', 'Identify string, integer, float, and boolean types'],
    difficulty: 'easy',
    estimatedMinutes: 15,
    xp: 50,
    course: { _id: 'starter-python', title: 'Python Foundations', slug: 'python-foundations', language: 'python', totalLessons: 4 },
    body: [
      block('py-1-a', 'A variable is a name you give to a value so your program can reuse it later.', 'h2'),
      block('py-1-b', 'Python does not need you to declare the type first. It reads the value and keeps track of the type for you.'),
      code('py-1-c', 'python', `
student_name = "Maya"
points = 120
is_active = True

print(student_name, points, is_active)
      `),
      { _type: 'callout', _key: 'py-1-d', variant: 'tip', text: 'Use clear variable names. Future you will thank present you.' },
    ],
    exercise: {
      title: 'Create a Greeting Variable',
      instructions: 'Create a variable called `greeting` that stores the string `"Hello, Explorer!"` and print it.',
      starterCode: '# Write your code here\n',
      solution: 'greeting = "Hello, Explorer!"\nprint(greeting)',
      expectedOutput: 'Hello, Explorer!',
    },
    quizzes: [
      quiz('py-1-q1', 'Which name is the clearest variable name?', ['x', 'student_score', 'thing'], 1, 'A clear name explains what the value represents.'),
      quiz('py-1-q2', 'What type is the value True?', ['string', 'boolean', 'number'], 1, 'True and False are boolean values.'),
    ],
  },
  {
    _id: 'starter-python-2',
    title: 'Decisions with If Statements',
    slug: 'python-if-statements',
    order: 2,
    summary: 'Control your program\'s flow using if, elif, and else statements.',
    objectives: ['Write if statements that conditionally execute code', 'Use comparison operators to build conditions', 'Chain multiple conditions with elif and else'],
    difficulty: 'easy',
    estimatedMinutes: 18,
    xp: 50,
    course: { _id: 'starter-python', title: 'Python Foundations', slug: 'python-foundations', language: 'python', totalLessons: 4 },
    body: [
      block('py-2-a', 'Programs become useful when they can choose between paths.', 'h2'),
      block('py-2-b', 'An if statement runs a block only when its condition is true. Indentation tells Python which lines belong to that block.'),
      code('py-2-c', 'python', `
score = 86

if score >= 80:
    print("Great work")
else:
    print("Keep practicing")
      `),
    ],
    exercise: {
      title: 'Grade Checker',
      instructions: 'Write an if-else statement that prints "Pass" if score is 50 or above, otherwise prints "Fail". The score variable is already set to 75.',
      starterCode: 'score = 75\n# Write your if-else here\n',
      solution: 'score = 75\nif score >= 50:\n    print("Pass")\nelse:\n    print("Fail")',
      expectedOutput: 'Pass',
    },
    quizzes: [
      quiz('py-2-q1', 'What does indentation control in Python?', ['Which lines belong to a block', 'The color of text', 'The file name'], 0, 'Python uses indentation to define blocks.'),
    ],
  },
  {
    _id: 'starter-python-3',
    title: 'Functions That Do One Job',
    slug: 'python-functions',
    order: 3,
    summary: 'Package reusable logic into functions that accept inputs and return results.',
    objectives: ['Define functions with def and parameters', 'Return values from functions', 'Call functions and use their return values'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    xp: 50,
    course: { _id: 'starter-python', title: 'Python Foundations', slug: 'python-foundations', language: 'python', totalLessons: 4 },
    body: [
      block('py-3-a', 'A function packages steps behind a useful name.', 'h2'),
      block('py-3-b', 'Good beginner functions do one clear job, accept inputs, and return a result.'),
      code('py-3-c', 'python', `
def add_bonus(points, bonus):
    return points + bonus

final_score = add_bonus(120, 15)
print(final_score)
      `),
    ],
    exercise: {
      title: 'Double It',
      instructions: 'Define a function called `double` that takes a number and returns it multiplied by 2. Call it with 7 and print the result.',
      starterCode: '# Define your function here\n',
      solution: 'def double(n):\n    return n * 2\n\nresult = double(7)\nprint(result)',
      expectedOutput: '14',
    },
    quizzes: [
      quiz('py-3-q1', 'Which keyword gives a value back from a function?', ['send', 'return', 'output'], 1, 'The return keyword sends a result back to the caller.'),
    ],
  },
  {
    _id: 'starter-js-1',
    title: 'Variables in the Browser',
    slug: 'javascript-variables-browser',
    order: 1,
    summary: 'Understand let, const, and how JavaScript variables work in the browser.',
    objectives: ['Declare variables with let and const', 'Understand when to use let vs const', 'Print values to the browser console'],
    difficulty: 'easy',
    estimatedMinutes: 16,
    xp: 50,
    course: { _id: 'starter-javascript', title: 'JavaScript Web Basics', slug: 'javascript-web-basics', language: 'javascript', totalLessons: 4 },
    body: [
      block('js-1-a', 'JavaScript stores changing values with let and stable references with const.', 'h2'),
      block('js-1-b', 'In browser code, variables often hold text, counts, selected elements, and user choices.'),
      code('js-1-c', 'javascript', `
const username = "pixelcoder";
let score = 0;

score = score + 10;
console.log(username, score);
      `),
    ],
    exercise: {
      title: 'User Profile',
      instructions: 'Create two variables: `username` (const) with the value "PixelCoder" and `age` (let) with value 16. Log both to the console.',
      starterCode: '// Write your code here\n',
      solution: 'const username = "PixelCoder";\nlet age = 16;\nconsole.log(username, age);',
      expectedOutput: 'PixelCoder 16',
    },
    quizzes: [
      quiz('js-1-q1', 'Which keyword is best for a value you plan to reassign?', ['const', 'let', 'fixed'], 1, 'Use let when the variable will receive a new value.'),
    ],
  },
  {
    _id: 'starter-js-2',
    title: 'Arrays and Loops',
    slug: 'javascript-arrays-loops',
    order: 2,
    summary: 'Store collections of data in arrays and iterate over them with loops.',
    objectives: ['Create and access array elements', 'Use for...of loops to iterate arrays', 'Combine arrays and loops to process data'],
    difficulty: 'easy',
    estimatedMinutes: 22,
    xp: 50,
    course: { _id: 'starter-javascript', title: 'JavaScript Web Basics', slug: 'javascript-web-basics', language: 'javascript', totalLessons: 4 },
    body: [
      block('js-2-a', 'Arrays keep related values in order.', 'h2'),
      block('js-2-b', 'A loop lets you run the same idea for each item without copying code.'),
      code('js-2-c', 'javascript', `
const lessons = ["Variables", "Arrays", "Events"];

for (const lesson of lessons) {
  console.log("Next:", lesson);
}
      `),
    ],
    exercise: {
      title: 'Sum Array',
      instructions: 'Create an array of numbers [2, 5, 8, 3] and use a for...of loop to calculate and log the total sum.',
      starterCode: '// Write your code here\n',
      solution: 'const numbers = [2, 5, 8, 3];\nlet total = 0;\nfor (const n of numbers) {\n  total += n;\n}\nconsole.log(total);',
      expectedOutput: '18',
    },
    quizzes: [
      quiz('js-2-q1', 'What does an array store?', ['A list of values', 'Only one number', 'A CSS rule'], 0, 'Arrays hold lists of values.'),
    ],
  },
  {
    _id: 'starter-js-3',
    title: 'Click Events',
    slug: 'javascript-click-events',
    order: 3,
    summary: 'Make web pages interactive by responding to user clicks.',
    objectives: ['Select DOM elements with querySelector', 'Add click event listeners to buttons', 'Write event handler functions'],
    difficulty: 'easy',
    estimatedMinutes: 18,
    xp: 50,
    course: { _id: 'starter-javascript', title: 'JavaScript Web Basics', slug: 'javascript-web-basics', language: 'javascript', totalLessons: 4 },
    body: [
      block('js-3-a', 'Events let the page react to users.', 'h2'),
      block('js-3-b', 'A click handler is a function the browser runs after a button is clicked.'),
      code('js-3-c', 'javascript', `
const button = document.querySelector("button");

button.addEventListener("click", () => {
  console.log("Button clicked");
});
      `),
    ],
    exercise: {
      title: 'Delayed Message',
      instructions: 'Use setTimeout to log "Hello later!" to the console after 1 second (1000ms).',
      starterCode: '// Use setTimeout here\n',
      solution: 'setTimeout(() => {\n  console.log("Hello later!");\n}, 1000);',
      expectedOutput: 'Hello later!',
    },
    quizzes: [
      quiz('js-3-q1', 'Which method listens for browser events?', ['addEventListener', 'listenNow', 'onBrowser'], 0, 'addEventListener attaches a function to an event.'),
    ],
  },
  {
    _id: 'starter-ts-1',
    title: 'Typing Component Props',
    slug: 'typescript-component-props',
    order: 1,
    summary: 'Add type safety to React component props with TypeScript interfaces.',
    objectives: ['Define TypeScript interfaces for component props', 'Use typed props in React components', 'Catch type mismatches at compile time'],
    difficulty: 'medium',
    estimatedMinutes: 20,
    xp: 50,
    course: { _id: 'starter-typescript', title: 'TypeScript for React', slug: 'typescript-for-react', language: 'typescript', totalLessons: 4 },
    body: [
      block('ts-1-a', 'Props are the contract between a parent and a component.', 'h2'),
      block('ts-1-b', 'TypeScript lets you describe that contract so mistakes show up before the browser does.'),
      code('ts-1-c', 'typescript', `
type CourseBadgeProps = {
  title: string;
  lessons: number;
};

function CourseBadge({ title, lessons }: CourseBadgeProps) {
  return <span>{title} - {lessons} lessons</span>;
}
      `),
    ],
    exercise: {
      title: 'Typed Greeting Component',
      instructions: 'Define a `GreetingProps` type with `name: string` and `age?: number`. Then declare a variable `info: GreetingProps` with name "Alice" and log it.',
      starterCode: '// Define your type and variable here\n',
      solution: 'type GreetingProps = {\n  name: string;\n  age?: number;\n};\n\nconst info: GreetingProps = { name: "Alice" };\nconsole.log(info.name);',
      expectedOutput: 'Alice',
    },
    quizzes: [
      quiz('ts-1-q1', 'What do prop types describe?', ['The component contract', 'The CSS reset', 'The build folder'], 0, 'Prop types describe what data a component expects.'),
    ],
  },
  {
    _id: 'starter-ts-2',
    title: 'State with Union Types',
    slug: 'typescript-union-state',
    order: 2,
    summary: 'Model component states cleanly using TypeScript union types.',
    objectives: ['Define union types with multiple string literals', 'Use union types to represent component states', 'Narrow union types with conditionals'],
    difficulty: 'medium',
    estimatedMinutes: 24,
    xp: 50,
    course: { _id: 'starter-typescript', title: 'TypeScript for React', slug: 'typescript-for-react', language: 'typescript', totalLessons: 4 },
    body: [
      block('ts-2-a', 'Union types model a small set of allowed values.', 'h2'),
      block('ts-2-b', 'They are useful for loading states because each screen state has a clear name.'),
      code('ts-2-c', 'typescript', `
type LoadState = "idle" | "loading" | "success" | "error";

let state: LoadState = "loading";
state = "success";
      `),
    ],
    exercise: {
      title: 'Traffic Light State',
      instructions: 'Define a union type `Light` with values "red" | "yellow" | "green". Create a variable `current: Light` set to "green". Write an if statement that logs "Go!" if green.',
      starterCode: '// Define the type and logic here\n',
      solution: 'type Light = "red" | "yellow" | "green";\n\nconst current: Light = "green";\nif (current === "green") {\n  console.log("Go!");\n}',
      expectedOutput: 'Go!',
    },
    quizzes: [
      quiz('ts-2-q1', 'Which symbol separates union options?', ['&', '|', ':'], 1, 'The pipe character separates choices in a union type.'),
    ],
  },
  {
    _id: 'starter-ts-3',
    title: 'API Response Shapes',
    slug: 'typescript-api-shapes',
    order: 3,
    summary: 'Type API responses so your components always receive the data they expect.',
    objectives: ['Define types for API response data', 'Use optional properties with ?', 'Document expected data shapes with TypeScript'],
    difficulty: 'medium',
    estimatedMinutes: 25,
    xp: 50,
    course: { _id: 'starter-typescript', title: 'TypeScript for React', slug: 'typescript-for-react', language: 'typescript', totalLessons: 4 },
    body: [
      block('ts-3-a', 'API data should be shaped before components depend on it.', 'h2'),
      block('ts-3-b', 'A type helps document which fields are required and which fields may be missing.'),
      code('ts-3-c', 'typescript', `
type Course = {
  id: string;
  title: string;
  tags?: string[];
};
      `),
    ],
    exercise: {
      title: 'User API Type',
      instructions: 'Define a `UserResponse` type with `id: string`, `name: string`, and optional `email?: string`. Create a `user: UserResponse` and log the name.',
      starterCode: '// Define your type and variable here\n',
      solution: 'type UserResponse = {\n  id: string;\n  name: string;\n  email?: string;\n};\n\nconst user: UserResponse = { id: "1", name: "Alice" };\nconsole.log(user.name);',
      expectedOutput: 'Alice',
    },
    quizzes: [
      quiz('ts-3-q1', 'What does ? mean on a property?', ['Readonly', 'Optional', 'Private'], 1, 'A question mark makes the property optional.'),
    ],
  },

  // ─── Python extra lesson ─────────────────────────────────────────────────────
  {
    _id: 'starter-python-4',
    title: 'Dictionaries and Loops',
    slug: 'python-dictionaries-loops',
    order: 4,
    summary: 'Store key-value pairs in dictionaries and iterate over data with for loops.',
    objectives: ['Create and manipulate dictionaries', 'Use for loops to iterate over lists and dicts', 'Format strings with f-strings', 'Write a basic list comprehension'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    xp: 50,
    course: { _id: 'starter-python', title: 'Python Foundations', slug: 'python-foundations', language: 'python', totalLessons: 4 },
    body: [
      block('py-4-a', 'Dictionaries store connections between keys and values.', 'h2'),
      block('py-4-b', 'Use a dictionary when you want to look things up by name rather than by position.'),
      code('py-4-c', 'python', `
student = {
  "name": "Maya",
  "score": 92,
  "active": True
}
print(student["name"])
      `),
      block('py-4-d', 'A for loop visits each item in a sequence. That can be a list, a string, or the keys of a dictionary.'),
      code('py-4-e', 'python', `
scores = [88, 92, 75]
for s in scores:
    print(f"Score: {s}")
      `),
      { _type: 'callout', _key: 'py-4-f', variant: 'tip', text: 'f-strings let you embed expressions inside string literals with curly braces.' },
    ],
    exercise: {
      title: 'Build a Student Roster',
      instructions: 'Create a dictionary `student` with keys "name", "language", and "level". Set them to any values and print each key-value pair using a for loop.',
      starterCode: '# Create your dictionary and loop here\n',
      solution: 'student = {"name": "Maya", "language": "Python", "level": "Beginner"}\nfor key, val in student.items():\n    print(f"{key}: {val}")',
      expectedOutput: 'name: Maya\nlanguage: Python\nlevel: Beginner',
    },
    quizzes: [
      quiz('py-4-q1', 'How do you access a dictionary value by its key?', ['dict[key]', 'dict.key', 'dict->key'], 0, 'Square brackets with the key name retrieve the value.'),
    ],
  },

  // ─── JavaScript extra lesson ─────────────────────────────────────────────────
  {
    _id: 'starter-js-4',
    title: 'Fetching Data with Fetch',
    slug: 'javascript-fetch-json',
    order: 4,
    summary: 'Fetch data from APIs, work with JSON, and understand Promises and async/await.',
    objectives: ['Make HTTP requests with the Fetch API', 'Parse JSON responses', 'Handle async operations with Promises', 'Write async/await syntax'],
    difficulty: 'medium',
    estimatedMinutes: 22,
    xp: 50,
    course: { _id: 'starter-javascript', title: 'JavaScript Web Basics', slug: 'javascript-web-basics', language: 'javascript', totalLessons: 4 },
    body: [
      block('js-4-a', 'The Fetch API lets your browser ask a server for data.', 'h2'),
      block('js-4-b', 'fetch() returns a Promise. Use .then() or await to handle the response when it arrives.'),
      code('js-4-c', 'javascript', `
const response = await fetch("https://api.example.com/user/1");
const data = await response.json();
console.log(data.name);
      `),
      block('js-4-d', 'JSON (JavaScript Object Notation) looks just like a JavaScript object. JSON.parse converts a string, JSON.stringify converts back.'),
      code('js-4-e', 'javascript', `
const jsonString = '{"name":"Maya","score":92}';
const obj = JSON.parse(jsonString);
console.log(obj.name);
      `),
    ],
    exercise: {
      title: 'Parse a User JSON',
      instructions: 'Use JSON.parse to convert the string `{"user": "Alice", "points": 150}` into an object. Then log the user property.',
      starterCode: 'const json = \'{"user": "Alice", "points": 150}\';\n// Parse and log here\n',
      solution: 'const json = \'{"user": "Alice", "points": 150}\';\nconst obj = JSON.parse(json);\nconsole.log(obj.user);',
      expectedOutput: 'Alice',
    },
    quizzes: [
      quiz('js-4-q1', 'What does response.json() return?', ['A string', 'A Promise that resolves to an object', 'An array'], 1, 'response.json() reads the body and parses it as JSON, returning a Promise.'),
    ],
  },

  // ─── TypeScript extra lesson ─────────────────────────────────────────────────
  {
    _id: 'starter-ts-4',
    title: 'Generics Basics',
    slug: 'typescript-generics-basics',
    order: 4,
    summary: 'Write reusable, type-safe functions and components with generics.',
    objectives: ['Define generic functions with type parameters', 'Constrain generics with extends', 'Use keyof with generics', 'Create generic interfaces'],
    difficulty: 'medium',
    estimatedMinutes: 22,
    xp: 50,
    course: { _id: 'starter-typescript', title: 'TypeScript for React', slug: 'typescript-for-react', language: 'typescript', totalLessons: 4 },
    body: [
      block('ts-4-a', 'A generic is a type parameter — a placeholder you fill in when you use the function.', 'h2'),
      block('ts-4-b', 'Generics let you write one function that works with many types while keeping full type safety.'),
      code('ts-4-c', 'typescript', `
function first<T>(items: T[]): T {
  return items[0];
}

const n = first([1, 2, 3]);  // number
const s = first(["a", "b"]); // string
      `),
      block('ts-4-d', 'Use extends to constrain what types a generic accepts.'),
      code('ts-4-e', 'typescript', `
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength("hello"); // 5
getLength([1, 2]);  // 2
      `),
    ],
    exercise: {
      title: 'Identity Function',
      instructions: 'Write a generic function `identity<T>` that takes a value of type T and returns it. Call it with a number and a string, logging both results.',
      starterCode: '// Write your generic function here\n',
      solution: 'function identity<T>(value: T): T {\n  return value;\n}\n\nconsole.log(identity(42));\nconsole.log(identity("hello"));',
      expectedOutput: '42\nhello',
    },
    quizzes: [
      quiz('ts-4-q1', 'What does <T> in a function signature declare?', ['A type parameter', 'A template literal', 'A generic module'], 0, '<T> declares a type parameter that is specified when the function is called.'),
    ],
  },

  // ─── HTML & CSS: Lesson 1 — Semantic Structure ───────────────────────────────
  {
    _id: 'starter-html-1',
    title: 'Semantic HTML Structure',
    slug: 'html-semantic-structure',
    order: 1,
    summary: 'Build meaningful web page structure with semantic HTML5 elements.',
    objectives: ['Use semantic tags like header, nav, main, section, article, footer', 'Create accessible forms with labels and fieldsets', 'Understand the HTML document outline'],
    difficulty: 'easy',
    estimatedMinutes: 18,
    xp: 50,
    course: { _id: 'starter-html-css', title: 'HTML & CSS Fundamentals', slug: 'html-css-fundamentals', language: 'html', totalLessons: 3 },
    body: [
      block('html-1-a', 'Semantic HTML gives meaning to your page structure — for browsers, screen readers, and other developers.', 'h2'),
      block('html-1-b', 'Replace generic divs with tags that describe their purpose.'),
      code('html-1-c', 'html', `
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/courses">Courses</a>
  </nav>
</header>
<main>
  <article>
    <h2>Lesson One</h2>
    <p>Content goes here.</p>
  </article>
</main>
<footer>
  <p>&copy; 2026 Spark</p>
</footer>
      `),
      block('html-1-d', 'Forms collect user input. Use label elements to make each field accessible.'),
      code('html-1-e', 'html', `
<form>
  <label for="email">Email</label>
  <input id="email" type="email" required />
  <button type="submit">Sign Up</button>
</form>
      `),
    ],
    exercise: {
      title: 'Build a Semantic Page',
      instructions: 'Write HTML that includes a header with a nav link, a main section with an article (h2 title + paragraph), and a footer with a copyright notice.',
      starterCode: '<!-- Write your semantic HTML here -->\n',
      solution: '<header>\n  <nav>\n    <a href="/">Home</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h2>Welcome</h2>\n    <p>This is a semantic page.</p>\n  </article>\n</main>\n<footer>\n  <p>&copy; 2026 Spark</p>\n</footer>',
      expectedOutput: '(no output — HTML structure only)',
    },
    quizzes: [
      quiz('html-1-q1', 'Which tag is used for the main navigation of a page?', ['<nav>', '<menu>', '<links>'], 0, '<nav> defines a set of navigation links.'),
    ],
  },

  // ─── HTML & CSS: Lesson 2 — Box, Flex, Grid ─────────────────────────────────
  {
    _id: 'starter-html-2',
    title: 'Box Model, Flexbox & Grid',
    slug: 'css-box-flex-grid',
    order: 2,
    summary: 'Master CSS layout with the box model, flexbox, and grid systems.',
    objectives: ['Understand margin, padding, border, and content areas', 'Create flexible layouts with Flexbox', 'Build two-dimensional layouts with CSS Grid', 'Use positioning for precise placement'],
    difficulty: 'easy',
    estimatedMinutes: 22,
    xp: 50,
    course: { _id: 'starter-html-css', title: 'HTML & CSS Fundamentals', slug: 'html-css-fundamentals', language: 'html', totalLessons: 3 },
    body: [
      block('html-2-a', 'Every element is a box. The box model controls spacing inside and out.', 'h2'),
      block('html-2-b', 'Content is the inner area. Padding goes around content, border goes around padding, margin goes around border.'),
      code('html-2-c', 'css', `
.card {
  padding: 16px;        /* space inside */
  margin: 8px;          /* space outside */
  border: 1px solid #ccc;
}
      `),
      block('html-2-d', 'Flexbox arranges items in one direction — perfect for nav bars, card rows, and centering.'),
      code('html-2-e', 'css', `
.nav {
  display: flex;
  gap: 16px;
  align-items: center;
}
      `),
      block('html-2-f', 'Grid handles two dimensions — rows and columns together.'),
      code('html-2-g', 'css', `
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
      `),
    ],
    exercise: {
      title: 'Card with Flex Layout',
      instructions: 'Write CSS that makes a `.container` a flexbox row with `gap: 12px`, and gives `.card` elements padding of 16px and a 1px solid gray border.',
      starterCode: '.container {\n  /* your styles */\n}\n.card {\n  /* your styles */\n}\n',
      solution: '.container {\n  display: flex;\n  gap: 12px;\n}\n.card {\n  padding: 16px;\n  border: 1px solid gray;\n}',
      expectedOutput: '(no output — CSS only)',
    },
    quizzes: [
      quiz('html-2-q1', 'Which CSS property creates space INSIDE an element?', ['margin', 'padding', 'gap'], 1, 'Padding adds space between content and border.'),
    ],
  },

  // ─── HTML & CSS: Lesson 3 — Responsive Design ────────────────────────────────
  {
    _id: 'starter-html-3',
    title: 'Responsive Design',
    slug: 'css-responsive-design',
    order: 3,
    summary: 'Make your pages look great on any screen size with responsive techniques.',
    objectives: ['Write media queries for different breakpoints', 'Use relative units (rem, %, vw, vh)', 'Apply a mobile-first approach', 'Use CSS custom properties for theming'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    xp: 50,
    course: { _id: 'starter-html-css', title: 'HTML & CSS Fundamentals', slug: 'html-css-fundamentals', language: 'html', totalLessons: 3 },
    body: [
      block('html-3-a', 'Responsive design means one page works on phones, tablets, and desktops.', 'h2'),
      block('html-3-b', 'Start with mobile styles, then add breakpoints for larger screens with min-width media queries.'),
      code('html-3-c', 'css', `
/* Mobile first — single column */
.grid { display: grid; gap: 12px; }
/* Tablet */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
/* Desktop */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
      `),
      block('html-3-d', 'Relative units scale with the viewport. Use rem for font sizes and % or fr for widths.'),
      code('html-3-e', 'css', `
:root {
  --primary: #FF5A1F;
  --radius: 8px;
}

.button {
  background: var(--primary);
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
      `),
    ],
    exercise: {
      title: 'Mobile-First Grid',
      instructions: 'Write CSS that makes `.grid` a single column by default, two columns at 600px, and three columns at 900px. Use 16px gaps and 1fr columns.',
      starterCode: '.grid {\n  /* your styles */\n}\n',
      solution: '.grid {\n  display: grid;\n  gap: 16px;\n}\n@media (min-width: 600px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n@media (min-width: 900px) {\n  .grid { grid-template-columns: repeat(3, 1fr); }\n}',
      expectedOutput: '(no output — CSS only)',
    },
    quizzes: [
      quiz('html-3-q1', 'What does the rem unit reference?', ['Root element font-size', 'Viewport width', 'Parent element'], 0, '1rem equals the font-size of the root (html) element.'),
    ],
  },

  // ─── SQL: Lesson 1 — SELECT and WHERE ────────────────────────────────────────
  {
    _id: 'starter-sql-1',
    title: 'SELECT and WHERE',
    slug: 'sql-select-where',
    order: 1,
    summary: 'Retrieve data from a database using SELECT queries with filtering and sorting.',
    objectives: ['Write SELECT queries to fetch columns', 'Filter rows with WHERE conditions', 'Sort results with ORDER BY', 'Limit results with LIMIT'],
    difficulty: 'easy',
    estimatedMinutes: 18,
    xp: 50,
    course: { _id: 'starter-sql', title: 'SQL & Databases', slug: 'sql-databases', language: 'sql', totalLessons: 3 },
    body: [
      block('sql-1-a', 'SELECT is how you ask a database for data. You name the columns you want and the table they live in.', 'h2'),
      block('sql-1-b', 'WHERE filters rows. Only rows that match the condition come back.'),
      code('sql-1-c', 'sql', `
SELECT title, xp
FROM challenges
WHERE difficulty = 'easy'
ORDER BY xp DESC
LIMIT 5;
      `),
      block('sql-1-d', 'Use comparison operators: =, <>, <, >, <=, >=. Combine conditions with AND and OR.'),
      code('sql-1-e', 'sql', `
SELECT name, score
FROM students
WHERE score >= 80 AND language = 'Python';
      `),
    ],
    exercise: {
      title: 'Filter Active Users',
      instructions: 'Write a query that selects name and email from a "users" table where active equals true, ordered by name.',
      starterCode: '-- Write your SELECT query\n',
      solution: 'SELECT name, email\nFROM users\nWHERE active = true\nORDER BY name;',
      expectedOutput: '(no output — SQL query only)',
    },
    quizzes: [
      quiz('sql-1-q1', 'Which clause filters rows in SQL?', ['WHERE', 'FILTER', 'HAVING'], 0, 'WHERE filters rows before grouping. HAVING filters after.'),
    ],
  },

  // ─── SQL: Lesson 2 — Joins and Aggregation ───────────────────────────────────
  {
    _id: 'starter-sql-2',
    title: 'Joins and Aggregation',
    slug: 'sql-joins-aggregation',
    order: 2,
    summary: 'Combine data from multiple tables and calculate summary statistics.',
    objectives: ['Join tables with INNER and LEFT JOIN', 'Group rows with GROUP BY', 'Use COUNT, SUM, AVG, MIN, MAX', 'Filter groups with HAVING'],
    difficulty: 'medium',
    estimatedMinutes: 22,
    xp: 100,
    course: { _id: 'starter-sql', title: 'SQL & Databases', slug: 'sql-databases', language: 'sql', totalLessons: 3 },
    body: [
      block('sql-2-a', 'JOIN lets you combine rows from two tables based on a related column.', 'h2'),
      block('sql-2-b', 'INNER JOIN returns only matching rows. LEFT JOIN keeps all rows from the left table.'),
      code('sql-2-c', 'sql', `
SELECT users.name, COUNT(enrollments.id) AS course_count
FROM users
LEFT JOIN enrollments ON users.id = enrollments.user_id
GROUP BY users.name
HAVING course_count > 0;
      `),
      block('sql-2-d', 'Aggregate functions compute a single value from many rows.'),
      code('sql-2-e', 'sql', `
SELECT language, AVG(score) AS avg_score, MAX(score) AS top_score
FROM results
GROUP BY language;
      `),
    ],
    exercise: {
      title: 'Student Course Count',
      instructions: 'Write a query that selects student name and the count of courses they are enrolled in. Use LEFT JOIN from students to enrollments. Group by student name.',
      starterCode: '-- Write your JOIN query\n',
      solution: 'SELECT students.name, COUNT(enrollments.id) AS total_courses\nFROM students\nLEFT JOIN enrollments ON students.id = enrollments.student_id\nGROUP BY students.name;',
      expectedOutput: '(no output — SQL query only)',
    },
    quizzes: [
      quiz('sql-2-q1', 'Which JOIN keeps all rows from the first table?', ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN'], 1, 'LEFT JOIN keeps every row from the left (first) table.'),
    ],
  },

  // ─── SQL: Lesson 3 — Insert, Update, Delete ──────────────────────────────────
  {
    _id: 'starter-sql-3',
    title: 'Insert, Update, and Delete',
    slug: 'sql-insert-update-delete',
    order: 3,
    summary: 'Modify data in a database with INSERT, UPDATE, and DELETE statements.',
    objectives: ['Insert new rows with INSERT INTO', 'Update existing rows with SET and WHERE', 'Delete rows with DELETE', 'Create tables with CREATE TABLE and constraints'],
    difficulty: 'medium',
    estimatedMinutes: 20,
    xp: 100,
    course: { _id: 'starter-sql', title: 'SQL & Databases', slug: 'sql-databases', language: 'sql', totalLessons: 3 },
    body: [
      block('sql-3-a', 'INSERT adds new rows to a table. Always specify which columns you are filling.', 'h2'),
      block('sql-3-b', 'UPDATE changes existing rows. Never run UPDATE without a WHERE clause unless you intend to change every row.'),
      code('sql-3-c', 'sql', `
INSERT INTO users (name, email, active)
VALUES ('Maya', 'maya@example.com', true);

UPDATE users
SET active = false
WHERE email = 'old@example.com';
      `),
      block('sql-3-d', 'CREATE TABLE defines a new table with column names, types, and constraints.'),
      code('sql-3-e', 'sql', `
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  pages INTEGER DEFAULT 0
);
      `),
    ],
    exercise: {
      title: 'Create and Insert',
      instructions: 'Write a CREATE TABLE statement for a "reviews" table with id (INTEGER PRIMARY KEY), course_id (INTEGER), rating (INTEGER), and comment (TEXT). Then insert one row.',
      starterCode: '-- Write your CREATE and INSERT\n',
      solution: 'CREATE TABLE reviews (\n  id INTEGER PRIMARY KEY,\n  course_id INTEGER,\n  rating INTEGER,\n  comment TEXT\n);\n\nINSERT INTO reviews (id, course_id, rating, comment)\nVALUES (1, 101, 5, \'Great course!\');',
      expectedOutput: '(no output — SQL statements only)',
    },
    quizzes: [
      quiz('sql-3-q1', 'What happens if you run DELETE without a WHERE clause?', ['It deletes all rows', 'It returns an error', 'It deletes the table'], 0, 'DELETE without WHERE removes every row in the table.'),
    ],
  },

];

export const getStarterCourses = () => courseSummaries;

export const getStarterCourse = (slug: string) =>
  courseSummaries.find(course => course.slug === slug) ?? null;

export const getStarterLesson = (slug: string) =>
  lessonDetails.find(lesson => lesson.slug === slug) ?? null;

export const getStarterLessonsForCourse = (courseId: string) =>
  lessonDetails
    .filter(lesson => lesson.course._id === courseId)
    .sort((a, b) => a.order - b.order);

