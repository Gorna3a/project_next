import fs from "node:fs";
import path from "node:path";
import { parseFile } from "./lib/parse.mjs";
import { validateAll } from "./lib/validate.mjs";
import { toSanityDocs } from "./lib/toSanity.mjs";

const srcDir = "C:/Users/ikkam/Documents/GitHub/project-next/courses/content/python";
const outFile = "C:/Users/ikkam/Documents/GitHub/project-next/courses/pixelcode-import/pixelcode-import/py-mod16-restart.ndjson";
const WANT = new Set([
  "py-mod-16-typing-testing-and-quality",
  "py-les-type-hints",
  "py-les-type-checkers-and-pydantic",
  "py-les-code-formatting-and-linting",
  "py-les-docstrings-and-documentation",
  "py-les-unit-testing-with-unittest",
  "py-les-pytest-and-tox",
  "py-ws-typed-calculator-with-tests",
  "py-lab-typed-stats-module",
  "py-rev-typing-testing-and-quality",
  "py-quiz-typing-testing-and-quality",
]);

const docs = [];
const parseProblems = new Map();
for (const name of fs.readdirSync(srcDir)) {
  if (!name.endsWith(".md")) continue;
  const stem = path.basename(name, ".md");
  if (!WANT.has(stem)) continue;
  const f = path.join(srcDir, name);
  const { doc, parseProblems: pp } = parseFile(f);
  if (doc) docs.push(doc);
  else docs.push({ file: f, data: {}, raw: "", cleaned: "", headingList: [], parsed: {}, stem });
  if (pp.length) parseProblems.set(f, pp);
}
const { problems } = validateAll(docs, parseProblems);
const mods = [];
for (const d of docs) {
  if (d && d.type === "module") mods.push(d.id);
}
// Module 16 itself is complete in this set
const filtered = problems.filter((p) => {
  const msg = p.msg || "";
  // Ignore intra-set completeness errors for other modules (none here) and the missing-course error
  if (msg.includes("is not a module in this content set") && msg.includes("py-mod-15")) return false;
  if (msg.includes("does not match any course file")) return false;
  return true;
});
let errs = 0;
for (const p of filtered) { console.log(`${p.level === "error" ? "ERROR" : "warn "}  ${path.basename(p.file)}  ${p.msg}`); if (p.level === "error") errs++; }
console.log(`${errs} module16 error(s) (course-context errors ignored)`);
if (errs > 0) process.exit(1);

const dl = docs.map((doc) => {
  const d = { ...doc };
  if (d.type === "module") {
    d.data = { ...d.data, courseId: "python-programming", prerequisites: ["py-mod-15-environments-and-packaging"] };
  }
  return d;
});
const sanityDocs = toSanityDocs(dl);
fs.writeFileSync(outFile, sanityDocs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${sanityDocs.length} draft documents to ${outFile}`);
