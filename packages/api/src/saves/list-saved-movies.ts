import type { SavedMovieListParams, SavedMovieListResponse } from '@kakamu/types';

import type { ApiClient } from '../client';
import { toSavedMovieListSearchParams } from './build-save-list-params';

/** `GET .../saves/movies` */
export async function getSavedMovieList(
  client: ApiClient,
  params: SavedMovieListParams,
): Promise<SavedMovieListResponse> {
  return client
    .get('saves/movies', { searchParams: toSavedMovieListSearchParams(params) })
    .json<SavedMovieListResponse>();
}
