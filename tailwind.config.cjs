/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,ts,tsx,md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: { 0: "#0A0A0F", 1: "#13131A", 2: "#1C1C26", 3: "#252533" },
        fg: { 0: "#FFFFFF", 1: "#A8A8B3", 2: "#6E6E7A", 3: "#3A3A47" },
        brand: { from: "#7C3AED", to: "#3B82F6" },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        "display-1": ["80px", { lineHeight: "0.98", letterSpacing: "-0.045em" }],
        "display-2": ["56px", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "h1": ["42px", { lineHeight: "1.05",  letterSpacing: "-0.03em" }],
        "h2": ["28px", { lineHeight: "1.14", letterSpacing: "-0.025em" }],
        "h3": ["22px", { lineHeight: "1.22", letterSpacing: "-0.02em" }],
        "body-lg": ["18px", { lineHeight: "1.5" }],
        "body":    ["16px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        "caption": ["12px", { lineHeight: "1.4", letterSpacing: "0.04em" }],
      },
      boxShadow: {
        "glow-brand": "var(--glow-brand)",
        "glow-hover": "var(--glow-hover)",
        "elevation-1": "var(--elevation-1)",
        "elevation-2": "var(--elevation-2)",
      },
      backgroundImage: { "grad-brand": "var(--grad-brand)" },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        emphasize: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
