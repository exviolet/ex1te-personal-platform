# ex1te Personal Platform

Личная платформа Бакытжана Избасарова (`ex1te`) для текстов, проектов и экспериментов.

## Structure

```text
ex1te-personal-platform/
├── .github/       # CI and pull request defaults
├── sketches/      # четыре HTML-прототипа и Content Blueprint
├── site/          # production Astro application
└── CONTRIBUTING.md
```

- [Content Blueprint](./sketches/CONTENT-BLUEPRINT.md)
- [Current visual source — 004 Editorial Field Station](./sketches/004-editorial-field-station/index.html)
- [Astro application](./site/README.md)
- [Git and pull request workflow](./CONTRIBUTING.md)

## Current production foundation

- Astro 7 and strict TypeScript;
- build-time Content Collections for `writing`, `lab`, and `projects`;
- responsive Editorial Field Station homepage;
- portrait-based personal identity with favicon and Open Graph assets;
- interactive `Steppe Signal` component;
- Writing, Lab, Projects, Uses, Now, and About routes;
- RSS and sitemap;
- Memory Wiki published as the first full project page; remaining starter content stays in drafts;
- Node integration tests against the production build.

## Verify

Requires Bun 1.3.14 and Node.js 22.12 or newer.

```bash
cd site
bun install
bun run verify
```

`bun run verify` runs Astro type/schema checking, a static production build, and integration tests.
