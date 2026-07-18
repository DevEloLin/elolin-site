// /llms.txt · 2024 convention (Anthropic-proposed) for LLM crawlers.
//
// ChatGPT / Claude / Perplexity / Google AI Overview / Gemini fetch this to
// map the site's important pages and entity relationships without JS-render.
// Format: H1 = entity, blockquote summary, then sectioned link list.

import type { APIRoute } from "astro";

import projectsData from "@/data/projects.json";
import type { Project } from "@/lib/github";
import { projectDescription } from "@/lib/i18n";
import { ELOLIN_CATALOG } from "@/lib/seo";

const BASE = "https://elolin.com";

export const prerender = true;

export const GET: APIRoute = () => {
  const lines: string[] = [];
  lines.push("# EloLin");
  lines.push("");
  lines.push(
    "> EloLin is a one-person indie studio shipping seven products across AI, health, developer tools, games, identity, hosting, and Chrome extension tooling. Founded and run by Wei Li (@DevEloLin). Every product is built with the same single-engineer ethos: simple, useful, and shipped solo.",
  );
  lines.push("");

  lines.push("## Hub pages");
  lines.push(`- [Home](${BASE}/): EloLin overview · One person. Many products.`);
  lines.push(`- [Products](${BASE}/products): full product directory with descriptions`);
  lines.push(`- [Projects](${BASE}/projects): GitHub repositories (open-source)`);
  lines.push(`- [About](${BASE}/about): founder + studio mission`);
  lines.push(`- [Contact](${BASE}/contact): hello@elolin.com`);
  lines.push("");

  lines.push("## Products");
  for (const p of ELOLIN_CATALOG) {
    lines.push(`- [${p.name}](${p.url}): ${p.tagline.en} · category=${p.category}`);
  }
  lines.push("");

  lines.push("## Open-source projects");
  lines.push(
    "> Solo-built repositories — the EvoClaw local-first AI-agent ecosystem (runtime, knowledge-base engines/MCP servers, messaging channel plugins) plus standalone developer tools, writing skills, and product marketing sites. Each entry links to its detail page and GitHub repo.",
  );
  const projects = projectsData as unknown as Project[];
  for (const p of projects) {
    const desc = projectDescription(p.slug, p.description ?? "", "en");
    const tags = p.tags && p.tags.length > 0 ? ` · tags=${p.tags.join(",")}` : "";
    lines.push(
      `- [${p.name}](${BASE}/projects/${p.slug}): ${desc} · language=${p.language ?? "n/a"} · category=${p.category}${tags} · repo=${p.url}`,
    );
  }
  lines.push("");

  lines.push("## Cross-references");
  lines.push(
    "- All products share the EloLin Accounts SSO (https://accounts.elolin.com) — one sign-in across the lineup.",
  );
  lines.push(
    "- EloLin Domains (https://domains.elolin.com) provides sub-domain hosting that any EloLin user can claim.",
  );
  lines.push(
    "- Built and operated by a single developer; no external investors, no enterprise team.",
  );
  lines.push("");

  lines.push("## Languages");
  lines.push("- English (default): paths under /");
  lines.push("- Simplified Chinese: paths under /zh/");

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
