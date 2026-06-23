import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getCommentsByPost } from '@kakamu/api';
import type { CommentIdListResponse } from '../lib/comment-cache';

import { commentKeys } from '../../../shared/keys/comment.keys';
import {
  DEFAULT_COMMENT_PAGE_SIZE,
  mapCommentListResponse,
  seedCommentDetailCacheFromList,
  toCommentIdListPage,
  type CommentInfiniteData,
} from '../lib/comment-cache';

export function useCommentsByPostInfiniteQuery(
  client: ApiClient,
  postId: number,
  pageSize: number = DEFAULT_COMMENT_PAGE_SIZE,
  options?: Omit<
    UseInfiniteQueryOptions<
      CommentIdListResponse,
      unknown,
      CommentInfiniteData,
      ReturnType<typeof commentKeys.byPostList>,
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: commentKeys.byPostList(postId, pageSize),
    queryFn: async ({ pageParam }) => {
      const response = await getCommentsByPost(client, postId, {
        page: pageParam,
        size: pageSize,
      });
      const mapped = mapCommentListResponse(response);
      seedCommentDetailCacheFromList(queryClient, postId, mapped.items);
      return toCommentIdListPage(mapped);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.total_pages
        ? lastPage.meta.current_page + 1
        : undefined,
    enabled: postId > 0,
    ...options,
  });
}
