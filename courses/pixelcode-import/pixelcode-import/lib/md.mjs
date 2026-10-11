// Small fence-aware Markdown helpers (no AST dependency).

const FENCE = /^\s*(```|~~~)/;

/** Split text into alternating prose / fenced-code chunks. */
export function chunks(text) {
  const out = [];
  let cur = [];
  let inFence = false;
  let marker = '';
  for (const line of text.split('\n')) {
    const m = line.match(FENCE);
    if (!inFence && m) {
      if (cur.length) out.push({ fence: false, text: cur.join('\n') });
      cur = [line];
      inFence = true;
      marker = m[1];
    } else if (inFence && line.trim().startsWith(marker)) {
      cur.push(line);
      out.push({ fence: true, text: cur.join('\n') });
      cur = [];
      inFence = false;
    } else {
      cur.push(line);
    }
  }
  if (cur.length) out.push({ fence: inFence, text: cur.join('\n') });
  return out;
}

/** Remove HTML comments outside fenced code. */
export function stripComments(text) {
  return chunks(text)
    .map((c) => (c.fence ? c.text : c.text.replace(/<!--[\s\S]*?-->/g, '')))
    .join('\n');
}

/** Split into sections at a given heading level, ignoring headings inside fences. */
export function sections(text, level) {
  const prefix = '#'.repeat(level) + ' ';
  const result = [];
  let current = null;
  for (const c of chunks(text)) {
    if (c.fence) {
      if (current) current.lines.push(c.text);
      continue;
    }
    for (const line of c.text.split('\n')) {
      if (line.startsWith(prefix)) {
        current = { title: line.slice(prefix.length).trim(), lines: [] };
        result.push(current);
      } else if (current) {
        current.lines.push(line);
      }
    }
  }
  return result.map((s) => ({ title: s.title, body: s.lines.join('\n').trim() }));
}

/** All heading titles at any level (outside fences). */
export function headings(text) {
  const found = [];
  for (const c of chunks(text)) {
    if (c.fence) continue;
    for (const line of c.text.split('\n')) {
      const m = line.match(/^(#{1,6})\s+(.*)$/);
      if (m) found.push({ level: m[1].length, title: m[2].trim() });
    }
  }
  return found;
}

/** First fenced code block in text -> { language, code } or null. */
export function firstFence(text) {
  const lines = text.split('\n');
  let start = -1;
  let lang = '';
  let marker = '';
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*(```|~~~)\s*([^\s`]*)/);
    if (start === -1 && m) {
      start = i;
      lang = m[2] || '';
      marker = m[1];
    } else if (start !== -1 && lines[i].trim().startsWith(marker)) {
      return { language: lang, code: lines.slice(start + 1, i).join('\n') };
    }
  }
  return null;
}

/** Markdown with all fenced code blocks removed (for prose-only checks). */
export function withoutFences(text) {
  return chunks(text).filter((c) => !c.fence).map((c) => c.text).join('\n');
}

/** Text before the first heading of the given level (fence-aware). */
export function preamble(text, level) {
  const prefix = '#'.repeat(level) + ' ';
  const out = [];
  for (const c of chunks(text)) {
    if (c.fence) {
      out.push(c.text);
      continue;
    }
    let stop = false;
    for (const line of c.text.split('\n')) {
      if (line.startsWith(prefix)) {
        stop = true;
        break;
      }
      out.push(line);
    }
    if (stop) break;
  }
  return out.join('\n');
}

/** Remove a trailing horizontal rule (---) and surrounding whitespace. */
export function trimRule(text) {
  return text.replace(/\n?\s*---\s*$/m, '').trim();
}

/** Bullet or numbered list items -> array of strings (single-line items). */
export function listItems(text) {
  return withoutFences(text)
    .split('\n')
    .map((l) => l.match(/^\s*(?:[-*]|\d+\.)\s+(.*\S)\s*$/))
    .filter(Boolean)
    .map((m) => m[1].trim());
}

/** Parse the first Markdown table in text -> { header: string[], rows: string[][] } or null. */
export function firstTable(text) {
  const lines = withoutFences(text).split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (/^\s*\|.*\|\s*$/.test(lines[i]) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const header = cells(lines[i]);
      const rows = [];
      for (let j = i + 2; j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j]); j++) rows.push(cells(lines[j]));
      return { header, rows };
    }
  }
  return null;
}
