import { skipToken, useSuspenseQuery, type QueryFunction, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getPostById } from '@kakamu/api';
import type { PostItem } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';

export function usePostByIdQuery(
  client: ApiClient,
  postId: number,
  options?: Omit<UseSuspenseQueryOptions<PostItem>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery({
    queryKey: postKeys.detail(postId),
    queryFn: (postId > 0 ? () => getPostById(client, postId) : skipToken) as QueryFunction<PostItem>,
    ...options,
  });
}
