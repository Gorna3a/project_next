import { createClient } from "@sanity/client";
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "vfejjthj";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN || process.env.SANITY_AUTH_TOKEN;
const client = createClient({ projectId, dataset, apiVersion: "2025-02-19", useCdn: false, token });
const all = await client.fetch(`* { _id, contentId, _type, status, title }`);
console.log(`all=${all.length}`);
const drafts = all.filter((d) => d._id.startsWith("drafts."));
console.log(`drafts=${drafts.length}`);
const pyAll = all.filter((d) => (d.contentId && d.contentId.startsWith("py-")) || d.contentId === "python-programming");
console.log(`pyDocs=${pyAll.length}`);
const pyPub = pyAll.filter((d) => !d._id.startsWith("drafts."));
console.log(`pyPublished=${pyPub.length}`);
const jsAll = all.filter((d) => d.contentId && !d.contentId.startsWith("py-") && d.contentId !== "python-programming");
console.log(`jsDocs=${jsAll.length}`);
const jsPub = jsAll.filter((d) => d._id && !d._id.startsWith("drafts."));
console.log(`jsPublished=${jsPub.length}`);
const mods = pyAll.filter((d) => d._type === "module").map((d) => `- ${d.title}`);
console.log("--- py modules ---");
for (const m of mods) console.log(m);
console.log("--- m16 check ---");
for (const d of pyAll) {
  const hay = `${d._id} ${d.contentId} ${d.title}`;
  if (hay.includes("typing") || hay.includes("Typing")) console.log(`${d._id} | ${d.contentId} | ${d._type} | ${d.status} | ${d.title}`);
}
