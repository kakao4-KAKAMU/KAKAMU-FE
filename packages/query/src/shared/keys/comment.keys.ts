export const commentKeys = {
  all: ['comment'] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (commentId: number) => [...commentKeys.details(), commentId] as const,
  spoilerDetails: () => [...commentKeys.all, 'spoiler'] as const,
  spoilerDetail: (commentId: number) => [...commentKeys.spoilerDetails(), commentId] as const,
  byPostLists: () => [...commentKeys.all, 'by-post'] as const,
  byPostList: (postId: number, pageSize: number) =>
    [...commentKeys.byPostLists(), postId, pageSize] as const,
  savedLists: () => [...commentKeys.all, 'saved'] as const,
  savedList: (pageSize: number) => [...commentKeys.savedLists(), pageSize] as const,
};
