import type { PersonaUpdateRequest, PersonaUpdateResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `PATCH .../personas/persona/{persona_id}` */
export async function updatePersona(
  client: ApiClient,
  personaId: string,
  body: PersonaUpdateRequest,
): Promise<PersonaUpdateResponse> {
  return client
    .patch(`personas/${personaId}`, { json: body })
    .json<PersonaUpdateResponse>();
}
