# brand-work

Source assets and generation scripts for EloLin brand identity.

## Source files

- `elolin-logo-exact.svg` — SVG wrapper containing the 680×549 base64 PNG of the
  orbital symbol (logo only).
- `elolin-full-exact.svg` — SVG wrapper containing the 2048×2048 base64 PNG of
  the full lockup (symbol + "EloLin" wordmark).
- `source-logo.png` / `source-full.png` — the PNGs extracted from the two SVG
  wrappers above. These are the **production-quality source raster** used to
  generate every asset in `final/`.

## Generation scripts

- `extract-embedded.ts` — extracts the base64 PNG from the two SVG wrappers
  into `source-*.png`.
- `generate-final.ts` — strips the white background from the source PNGs,
  generates Set 1 (light/transparent) and Set 2 (tech-gradient dark) variants
  at all required sizes, and writes them to `final/`.

## Regenerate

```bash
pnpm tsx brand-work/extract-embedded.ts
pnpm tsx brand-work/generate-final.ts
```

## Output (`final/`)

Set 1 — Standard light/transparent:
- `favicon.svg`, `favicon-16.png`, `favicon-32.png`
- `apple-touch-icon.png` (180×180, white rounded square)
- `oauth-logo-512.png` (512×512, transparent — Google OAuth consent screen)
- `ios-icon-1024.png` (1024×1024, white solid square)
- `og-card-light-1200x630.png`
- `lockup-light-500.png`

Set 2 — Tech gradient (dark sci-fi):
- `favicon-dark.svg`
- `apple-touch-icon-dark.png`
- `oauth-logo-dark-512.png`
- `ios-icon-dark-1024.png`
- `og-card-dark-1200x630.png` (with white "EloLin" + tagline)
- `lockup-dark-500.png`

## Mixed-strategy usage

Per the project decision, the live elolin-site uses:

| Asset | Variant |
|---|---|
| favicon.svg / favicon-16 / favicon-32 | Set 1 (transparent) |
| apple-touch-icon | Set 2 (dark gradient) |
| og-default.png | Set 2 (dark gradient) |
| `<EloLogo>` component (loads `/symbol.png`) | Set 1 transparent symbol |

The Set 2 assets remain in `final/` for future reuse by accounts.elolin.com
and other dark-themed surfaces.
