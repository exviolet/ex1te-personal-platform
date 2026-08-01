# ex1te Personal Platform

Личная платформа Бакытжана Избасарова (`ex1te`) для текстов, проектов и экспериментов.

## Structure

```text
ex1te-personal-platform/
├── .github/       # push-based CI configuration
├── sketches/      # четыре HTML-прототипа и Content Blueprint
├── site/          # production Astro application
└── CONTRIBUTING.md
```

- [Content Blueprint](./sketches/CONTENT-BLUEPRINT.md)
- [Current visual source — 004 Editorial Field Station](./sketches/004-editorial-field-station/index.html)
- [Astro application](./site/README.md)
- [Local Git branch workflow](./CONTRIBUTING.md)

## Current production foundation

- Astro 7 and strict TypeScript;
- build-time Content Collections for `writing`, `lab`, and `projects`;
- responsive Editorial Field Station homepage with real-content discovery, current work directions, and visible topic tags;
- portrait-based personal identity with favicon and Open Graph assets;
- interactive `Steppe Signal` component;
- desktop reading routes with heading indexes, active-section tracking, progress, and return-to-top controls;
- Writing, Lab, Projects, Uses, Now, and About routes;
- RSS and sitemap;
- Memory Wiki published as the first full project page, Unicode Spinner Playground as the first Lab experiment, and `rn + tmuxp` as the first practical Writing guide; remaining starter content stays in drafts;
- Node integration tests against the production build.

## Verify

Requires Bun 1.3.14 and Node.js 22.12 or newer.

```bash
cd site
bun install
bun run verify
```

`bun run verify` runs Astro type/schema checking, a static production build, and integration tests.

## Deploy

The static site is published to [ex1te.pages.dev](https://ex1te.pages.dev) with Cloudflare Pages.

```bash
cd site
bun run build
bunx wrangler pages deploy dist --project-name ex1te --branch main
```

`SITE_URL` can override the canonical base when a custom domain is connected later.
