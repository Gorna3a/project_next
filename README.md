# PixelCode

An in-browser coding platform — a Next.js web app that lets users write, run, and learn
code (JavaScript/Node.js and Python) directly in the browser, with AI tutoring, courses,
and a fully hosted project workspace.

PixelCode ships a **complete in-app IDE** running entirely client-side:

- **Node.js runtime** via [Nodepod](https://www.npmjs.com/package/@scelar/nodepod) — a
  browser-based, sandboxed Node environment (MIT-licensed) powered by a service worker.
- **Python runtime** via [Pyodide](https://pyodide.org) — in-browser WebAssembly Python.
- **Terminals** via `@xterm/xterm` + `@xterm/addon-fit`, attached to live Nodepod processes.
- **Code editing** via the Monaco editor (`@monaco-editor/react`).

## Features

- 🧠 **AI tutor** powered by Google's Gemini (`@google/generative-ai`).
- 📚 **Course/content platform** backed by Sanity CMS (`@sanity/client`, Portable Text).
- 🔐 **Authentication** with email/password, Google, and GitHub (Firebase Auth).
- 🎨 **Theming** — classic / neo / minimal themes with a PixelCode design-token system,
  dark mode, RTL support, and full localization.
- 🖥️ **In-app IDE** with file tree, code editor, integrated terminals, and a live preview
  iframe that renders the running Node server.

## Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | Next.js 15 (App Router), React 19, TypeScript           |
| IDE runtime  | `@scelar/nodepod` (Node), Pyodide (Python), xterm       |
| Editor       | Monaco (`@monaco-editor/react`)                         |
| Auth         | Firebase Auth + Firestore                               |
| AI           | Google Generative AI (Gemini)                           |
| CMS          | Sanity (`@sanity/client`, `@portabletext/react`, GROQ) |
| Styling      | Tailwind CSS 3 + `clsx` / `tailwind-merge`              |
| Animation    | Framer Motion                                           |
| Lint/Format  | ESLint 10 + TypeScript ESLint                           |

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project (for auth + Firestore)
- (Optional) Sanity project + Gemini API key for CMS/AI features

### Install

```bash
npm install
```

### Environment

Create a `.env.local` file in the project root with your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Additional variables for Sanity / Gemini follow the same `NEXT_PUBLIC_*` convention.

### Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The in-app IDE lives under
`/app/ide`.

### Build & Run

```bash
npm run build
npm run start
```

## How the in-app IDE works

The IDE runs a real Node.js environment **inside the browser** using Nodepod. Nodepod
installs a service worker that proxies network requests for the sandboxed preview, which
requires cross-origin isolation:

- `next.config.ts` serves the Nodepod service worker at `/sw.js` and rewrites the
  hardcoded `/__sw__.js` path onto it (Next.js excludes `_`-prefixed route segments).
- `Cross-Origin-Opener-Policy: same-origin` and
  `Cross-Origin-Embedder-Policy: credentialless` are applied to `/app/ide/*`.

> Because the page is cross-origin isolated, Firebase **OAuth popups**
> (`signInWithPopup`) cannot read the provider window. PixelCode therefore falls back to
> the **redirect** OAuth flow (`signInWithRedirect`) whenever `window.crossOriginIsolated`
> is true, keeping Google/GitHub sign-in working inside the IDE.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Next.js dev server         |
| `npm run build`   | Production build                     |
| `npm run start`   | Run the production build             |
| `npm run lint`    | Lint with ESLint                     |

## Project Structure

```
src/
  app/                    Next.js App Router pages (incl. /app/ide, /login, /signup)
  core/context/          React contexts (Auth, theme, i18n)
  platform/pages/        Feature pages (IDE, Auth, courses, ...)
    IDE/                  Nodepod boot, Pyodide, Monaco editor, terminal, preview
  firebase/              Firebase client initialization
app/sw.js/route.ts       Nodepod service worker endpoint
next.config.ts           Webpack + COOP/COEP + SW rewrite configuration
```

## License

See repository settings for license details.
