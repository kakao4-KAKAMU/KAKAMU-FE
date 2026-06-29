import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fromOpenApi } from '@msw/source/open-api';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mocksDir = join(__dirname, '..');
const specPath = join(mocksDir, 'openapi.json');
const outputPath = join(mocksDir, 'handlers.generated.meta.json');

const apiBase =
  process.env.EXPO_PUBLIC_BACKEND_API_URL?.replace(/\/$/, '') ?? 'http://dev.filma.cloud/api';

const spec = JSON.parse(readFileSync(specPath, 'utf8'));

const patchedSpec = {
  ...spec,
  servers: [{ url: apiBase }],
};

const handlers = await fromOpenApi(patchedSpec);

const meta = {
  generatedAt: new Date().toISOString(),
  apiBase,
  handlerCount: handlers.length,
  openapiVersion: spec.info?.version ?? null,
};

writeFileSync(outputPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
console.log(`Generated ${handlers.length} handlers for base URL ${apiBase}`);
console.log(`Meta written to ${outputPath}`);
