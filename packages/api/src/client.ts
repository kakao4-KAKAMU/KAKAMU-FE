import ky from 'ky';

export function createApiClient(prefixUrl: string) {
  return ky.create({ prefixUrl, timeout: 30_000 });
}

export type ApiClient = ReturnType<typeof createApiClient>;
