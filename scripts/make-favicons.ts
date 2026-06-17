import { readFile, writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

const svg = await readFile("public/favicon.svg", "utf-8");
const sizes: Array<[string, number]> = [
  ["public/favicon-16.png", 16],
  ["public/favicon-32.png", 32],
  ["public/apple-touch-icon.png", 180],
];
for (const [out, size] of sizes) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size } })
    .render().asPng();
  await writeFile(out, png);
  console.log(`wrote ${out}`);
}
