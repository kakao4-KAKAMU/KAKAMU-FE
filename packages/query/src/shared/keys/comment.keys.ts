export const commentKeys = {
  all: ['comment'] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (commentId: number) => [...commentKeys.details(), commentId] as const,
  byPostLists: () => [...commentKeys.all, 'by-post'] as const,
  byPostList: (postId: number) => [...commentKeys.byPostLists(), postId] as const,
};
