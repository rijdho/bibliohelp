// i18n integrity (node --test, dependency-free).
//
// Three silent-failure classes are pinned here:
//  1. App dictionary key parity — a key added to one locale but not the other
//     two falls back to English silently.
//  2. Landing overlay array lengths — docs/index.html aligns [es, en, de] by
//     INDEX, so a missing entry shifts every later language in silence.
//  3. Worker-emitted message codes must exist in the app dictionary — a code
//     the client does not know falls back to the server's English string
//     (this exact gap shipped once: err.badRequest / err.internal).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dictSrc = readFileSync(join(root, 'frontend/src/lib/i18n.svelte.ts'), 'utf8');

function keysOf(locale) {
  const start = dictSrc.indexOf(`  ${locale}: {`);
  assert.ok(start !== -1, `bloque '${locale}' no encontrado`);
  const end = dictSrc.indexOf('\n  }', start);
  const block = dictSrc.slice(start, end);
  return [...block.matchAll(/^\s{4}'([^']+)':/gm)].map(m => m[1]);
}

test('app dictionary: es/en/de have identical key sets', () => {
  const es = keysOf('es'), en = keysOf('en'), de = keysOf('de');
  assert.ok(es.length >= 111, `es tiene ${es.length} claves`);
  for (const [name, keys] of [['en', en], ['de', de]]) {
    const a = new Set(es), b = new Set(keys);
    const missing = es.filter(k => !b.has(k));
    const extra = keys.filter(k => !a.has(k));
    assert.deepEqual({ missing, extra }, { missing: [], extra: [] },
      `desalineación es↔${name}`);
  }
});

test('app dictionary: interpolation placeholders match across locales', () => {
  const params = src => new Set([...src.matchAll(/\{(\w+)\}/g)].map(m => m[1]));
  const blockOf = l => {
    const start = dictSrc.indexOf(`  ${l}: {`);
    return dictSrc.slice(start, dictSrc.indexOf('\n  }', start));
  };
  const value = (block, key) =>
    new RegExp(`'${key.replace('.', '\\.')}': '((?:[^'\\\\]|\\\\.)*)'`).exec(block)?.[1] ?? '';
  const es = blockOf('es');
  for (const l of ['en', 'de']) {
    const other = blockOf(l);
    for (const k of keysOf('es')) {
      assert.deepEqual([...params(value(other, k))].sort(), [...params(value(es, k))].sort(),
        `placeholders de '${k}' difieren entre es y ${l}`);
    }
  }
});

test('landing overlay: every [es,en,de] array has exactly 3 entries and a matching data-i18n anchor', () => {
  const html = readFileSync(join(root, 'docs/index.html'), 'utf8');
  const m = html.match(/var I\s*=\s*(\{[\s\S]*?\});/);
  assert.ok(m, 'overlay I no encontrado en docs/index.html');
  const I = new Function(`return ${m[1]}`)();
  const langs = /var LANGS=\[([^\]]+)\]/.exec(html)[1].split(',').length;
  assert.equal(langs, 3);
  const anchors = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map(x => x[1]));
  for (const [k, v] of Object.entries(I)) {
    assert.equal(v.length, 3, `I['${k}'] tiene ${v.length} entradas, no 3`);
    assert.ok(anchors.has(k), `I['${k}'] sin ancla data-i18n`);
  }
  for (const a of anchors) assert.ok(a in I, `ancla '${a}' sin entrada en I`);
});

test('every worker-emitted code exists in all three locales', () => {
  const codes = new Set();
  const walk = dir => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (f.endsWith('.ts') && !f.endsWith('.test.ts')) {
        const src = readFileSync(p, 'utf8');
        for (const m of src.matchAll(/'((?:msg|err|sug)\.[A-Za-z]+)'/g)) codes.add(m[1]);
      }
    }
  };
  walk(join(root, 'worker/src'));
  assert.ok(codes.size >= 15, `solo ${codes.size} códigos encontrados`);
  for (const l of ['es', 'en', 'de']) {
    const keys = new Set(keysOf(l));
    for (const c of codes) assert.ok(keys.has(c), `código '${c}' ausente en '${l}'`);
  }
});
