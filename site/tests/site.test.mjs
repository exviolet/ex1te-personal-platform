import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(siteRoot, '..');
const distRoot = path.join(siteRoot, 'dist');

const readBuilt = (relativePath) => readFile(path.join(distRoot, relativePath), 'utf8');

test('production build emits every MVP route', async () => {
  const routes = [
    'index.html',
    'writing/index.html',
    'lab/index.html',
    'projects/index.html',
    'projects/memory-wiki/index.html',
    'uses/index.html',
    'now/index.html',
    'about/index.html',
    'rss.xml',
    'sitemap-index.xml',
  ];

  await Promise.all(routes.map((route) => access(path.join(distRoot, route))));
});

test('homepage communicates the approved positioning', async () => {
  const html = await readBuilt('index.html');

  assert.match(html, /<html[^>]+lang="ru"/);
  assert.match(html, /Systems for real work\./);
  assert.match(html, /Personal field station/);
  assert.match(html, /Здесь я собираю мысли, проекты и эксперименты/);
  assert.match(html, /Steppe Signal/);

  assert.doesNotMatch(html, /RU writing · EN interface · KZ identity/);
  assert.doesNotMatch(html, /Bakytzhan Izbassarov · Бақытжан Избасаров/);
  assert.doesNotMatch(html, /личный публичный архив/i);
});

test('homepage exposes navigation and all Steppe Signal states', async () => {
  const html = await readBuilt('index.html');

  for (const href of ['/writing/', '/lab/', '/projects/', '/uses/', '/now/', '/about/']) {
    assert.match(html, new RegExp(`href="${href}"`));
  }

  for (const state of ['writing', 'lab', 'projects', 'now']) {
    assert.match(html, new RegExp(`data-section="${state}"`));
  }
});

test('remaining starter content drafts carry language and draft metadata', async () => {
  const entries = [
    'src/content/writing/my-personal-ai-workflow.md',
    'src/content/projects/rewrite-desktop.md',
  ];

  for (const relativePath of entries) {
    const source = await readFile(path.join(siteRoot, relativePath), 'utf8');
    assert.match(source, /^---[\s\S]*?lang: ru/m, relativePath);
    assert.match(source, /^---[\s\S]*?draft: true/m, relativePath);
    assert.match(source, /^---[\s\S]*?description:/m, relativePath);
  }
});

