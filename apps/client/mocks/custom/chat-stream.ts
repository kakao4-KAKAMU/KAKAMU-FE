import { http } from 'msw';

import { getApiBaseUrl } from '../api-base';
import { MOCK_PERSONA_ID, MOCK_USER_ID } from './fixtures';

function apiUrl(path: string): string {
  return `${getApiBaseUrl()}/${path.replace(/^\//, '')}`;
}

function encodeSseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

/** `POST /chat/completions` SSE 스트림 mock */
export const chatStreamHandlers = [
  http.post(apiUrl('chat/completions'), async ({ request }) => {
    const body = (await request.json()) as { session_id?: string; message?: string };
    const sessionId = body.session_id ?? 'mock-session-id';
    const messageId = 'mock-message-id';

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        controller.enqueue(
          encoder.encode(
            encodeSseEvent('open', {
              session_id: sessionId,
              message_id: messageId,
            }),
          ),
        );

        controller.enqueue(
          encoder.encode(
            encodeSseEvent('node', {
              type: 'node',
              data: {
                generate_reply: {
                  reply: `Mock 응답: ${body.message ?? ''}`.trim(),
                },
              },
            }),
          ),
        );

        controller.enqueue(
          encoder.encode(
            encodeSseEvent('done', {
              session_id: sessionId,
              message_id: messageId,
              user_id: MOCK_USER_ID,
              persona_id: MOCK_PERSONA_ID,
            }),
          ),
        );

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),
];
