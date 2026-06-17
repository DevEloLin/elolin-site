export const LANG_COLOR: Record<string, string> = {
  Rust: "#DEA584",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Python: "#3572A5",
  HTML: "#E34F26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Ruby: "#701516",
  Go: "#00ADD8",
  Astro: "#FF5D01",
};
export function langColor(lang: string | null | undefined): string {
  if (!lang) return "#6E6E7A";
  return LANG_COLOR[lang] ?? "#6E6E7A";
}
