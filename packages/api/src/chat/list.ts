import type { ChatListResponse } from '@kakamu/types';
import type { ApiClient } from '../client';

/** `GET .../chat/list` */
export async function getChatList(client: ApiClient): Promise<ChatListResponse> {
  return client.get('list').json<ChatListResponse>();
}
