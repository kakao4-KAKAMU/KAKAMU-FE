import type { ReactNode } from 'react';
import { ProfileFeedPanel } from './ProfileFeedPanel';
import { ProfileSavedCommentsPanel } from './ProfileSavedCommentsPanel';
import { ProfileSavedEmptyState } from './ProfileSavedEmptyState';
import { ProfileSavedMoviesPanel } from './ProfileSavedMoviesPanel';
import type { ProfileSavedCategoryId } from '@/components/featured/profileScreen/types';
import type { useProfileSavedQueries } from '@/hooks/profile/useProfileSavedCategories';

type ProfileSavedCategoryContentProps = {
  categoryId: ProfileSavedCategoryId;
  queries: ReturnType<typeof useProfileSavedQueries>;
};

function renderSavedList(
  categoryId: ProfileSavedCategoryId,
  queries: ReturnType<typeof useProfileSavedQueries>,
): ReactNode {
  const postIds = queries.postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const commentIds = queries.commentsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const movieIds = queries.moviesQuery.data?.pages.flatMap((page) => page.items) ?? [];

  switch (categoryId) {
    case 'posts':
      if (postIds.length === 0) {
        return <ProfileSavedEmptyState />;
      }
      return <ProfileFeedPanel postsIds={postIds} />;
    case 'comments':
      if (commentIds.length === 0) {
        return <ProfileSavedEmptyState />;
      }
      return <ProfileSavedCommentsPanel commentIds={commentIds} />;
    case 'movies':
      if (movieIds.length === 0) {
        return <ProfileSavedEmptyState />;
      }
      return <ProfileSavedMoviesPanel movieIds={movieIds} />;
    default:
      return <ProfileSavedEmptyState />;
  }
}

export function ProfileSavedCategoryContent({
  categoryId,
  queries,
}: ProfileSavedCategoryContentProps) {
  return renderSavedList(categoryId, queries);
}
