/**
 * Canonical EloLin SEO building blocks · used by Layout.astro + per-page JsonLd.
 *
 * One source of truth for:
 *   1. Organization (entity identity · sitewide)
 *   2. Product catalog (every EloLin site references this)
 *   3. Schema.org JSON-LD builders
 *
 * Sister sites (accounts / domains / games / testhive) embed structurally
 * identical Organization + SoftwareApplication snippets so Google merges
 * the entity graph cleanly across subdomains.
 */

import { SITE, type Locale } from "./site";

export const ELOLIN_GITHUB = "https://github.com/DevEloLin";
export const ELOLIN_TWITTER = "https://x.com/DevEloLin";
export const ELOLIN_LOGO = "https://elolin.com/og-default.png";

export type ProductCategory =
  | "AI"
  | "Health"
  | "Developer Tools"
  | "Games"
  | "Identity"
  | "Hosting";

export type ProductSpec = {
  slug: string;
  name: string;
  url: string;
  tagline: { en: string; zh: string };
  category: ProductCategory;
  applicationCategory: string;
  operatingSystem: string;
  keywords: string[];
};

// Canonical product catalog · same shape used across every EloLin site.
// Keep IN SYNC with FLAGSHIP_PRODUCTS + PLATFORM_SERVICES in site.ts (which
// drives the homepage cards) — this version adds Schema.org-specific fields.
export const ELOLIN_CATALOG: readonly ProductSpec[] = [
  {
    slug: "evoclaw",
    name: "EvoClaw",
    url: "https://develolin.github.io/EvoClawSite/",
    tagline: {
      en: "Local-first self-evolving AI agent runtime.",
      zh: "本地优先 · 自我进化的 AI agent 运行时",
    },
    category: "AI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    keywords: [
      "local-first AI",
      "AI agent runtime",
      "self-evolving agent",
      "Rust Tauri AI",
      "offline LLM agent",
    ],
  },
  {
    slug: "kinmate",
    name: "KinMate",
    url: "https://kinmate.elolin.com",
    tagline: {
      en: "Private family health vault with AI explanations.",
      zh: "私密的家庭健康保险库 · AI 解读报告",
    },
    category: "Health",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web, iOS, Android",
    keywords: [
      "family health app",
      "private health vault",
      "AI medical report",
      "medication reminder",
      "care check-in",
    ],
  },
  {
    slug: "testhive",
    name: "TestHive",
    url: "https://testhive.elolin.com",
    tagline: {
      en: "Real testers for your Google Play Closed Testing.",
      zh: "真实测试者 · 真实反馈 · 真实报告",
    },
    category: "Developer Tools",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    keywords: [
      "Google Play Closed Testing",
      "beta tester marketplace",
      "real testers",
      "12 testers 14 days",
      "indie Android dev",
    ],
  },
  {
    slug: "games",
    name: "EloGames",
    url: "https://games.elolin.com",
    tagline: {
      en: "Indie games · play instantly in your browser.",
      zh: "浏览器秒玩独立游戏 · 无需下载",
    },
    category: "Games",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    keywords: [
      "browser games",
      "play instantly",
      "indie games online",
      "no download games",
      "casual games",
    ],
  },
  {
    slug: "accounts",
    name: "Accounts",
    url: "https://accounts.elolin.com",
    tagline: {
      en: "One sign-in for every EloLin product.",
      zh: "一次登录 · 通行所有 EloLin 产品",
    },
    category: "Identity",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    keywords: [
      "EloLin SSO",
      "single sign-on",
      "unified account",
      "OAuth identity",
    ],
  },
  {
    slug: "domains",
    name: "Domains",
    url: "https://domains.elolin.com",
    tagline: {
      en: "Free sub-domain hosting · ready in 30 seconds.",
      zh: "30 秒上线你的子域名 · 完全免费",
    },
    category: "Hosting",
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    keywords: [
      "free subdomain",
      "sub-domain hosting",
      "instant DNS",
      "custom subdomain",
      "free hosting",
    ],
  },
  {
    slug: "mv3migrate",
    name: "mv3migrate",
    url: "https://mv3migrate.elolin.com",
    tagline: {
      en: "Chrome MV2 → MV3 migration CLI · scans, codemods, reports.",
      zh: "Chrome MV2 → MV3 迁移 CLI · 扫描 · 修补 · 报告",
    },
    category: "Developer Tools",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows",
    keywords: [
      "Chrome MV3 migration",
      "Manifest V3 codemod",
      "Chrome extension migration",
      "MV2 to MV3 CLI",
      "Chrome extension tooling",
    ],
  },
] as const;

// ─── Schema.org builders ────────────────────────────────────────────────

export function organization(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://elolin.com/#org",
    name: SITE.name,
    url: SITE.url,
    logo: ELOLIN_LOGO,
    sameAs: [ELOLIN_GITHUB, ELOLIN_TWITTER],
    description: SITE.description.en,
    founder: {
      "@type": "Person",
      "@id": "https://elolin.com/about#person",
      name: "Wei Li",
      url: "https://elolin.com/about",
    },
    brand: { "@type": "Brand", name: SITE.name },
  };
}

export function website(locale: Locale): Record<string, unknown> {
  const prefix = locale === "zh" ? "/zh" : "";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `https://elolin.com${prefix}#website`,
    url: `${SITE.url}${prefix}/`,
    name: SITE.name,
    description: SITE.description[locale],
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    publisher: { "@id": "https://elolin.com/#org" },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}${prefix}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplication(
  product: ProductSpec,
  locale: Locale,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    url: product.url,
    description: product.tagline[locale],
    applicationCategory: product.applicationCategory,
    operatingSystem: product.operatingSystem,
    publisher: { "@id": "https://elolin.com/#org" },
    keywords: product.keywords.join(", "),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function productItemList(
  products: readonly ProductSpec[],
  locale: Locale,
  baseUrl: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "zh" ? "EloLin 产品矩阵" : "EloLin Products",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: p.url,
      name: p.name,
      description: p.tagline[locale],
    })),
    isPartOf: { "@id": `${baseUrl}#website` },
  };
}

export function breadcrumb(
  items: readonly { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function howTo(
  name: string,
  description: string,
  steps: readonly { name: string; text: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function faqPage(
  qa: readonly { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
