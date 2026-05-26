import type { GenreListResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `GET .../genre/list` */
export async function getGenreList(client: ApiClient): Promise<GenreListResponse> {
  return client.get('genre/list').json<GenreListResponse>();
}
