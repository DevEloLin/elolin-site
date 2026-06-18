import { readFile, writeFile } from "node:fs/promises";

const sources = [
  ["brand-work/elolin-logo-exact.svg", "brand-work/source-logo.png"],
  ["brand-work/elolin-full-exact.svg", "brand-work/source-full.png"],
] as const;

for (const [svgPath, pngPath] of sources) {
  const svg = await readFile(svgPath, "utf-8");
  const m = svg.match(/href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/);
  if (!m) {
    console.error(`No embedded PNG in ${svgPath}`);
    continue;
  }
  const buf = Buffer.from(m[1], "base64");
  await writeFile(pngPath, buf);
  console.log(`extracted ${pngPath} (${(buf.length / 1024).toFixed(1)} KB)`);
}
