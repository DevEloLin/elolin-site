import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { GhRepoRawSchema, sanitizeRepo, type GhRepoRaw, type Project } from "../src/lib/github";

const GH_USER = "DevEloLin";
const API = `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`;
const OUT = resolve(process.cwd(), "src/data/projects.json");

export function filterReposForSite(rs: GhRepoRaw[]): GhRepoRaw[] {
  return rs
    .filter((r) => r.name !== "DevEloLin")
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => {
      const ta = new Date(a.pushed_at).getTime();
      const tb = new Date(b.pushed_at).getTime();
      if (tb !== ta) return tb - ta;
      return b.stargazers_count - a.stargazers_count;
    });
}

/* v8 ignore start */
async function fetchGitHub(): Promise<GhRepoRaw[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    "User-Agent": "elolin-site-build",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API, { headers, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`);
  const raw = (await res.json()) as unknown[];
  return raw.map((r) => GhRepoRawSchema.parse(r));
}

async function loadFallback(): Promise<Project[] | null> {
  try {
    const txt = await readFile(OUT, "utf-8");
    return JSON.parse(txt) as Project[];
  } catch {
    return null;
  }
}

async function main() {
  console.log(`[fetch-github] fetching ${GH_USER} repos…`);
  let projects: Project[];
  try {
    const raw = await fetchGitHub();
    const filtered = filterReposForSite(raw);
    projects = filtered.map(sanitizeRepo);
    console.log(`[fetch-github] ok: ${projects.length} repos`);
  } catch (err) {
    const fb = await loadFallback();
    if (!fb) {
      console.error(`[fetch-github] live fetch failed AND no fallback present`);
      throw err;
    }
    console.warn(`[fetch-github] WARN live fetch failed (${(err as Error).message}); using fallback`);
    projects = fb;
  }
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(projects, null, 2) + "\n", "utf-8");
  console.log(`[fetch-github] wrote ${OUT}`);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
/* v8 ignore stop */
