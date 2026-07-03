import type { MovieRecommendParams, MovieRecommendationResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

const DEFAULT_QUERY = '맞춤 영화 추천';

function toMovieRecommendSearchParams(params: MovieRecommendParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  searchParams.set('query', params.query?.trim() || DEFAULT_QUERY);
  return searchParams;
}

/** `GET /movies/recommend` */
export async function getMovieRecommend(
  client: ApiClient,
  params: MovieRecommendParams = {},
): Promise<MovieRecommendationResponse> {
  return client
    .get('movies/recommend', { searchParams: toMovieRecommendSearchParams(params) })
    .json<MovieRecommendationResponse>();
}
