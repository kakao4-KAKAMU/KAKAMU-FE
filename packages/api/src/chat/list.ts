import type { ChatListParams, ChatListResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

function toChatListSearchParams(params: ChatListParams): Record<string, string> {
  return {
    user_id: params.user_id,
    limit: String(params.limit ?? 20),
    ...(typeof params.cursor === 'number' ? { cursor: String(params.cursor) } : {}),
  };
}

/** `GET .../chat/list` */
export async function getChatList(
  client: ApiClient,
  params: ChatListParams,
): Promise<ChatListResponse> {
  return client
    .get('chat/list', {
      searchParams: toChatListSearchParams(params),
    })
    .json<ChatListResponse>();
}
