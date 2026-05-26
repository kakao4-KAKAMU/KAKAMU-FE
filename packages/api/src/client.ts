import type { Options } from 'ky';
import ky from 'ky';
export function createApiClient(prefixUrl: string, options: Partial<Options>) {
  return ky.create({ prefixUrl, timeout: 30_000, ...options });
}

export type ApiClient = ReturnType<typeof createApiClient>;
