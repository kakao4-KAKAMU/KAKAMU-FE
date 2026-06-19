import type { ApiClient } from '@kakamu/api';
import { getChatHistory } from '@kakamu/api';
import type { ChatHistoryResponse } from '@kakamu/types';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { chatKeys } from '../../../shared/keys/chat.keys';

export function useChatHistoryInfiniteQuery(
  client: ApiClient,
  sessionId: string,
  limit: number,
  user_id: string,
  options?: Omit<
    UseInfiniteQueryOptions<
      ChatHistoryResponse,
      unknown,
      InfiniteData<ChatHistoryResponse, number | null>,
      ReturnType<typeof chatKeys.historyList>,
      number | null
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >,
) {
  return useInfiniteQuery({
    queryKey: chatKeys.historyList(sessionId, limit),
    enabled: Boolean(sessionId),
    queryFn: ({ pageParam }) =>
      getChatHistory(client, sessionId, {
        limit,
        cursor: pageParam,
        user_id: user_id,
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.next_cursor : null),
    ...options,
  });
}
