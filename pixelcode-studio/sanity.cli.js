import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "vfejjthj",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  deployment: {
    // `sanity deploy` target — fill in after first deploy if needed
    // appId: "",
  },
});
