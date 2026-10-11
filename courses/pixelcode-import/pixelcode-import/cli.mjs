#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import { listFiles, parseFile } from './lib/parse.mjs';
import { validateAll } from './lib/validate.mjs';
import { toSanityDocs } from './lib/toSanity.mjs';

const [, , command, dirArg, ...rest] = process.argv;
const flags = new Set(rest.filter((a) => a.startsWith('--')));
const opt = (name) => {
  const i = rest.indexOf(name);
  return i !== -1 ? rest[i + 1] : undefined;
};

function usage(code = 1) {
  console.log(`Usage:
  node cli.mjs validate <dir> [--strict]              Check every .md file (no network)
  node cli.mjs ndjson   <dir> [--out file.ndjson]     Validate, then write Sanity NDJSON (no token needed)
  node cli.mjs import   <dir> [--apply] [--only-new]  Validate, then import as DRAFTS (dry run unless --apply)

Environment for import --apply: SANITY_PROJECT_ID, SANITY_DATASET (default "production"), SANITY_API_WRITE_TOKEN`);
  process.exit(code);
}

if (!command || !dirArg || !['validate', 'ndjson', 'import'].includes(command)) usage(command ? 1 : 0);
if (!fs.existsSync(dirArg) || !fs.statSync(dirArg).isDirectory()) {
  console.error(`Not a directory: ${dirArg}`);
  process.exit(1);
}

function load() {
  const files = listFiles(dirArg);
  if (!files.length) {
    console.error(`No content .md files found in ${dirArg}`);
    process.exit(1);
  }
  const docs = [];
  const parseProblems = new Map();
  for (const f of files) {
    const { doc, parseProblems: pp } = parseFile(f);
    if (doc) docs.push(doc);
    else docs.push({ file: f, data: {}, raw: '', cleaned: '', headingList: [], parsed: {}, stem: path.basename(f, '.md') });
    if (pp.length) parseProblems.set(f, pp);
  }
  const { problems, byId } = validateAll(docs, parseProblems);
  return { docs, problems, byId };
}

function report(problems, strict) {
  const byFile = new Map();
  for (const p of problems) {
    if (!byFile.has(p.file)) byFile.set(p.file, []);
    byFile.get(p.file).push(p);
  }
  for (const [file, list] of byFile) {
    console.log(`\n${path.relative(process.cwd(), file)}`);
    for (const p of list) console.log(`  ${p.level === 'error' ? 'ERROR' : 'warn '}  ${p.msg}`);
  }
  const errors = problems.filter((p) => p.level === 'error').length;
  const warns = problems.filter((p) => p.level === 'warn').length;
  console.log(`\n${errors} error(s), ${warns} warning(s)`);
  return errors > 0 || (strict && warns > 0);
}

const { docs, problems, byId } = load();
const failed = report(problems, flags.has('--strict'));

if (command === 'validate') {
  if (!failed) {
    const count = (t) => docs.filter((d) => d.type === t).length;
    console.log(`OK: ${docs.length} files (${count('course')} course, ${count('module')} modules, ${count('theory')} theory, ${count('workshop')} workshops, ${count('lab')} labs, ${count('review')} reviews, ${count('quiz')} quizzes, ${count('certification-project')} capstone)`);
  }
  process.exit(failed ? 1 : 0);
}

if (failed) {
  console.error('\nRefusing to continue: fix the problems above first.');
  process.exit(1);
}

const sanityDocs = toSanityDocs(docs);

if (command === 'ndjson') {
  const out = opt('--out') || 'sanity-import.ndjson';
  fs.writeFileSync(out, sanityDocs.map((d) => JSON.stringify(d)).join('\n') + '\n');
  console.log(`\nWrote ${sanityDocs.length} draft documents to ${out}`);
  console.log(`Import with:  npx sanity dataset import ${out} <dataset> --missing   (keeps existing documents)`);
  console.log(`          or:  npx sanity dataset import ${out} <dataset> --replace   (overwrites documents with the same _id)`);
  process.exit(0);
}

// command === 'import'
const apply = flags.has('--apply');
const onlyNew = flags.has('--only-new');
const tally = {};
for (const d of sanityDocs) tally[d._type + (d.kind ? `:${d.kind}` : '')] = (tally[d._type + (d.kind ? `:${d.kind}` : '')] || 0) + 1;
console.log(`\nPlan: ${sanityDocs.length} draft documents`);
for (const [k, v] of Object.entries(tally)) console.log(`  ${String(v).padStart(3)}  ${k}`);

if (!apply) {
  console.log('\nDry run only. Nothing was written. Re-run with --apply to import.');
  process.exit(0);
}

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error('\nSet SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (see .env.example).');
  process.exit(1);
}
const { createClient } = await import('@sanity/client');
const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false });

let docsToWrite = sanityDocs;
if (onlyNew) {
  const ids = sanityDocs.flatMap((d) => [d._id, d._id.replace(/^drafts\./, '')]);
  const existing = new Set(await client.fetch('*[_id in $ids]._id', { ids }));
  docsToWrite = sanityDocs.filter((d) => !existing.has(d._id) && !existing.has(d._id.replace(/^drafts\./, '')));
  console.log(`--only-new: skipping ${sanityDocs.length - docsToWrite.length} document(s) that already exist`);
} else {
  const published = await client.fetch('*[_id in $ids]._id', { ids: sanityDocs.map((d) => d._id.replace(/^drafts\./, '')) });
  if (published.length) console.log(`Note: ${published.length} document(s) already have a published version; their drafts will be replaced (shown as unpublished edits in Studio).`);
}

const CHUNK = 50;
let written = 0;
for (let i = 0; i < docsToWrite.length; i += CHUNK) {
  const tx = client.transaction();
  for (const d of docsToWrite.slice(i, i + CHUNK)) tx.createOrReplace(d);
  await tx.commit({ visibility: 'async' });
  written += Math.min(CHUNK, docsToWrite.length - i);
  console.log(`  wrote ${written}/${docsToWrite.length}`);
}
console.log(`\nDone. ${written} draft document(s) written to ${projectId}/${dataset}. Review and publish them in Studio.`);
