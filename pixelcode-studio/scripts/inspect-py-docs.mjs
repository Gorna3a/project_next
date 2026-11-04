import { getCliClient } from '@sanity/cli';
const client = getCliClient({ apiVersion: '2025-02-19' });
const py = await client.fetch(`*[_id match "py-*" || contentId match "py-*"]{_id, contentId, title, status}[0...5]`);
console.log(JSON.stringify(py, null, 2));
const count = await client.fetch(`count(*[_id match "py-*" || contentId match "py-*"])`);
console.log(`count: ${count}`);
const course = await client.fetch(`*[_id == "python-programming"]{_id, contentId, title}`);
console.log(JSON.stringify(course, null, 2));
