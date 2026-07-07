import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
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
