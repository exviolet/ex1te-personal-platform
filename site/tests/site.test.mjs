import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
