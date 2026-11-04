import { getCliClient } from '@sanity/cli';
const client = getCliClient({ apiVersion: '2025-02-19' });
console.log(`projectId in client config: ${JSON.stringify(client.config().projectId)} dataset: ${client.config().dataset}`);
// Direct API version check
try {
  const d = await client.fetch(`*[_id == "drafts.py-mod-17-concurrency"]{_id, contentId}`);
  console.log(`direct drafts.py-mod-17-concurrency: ${JSON.stringify(d)}`);
} catch (e) { console.log(`fetch error: ${e.message}`); }
const py = await client.fetch(`*[_type == "lesson" && contentId match "py-*"]{_id, contentId, kind, order, title}`);
console.log(`Python lessons total: ${py.length}`);
const found = py.filter(d => d.contentId.includes('concurrency') || d.contentId.includes('async') || d.contentId.includes('thread'));
console.log(`found subtotal: ${found.length}`);
console.log(`first 3 contentIds: ${py.slice(0,3).map(d=>d.contentId).join(', ')}`);
const ids = ["py-les-concurrency-concepts-and-gil","py-les-threading","py-les-multiprocessing","py-les-asyncio-basics","py-les-python-frameworks-overview","py-ws-threads-and-async-basics","py-lab-async-batch-runner","py-rev-concurrency","py-quiz-concurrency"];
const mod17 = py.filter(d => ids.includes(d.contentId)).sort((a,b)=> (a.order||0)-(b.order||0));
console.log(`Module 17 lessons found: ${mod17.length}`);
for (const d of mod17) console.log(`${d._id} | order=${d.order} | ${d.title}`);
const mods = await client.fetch(`*[_type == "module" && contentId match "py-*"]{_id, contentId, title}`);
console.log(`Python modules: ${mods.length}`);
for (const m of mods.sort((a,b)=> (a.contentId||'').localeCompare(b.contentId||''))) console.log(`${m._id} | ${m.title}`);
