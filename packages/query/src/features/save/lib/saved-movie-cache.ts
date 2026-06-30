import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';
import type { MovieDetail, MovieItem, SavedMovieListResponse } from '@kakamu/types';

import { movieKeys } from '../../../shared/keys/movie.keys';

export type SavedMovieCursorIdListResponse = Omit<SavedMovieListResponse, 'items'> & {
  items: string[];
};

export type SavedMovieInfiniteData = InfiniteData<
  SavedMovieCursorIdListResponse,
  number | undefined
>;

export type SavedMovieListQuerySnapshot = [QueryKey, SavedMovieInfiniteData | undefined][];

export type MovieDetailQuerySnapshot = [QueryKey, MovieDetail | undefined][];

function filterMovieIdFromPages(
  data: SavedMovieInfiniteData,
  movieId: string,
): SavedMovieInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter((id) => id !== movieId),
    })),
  };
}

function prependMovieIdToFirstPage(
  data: SavedMovieInfiniteData,
  movieId: string,
): SavedMovieInfiniteData {
  if (data.pages.length === 0) {
    return {
      ...data,
      pages: [
        {
          items: [movieId],
          next_cursor: null,
          has_next: false,
        },
      ],
    };
  }

  const [firstPage, ...restPages] = data.pages;
  const withoutDuplicate = firstPage.items.filter((id) => id !== movieId);
  return {
    ...data,
    pages: [{ ...firstPage, items: [movieId, ...withoutDuplicate] }, ...restPages],
  };
}

export function toSavedMovieIdListPage(
  response: SavedMovieListResponse,
): SavedMovieCursorIdListResponse {
  return {
    ...response,
    items: response.items.map((item) => item.id),
  };
}

export function seedSavedMovieDetailCache(
  queryClient: QueryClient,
  items: MovieItem[],
): void {
  for (const item of items) {
    queryClient.setQueryData(movieKeys.detail(item.id), item);
  }
}

export function snapshotSavedMovieInfiniteLists(
  queryClient: QueryClient,
): SavedMovieListQuerySnapshot {
  return queryClient.getQueriesData<SavedMovieInfiniteData>({
    queryKey: movieKeys.savedLists(),
  });
}

export function restoreSavedMovieInfiniteLists(
  queryClient: QueryClient,
  snapshots: SavedMovieListQuerySnapshot,
): void {
  for (const [queryKey, data] of snapshots) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function snapshotMovieDetailFull(
  queryClient: QueryClient,
  movieId: string,
): MovieDetailQuerySnapshot {
  return queryClient.getQueriesData<MovieDetail>({
    queryKey: movieKeys.detailFull(movieId),
  });
}

export function restoreMovieDetailFulls(
  queryClient: QueryClient,
  snapshots: MovieDetailQuerySnapshot,
): void {
  for (const [queryKey, data] of snapshots) {
    queryClient.setQueryData(queryKey, data);
  }
}

export function removeMovieFromSavedLists(queryClient: QueryClient, movieId: string): void {
  queryClient.setQueriesData<SavedMovieInfiniteData>(
    { queryKey: movieKeys.savedLists() },
    (old) => (old ? filterMovieIdFromPages(old, movieId) : old),
  );
}

export function setMovieSaveInCaches(
  queryClient: QueryClient,
  movieId: string,
  isSaved: boolean,
): void {
  queryClient.setQueryData<MovieDetail>(movieKeys.detailFull(movieId), (old) =>
    old ? { ...old, is_saved: isSaved } : old,
  );

  if (isSaved) {
    queryClient.setQueriesData<SavedMovieInfiniteData>(
      { queryKey: movieKeys.savedLists() },
      (old) => (old ? prependMovieIdToFirstPage(old, movieId) : old),
    );
    return;
  }

  removeMovieFromSavedLists(queryClient, movieId);
}

export function toggleMovieSaveInCaches(queryClient: QueryClient, movieId: string): void {
  const detail = queryClient.getQueryData<MovieDetail>(movieKeys.detailFull(movieId));
  const nextIsSaved = detail ? !detail.is_saved : true;
  setMovieSaveInCaches(queryClient, movieId, nextIsSaved);
}

export async function cancelMovieSaveQueries(
  queryClient: QueryClient,
  movieId: string,
): Promise<void> {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: movieKeys.detailFull(movieId) }),
    queryClient.cancelQueries({ queryKey: movieKeys.savedLists() }),
  ]);
}
