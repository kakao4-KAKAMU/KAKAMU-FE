import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getPostById } from '@kakamu/api';
import type { PostItem } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';

export function usePostByIdQuery(
  client: ApiClient,
  postId: number,
  options?: Omit<UseQueryOptions<PostItem>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostById(client, postId),
    ...options,
    enabled: (options?.enabled ?? true) && postId > 0,
  });
}
