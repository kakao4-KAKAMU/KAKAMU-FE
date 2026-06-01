import type { PostListParams } from '@kakamu/types';

export const postKeys = {
  all: ['post'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: Omit<PostListParams, 'cursor'>) =>
    [...postKeys.lists(), params] as const,
  likedLists: () => [...postKeys.lists(), 'liked'] as const,
  likedList: (params: Omit<PostListParams, 'cursor'>) =>
    [...postKeys.likedLists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (postId: number) => [...postKeys.details(), postId] as const,
};
