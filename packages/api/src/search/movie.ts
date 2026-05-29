import type {
  MovieSearchItem,
  MovieSearchParams,
  MovieSearchRequestBody,
  SearchPageResponse,
} from '@kakamu/types';

import type { ApiClient } from '../client';

const DEFAULT_SORT = 'year_desc' satisfies MovieSearchRequestBody['sort'];
const DEFAULT_LIMIT = 20;

function toMovieSearchParams(params: MovieSearchParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  searchParams.set('name', params.name?.trim() ?? '');
  for (const genre of params.genre ?? []) {
    searchParams.append('genre[]', String(genre));
  }
  if (params.year != null) {
    searchParams.set('year', params.year.toString());
  }
  searchParams.set('sort', params.sort ?? DEFAULT_SORT);
  if (params.skip != null) {
    searchParams.set('skip', params.skip.toString());
  }
  searchParams.set('limit', params.limit?.toString() ?? DEFAULT_LIMIT.toString());
  return searchParams;
}

/** `POST .../v1/search/movie` */
export async function postSearchMovies(
  client: ApiClient,
  params: MovieSearchParams = {},
): Promise<SearchPageResponse<MovieSearchItem>> {
  return client
    .get('v1/search/movie', { searchParams: toMovieSearchParams(params) })
    .json<SearchPageResponse<MovieSearchItem>>();
}
