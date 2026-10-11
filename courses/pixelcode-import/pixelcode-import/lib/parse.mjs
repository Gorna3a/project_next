import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { STEP_SECTIONS } from './constants.mjs';
import { stripComments, sections, headings, firstFence, preamble, trimRule, listItems, firstTable } from './md.mjs';

/** Recursively list content .md files (skips _spec.md, README.md, node_modules, dotfolders). */
export function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    else if (entry.name.endsWith('.md') && !entry.name.startsWith('_') && entry.name.toLowerCase() !== 'readme.md') out.push(full);
  }
  return out.sort();
}

function normalizeData(data) {
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = v instanceof Date ? v.toISOString().slice(0, 10) : v;
  return out;
}

function parseJsonFence(text, where, problems) {
  const fence = firstFence(text);
  if (!fence) {
    problems.push(`${where}: missing fenced \`\`\`json block`);
    return null;
  }
  try {
    const value = JSON.parse(fence.code);
    if (!Array.isArray(value)) {
      problems.push(`${where}: JSON must be an array of tests`);
      return null;
    }
    return value;
  } catch (e) {
    problems.push(`${where}: invalid JSON (${e.message})`);
    return null;
  }
}

/**
 * Parse one file. Returns { doc, problems } where problems are structural parse problems (strings).
 * Semantic validation happens in validate.mjs.
 */
