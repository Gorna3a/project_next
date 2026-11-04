import { getCliClient } from '@sanity/cli';
const client = getCliClient({ apiVersion: '2025-02-19' });
const all = await client.fetch(`*[_id match "py-*" || contentId match "py-*"]{_id, contentId, title}[0...500]`);
const ids = all.map(d => d.contentId).sort();
console.log(ids.join('\n'));
console.log(`---total ${ids.length}`);
console.log(`has py-mod-14: ${ids.includes('py-mod-14-data-structures')}`);
console.log(`has py-les-arrays: ${ids.includes('py-les-arrays-and-linked-lists')}`);
