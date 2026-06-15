import type { PersonaCreateRequest, PersonaCreateResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../personas/persona` */
export async function createPersona(
  client: ApiClient,
  body: PersonaCreateRequest,
): Promise<PersonaCreateResponse> {
  return client.post('personas', { json: body }).json<PersonaCreateResponse>();
}
