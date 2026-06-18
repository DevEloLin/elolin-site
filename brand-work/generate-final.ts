import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const OUT = "brand-work/final";
await mkdir(OUT, { recursive: true });

// ─── 1. White → transparent ────────────────────────────────────────────
const whiteToTransparent = async (input: string, threshold = 240) => {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i] >= threshold && data[i + 1] >= threshold && data[i + 2] >= threshold) {
      data[i + 3] = 0;
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });
};

console.log("[prep] removing white background…");
const symbol = await whiteToTransparent("brand-work/source-logo.png");
const symbolBuf = await symbol.png().toBuffer();
await writeFile(`${OUT}/_symbol-transparent.png`, symbolBuf);

const full = await whiteToTransparent("brand-work/source-full.png");
const fullBuf = await full.png().toBuffer();
await writeFile(`${OUT}/_lockup-transparent.png`, fullBuf);

// Trim transparent edges so resizes don't waste padding
const symbolTrimmed = await sharp(symbolBuf).trim({ background: "#FFFFFF00", threshold: 1 }).toBuffer();
const fullTrimmed = await sharp(fullBuf).trim({ background: "#FFFFFF00", threshold: 1 }).toBuffer();

// ─── 2. Dark tech gradient background generator ───────────────────────
async function darkBg(width: number, height: number): Promise<Buffer> {
  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="base" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#0A0A0F"/>
        <stop offset="0.5" stop-color="#15102A"/>
        <stop offset="1" stop-color="#0E1726"/>
      </linearGradient>
      <radialGradient id="glow1" cx="20%" cy="20%" r="50%">
        <stop offset="0" stop-color="#7C3AED" stop-opacity="0.45"/>
        <stop offset="1" stop-color="#7C3AED" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="85%" cy="80%" r="55%">
        <stop offset="0" stop-color="#3B82F6" stop-opacity="0.35"/>
        <stop offset="1" stop-color="#3B82F6" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#base)"/>
    <rect width="${width}" height="${height}" fill="url(#glow1)"/>
    <rect width="${width}" height="${height}" fill="url(#glow2)"/>
  </svg>`;
  return new Resvg(svg).render().asPng();
}

// ─── 3. Light/white square background generator ─────────────────────────
async function lightSquare(size: number, rx = 0): Promise<Buffer> {
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${rx}" fill="#FFFFFF"/>
  </svg>`;
  return new Resvg(svg).render().asPng();
}

// ─── 4. Composite helper: bg + centered symbol ─────────────────────────
async function compose(bg: Buffer, fg: Buffer, fgPercent: number, output: string) {
  const meta = await sharp(bg).metadata();
  const W = meta.width!, H = meta.height!;
  const side = Math.min(W, H);
  const fgSize = Math.round(side * fgPercent);
  const resizedFg = await sharp(fg).resize({ width: fgSize, height: fgSize, fit: "inside" }).toBuffer();
  const fgMeta = await sharp(resizedFg).metadata();
  const left = Math.round((W - fgMeta.width!) / 2);
  const top = Math.round((H - fgMeta.height!) / 2);
  await sharp(bg)
    .composite([{ input: resizedFg, left, top }])
    .png()
    .toFile(output);
  console.log(`  wrote ${output}`);
}

// ─── 5. SET 1 — Standard (transparent / white) ─────────────────────────
console.log("[set 1] standard light/transparent");

// favicon.svg — wrap the transparent symbol as data URI
const symbolDataUri = `data:image/png;base64,${symbolBuf.toString("base64")}`;
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 549" role="img" aria-label="EloLin">
  <image href="${symbolDataUri}" width="680" height="549"/>
</svg>`;
await writeFile(`${OUT}/favicon.svg`, faviconSvg);

// Resize symbol for small favicons
await sharp(symbolTrimmed).resize(16, 16, { fit: "inside" }).png().toFile(`${OUT}/favicon-16.png`);
await sharp(symbolTrimmed).resize(32, 32, { fit: "inside" }).png().toFile(`${OUT}/favicon-32.png`);

// apple-touch-icon — 180×180 white rounded square + symbol
const appleBg = await lightSquare(180, 40);
await compose(appleBg, symbolTrimmed, 0.72, `${OUT}/apple-touch-icon.png`);

// OAuth logo — 512×512 transparent + symbol
await sharp(symbolTrimmed).resize(512, 512, { fit: "inside" }).png().toFile(`${OUT}/oauth-logo-512.png`);

// iOS icon — 1024×1024 white square + symbol
const iosBg = await lightSquare(1024, 0);
await compose(iosBg, symbolTrimmed, 0.7, `${OUT}/ios-icon-1024.png`);

// Light OG card — 1200×630 white bg with the FULL lockup centered
const lightOgBg = await sharp({
  create: { width: 1200, height: 630, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
}).png().toBuffer();
await compose(lightOgBg, fullTrimmed, 0.65, `${OUT}/og-card-light-1200x630.png`);

// Lockup-light — 500-wide horizontal
await sharp(fullTrimmed).resize({ width: 500, fit: "inside" }).png().toFile(`${OUT}/lockup-light-500.png`);

// ─── 6. SET 2 — Tech gradient (dark sci-fi) ────────────────────────────
console.log("[set 2] dark tech gradient");

// favicon-dark.svg — dark gradient + symbol (rendered as 64×64 SVG)
const darkFaviconSvg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="EloLin">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0A0A0F"/>
      <stop offset="1" stop-color="#15102A"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="12" fill="url(#base)"/>
  <image href="${symbolDataUri}" x="6" y="6" width="52" height="52"/>
</svg>`;
await writeFile(`${OUT}/favicon-dark.svg`, darkFaviconSvg);

