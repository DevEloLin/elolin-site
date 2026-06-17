import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://elolin.com",
  integrations: [tailwind({ applyBaseStyles: false }), sitemap()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    routing: { prefixDefaultLocale: false },
  },
  build: { format: "directory" },
  vite: { ssr: { noExternal: ["clsx", "tailwind-merge"] } },
});
