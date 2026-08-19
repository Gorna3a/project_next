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
      // Nodepod hardcodes `navigator.serviceWorker.register("/__sw__.js")` and
      // does not honor the `swUrl` boot option in this version. Next's App
      // Router excludes `_`-prefixed segments, so we serve the SW at /sw.js
      // and rewrite the hardcoded path onto it.
      { source: "/__sw__.js", destination: "/sw.js" },
    ];
  },
  async headers() {
    return [
      {
        // The in-browser IDE (Nodepod) needs cross-origin isolation for its
        // SharedArrayBuffer-backed runtime, plus the same headers for preview
        // iframes. Applied only to the IDE route.
        source: "/app/ide/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
  webpack(config, { isServer, webpack }) {
    // Next.js sets a global `module.generator.asset.filename`, which webpack
    // merges into every asset rule — including `asset/inline`. Nodepod ships an
    // inlined asset, so its schema validation trips ("generator has an unknown
    // property 'filename'"). Remap the generator to the type-specific keys.
    if (config.module.generator?.asset?.filename) {
      config.module.generator["asset/resource"] = config.module.generator.asset;
      config.module.generator["asset/source"] = config.module.generator.asset;
      delete config.module.generator.asset;
    }

    // Nodepod's bundle has guarded dynamic `import("node:...")` calls for its
    // headless Node/Bun fallback. They are never reached in the browser, but
    // webpack rejects the `node:` scheme before resolution. Strip the prefix so
    // Next's own `resolve.fallback` resolves fs/module/process to empty
    // modules. Client compiler only — the server build needs the real Node
    // builtins (the SW route uses node:fs/promises).
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        })
      );
      // Next's client fallback map has no `fs`/`module` entries, so the stripped
      // imports still fail to resolve. Stub them as empty modules (the guarded
      // headless fallbacks never actually run in the browser).
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      };
    }

    // Nodepod ships its runtime as one giant embedded string, so webpack's
    // PackFileCacheStrategy logs a benign "Serializing big strings" warning via
    // its infrastructure logger on every rebuild. It's not a compilation
    // warning (ignoreWarnings can't reach it) — raising the infrastructure
    // logging level silences it.
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: "error",
    };

    return config;
  },
};

export default nextConfig;