// apple-touch-icon-dark — 180×180 dark gradient rounded + symbol
const darkApple = await sharp(
  await darkBg(180, 180),
).composite([
  {
    input: Buffer.from(
      `<svg width="180" height="180"><rect width="180" height="180" rx="40" fill="black"/></svg>`,
    ),
    blend: "dest-in",
  },
]).png().toBuffer();
await compose(darkApple, symbolTrimmed, 0.72, `${OUT}/apple-touch-icon-dark.png`);

// OAuth-dark 512×512
const oauthDarkBg = await darkBg(512, 512);
await compose(oauthDarkBg, symbolTrimmed, 0.68, `${OUT}/oauth-logo-dark-512.png`);

// iOS-dark 1024×1024
const iosDarkBg = await darkBg(1024, 1024);
await compose(iosDarkBg, symbolTrimmed, 0.7, `${OUT}/ios-icon-dark-1024.png`);

// Dark OG card 1200×630 — needs custom: dark gradient + symbol + "EloLin" white + tagline
// Use satori for text composition
const fontBold = await readFile("public/fonts/Geist-Bold.ttf");
const ogDark = await satori(
  {
    type: "div",
    props: {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 100px",
        position: "relative",
        fontFamily: "Geist",
        background: "linear-gradient(135deg, #0A0A0F 0%, #15102A 50%, #0E1726 100%)",
      },
      children: [
        // Glow blob top-left
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: -220, left: -220,
              width: 800, height: 800,
              borderRadius: 9999,
              background: "radial-gradient(circle, rgba(124,58,237,0.45) 0%, transparent 60%)",
              filter: "blur(40px)",
            },
          },
        },
        // Glow blob bottom-right
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: -200, right: -200,
              width: 700, height: 700,
              borderRadius: 9999,
              background: "radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 60%)",
              filter: "blur(40px)",
            },
          },
        },
        // Symbol + wordmark row
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: 40 },
            children: [
              { type: "img", props: { src: symbolDataUri, width: 160, height: 160, style: { display: "block" } } },
              {
                type: "div",
                props: {
                  style: { fontSize: 160, fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF", lineHeight: 1 },
                  children: "EloLin",
                },
              },
            ],
          },
        },
        // Tagline
        {
          type: "div",
          props: {
            style: {
              marginTop: 32,
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: "0.4em",
              color: "#A8A8B3",
              textTransform: "uppercase",
            },
            children: "Connect · Build · Grow",
          },
        },
      ],
    },
  },
  { width: 1200, height: 630, fonts: [{ name: "Geist", data: fontBold, weight: 700, style: "normal" }] },
);
await writeFile(`${OUT}/og-card-dark-1200x630.png`, new Resvg(ogDark).render().asPng());
console.log(`  wrote ${OUT}/og-card-dark-1200x630.png`);

// Lockup-dark 500-wide — dark gradient + symbol + white "EloLin"
const lockupDark = await satori(
  {
    type: "div",
    props: {
      style: {
        width: 500, height: 120, display: "flex", alignItems: "center", padding: "0 24px",
        fontFamily: "Geist",
        background: "linear-gradient(135deg, #0A0A0F 0%, #15102A 100%)",
      },
      children: [
        { type: "img", props: { src: symbolDataUri, width: 80, height: 80, style: { display: "block" } } },
        {
          type: "div",
          props: {
            style: { fontSize: 64, fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF", marginLeft: 20 },
            children: "EloLin",
          },
        },
      ],
    },
  },
  { width: 500, height: 120, fonts: [{ name: "Geist", data: fontBold, weight: 700, style: "normal" }] },
);
await writeFile(`${OUT}/lockup-dark-500.png`, new Resvg(lockupDark).render().asPng());
console.log(`  wrote ${OUT}/lockup-dark-500.png`);

console.log("\n✓ all 14 assets written to brand-work/final/");
