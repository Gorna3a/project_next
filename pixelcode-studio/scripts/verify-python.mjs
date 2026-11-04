import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });

async function main() {
  const drafts = await client.fetch('*[_id in path("drafts.**")]{_id}', {}, { perspective: 'raw' });
  const pythonDocs = await client.fetch(
    '*[_type in ["course","module","lesson"] && (contentId match "py-*" || contentId == "python-programming")]{_id, _type, title, status}',
    {},
    { perspective: 'published' }
  );
  const jsDocs = await client.fetch(
    '*[_type in ["course","module","lesson"] && contentId != null && !(contentId match "py-*") && contentId != "python-programming"]{_id, status}',
    {},
    { perspective: 'published' }
  );
  console.log('all drafts:', drafts.length);
  console.log('python docs:', pythonDocs.length, 'published:', pythonDocs.filter((d) => d.status === 'published').length);
  console.log('js docs:', jsDocs.length, 'published:', jsDocs.filter((d) => d.status === 'published').length);
  console.log('python modules:', pythonDocs.filter((d) => d._type === 'module').map((d) => d.title).join(' | '));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
