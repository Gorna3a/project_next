import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "vfejjthj";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN || process.env.SANITY_AUTH_TOKEN;

const client = createClient({ projectId, dataset, apiVersion: "2025-02-19", useCdn: false, token });
const drafts = await client.fetch(
  `*[_id in path("drafts.**") && (contentId match "py-*" || contentId == "python-programming")] { _id, contentId, title, status }`
);
console.log(`drafts=${drafts.length}`);
for (const d of drafts) {
  const pubId = d._id.replace(/^drafts\./, "");
  const {_id, ...rest} = d;
  await client.createOrReplace({...rest, _id: pubId, status: "published"});
  await client.delete(d._id);
  console.log(`published ${pubId}`);
}
console.log("published drafts");
