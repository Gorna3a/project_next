import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Firebase Admin is bundle-sensitive — externalize it so Vercel doesn't
  // mis-bundle it (serverless cold-start crashes with an empty 500).
  serverExternalPackages: ["firebase-admin"],
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
