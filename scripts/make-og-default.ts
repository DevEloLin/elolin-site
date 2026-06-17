import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile } from "node:fs/promises";

const fontReg = await readFile("public/fonts/Geist-Bold.ttf");
const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        width: 1200, height: 630, display: "flex",
        background: "#0A0A0F", color: "#FFFFFF",
        flexDirection: "column", justifyContent: "center", padding: 80,
        fontFamily: "Geist",
      },
      children: [
        { type: "div", props: {
          style: { fontSize: 96, fontWeight: 700, lineHeight: 1.05,
                   background: "linear-gradient(135deg,#7C3AED,#3B82F6)",
                   WebkitBackgroundClip: "text", color: "transparent" },
          children: "One person. Many products." }},
        { type: "div", props: {
          style: { fontSize: 36, color: "#A8A8B3", marginTop: 24 },
          children: "elolin.com" }},
      ],
    },
  },
  { width: 1200, height: 630,
    fonts: [{ name: "Geist", data: fontReg, weight: 700, style: "normal" }] },
);
const png = new Resvg(svg).render().asPng();
await writeFile("public/og-default.png", png);
console.log("wrote public/og-default.png");
