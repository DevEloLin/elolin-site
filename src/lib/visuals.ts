export const VISUAL_PREVIEWS: Record<string, string> = {
  evoclaw: "https://develolin.github.io/EvoClawSite/image/EvoClaw2.png",
  "kinmate-site": "https://develolin.github.io/kinmate-site/icon-512.png",
  testhive: "https://testhive.elolin.com/opengraph-image.png",
  accounts: "https://accounts.elolin.com/og-default.png",
  domains: "https://domains.elolin.com/og-default.png",
  games: "https://games.elolin.com/og-default.png",
  "mv3migrate-site": "https://elolin.com/og-default.png",
};

export function visualPreviewFor(slug: string | null | undefined): string | undefined {
  if (!slug) return undefined;
  return VISUAL_PREVIEWS[slug.toLowerCase()];
}
