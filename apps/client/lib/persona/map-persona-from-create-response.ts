import type { PersonaCreateResponse } from '@kakamu/types';
import type { Persona } from '@kakamu/types';

export function mapPersonaFromCreateResponse(response: PersonaCreateResponse): Persona {
  return {
    id: response.id,
    nickname: response.name,
    persona_type: response.persona_type,
    tag: response.tag,
    profile_image_url: response.profile_image_url,
  };
}
