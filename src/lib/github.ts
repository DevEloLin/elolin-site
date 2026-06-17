import { z } from "zod";

export const Category = z.enum(["product", "skill", "site", "tool"]);
export type Category = z.infer<typeof Category>;

export const GhRepoRawSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  fork: z.boolean(),
  archived: z.boolean(),
  topics: z.array(z.string()).default([]),
  homepage: z.string().nullable().optional(),
  html_url: z.string(),
  pushed_at: z.string(),
  owner: z.object({
    login: z.string(),
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
  }),
});
export type GhRepoRaw = z.infer<typeof GhRepoRawSchema>;

export const ProjectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  language: z.string().nullable(),
  stars: z.number(),
  homepage: z.string().nullable(),
  url: z.string(),
  pushedAt: z.string(),
  category: Category,
  tags: z.array(z.string()),
  owner: z.object({ login: z.string() }),
});
export type Project = z.infer<typeof ProjectSchema>;

const PRODUCT_NAMES = /^(evoclaw|kinmate)(-|$)/i;
const AI_TOPICS = new Set(["ai", "agent", "llm", "mcp", "genai"]);
const AI_NAME_RE = /(evoclaw|kinmate|-mcp$)/i;

export function categorize(r: Pick<GhRepoRaw, "name" | "topics">): Category {
  for (const t of r.topics) {
    if (t === "product" || t === "skill" || t === "site" || t === "tool") return t;
  }
  if (PRODUCT_NAMES.test(r.name)) return "product";
  if (/^skill-/i.test(r.name) || /-mcp$/i.test(r.name)) return "skill";
  if (/-site$/i.test(r.name) || /^.*site$/i.test(r.name)) return "site";
  return "tool";
}

export function hasAiTag(r: Pick<GhRepoRaw, "name" | "topics">): boolean {
  if (r.topics.some((t) => AI_TOPICS.has(t.toLowerCase()))) return true;
  if (AI_NAME_RE.test(r.name)) return true;
  return false;
}

export function sanitizeRepo(r: GhRepoRaw): Project {
  const cat = categorize(r);
  const tags: string[] = [];
  if (hasAiTag(r)) tags.push("ai");
  return {
    id: r.id,
    slug: r.name.toLowerCase(),
    name: r.name,
    description: r.description ?? "",
    language: r.language ?? null,
    stars: r.stargazers_count,
    homepage: r.homepage && r.homepage.length > 0 ? r.homepage : null,
    url: r.html_url,
    pushedAt: r.pushed_at,
    category: cat,
    tags,
    owner: { login: r.owner.login },
  };
}
