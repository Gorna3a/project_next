import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });

async function main() {
  const refs = await client.fetch(
    '*[_id in path("drafts.**") && (contentId match "py-*" || contentId == "python-programming")]{_id}',
    {},
    { perspective: 'raw' }
  );
  console.log('python drafts found:', refs.length);
  if (refs.length === 0) return;

  const drafts = [];
  for (const ref of refs) {
    const doc = await client.getDocument(ref._id);
    if (doc) drafts.push(doc);
  }

  const tx = client.transaction();
  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, '');
    const { _id, _rev, _updatedAt, ...rest } = draft;
    tx.createOrReplace({ ...rest, _id: publishedId, status: 'published' });
    tx.delete(draft._id);
  }

  const result = await tx.commit({ visibility: 'async' });
  console.log('published operations:', result.results.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
