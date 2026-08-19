// Serves the Nodepod service worker from our own origin (browsers refuse to
// register a service worker that lives in node_modules). Nodepod registers it
// at /sw.js to route preview iframes and virtual HTTP servers.
//
// Note: this lives in a folder named `sw.js`, NOT `__sw__.js`, because Next's
// App Router treats any segment starting with `_` as a private folder and
// excludes it from routing. use-nodepod.ts passes `swUrl: "/sw.js"` to match.
export { GET } from "@scelar/nodepod/next";
