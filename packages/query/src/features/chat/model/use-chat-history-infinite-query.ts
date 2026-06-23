import type { ApiClient } from '@kakamu/api';
import { getChatHistory } from '@kakamu/api';
import type { ChatHistoryResponse } from '@kakamu/types';
import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { chatKeys } from '../../../shared/keys/chat.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

export type ChatHistoryIdResponse = Omit<ChatHistoryResponse, 'messages'> & {
  messages: number[];
};

export type ChatHistoryIdInfiniteData = InfiniteData<ChatHistoryIdResponse, number | null>;

function selectChatHistoryMessageIds(
  data: InfiniteData<ChatHistoryResponse, number | null>,
): ChatHistoryIdInfiniteData {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      messages: page.messages.map((message) => message.id),
    })),
  };
}

export function useChatHistoryInfiniteQuery(
  client: ApiClient,
  sessionId: string,
  limit: number,
  user_id: string,
  options?: Omit<
    UseInfiniteQueryOptions<
      ChatHistoryResponse,
      unknown,
      ChatHistoryIdInfiniteData,
      ReturnType<typeof chatKeys.historyList>,
      number | null
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'select'
  >,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: chatKeys.historyList(sessionId, limit),
    enabled: Boolean(sessionId),
    queryFn: async ({ pageParam }) => {
      const response = await getChatHistory(client, sessionId, {
        limit,
        cursor: pageParam,
        user_id,
      });
      seedDetailCache(
        queryClient,
        response.messages,
        (message) => message.id,
        chatKeys.messageDetail,
      );
      return response;
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.next_cursor : null),
    select: selectChatHistoryMessageIds,
    ...options,
  });
}
