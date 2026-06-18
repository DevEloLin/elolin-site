# elolin-site

`elolin.com` — personal brand hub for EloLin.

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

Build runs `scripts/fetch-github.ts` first (live GitHub fetch) then `astro build`.
Without a `GITHUB_TOKEN`, you're rate-limited to 60 req/h — usually fine for one run.

## Tests

```bash
pnpm test         # vitest unit tests
pnpm test:e2e     # Playwright privacy guardrail
```

## Deploy

See `docs/superpowers/runbooks/deploy.md`.
