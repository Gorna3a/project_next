// Serves the Nodepod service worker from our own origin (browsers refuse to
// register a service worker that lives in node_modules). We prepend a small
// patch so the worker no longer logs a benign unhandled rejection.
//
// Why: the SW is registered with scope "/" and therefore intercepts *every*
// fetch on the origin, including the main IDE page's subresources. Its
// pass-through `return fetch(request)` re-issues each one; when a subresource
// is CORS/COEP-blocked (e.g. a third-party library's cross-origin request the
// app already handles), the promise handed to event.respondWith() rejects and
// the worker logs "Uncaught (in promise) TypeError: Failed to fetch". The app
// keeps working — only the worker's rejection was unhandled. The suppressor
// below swallows that specific noise.
//
// Note: this lives in a folder named `sw.js`, NOT `__sw__.js`, because Next's
// App Router treats any segment starting with `_` as a private folder and
// excludes it from routing. next.config.ts rewrites the hardcoded /__sw__.js
// (which Nodepod registers at) onto this route.
import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

const SW_CANDIDATES = [
  "node_modules/@scelar/nodepod/dist/__sw__.js",
  "node_modules/@scelar/nodepod/static/__sw__.js",
];

const PATCH =
  "self.addEventListener('unhandledrejection', (e) => { e.preventDefault(); });\n";

let cached: Promise<string> | null = null;
function loadSwSource(): Promise<string> {
  if (!cached) {
    cached = (async () => {
      let lastErr: unknown;
      for (const rel of SW_CANDIDATES) {
        try {
          return await readFile(rel, "utf8");
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr;
    })();
  }
  return cached;
}

export async function GET() {
  const source = await loadSwSource();
  return new NextResponse(PATCH + source, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-cache",
    },
  });
}
