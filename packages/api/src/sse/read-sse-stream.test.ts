import { describe, expect, it, vi } from 'vitest';

import { readSseStream, type SseMessage } from './read-sse-stream';

function createSseResponse(chunks: string[]): Response {
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });

  // RN fetch BodyInit includes `_SourceUri`; web ReadableStream needs assertion in tests.
  type ResponseBody = NonNullable<ConstructorParameters<typeof Response>[0]>;
  return new Response(stream as unknown as ResponseBody);
}

function encodeEvent(event: string, data: string): string {
  return `event: ${event}\ndata: ${data}\n\n`;
}

describe('readSseStream', () => {
  it('dispatches multiple events delivered in a single chunk', async () => {
    const payload = encodeEvent('open', '{"session_id":"s1"}') + encodeEvent('node', '{"reply":"hi"}');

    const messages: SseMessage[] = [];
    await readSseStream(createSseResponse([payload]), (message) => {
      messages.push(message);
    });

    expect(messages).toEqual([
      { event: 'open', data: '{"session_id":"s1"}' },
      { event: 'node', data: '{"reply":"hi"}' },
    ]);
  });

  it('buffers events split across chunks', async () => {
    const first = 'event: open\ndata: {"session_id":"s1"}\n\nevent: node\ndata: ';
    const second = '{"reply":"hi"}\n\n';

    const messages: SseMessage[] = [];
    await readSseStream(createSseResponse([first, second]), (message) => {
      messages.push(message);
    });

    expect(messages).toEqual([
      { event: 'open', data: '{"session_id":"s1"}' },
      { event: 'node', data: '{"reply":"hi"}' },
    ]);
  });

  it('ignores comment-only blocks', async () => {
    const payload = ': ping\n\n' + encodeEvent('done', '{"ok":true}');

    const messages: SseMessage[] = [];
    await readSseStream(createSseResponse([payload]), (message) => {
      messages.push(message);
    });

    expect(messages).toEqual([{ event: 'done', data: '{"ok":true}' }]);
  });

  it('awaits async handlers sequentially', async () => {
    const payload = encodeEvent('open', '1') + encodeEvent('node', '2');
    const order: string[] = [];

    await readSseStream(createSseResponse([payload]), async (message) => {
      order.push(`start:${message.event}`);
      await new Promise((resolve) => setTimeout(resolve, 0));
      order.push(`end:${message.event}`);
    });

    expect(order).toEqual(['start:open', 'end:open', 'start:node', 'end:node']);
  });

  it('stops dispatching when aborted', async () => {
    const payload = encodeEvent('open', '1') + encodeEvent('node', '2');
    const controller = new AbortController();
    const handler = vi.fn(async () => {
      controller.abort();
    });

    await readSseStream(createSseResponse([payload]), handler, controller.signal);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
