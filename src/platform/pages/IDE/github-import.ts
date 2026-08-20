import type { FileKind, ProjectFile, ProjectType } from "./types";
import { detectProjectType } from "./types";

export const fileKindFromName = (name: string): FileKind => {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : "";
  if (ext === ".html") return "html";
  if (ext === ".css") return "css";
  if (ext === ".js" || ext === ".mjs" || ext === ".cjs") return "js";
  if (ext === ".ts" || ext === ".tsx") return "ts";
  if (ext === ".json") return "json";
  if (ext === ".md") return "md";
  if (ext === ".py") return "py";
  return "js";
};

export interface ImportResult {
  files: ProjectFile[];
  name: string;
  projectType: ProjectType;
}

const parseRepo = (
  input: string,
): { owner: string; repo: string; branch?: string } | null => {
  let s = input.trim();
  s = s
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/^git@github\.com:/, "")
    .replace(/\.git$/, "");
  const m = s.match(/^([^/\s]+)\/([^/\s]+)(?:\/tree\/([^/\s]+))?/);
  if (!m) return null;
  return { owner: m[1], repo: m[2], branch: m[3] };
};

const BINARY_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".woff", ".woff2", ".ttf",
  ".eot", ".mp4", ".webm", ".mp3", ".zip", ".pdf", ".bin", ".exe",
]);
const IGNORED_DIRS = /^(node_modules|\.git|dist|build|\.next|coverage)\//;
const MAX_FILE = 400_000; // bytes

export async function importGithubRepo(
  input: string,
  token?: string | null,
): Promise<ImportResult> {
  const repo = parseRepo(input);
  if (!repo)
    throw new Error(
      "Could not parse the repository. Use owner/repo or a full GitHub URL.",
    );

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const repoRes = await fetch(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}`,
    { headers },
  );
  if (repoRes.status === 404)
    throw new Error("Repository not found (check the name and your access).");
  if (repoRes.status === 403)
    throw new Error(
      "GitHub API rate limit reached. Sign in with GitHub and try again.",
    );
  if (!repoRes.ok) throw new Error(`GitHub error ${repoRes.status}.`);
  const repoData = await repoRes.json();
  const branch = repo.branch || repoData.default_branch || "main";

  const treeRes = await fetch(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}/git/trees/${branch}?recursive=1`,
    { headers },
  );
  if (!treeRes.ok) throw new Error("Could not read the repository file tree.");
  const treeData = await treeRes.json();
  const entries = (treeData.tree || []).filter(
    (e: { type: string }) => e.type === "blob",
  );

  const files: ProjectFile[] = [];
  for (const entry of entries as { path: string; size?: number }[]) {
    const path = entry.path;
    const lower = path.toLowerCase();
    const ext = lower.slice(lower.lastIndexOf("."));
    if (BINARY_EXT.has(ext)) continue;
    if (IGNORED_DIRS.test(path)) continue;
    if ((entry.size ?? 0) > MAX_FILE) continue;

    const raw = await fetch(
      `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${path}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {},
    );
    if (!raw.ok) continue;
    const content = await raw.text();
    const parent = path.includes("/")
      ? path.slice(0, path.lastIndexOf("/"))
      : undefined;
    files.push({
      id: path,
      name: path.slice(path.lastIndexOf("/") + 1),
      kind: fileKindFromName(path),
      content,
      parent,
    });
  }

  if (!files.length)
    throw new Error("No readable text files were found in this repository.");
  return { files, name: repo.repo, projectType: detectProjectType(files) };
}
