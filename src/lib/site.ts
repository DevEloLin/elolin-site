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
