import {
  useQueryClient,
  useSuspenseQuery,
  type UseSuspenseQueryOptions,
} from '@tanstack/react-query';
import { getChatList, type ApiClient } from '@kakamu/api';
import type { ChatListParams, ChatListResponse, ChatSession } from '@kakamu/types';

import { chatKeys } from '../../../shared/keys/chat.keys';
import { seedDetailCache } from '../../../shared/lib/normalize-list-cache';

function selectChatSessionIds(data: ChatListResponse): string[] {
  return data.map((session) => session.session_id);
}

export function useChatListQuery(
  client: ApiClient,
  params: ChatListParams,
  options?: Omit<
    UseSuspenseQueryOptions<ChatListResponse, Error, string[]>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: chatKeys.list(),
    queryFn: async () => {
      const sessions = await getChatList(client, params);
      seedDetailCache(
        queryClient,
        sessions,
        (session) => session.session_id,
        chatKeys.detail,
      );
      return sessions;
    },
    select: selectChatSessionIds,
    ...options,
  });
}

export function useChatSessionQuery(
  sessionId: string,
  options?: Omit<UseSuspenseQueryOptions<ChatSession>, 'queryKey' | 'queryFn'>,
) {
  const queryClient = useQueryClient();

  return useSuspenseQuery({
    queryKey: chatKeys.detail(sessionId),
    queryFn: () => {
      const cached = queryClient.getQueryData<ChatSession>(chatKeys.detail(sessionId));
      if (!cached) {
        throw new Error(`Chat session ${sessionId} is not available in cache`);
      }
      return cached;
    },
    ...options,
  });
}
