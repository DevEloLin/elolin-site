import { writeFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0"/></filter>
  <rect width="128" height="128" filter="url(#n)" opacity="1"/>
</svg>`;
const png = new Resvg(svg).render().asPng();
await writeFile("public/noise.png", png);
console.log("wrote public/noise.png");
