import { useMemo } from 'react';
import { useTranslation } from '@kakamu/i18n';
import {
  useSavedCommentsInfiniteQuery,
  useSavedMoviesInfiniteQuery,
  useSavedPostsInfiniteQuery,
} from '@kakamu/query';
import type { ApiClient } from '@kakamu/api';

import type {
  ProfileSavedCategory,
  ProfileSavedCategoryId,
} from '@/components/featured/profileScreen/types';

export function useProfileSavedQueries(client: ApiClient) {
  const postsQuery = useSavedPostsInfiniteQuery(client, { limit: 20 });
  const commentsQuery = useSavedCommentsInfiniteQuery(client);
  const moviesQuery = useSavedMoviesInfiniteQuery(client, { limit: 20 });

  return { postsQuery, commentsQuery, moviesQuery };
}

function countSavedPosts(
  pages: { items: number[] }[] | undefined,
): number {
  return pages?.flatMap((page) => page.items).length ?? 0;
}

function countSavedComments(
  pages: { items: number[]; meta?: { total_count?: number } }[] | undefined,
): number {
  const firstPage = pages?.[0];
  if (firstPage?.meta?.total_count != null) {
    return firstPage.meta.total_count;
  }
  return pages?.flatMap((page) => page.items).length ?? 0;
}

function countSavedMovies(
  pages: { items: string[] }[] | undefined,
): number {
  return pages?.flatMap((page) => page.items).length ?? 0;
}

export function useProfileSavedCategories(
  queries: ReturnType<typeof useProfileSavedQueries>,
): ProfileSavedCategory[] {
  const { t } = useTranslation();
  const { postsQuery, commentsQuery, moviesQuery } = queries;

  return useMemo(() => {
    const counts: Record<ProfileSavedCategoryId, number> = {
      posts: countSavedPosts(postsQuery.data?.pages),
      comments: countSavedComments(commentsQuery.data?.pages),
      movies: countSavedMovies(moviesQuery.data?.pages),
    };

    return [
      {
        id: 'posts',
        title: t('account.profile.saved.posts'),
        itemCount: counts.posts,
      },
      {
        id: 'comments',
        title: t('account.profile.saved.comments'),
        itemCount: counts.comments,
      },
      {
        id: 'movies',
        title: t('account.profile.saved.movies'),
        itemCount: counts.movies,
      },
    ];
  }, [commentsQuery.data, moviesQuery.data, postsQuery.data, t]);
}
