export const SITE = {
  name: "EloLin",
  domain: "elolin.com",
  url: "https://elolin.com",
  github: "https://github.com/DevEloLin",
  twitter: "https://x.com/DevEloLin",
  email: "hello@elolin.com",
  defaultLocale: "en" as const,
  locales: ["en", "zh"] as const,
  description: {
    en: "Solo developer building AI products. One person. Many products.",
    zh: "独立开发者 · 一人公司 · AI 产品",
  },
} as const;

export type Locale = (typeof SITE.locales)[number];

// ProductEntry — homepage-grade showcase data.
//   url:     real customer-facing landing URL (verified reachable)
//   tagline: short WHO+WHAT one-liner per locale · ≤ 60 char EN
//   repo:    OPTIONAL GitHub repo slug · enables "GitHub" link on /products page
//            via projects.json lookup. Omit for products without a public repo.
export type ProductEntry = {
  slug: string;
  name: string;
  url: string;
  tagline: { en: string; zh: string };
  tags: readonly string[];
  repo?: string;
  extraLinks?: readonly { label: string; href: string }[];
};

export const FLAGSHIP_PRODUCTS: readonly ProductEntry[] = [
  {
    slug: "evoclaw",
    name: "EvoClaw",
    url: "https://develolin.github.io/EvoClawSite/",
    tagline: {
      en: "Local-first self-evolving AI agent runtime.",
      zh: "本地优先 · 自我进化的 AI agent 运行时",
    },
    tags: ["Rust", "Tauri", "Local-first"],
    repo: "evoclaw",
    extraLinks: [
      { label: "Homebrew", href: "https://github.com/DevEloLin/homebrew-tap" },
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
    tags: ["TypeScript", "Supabase", "AI"],
    repo: "kinmate-site",
  },
  {
    slug: "testhive",
    name: "TestHive",
    url: "https://testhive.elolin.com",
    tagline: {
      en: "Real testers for your Google Play Closed Testing.",
      zh: "真实测试者 · 真实反馈 · 真实报告",
    },
    tags: ["Indie Dev", "Beta"],
  },
  {
    slug: "games",
    name: "EloGames",
    url: "https://games.elolin.com",
    tagline: {
      en: "Indie games · play in your browser.",
      zh: "浏览器秒玩独立游戏",
    },
    tags: ["Gaming"],
  },
  {
    slug: "mv3migrate",
    name: "mv3migrate",
    url: "https://mv3migrate.elolin.com",
    tagline: {
      en: "Chrome MV2 → MV3 migration CLI · scans, codemods, reports.",
      zh: "Chrome MV2 → MV3 迁移 CLI · 扫描 · 修补 · 报告",
    },
    tags: ["Developer Tools", "CLI"],
  },
] as const;

export const PLATFORM_SERVICES: readonly ProductEntry[] = [
  {
    slug: "accounts",
    name: "Accounts",
    url: "https://accounts.elolin.com",
    tagline: {
      en: "One sign-in for every EloLin product.",
      zh: "一次登录 · 通行所有 EloLin 产品",
    },
    tags: ["Identity", "SSO"],
  },
  {
    slug: "domains",
    name: "Domains",
    url: "https://domains.elolin.com",
    tagline: {
      en: "Sub-domain hosting, ready in 30 seconds.",
      zh: "30 秒上线你的子域名",
    },
    tags: ["Hosting"],
  },
] as const;
