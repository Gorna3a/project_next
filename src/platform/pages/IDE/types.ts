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
  { id: "index.html", name: "index.html", kind: "html", content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>First light</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main class="card">
      <span class="eyebrow">A tiny beginning</span>
      <h1>Hello, <em>curious</em> mind.</h1>
      <p>You just made a web page. Change the code and watch it come alive.</p>
      <button id="spark">Make a spark</button>
      <span id="message"></span>
    </main>
    <script src="script.js"></script>
  </body>
</html>` },
  { id: "style.css", name: "style.css", kind: "css", content: `:root {
  font-family: system-ui, sans-serif;
  color: #193342;
  background: #f3eadb;
}

* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; }
.card { width: min(560px, calc(100% - 40px)); padding: 56px; background: #fffaf0; border: 1px solid #dbc9ae; border-radius: 22px; box-shadow: 0 18px 50px #8c715229; }
.eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: .16em; color: #bf7045; font-weight: 700; }
h1 { font-size: clamp(36px, 6vw, 64px); line-height: .98; margin: 22px 0 18px; letter-spacing: -.06em; }
h1 em { color: #178f86; font-style: normal; }
p { line-height: 1.7; color: #65737a; max-width: 370px; }
button { margin-top: 18px; border: 0; border-radius: 999px; padding: 13px 19px; background: #178f86; color: white; font-weight: 700; cursor: pointer; }
#message { display: block; margin-top: 18px; color: #bf7045; font-size: 14px; }` },
  { id: "script.js", name: "script.js", kind: "js", content: `const button = document.querySelector("#spark");
const message = document.querySelector("#message");

button.addEventListener("click", () => {
  message.textContent = "You made something happen.";
  button.textContent = "Again";
});` },
  { id: "package.json", name: "package.json", kind: "json", content: `{
  "name": "first-light",
  "private": true,
  "scripts": {
    "dev": "vite --host 0.0.0.0"
  },
  "devDependencies": {
    "vite": "latest"
  }
}` },
  { id: "README.md", name: "README.md", kind: "md", content: `# First light

Welcome to your first little project.

Try changing the headline, then press **Run** to see your work.` },
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
