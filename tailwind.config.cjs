/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,ts,tsx,md,mdx}"],
  darkMode: "class",
  theme: { extend: {} },
  plugins: [require("@tailwindcss/typography")],
};
