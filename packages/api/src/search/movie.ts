import type { MovieSearchParams, PaginatedResponse, MovieSearchItem } from '@kakamu/types';

import type { ApiClient } from '../client';

import { buildSearchParams } from './build-search-params';

function toMovieSearchParams(params: MovieSearchParams) {
  return buildSearchParams({
    genre: params.genre?.length ? params.genre : undefined,
    name: params.name?.trim() || undefined,
    year: params.year,
    sort: params.sort,
    cursor: params.cursor,
    limit: params.limit,
  });
}

/** `GET .../search/movie` */
export async function getSearchMovies(
  client: ApiClient,
  params: MovieSearchParams = {},
): Promise<PaginatedResponse<MovieSearchItem>> {
  return client
    .get('search/movie', { searchParams: toMovieSearchParams(params) })
    .json<PaginatedResponse<MovieSearchItem>>();
}
