import type { ChatHistoryParams, ChatHistoryResponse } from '@kakamu/types';

import type { ApiClient } from '../client';

function toHistorySearchParams(params: ChatHistoryParams): Record<string, string> {
  return {
    limit: String(params.limit),
    ...(typeof params.cursor === 'number' ? { cursor: String(params.cursor) } : {}),
  };
}

/** `GET .../history/{session_id}` */
export async function getChatHistory(
  client: ApiClient,
  sessionId: string,
  params: ChatHistoryParams,
): Promise<ChatHistoryResponse> {
  return client
    .get(`history/${sessionId}`, {
      searchParams: toHistorySearchParams(params),
    })
    .json<ChatHistoryResponse>();
}
