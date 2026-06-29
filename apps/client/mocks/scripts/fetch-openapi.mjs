import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiBase =
  process.env.EXPO_PUBLIC_BACKEND_API_URL?.replace(/\/$/, '') ?? 'http://dev.filma.cloud/api';

const OPENAPI_URL = `${apiBase}/openapi.json`;
const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '..', 'openapi.json');

const response = await fetch(OPENAPI_URL);

if (!response.ok) {
  throw new Error(`Failed to fetch OpenAPI spec: ${response.status} ${response.statusText}`);
}

const spec = await response.json();
writeFileSync(outputPath, `${JSON.stringify(spec, null, 2)}\n`, 'utf8');
console.log(`OpenAPI spec saved to ${outputPath}`);
