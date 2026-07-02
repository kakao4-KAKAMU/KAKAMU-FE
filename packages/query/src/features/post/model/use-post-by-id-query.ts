import {
  useQueryClient,
  useSuspenseQuery,
  type QueryFunction,
  type UseSuspenseQueryOptions,
} from '@tanstack/react-query';
import type { ApiClient } from '@kakamu/api';
import { getPostById } from '@kakamu/api';
import type { PostItem } from '@kakamu/types';

import { postKeys } from '../../../shared/keys/post.keys';
import { seedPostDetailCache } from '../lib/post-infinite-cache';

export function usePostByIdQuery(
  client: ApiClient,
  postId: number,
  options?: Omit<UseSuspenseQueryOptions<PostItem>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: postKeys.detail(postId),
    queryFn: (async () => {
      const post = await getPostById(client, postId);
      seedPostDetailCache(queryClient, post);
      return post;
    }) as QueryFunction<PostItem>,
    ...options,
  });
}
