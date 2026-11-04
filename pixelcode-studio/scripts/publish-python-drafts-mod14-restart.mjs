// Publish every Python draft: copy drafts.<id> to <id> with status published, delete draft.
// Uses --missing semantics: already-published Python docs are left in place (never deleted),
// and every Python draft present is published, not only newly added ones.
// Run: npx sanity exec scripts/publish-python-drafts-mod14-restart.mjs --with-user-token
import { getCliClient } from '@sanity/cli';

const client = getCliClient({ apiVersion: '2025-02-19' });

async function fetchAll() {
  const all = await client.fetch(
    `*[_id in ["python-programming", "drafts.python-programming"] || contentId match "py-*" || contentId == "python-programming"]{_id, contentId, title, status}`
  );
  return all;
}

const docs = await fetchAll();
// Only act on drafts
const draftDocs = docs.filter((d) => d._id.startsWith('drafts.'));
console.log(`Found ${draftDocs.length} Python draft documents`);

for (const draft of draftDocs) {
  const publishedId = draft._id.replace(/^drafts\./, '');
  const full = await client.getDocument(draft._id);
  if (!full) continue;
  const { _id, _rev, ...rest } = full;
  const pubDoc = { ...rest, _id: publishedId };
  if (!pubDoc.status || pubDoc.status === 'draft') pubDoc.status = 'published';
  await client.createOrReplace(pubDoc);
  console.log(`Published ${publishedId} (${pubDoc.title || ''})`);
}

if (draftDocs.length) {
  const deleteIds = draftDocs.map((d) => d._id);
  await client.delete({ query: `*[_id in $ids]`, params: { ids: deleteIds } });
  console.log(`Deleted ${deleteIds.length} drafts`);
} else {
  console.log('No drafts to publish');
}

// Verify counts
const all2 = await fetchAll();
const published = all2.filter((d) => !d._id.startsWith('drafts.'));
console.log(`Python docs: ${all2.length} total, ${published.length} published`);
