# ex1te — Astro site

Production application for the ex1te personal platform.

## Requirements

- Bun 1.3.14;
- Node.js 22.12 or newer.

## Commands

```bash
bun install
bun run dev
bun run check
bun run build
bun run test
bun run verify
```

## Content

```text
src/content/
├── writing/
├── lab/
└── projects/
```

Content schemas live in `src/content.config.ts`. Draft entries use `draft: true` and are excluded from generated detail routes and public collection indexes. A real publication requires a publication/start date; drafts may omit unknown dates.

## Identity

Production identity assets live in `public/identity/`:

- portrait logo and header crop;
- avatar and Apple touch icon;
- 32px favicon;
- 1200×630 Open Graph card;
- untouched original JPG.

The illustrated portrait is the personal logo, `ex1te` is the wordmark, and Steppe Signal remains the platform's signature interaction.

## Site URL

Until a domain is selected, builds use `https://ex1te.local` as the canonical base for sitemap and RSS generation. Override it for deployment:

```bash
SITE_URL=https://example.com bun run build
```

Do not deploy with the placeholder canonical URL.

## Design source

The visual source of truth remains [`../sketches/004-editorial-field-station/index.html`](../sketches/004-editorial-field-station/index.html). Content and architecture decisions are recorded in [`../sketches/CONTENT-BLUEPRINT.md`](../sketches/CONTENT-BLUEPRINT.md).
