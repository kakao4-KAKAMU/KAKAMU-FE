import {
  useInfiniteQuery,
  useQueryClient,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getSavedCommentList } from '@kakamu/api';

import { commentKeys } from '../../../shared/keys/comment.keys';
import {
  DEFAULT_COMMENT_PAGE_SIZE,
  mapCommentListResponse,
  seedCommentDetailCacheFromList,
  toCommentIdListPage,
  type CommentIdListResponse,
  type CommentInfiniteData,
} from '../../comment/lib/comment-cache';

export function useSavedCommentsInfiniteQuery(
  client: ApiClient,
  pageSize: number = DEFAULT_COMMENT_PAGE_SIZE,
  options?: Omit<
    UseInfiniteQueryOptions<
      CommentIdListResponse,
      unknown,
      CommentInfiniteData,
      ReturnType<typeof commentKeys.savedList>,
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: commentKeys.savedList(pageSize),
    queryFn: async ({ pageParam }) => {
      const response = await getSavedCommentList(client, {
        page: pageParam,
        size: pageSize,
      });
      const mapped = mapCommentListResponse(response);
      seedCommentDetailCacheFromList(queryClient, 0, mapped.items);
      return toCommentIdListPage(mapped);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.total_pages
        ? lastPage.meta.current_page + 1
        : undefined,
    ...options,
  });
}
