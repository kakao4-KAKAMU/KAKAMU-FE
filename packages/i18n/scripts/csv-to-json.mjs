/**
 * Reads src/locales/*.csv (header: code,ko,en) and writes nested JSON for i18next.
 * Uses lodash `set` to turn dot-path codes into nested objects.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
import set from 'lodash/set.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, '..');
const localesDir = join(pkgRoot, 'src', 'locales');
const outDir = join(pkgRoot, 'src', 'generated');

function rowsToNestedObject(rows, valueKey) {
  const root = {};
  for (const row of rows) {
    const code = row.code?.trim();
    if (!code) {
      continue;
    }
    const value = row[valueKey] ?? '';
    set(root, code, value);
  }
  return root;
}

function loadGuestRows() {
  const csvPath = join(localesDir, 'guest.csv');
  const raw = readFileSync(csvPath, 'utf8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  const header = Object.keys(records[0] ?? {});
  if (!header.includes('code') || !header.includes('ko') || !header.includes('en')) {
    throw new Error(
      `guest.csv must have header columns code, ko, en. Found: ${header.join(', ')}`
    );
  }
  return records;
}

mkdirSync(outDir, { recursive: true });

const rows = loadGuestRows();
const koTranslation = rowsToNestedObject(rows, 'ko');
const enTranslation = rowsToNestedObject(rows, 'en');

writeFileSync(join(outDir, 'ko.json'), `${JSON.stringify(koTranslation, null, 2)}\n`, 'utf8');
writeFileSync(join(outDir, 'en.json'), `${JSON.stringify(enTranslation, null, 2)}\n`, 'utf8');

