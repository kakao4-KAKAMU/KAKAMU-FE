import type { MovieItem } from '@kakamu/types';
import { useMovieByIdQuery } from '@kakamu/query';

import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { SelectedMovieRow } from './SelectedMovieRow';

type MovieSearchResultRowProps = {
  movieId: string;
  checked: boolean;
  onToggle: (movie: MovieItem) => void;
};

export function MovieSearchResultRow({ movieId, checked, onToggle }: MovieSearchResultRowProps) {
  const client = useBackendApiClient();
  const movieQuery = useMovieByIdQuery(movieId);
  const movie = movieQuery.data;

  return (
    <SelectedMovieRow
      title={movie.title}
      poster_url={movie.poster_url ?? undefined}
      release_date={movie.release_date ?? undefined}
      checked={checked}
      onToggle={() => onToggle(movie)}
    />
  );
}
