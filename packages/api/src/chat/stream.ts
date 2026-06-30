import type { ChatSseEvent, ChatStreamRequestBody } from '@kakamu/types';

import type { ApiClient } from '../client';
import { readSseStream } from '../sse/read-sse-stream';

function parseSseDataPayload(data: string): unknown {
  try {
    return JSON.parse(data) as unknown;
  } catch (error) {
    console.error('parseSseDataPayload - error', error)
    return data;
  }
}

/** `POST .../stream` (SSE). 인증·페르소나 헤더는 `ApiClient` 인터셉터가 처리한다. */
export async function postChatStream(
  client: ApiClient,
  body: ChatStreamRequestBody,
  onEvent: (event: ChatSseEvent) => void | Promise<void>,
  signal?: AbortSignal,
): Promise<void> {
  const response = await client.post('chat/completions', {
    json: {
      session_id: body.session_id,
      message: body.message,
    },
    headers: { Accept: 'text/event-stream' },
    timeout: false,
    signal,
  });

  await readSseStream(
    response,
    async (message) => {
      await onEvent({
        event: message.event,
        data: parseSseDataPayload(message.data),
      });
    },
    signal,
  );
}
