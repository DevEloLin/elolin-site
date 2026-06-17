import enCommon from "@/i18n/en/common.json";
import enHome from "@/i18n/en/home.json";
import enProducts from "@/i18n/en/products.json";
import enProjects from "@/i18n/en/projects.json";
import enAbout from "@/i18n/en/about.json";
import enContact from "@/i18n/en/contact.json";

import zhCommon from "@/i18n/zh/common.json";
import zhHome from "@/i18n/zh/home.json";
import zhProducts from "@/i18n/zh/products.json";
import zhProjects from "@/i18n/zh/projects.json";
import zhAbout from "@/i18n/zh/about.json";
import zhContact from "@/i18n/zh/contact.json";

import zhOverrides from "@/i18n/zh/project-overrides.json";

import { SITE, type Locale } from "./site";

const DICT = {
  en: { common: enCommon, home: enHome, products: enProducts,
        projects: enProjects, about: enAbout, contact: enContact },
  zh: { common: zhCommon, home: zhHome, products: zhProducts,
        projects: zhProjects, about: zhAbout, contact: zhContact },
} as const;

export type { Locale } from "./site";
export const LOCALES = SITE.locales;

function lookup(dict: any, dotted: string): string | undefined {
  return dotted.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), dict);
}

export function t(key: string, locale: Locale): string {
  const [ns, ...rest] = key.split(".");
  if (!ns || rest.length === 0) return key;
  const path = rest.join(".");
  const value =
    lookup((DICT[locale] as any)[ns], path) ??
    lookup((DICT.en as any)[ns], path);
  return typeof value === "string" ? value : key;
}

export function getLocaleFromPath(path: string): Locale {
  return path === "/zh" || path.startsWith("/zh/") ? "zh" : "en";
}

export function localizePath(path: string, locale: Locale): string {
  const stripped = path.replace(/^\/zh(\/|$)/, "/");
  if (locale === "en") return stripped;
  return stripped === "/" ? "/zh/" : `/zh${stripped}`;
}

export function projectDescription(slug: string, fallback: string, locale: Locale): string {
  if (locale === "en") return fallback;
  const zh = (zhOverrides as Record<string, string>)[slug];
  return zh ?? fallback;
}
