import { skipToken, useSuspenseQuery, type QueryFunction, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { getChatList, type ApiClient } from '@kakamu/api';
import type { ChatListParams, ChatListResponse } from '@kakamu/types';

import { chatKeys } from '../../../shared/keys/chat.keys';

export function useChatListQuery(
  client: ApiClient,
  params: ChatListParams | null,
  options?: Omit<UseSuspenseQueryOptions<ChatListResponse>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery({
    queryKey: chatKeys.list(),
    queryFn: (params?.user_id
      ? () => getChatList(client, params)
      : skipToken) as QueryFunction<ChatListResponse>,
    ...options,
  });
}