test('identity asset set is present and uses real image formats', async () => {
  const assets = [
    'public/identity/ex1te-portrait-original.jpg',
    'public/identity/ex1te-portrait.webp',
    'public/identity/ex1te-avatar-512.webp',
    'public/identity/ex1te-header-mark.webp',
    'public/identity/ex1te-og.png',
    'public/identity/favicon-32.png',
    'public/identity/apple-touch-icon.png',
  ];

  for (const relativePath of assets) {
    const asset = await readFile(path.join(siteRoot, relativePath));
    assert.ok(asset.length > 512, `${relativePath} should not be an empty placeholder`);
  }

  const webp = await readFile(path.join(siteRoot, 'public/identity/ex1te-header-mark.webp'));
  assert.equal(webp.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(webp.subarray(8, 12).toString('ascii'), 'WEBP');

  const og = await readFile(path.join(siteRoot, 'public/identity/ex1te-og.png'));
  assert.equal(og.readUInt32BE(16), 1200, 'Open Graph image width');
  assert.equal(og.readUInt32BE(20), 630, 'Open Graph image height');
});

test('portrait identity is wired into header, About, and metadata', async () => {
  const home = await readBuilt('index.html');
  const about = await readBuilt('about/index.html');

  assert.match(home, /src="\/identity\/ex1te-header-mark\.webp"/);
  assert.match(about, /src="\/identity\/ex1te-portrait\.webp"/);
  assert.match(about, /class="identity-portrait/);

  for (const html of [home, about]) {
    assert.match(html, /property="og:image"[^>]+\/identity\/ex1te-og\.png/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /rel="apple-touch-icon"[^>]+\/identity\/apple-touch-icon\.png/);
    assert.match(html, /rel="icon"[^>]+\/identity\/favicon-32\.png/);
    assert.match(html, /application\/ld\+json/);
  }
});

test('Memory Wiki is a published and grounded project page', async () => {
  const source = await readFile(path.join(siteRoot, 'src/content/projects/memory-wiki.md'), 'utf8');
  const html = await readBuilt('projects/memory-wiki/index.html');
  const projectsIndex = await readBuilt('projects/index.html');

  assert.match(source, /^---[\s\S]*?draft: false/m);
  assert.match(source, /^---[\s\S]*?started: 2026-06-18/m);
  assert.match(projectsIndex, /href="\/projects\/memory-wiki\/"/);

  assert.match(html, /История разговоров — ещё не память\./);
  assert.match(html, /hermes sessions export/);
  assert.match(html, /data-project-flow/);
  assert.match(html, /31 sessions/);
  assert.match(html, /12 days/);
  assert.match(html, /31 topics/);
  assert.match(html, /tool-output/);
  assert.match(html, /\/projects\/memory-wiki\/sample-overview\.webp/);
  assert.doesNotMatch(html, /Дополнить проверенными возможностями/);

  await access(path.join(siteRoot, 'public/projects/memory-wiki/sample-overview.webp'));
});

test('repository uses Bun as its only JavaScript package manager', async () => {
  const packageJson = JSON.parse(await readFile(path.join(siteRoot, 'package.json'), 'utf8'));
  const workflow = await readFile(path.join(repoRoot, '.github/workflows/verify.yml'), 'utf8');
  const docs = await Promise.all([
    readFile(path.join(repoRoot, 'README.md'), 'utf8'),
    readFile(path.join(siteRoot, 'README.md'), 'utf8'),
    readFile(path.join(repoRoot, 'CONTRIBUTING.md'), 'utf8'),
  ]);

  assert.equal(packageJson.packageManager, 'bun@1.3.14');
  assert.equal(packageJson.scripts.verify, 'bun run check && bun run build && bun run test');
  await access(path.join(siteRoot, 'bun.lock'));
  for (const obsoleteLockfile of [
    'bun.lockb',
    'package-lock.json',
    'npm-shrinkwrap.json',
    'pnpm-lock.yaml',
    'yarn.lock',
  ]) {
    await assert.rejects(access(path.join(siteRoot, obsoleteLockfile)));
  }

  assert.match(
    workflow,
    /oven-sh\/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6 # v2\.2\.0/,
  );
  assert.match(workflow, /bun-version: 1\.3\.14/);
  assert.match(workflow, /bun install --frozen-lockfile/);
  assert.match(workflow, /bun run verify/);
  assert.doesNotMatch(workflow, /npm ci|cache: npm|package-lock\.json/);

  for (const document of docs) assert.doesNotMatch(document, /\bnpm(?:\s|$)/m);
  assert.match(docs[0], /Bun 1\.3\.14/);
  assert.match(docs[1], /Bun 1\.3\.14/);
});

test('repository uses local no-ff branch merges without a pull request gate', async () => {
  const workflow = await readFile(path.join(repoRoot, '.github/workflows/verify.yml'), 'utf8');
  const contributing = await readFile(path.join(repoRoot, 'CONTRIBUTING.md'), 'utf8');

  assert.doesNotMatch(workflow, /^\s*pull_request:/m);
  await assert.rejects(access(path.join(repoRoot, '.github/pull_request_template.md')));
  assert.match(contributing, /git merge --no-ff/);
  assert.doesNotMatch(contributing, /open a pull request/i);
});

test('theme system initializes before paint and exposes an accessible persistent switcher', async () => {
  const home = await readBuilt('index.html');
  const styles = await readFile(path.join(siteRoot, 'src/styles/global.css'), 'utf8');

  assert.match(home, /name="color-scheme" content="light dark"/);
  assert.match(home, /data-theme-color/);
  assert.match(home, /data-theme-toggle/);
  assert.match(home, /aria-label="Dark theme"/);
  assert.match(home, /aria-pressed="false"/);
  assert.match(home, /localStorage\.getItem\(['"]ex1te-theme['"]\)/);
  assert.match(home, /localStorage\.setItem\(['"]ex1te-theme['"]/);
  assert.match(home, /matchMedia\(['"]\(prefers-color-scheme: dark\)['"]\)/);

  const initializer = home.indexOf("localStorage.getItem('ex1te-theme')");
  const stylesheet = home.indexOf('rel="stylesheet"');
  const body = home.indexOf('<body>');
  assert.ok(initializer >= 0 && initializer < stylesheet, 'theme initializer must precede the stylesheet');
  assert.ok(stylesheet < body, 'stylesheet must load before body content');

  assert.match(styles, /html\[data-theme=['"]dark['"]\]/);
  assert.match(styles, /@media\s*\(prefers-color-scheme:\s*dark\)/);
  assert.match(styles, /--theme-control-track:/);
});

test('theme state semantics survive invalid or unavailable storage', async () => {
  const layout = await readFile(path.join(siteRoot, 'src/layouts/BaseLayout.astro'), 'utf8');
  const switcher = await readFile(path.join(siteRoot, 'src/components/ThemeSwitcher.astro'), 'utf8');
  const styles = await readFile(path.join(siteRoot, 'src/styles/global.css'), 'utf8');

  assert.match(layout, /const validSavedTheme = savedTheme === 'light' \|\| savedTheme === 'dark'/);
  assert.match(layout, /themeSource = validSavedTheme \? 'saved' : 'system'/);
  assert.match(switcher, /aria-label="Dark theme"/);
  assert.doesNotMatch(switcher, /setAttribute\(['"]aria-label['"]/);
  assert.match(switcher, /let hasManualOverride = false/);
  assert.match(switcher, /hasManualOverride = true/);
  assert.match(switcher, /!readStoredTheme\(\) && !hasManualOverride/);
  assert.match(styles, /@media \(max-width:720px\)[\s\S]*?\.theme-switcher \{[^}]*min-width:44px;[^}]*min-height:44px;/);
});

test('theme bearing keeps day and night labels anchored while only its marker moves', async () => {
  const switcher = await readFile(path.join(siteRoot, 'src/components/ThemeSwitcher.astro'), 'utf8');

  assert.match(switcher, /theme-switcher-word[^>]*>DAY<\/span>/);
  assert.match(switcher, /theme-switcher-next[^>]*>NIGHT<\/span>/);
  assert.doesNotMatch(switcher, /\.textContent\s*=\s*isDark/);
});

test('theme text tokens meet WCAG AA contrast in both modes', async () => {
  const styles = await readFile(path.join(siteRoot, 'src/styles/global.css'), 'utf8');
  const token = (name) => {
    const match = styles.match(new RegExp(`--${name}:\\s*light-dark\\((#[\\da-f]{6}),\\s*(#[\\da-f]{6})\\)`, 'i'));
    assert.ok(match, `missing light-dark color token --${name}`);
    return { light: match[1], dark: match[2] };
  };
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/.{2}/g).map((value) => Number.parseInt(value, 16) / 255);
    const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const contrast = (foreground, background) => {
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };

  const paper = token('paper');
  const paperBright = token('paper-bright');
  const readoutSurface = token('readout-surface');
  assert.match(styles, /\.signal-readout \{[^}]*background:var\(--readout-surface\)/);
  for (const name of ['ink', 'ink-soft', 'muted', 'signal']) {
    const colors = token(name);
    for (const mode of ['light', 'dark']) {
      assert.ok(contrast(colors[mode], paper[mode]) >= 4.5, `--${name} misses AA contrast in ${mode} mode`);
      assert.ok(contrast(colors[mode], readoutSurface[mode]) >= 4.5, `--${name} misses AA on the readout in ${mode} mode`);
    }
  }

  for (const name of ['state-writing', 'state-lab', 'state-projects', 'state-now']) {
    const colors = token(name);
    for (const mode of ['light', 'dark']) {
      assert.ok(contrast(colors[mode], paper[mode]) >= 4.5, `--${name} misses AA against paper in ${mode} mode`);
      assert.ok(contrast(colors[mode], paperBright[mode]) >= 4.5, `--${name} misses AA active-control contrast in ${mode} mode`);
      assert.ok(contrast(colors[mode], readoutSurface[mode]) >= 4.5, `--${name} misses AA on the readout in ${mode} mode`);
    }
  }
});
