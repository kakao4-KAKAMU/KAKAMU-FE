import type {
  MovieSearchItem,
  MovieSearchParams,
  MovieSearchRequestBody,
  SearchPageResponse,
} from '@kakamu/types';

import type { ApiClient } from '../client';

const DEFAULT_SORT = 'year_desc' satisfies MovieSearchRequestBody['sort'];
const DEFAULT_LIMIT = 20;

function toMovieSearchBody(params: MovieSearchParams): MovieSearchRequestBody {
  return {
    name: params.name?.trim() ?? '',
    genre: params.genre ?? [],
    year: params.year,
    sort: params.sort ?? DEFAULT_SORT,
    skip: params.skip ?? 1,
    limit: params.limit ?? DEFAULT_LIMIT,
  };
}

/** `POST .../search/movie` */
export async function postSearchMovies(
  client: ApiClient,
  params: MovieSearchParams = {},
): Promise<SearchPageResponse<MovieSearchItem>> {
  return client
    .post('search/movie', { json: toMovieSearchBody(params) })
    .json<SearchPageResponse<MovieSearchItem>>();
}
