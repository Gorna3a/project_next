export type FileKind = "html" | "css" | "js" | "ts" | "json" | "py" | "md" | "folder";
export type ProjectType = "web" | "python";

export type ProjectFile = {
  id: string;
  name: string;
  kind: FileKind;
  content?: string;
  parent?: string;
};

export const starterFiles: ProjectFile[] = [
  {
    id: "index.html",
    name: "index.html",
    kind: "html",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PixelLab Playground</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main class="lab">
      <header class="lab__header">
        <div class="orb"></div>
        <div class="lab__title">
          <h1>PixelLab <span>Playground</span></h1>
          <p>A live sandbox to poke at functions, animations, and the DOM.</p>
        </div>
        <button id="themeToggle" class="btn btn--ghost">Toggle theme</button>
      </header>

      <section class="panel">
        <label class="field">
          <span>Value</span>
          <input id="value" type="number" value="12" />
        </label>
        <div class="actions">
          <button class="btn" data-fn="fibonacci">fibonacci(n)</button>
          <button class="btn" data-fn="factorial">factorial(n)</button>
          <button class="btn" data-fn="isPrime">isPrime(n)</button>
          <button class="btn" data-fn="reverse">reverse(str)</button>
          <button class="btn" data-fn="sort">sort(arr)</button>
        </div>
      </section>

      <section class="stats">
        <div class="stat"><span id="clock">--:--:--</span><small>live clock</small></div>
        <div class="stat"><span id="counter">0</span><small>counter</small></div>
        <button id="inc" class="btn btn--accent">+1</button>
        <button id="spin" class="btn">spin orb</button>
      </section>

      <section class="console">
        <div class="console__bar"><span>console</span></div>
        <pre id="output"></pre>
      </section>
    </main>
    <script src="script.js"></script>
  </body>
</html>`,
  },
  {
    id: "style.css",
    name: "style.css",
    kind: "css",
    content: `:root {
  --bg: #0f1020;
  --bg-2: #1a1b3a;
  --surface: rgba(255, 255, 255, 0.06);
  --surface-strong: rgba(255, 255, 255, 0.12);
  --border: rgba(255, 255, 255, 0.14);
  --text: #eef0ff;
  --muted: #9aa0d0;
  --accent: #7c5cff;
  --accent-2: #21d4c4;
  --radius: 18px;
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  color-scheme: dark;
}

.lab[data-theme="light"] {
  --bg: #eef1ff;
  --bg-2: #dfe4ff;
  --surface: rgba(20, 22, 60, 0.05);
  --surface-strong: rgba(20, 22, 60, 0.1);
  --border: rgba(20, 22, 60, 0.14);
  --text: #1a1b3a;
  --muted: #5b6196;
  --shadow: 0 20px 60px rgba(40, 50, 120, 0.18);
  color-scheme: light;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Inter", system-ui, sans-serif;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(124, 92, 255, 0.35), transparent 60%),
    radial-gradient(1000px 500px at 110% 10%, rgba(33, 212, 196, 0.28), transparent 55%),
    linear-gradient(135deg, var(--bg), var(--bg-2));
  background-attachment: fixed;
  animation: gradientShift 18s ease-in-out infinite alternate;
}

@keyframes gradientShift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(40deg); }
}

.lab {
  width: min(820px, calc(100% - 32px));
  margin: 48px auto;
  display: grid;
  gap: 18px;
  padding: 26px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
}

.lab__header {
  display: flex;
  align-items: center;
  gap: 18px;
}

.orb {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--accent), var(--accent-2), var(--accent));
  box-shadow: 0 0 30px rgba(124, 92, 255, 0.6);
  animation: float 4s ease-in-out infinite;
}

.orb--spin { animation: spin 1.4s linear infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.lab__title h1 {
  margin: 0;
  font-size: clamp(26px, 4vw, 40px);
  letter-spacing: -0.03em;
}

.lab__title h1 span {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lab__title p { margin: 6px 0 0; color: var(--muted); }

.panel, .stats, .console {
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface-strong);
  padding: 16px;
}

.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--muted); }
.field input {
  width: 160px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
}

.actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }

.stats { display: flex; align-items: center; gap: 16px; }
.stat { display: flex; flex-direction: column; }
.stat span { font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; }
.stat small { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; }

