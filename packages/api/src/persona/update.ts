import type { PersonaUpdateRequest, PersonaUpdateResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `PUT .../personas/{persona_id}` */
export async function updatePersona(
  client: ApiClient,
  personaId: string,
  body: PersonaUpdateRequest,
): Promise<PersonaUpdateResponse> {
  return client
    .put(`personas/${personaId}`, { json: body })
    .json<PersonaUpdateResponse>();
}
