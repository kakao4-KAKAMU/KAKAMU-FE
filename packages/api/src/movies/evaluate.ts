import type { MovieEvaluationRequest, MovieEvaluationResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `POST .../movies/evaluate` */
export async function postMovieEvaluate(
  client: ApiClient,
  body: MovieEvaluationRequest,
): Promise<MovieEvaluationResponse> {
  return client.post('movies/evaluate', { json: body }).json<MovieEvaluationResponse>();
}
