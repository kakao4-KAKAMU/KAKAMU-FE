import type { QueryClient } from '@tanstack/react-query';
import type { MovieDetail, MovieItem, MovieTitle } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';

export function getPrimaryMovieTitle(titles: MovieTitle[]): string {
  const originalTitle = titles.find((title) => title.is_original)?.title_name.trim();
  if (originalTitle) {
    return originalTitle;
  }

  return titles[0]?.title_name.trim() ?? '';
}

export function movieDetailToItem(detail: MovieDetail): MovieItem {
  return {
    id: detail.id,
    title: getPrimaryMovieTitle(detail.titles),
    poster_url: detail.poster_url,
    release_date: detail.release_date,
  };
}

export function seedMovieDetailCache(queryClient: QueryClient, detail: MovieDetail): void {
  queryClient.setQueryData(movieKeys.detailFull(detail.id), detail);
  queryClient.setQueryData(movieKeys.detail(detail.id), movieDetailToItem(detail));
}
