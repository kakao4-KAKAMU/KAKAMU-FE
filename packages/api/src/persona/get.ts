import type { PersonaListResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `GET .../personas/personas` */
export async function getPersonas(client: ApiClient): Promise<PersonaListResponse> {
  return client.get('personas/personas').json<PersonaListResponse>();
}
