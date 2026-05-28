import type { PersonaCreateRequest, PersonaCreateResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../profile/persona` */
export async function createPersona(
  client: ApiClient,
  body: PersonaCreateRequest,
): Promise<PersonaCreateResponse> {
  return client.post('profile/persona', { json: body }).json<PersonaCreateResponse>();
}
