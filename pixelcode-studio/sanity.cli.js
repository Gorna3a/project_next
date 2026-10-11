import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "vfejjthj",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  project: {
    // Built assets are prefixed so the Studio can be served under /studio
    // (see root vercel.json). Overridable via SANITY_STUDIO_BASEPATH.
    basePath: process.env.SANITY_STUDIO_BASEPATH || "/studio",
  },
  deployment: {
    // `sanity deploy` target — fill in after first deploy if needed
    // appId: "",
  },
});
