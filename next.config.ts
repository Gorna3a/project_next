import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Firebase Admin is bundle-sensitive — externalize it so Vercel doesn't
  // mis-bundle it (serverless cold-start crashes with an empty 500).
  serverExternalPackages: ["firebase-admin"],
  // firebase-admin ships dual CJS/ESM builds. Next emits `import("firebase-admin/…")`
  // (the ESM condition), but the file trace can miss the ESM wrappers, crashing
  // the function at module load. Include them explicitly for both admin routes.
  outputFileTracingIncludes: {
    "/api/xp/award": ["./node_modules/firebase-admin/lib/esm/**/*"],
    "/api/health": ["./node_modules/firebase-admin/lib/esm/**/*"],
  },
  images: {
    // The next/image optimizer is not functional in this deployment (all
    // /_next/image URLs return 404 — platform/sharp environment issue).
    // Serve source files directly; all our assets are ≤ 13 KB.
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "clsx", "tailwind-merge"],
  },
};

export default nextConfig;
