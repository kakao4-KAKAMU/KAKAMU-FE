import { postChatStream } from '@kakamu/api';
import type { ChatSseEvent, ChatStreamRequestBody } from '@kakamu/types';
import { useCallback } from 'react';

import { useChatApiClient } from '@/hooks/api/useChatApiClient';

/** `useChatApiClient` 기반 SSE 스트림 POST */
export function usePostChatStream() {
  const client = useChatApiClient();

  return useCallback(
    (
      body: ChatStreamRequestBody,
      onEvent: (event: ChatSseEvent) => void | Promise<void>,
      signal?: AbortSignal,
    ) => postChatStream(client, body, onEvent, signal),
    [client],
  );
}
