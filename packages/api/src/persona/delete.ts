import type { ApiClient } from '../client';

/** `DELETE .../personas/persona/{persona_id}` */
export async function deletePersona(
  client: ApiClient,
  personaId: string,
): Promise<void> {
  await client.delete(`personas/persona/${personaId}`).text();
}
