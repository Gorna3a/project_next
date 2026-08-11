import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        // The in-browser IDE (WebContainer) needs cross-origin isolation so the
        // shared-memory Node.js runtime can boot. Applied only to the IDE route.
        source: "/app/ide/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/judge0/:path*",
        destination: "https://ce.judge0.com/:path*",
      },
    ];
  },
};

export default nextConfig;