.btn {
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
  color: var(--text);
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(124,92,255,0.35); }
.btn:active { transform: translateY(0); }
.btn--accent { background: linear-gradient(180deg, var(--accent), #5a3cff); border-color: transparent; }
.btn--ghost { margin-left: auto; }

.console { padding: 0; overflow: hidden; }
.console__bar {
  padding: 10px 14px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
}
.console pre {
  margin: 0;
  padding: 14px;
  min-height: 140px;
  max-height: 240px;
  overflow: auto;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--accent-2);
}

@media (max-width: 560px) {
  .lab__header { flex-wrap: wrap; }
  .btn--ghost { margin-left: 0; }
}`,
  },
  {
    id: "script.js",
    name: "script.js",
    kind: "js",
    content: `// PixelLab Playground - a small live sandbox.
// Results print to the console panel in the preview.

function fibonacci(n) {
  n = Math.max(0, Math.floor(Number(n) || 0));
  if (n < 2) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t; }
  return b;
}

function factorial(n) {
  n = Math.max(0, Math.floor(Number(n) || 0));
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function isPrime(n) {
  n = Math.floor(Number(n) || 0);
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function reverseString(str) {
  return String(str).split("").reverse().join("");
}

function bubbleSort(arr) {
  const a = arr.slice();
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) { const t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; }
    }
  }
  return a;
}

function randomArray(size) {
  const out = [];
  for (let i = 0; i < size; i++) out.push(Math.floor(Math.random() * 100));
  return out;
}

function log(line) {
  const out = document.getElementById("output");
  const time = new Date().toLocaleTimeString();
  out.textContent = "[" + time + "] " + line + "\\n" + out.textContent;
}

function run(fn) {
  const raw = document.getElementById("value").value;
  if (fn === "reverse") {
    log("reverse('" + raw + "') = '" + reverseString(raw) + "'");
    return;
  }
  const n = Number(raw);
  if (fn === "fibonacci") log("fibonacci(" + n + ") = " + fibonacci(n));
  else if (fn === "factorial") log("factorial(" + n + ") = " + factorial(n));
  else if (fn === "isPrime") log("isPrime(" + n + ") = " + isPrime(n));
  else if (fn === "sort") {
    const arr = randomArray(8);
    log("sort(" + arr.join(",") + ") = " + bubbleSort(arr).join(","));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-fn]").forEach(function (btn) {
    btn.addEventListener("click", function () { run(btn.getAttribute("data-fn")); });
  });

  let count = Number(localStorage.getItem("pixellab_count") || 0);
  const counter = document.getElementById("counter");
  counter.textContent = count;
  document.getElementById("inc").addEventListener("click", function () {
    count += 1;
    counter.textContent = count;
    localStorage.setItem("pixellab_count", count);
  });

  document.getElementById("spin").addEventListener("click", function () {
    document.querySelector(".orb").classList.toggle("orb--spin");
  });

  const root = document.querySelector(".lab");
  const saved = localStorage.getItem("pixellab_theme");
  if (saved) root.setAttribute("data-theme", saved);
  document.getElementById("themeToggle").addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("pixellab_theme", next);
  });

  setInterval(function () {
    document.getElementById("clock").textContent = new Date().toLocaleTimeString();
  }, 1000);

  log("PixelLab ready. Try the buttons above.");
});`,
  },
  {
    id: "package.json",
    name: "package.json",
    kind: "json",
    content: `{
  "name": "pixellab",
  "private": true,
  "scripts": {
    "dev": "vite --host 0.0.0.0"
  },
  "devDependencies": {
    "vite": "latest"
  }
}`,
  },
  {
    id: "README.md",
    name: "README.md",
    kind: "md",
    content: `# PixelLab Playground

A richer starter to stress the in-browser IDE.

- Several JS functions (fibonacci, factorial, isPrime, reverse, bubble sort)
- A live clock, a persisted counter, and a theme toggle (localStorage)
- A large animated stylesheet with light/dark themes

Press **Run**, then use the buttons in the preview to exercise the code.`,
  },
];

export const pythonStarterFiles: ProjectFile[] = [
  { id: "main.py", name: "main.py", kind: "py", content: `# Welcome to the Python workspace
# Pyodide runs Python right in your browser.

name = "PixelCoder"
print(f"Hello, {name}!")
print("Edit main.py and press Run to see the output.")

import math
radius = 5
area = math.pi * radius ** 2
print(f"A circle with radius {radius} has area {area:.2f}.")` },
  { id: "README.md", name: "README.md", kind: "md", content: `# Python starter

A tiny Python workspace that runs in your browser with Pyodide.

Edit **main.py** and press **Run** to see the output below.` },
];

export const detectProjectType = (files: ProjectFile[]): ProjectType =>
  files.some(file => file.name === "main.py") || files.some(file => file.name.endsWith(".py"))
    ? "python"
    : "web";

export const projectLabel = (type: ProjectType): string =>
  type === "python" ? "python" : "starter";
