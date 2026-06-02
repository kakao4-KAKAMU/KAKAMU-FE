import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getChatList, type ApiClient } from '@kakamu/api';
import type { ChatListResponse } from '@kakamu/types';

import { chatKeys } from '../../../shared/keys/chat.keys';

export function useChatListQuery(
  client: ApiClient,
  options?: Omit<UseQueryOptions<ChatListResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ChatListResponse>({
    queryKey: chatKeys.list(),
    queryFn: () => getChatList(client),
    ...options,
  });
}
