import { getCliClient } from '@sanity/cli';
const client = getCliClient({ apiVersion: '2025-02-19' });
const all = await client.fetch(`*[_id match "py-*" || _id match "drafts.py-*"]{_id}[0...500]`);
console.log(`id-based count: ${all.length}`);
console.log(all.slice(0, 20).map(d => d._id).join(', '));
const all2 = await client.fetch(`count(*[_id match "py-*"])`);
console.log(`count py-*: ${all2}`);
const drafts = await client.fetch(`count(*[_id match "drafts.*"])`);
console.log(`count drafts.*: ${drafts}`);
