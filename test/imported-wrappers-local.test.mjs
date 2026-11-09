import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const manifests = ['2026-10-29', '2026-11-02', '2026-11-02-batch2'];
const games = manifests.flatMap(date => JSON.parse(readFileSync(`docs/game-imports/${date}.json`)).games);

test('imported game pages restrict resource requests to the local origin', () => {
  const errors = [];
  for (const {folder} of games) {
    const html = readFileSync(`static/misc/${folder}/index.html`, 'utf8');
    const policy = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i)?.[1] || '';
    if (!policy.includes("default-src 'self' data: blob:") || !policy.includes("connect-src 'self' data: blob:") || !policy.includes("worker-src 'self' blob:") || !policy.includes("script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:")) errors.push(`${folder}: missing local policy`);
    if (/<script\b[^>]*\bsrc=["']https?:\/\//i.test(html)) errors.push(`${folder}: remote script`);
    if (/https:\/\/cdn\.jsdelivr\.net\/npm\/brotli-dec-wasm/.test(html)) errors.push(`${folder}: remote Brotli`);
    if (/<base\b[^>]*\bhref=["']https?:\/\//i.test(html)) errors.push(`${folder}: remote base`);
  }
  assert.deepEqual(errors, []);
});

test('Flash games disable embedded network requests and keep their game identity', () => {
  const errors = [];
  for (const {folder} of games) {
    const html = readFileSync(`static/misc/${folder}/index.html`, 'utf8');
    if (!new RegExp(`data-game-id=["']${folder}["']`).test(html)) errors.push(`${folder}: missing game ID`);
    if (html.includes('gms-flash-config') && !/allowNetworking\s*:\s*['"]none['"]/.test(html)) errors.push(`${folder}: Flash networking enabled`);
  }
  assert.deepEqual(errors, []);
});

test('Dig out of Prison does not request an empty data script', () => {
  const html = readFileSync('static/misc/dig-out-of-prison/index.html', 'utf8');
  assert.doesNotMatch(html, /data:text\/javascript,/);
});

test('Draw Climber normalizes generated image paths before loading them', () => {
  const html = readFileSync('static/misc/draw-climber/index.html', 'utf8');
  assert.match(html, /Object\.defineProperty\(HTMLImageElement\.prototype,\s*["']src["']/);
});

test('Chicken Royale does not request a favicon absent from its source', () => {
  const html = readFileSync('static/misc/chicken-royale/index.html', 'utf8');
  assert.doesNotMatch(html, /TemplateData\/favicon\.png/);
});

test('Draw Climber normalizes generated media paths before loading them', () => {
  const html = readFileSync('static/misc/draw-climber/index.html', 'utf8');
  assert.match(html, /Object\.defineProperty\(HTMLMediaElement\.prototype,\s*["']src["']/);
});

test('Draw Climber normalizes Audio constructor paths', () => {
  const html = readFileSync('static/misc/draw-climber/index.html', 'utf8');
  assert.match(html, /window\.Audio=function/);
});
