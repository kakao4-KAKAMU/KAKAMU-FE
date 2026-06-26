import type { MovieToEvaluateListResponse, MovieToEvaluateParams } from '@kakamu/types';

import type { ApiClient } from '../client';

const DEFAULT_LIMIT = 20;

function toMovieToEvaluateSearchParams(params: MovieToEvaluateParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.persona_id) {
    searchParams.set('persona_id', params.persona_id);
  }
  searchParams.set('limit', (params.limit ?? DEFAULT_LIMIT).toString());
  return searchParams;
}

/** `GET .../movies` */
export async function getMoviesToEvaluate(
  client: ApiClient,
  params: MovieToEvaluateParams = {},
): Promise<MovieToEvaluateListResponse> {
  return client
    .get('movies', { searchParams: toMovieToEvaluateSearchParams(params) })
    .json<MovieToEvaluateListResponse>();
}
