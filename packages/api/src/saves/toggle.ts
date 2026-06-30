import type { SaveToggleRequest, SaveToggleResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../saves/` */
export async function postSaveToggle(
  client: ApiClient,
  body: SaveToggleRequest,
): Promise<SaveToggleResponse> {
  return client.post('saves/', { json: body }).json<SaveToggleResponse>();
}
