import fs from 'node:fs';
import path from 'node:path';
import { listFiles, parseFile } from './lib/parse.mjs';
import { toSanityDocs } from './lib/toSanity.mjs';

const SRC = path.resolve('C:/Users/ikkam/Documents/GitHub/project-next/courses/content/python');
const OUT = path.resolve('C:/Users/ikkam/Documents/GitHub/project-next/courses/pixelcode-import/pixelcode-import/py-mod17.ndjson');

const WANTED = new Set([
  'py-mod-17-concurrency',
  'py-les-concurrency-concepts-and-gil',
  'py-les-threading',
  'py-les-multiprocessing',
  'py-les-asyncio-basics',
  'py-les-python-frameworks-overview',
  'py-ws-threads-and-async-basics',
  'py-lab-async-batch-runner',
  'py-rev-concurrency',
  'py-quiz-concurrency',
  'python-programming',
  // prerequisite stubs so sequential-order checks pass locally; they are not written to NDJSON
  'py-mod-16-typing-testing-and-quality',
  'py-mod-01-getting-started',
  'py-mod-02-variables-and-data-types',
  'py-mod-03-operators-and-conditionals',
  'py-mod-04-loops',
  'py-mod-05-functions',
  'py-mod-06-collections',
  'py-mod-07-modules-and-standard-library',
  'py-mod-08-exceptions-and-files',
  'py-mod-09-object-oriented-programming',
  'py-mod-10-iteration-and-functional-tools',
  'py-mod-11-decorators-and-context-managers',
  'py-mod-12-regular-expressions',
  'py-mod-13-recursion-and-algorithms',
  'py-mod-14-data-structures',
  'py-mod-15-environments-and-packaging',
]);

const EMIT = new Set([
  'py-mod-17-concurrency',
  'py-les-concurrency-concepts-and-gil',
  'py-les-threading',
  'py-les-multiprocessing',
  'py-les-asyncio-basics',
  'py-les-python-frameworks-overview',
  'py-ws-threads-and-async-basics',
  'py-lab-async-batch-runner',
  'py-rev-concurrency',
  'py-quiz-concurrency',
]);

const files = listFiles(SRC).filter((f) => WANTED.has(path.basename(f, '.md')));
const docs = [];
for (const f of files) {
  const { doc } = parseFile(f);
  if (doc) docs.push(doc);
}
const sanityDocs = toSanityDocs(docs).filter((d) => EMIT.has(d.contentId));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, sanityDocs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`Wrote ${sanityDocs.length} draft documents to ${OUT}`);
