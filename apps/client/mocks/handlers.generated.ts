import { fromOpenApi } from '@msw/source/open-api';

import { getApiBaseUrl } from './api-base';

let generatedHandlersPromise: ReturnType<typeof fromOpenApi> | null = null;

/** OpenAPI 스펙 기반 MSW 핸들러 (런타임 생성, 결과 캐시) */
export async function createGeneratedHandlers() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const spec = await import('./openapi.json');
  if (!generatedHandlersPromise) {
    const apiBase = getApiBaseUrl();
    generatedHandlersPromise = fromOpenApi({
      ...(spec as Record<string, unknown>),
      servers: [{ url: apiBase }],
    } as Parameters<typeof fromOpenApi>[0]);
  }

  return generatedHandlersPromise;
}
