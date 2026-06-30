export type SseMessage = {
  event: string;
  data: string;
};

type SseMessageHandler = (message: SseMessage) => void | Promise<void>;

const SSE_BLOCK_DELIMITER = /(?:\r\n|\n){2}/;

function parseSseBlock(block: string): SseMessage | null {
  const trimmed = block.trim();
  if (!trimmed) {
    return null;
  }

  // comment-only block (e.g. `: ping`)
  if (trimmed.startsWith(':')) {
    return null;
  }

  let event = 'message';
  const dataLines: string[] = [];

  for (const rawLine of trimmed.split('\n')) {
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;

    if (line.startsWith(':')) {
      continue;
    }
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (dataLines.length === 0) {
    return null;
  }

  return { event, data: dataLines.join('\n') };
}

function splitBufferedBlocks(buffer: string): { blocks: string[]; remainder: string } {
  const parts = buffer.split(SSE_BLOCK_DELIMITER);
  const remainder = parts.pop() ?? '';
  return { blocks: parts, remainder };
}

/**
 * ReadableStream 기반 SSE 파서.
 * 핸들러가 Promise를 반환하면 이벤트마다 await하여 UI 갱신 타이밍을 보장한다.
 */
export async function readSseStream(
  response: Response,
  onMessage: SseMessageHandler,
  signal?: AbortSignal,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('SSE response has no body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  const dispatchBlocks = async (blocks: string[]) => {
    for (const block of blocks) {
      if (signal?.aborted) {
        return;
      }

      const message = parseSseBlock(block);
      if (!message) {
        continue;
      }

      await onMessage(message);
    }
  };

  try {
    while (true) {
      if (signal?.aborted) {
        break;
      }

      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const { blocks, remainder } = splitBufferedBlocks(buffer);
      buffer = remainder;
      await dispatchBlocks(blocks);
    }

    if (!signal?.aborted && buffer.trim()) {
      await dispatchBlocks([buffer]);
    }
  } finally {
    reader.releaseLock();
  }
}
