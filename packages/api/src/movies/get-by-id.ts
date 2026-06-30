import type { MovieDetail } from '@kakamu/types';

import type { ApiClient } from '../client';

/** `GET .../movies/{movie_id}` */
export async function getMovieById(client: ApiClient, movieId: string): Promise<MovieDetail> {
  return client.get(`movies/${movieId}`).json<MovieDetail>();
}