export function parseFile(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const parseProblems = [];
  let fm;
  try {
    fm = matter(raw);
  } catch (e) {
    return { doc: null, parseProblems: [`Invalid frontmatter YAML: ${e.message}`] };
  }
  const data = normalizeData(fm.data || {});
  const content = fm.content.replace(/^\n+/, '');
  const cleaned = stripComments(content);
  const doc = {
    file,
    stem: path.basename(file, '.md'),
    raw,
    data,
    id: data.id,
    type: data.type,
    cleaned,
    headingList: headings(cleaned),
    parsed: {},
  };
  const P = doc.parsed;

  switch (data.type) {
    case 'course': {
      P.body = cleaned.trim();
      const sec = Object.fromEntries(sections(cleaned, 1).map((s) => [s.title, s.body]));
      const all = Object.fromEntries(sections(cleaned, 2).map((s) => [s.title, s.body]));
      P.learningObjectives = listItems(all['Learning Objectives'] || '');
      P.prerequisiteKnowledge = listItems(all['Prerequisite Knowledge'] || '');
      void sec;
      break;
    }
    case 'module': {
      P.body = cleaned.trim();
      const all = Object.fromEntries(sections(cleaned, 2).map((s) => [s.title, s.body]));
      P.outcomes = listItems(all['What You Will Be Able To Do'] || '');
      break;
    }
    case 'theory':
    case 'review': {
      P.body = cleaned.trim();
      if (data.type === 'review') {
        const matrix = sections(cleaned, 2).find((s) => s.title === 'Core Terminology / Formula Matrix');
        P.matrix = matrix ? firstTable(matrix.body) : null;
      }
      break;
    }
    case 'workshop': {
      P.body = trimRule(preamble(cleaned, 2).replace(/^# .*\n?/, ''));
      P.steps = [];
      for (const s of sections(cleaned, 2)) {
        const m = s.title.match(/^Step\s+(\d+)\s*[:\-–—]?\s*(.*)$/i);
        if (!m) continue;
        const subs = Object.fromEntries(sections(s.body, 3).map((x) => [x.title, x.body]));
        const where = `Step ${m[1]}`;
        const step = {
          number: Number(m[1]),
          title: m[2].trim(),
          present: STEP_SECTIONS.filter((n) => n in subs),
          instructions: (subs['Instructions'] || '').trim(),
          hints: listItems(subs['Hints'] || ''),
          starter: subs['Starter State / Code'] ? firstFence(subs['Starter State / Code']) : null,
          solution: subs['Solution State / Code'] ? firstFence(subs['Solution State / Code']) : null,
          tests: null,
        };
        if (subs['Evaluation Tests']) step.tests = parseJsonFence(subs['Evaluation Tests'], `${where} Evaluation Tests`, parseProblems);
        P.steps.push(step);
      }
      break;
    }
    case 'lab': {
      const h2 = Object.fromEntries(sections(cleaned, 2).map((s) => [s.title, s.body]));
      P.objective = trimRule(preamble(cleaned, 2).replace(/^# .*\n?/, ''));
      P.requirements = listItems(h2['Requirements'] || '');
      P.starter = h2['Starter State / Workspace'] ? firstFence(h2['Starter State / Workspace']) : null;
      P.tests = h2['Evaluation Tests'] ? parseJsonFence(h2['Evaluation Tests'], 'Evaluation Tests', parseProblems) : null;
      P.hints = [...(h2['Hints'] || '').matchAll(/\*\*Hint\s*\d+:\*\*\s*(.+)/g)].map((m) => m[1].trim());
      P.referenceSolution = h2['Reference Solution'] ? firstFence(h2['Reference Solution']) : null;
      P.body = [P.objective, P.requirements.length ? '## Requirements\n' + P.requirements.map((r) => `- ${r}`).join('\n') : ''].filter(Boolean).join('\n\n');
      break;
    }
    case 'quiz': {
      P.questions = [];
      for (const s of sections(content, 2)) {
        const m = s.title.match(/^Question\s+(\d+)/i);
        if (!m) continue;
        const metaMatch = s.body.match(/<!--\s*meta:\s*(\{[\s\S]*?\})\s*-->/);
        let meta = null;
        let metaError = null;
        if (metaMatch) {
          try {
            meta = JSON.parse(metaMatch[1]);
          } catch (e) {
            metaError = e.message;
          }
        }
        const body = stripComments(s.body);
        const lines = body.split('\n');
        const optionRe = /^- \[( |x|X)\]\s+(.*\S)\s*$/;
        const firstOpt = lines.findIndex((l) => optionRe.test(l));
        const options = lines.map((l) => l.match(optionRe)).filter(Boolean).map((o) => ({ text: o[2].trim(), correct: o[1].toLowerCase() === 'x' }));
        const promptText = (firstOpt === -1 ? lines : lines.slice(0, firstOpt)).join('\n').trim();
        const hint = (body.match(/^>\s*\*\*Hint:\*\*\s*(.+)$/m) || [])[1];
        const exp = body.match(/\*Explanation\*:\s*([\s\S]*)$/);
        P.questions.push({
          number: Number(m[1]),
          meta,
          metaError,
          hasMeta: Boolean(metaMatch),
          prompt: promptText,
          options,
          hint: hint ? hint.trim() : undefined,
          explanation: exp ? trimRule(exp[1]) : '',
        });
      }
      break;
    }
    case 'certification-project': {
      const h2 = Object.fromEntries(sections(cleaned, 2).map((s) => [s.title, s.body]));
      P.objective = trimRule(preamble(cleaned, 2).replace(/^# .*\n?/, ''));
      P.deliverables = listItems(h2['Functional Deliverables'] || '');
      const table = h2['Requirements & Rubric'] ? firstTable(h2['Requirements & Rubric']) : null;
      P.rubric = table
        ? table.rows.map((r) => ({
            number: Number(r[0]),
            requirement: r[1],
            weight: Number(r[2]),
            required: /^(yes|true|y)$/i.test((r[3] || '').trim()),
            _raw: r,
          }))
        : null;
      P.starter = h2['Starter Workspace'] ? firstFence(h2['Starter Workspace']) : null;
      P.tests = h2['Automated Validation Criteria'] ? parseJsonFence(h2['Automated Validation Criteria'], 'Automated Validation Criteria', parseProblems) : null;
      P.body = [
        P.objective,
        P.deliverables.length ? '## Functional Deliverables\n' + P.deliverables.map((d, i) => `${i + 1}. ${d}`).join('\n') : '',
        h2['Requirements & Rubric'] ? '## Requirements & Rubric\n' + h2['Requirements & Rubric'] : '',
      ].filter(Boolean).join('\n\n');
      break;
    }
    default:
      break;
  }
  return { doc, parseProblems };
}
