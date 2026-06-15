import type { PersonaDetailResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `GET .../personas/persona/{persona_id}` */
export async function getPersonaById(client: ApiClient, personaId: string): Promise<PersonaDetailResponse> {
  return client.get(`personas/${personaId}`).json<PersonaDetailResponse>();
}
