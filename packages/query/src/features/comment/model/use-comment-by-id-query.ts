import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { CommentItem } from '@kakamu/types';

import { commentKeys } from '../../../shared/keys/comment.keys';

export function useCommentByIdQuery(
  commentId: number,
  options?: Omit<UseSuspenseQueryOptions<CommentItem>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: commentKeys.detail(commentId),
    queryFn: () => {
      const cached = queryClient.getQueryData<CommentItem>(commentKeys.detail(commentId));
      if (!cached) {
        throw new Error(`Comment ${commentId} is not available in cache`);
      }
      return cached;
    },
    ...options,
  });
}
