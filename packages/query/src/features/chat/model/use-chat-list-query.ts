import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getChatList, type ApiClient } from '@kakamu/api';
import type { ChatListParams, ChatListResponse } from '@kakamu/types';

import { chatKeys } from '../../../shared/keys/chat.keys';

export function useChatListQuery(
  client: ApiClient,
  params: ChatListParams | null,
  options?: Omit<UseQueryOptions<ChatListResponse>, 'queryKey' | 'queryFn'>,
) {
  const enabled = !!params?.user_id && (options?.enabled ?? true);

  return useQuery<ChatListResponse>({
    queryKey: chatKeys.list(),
    queryFn: () => {
      if (!params) {
        return Promise.resolve([]);
      }
      return getChatList(client, params);
    },
    ...options,
    enabled,
  });
}
