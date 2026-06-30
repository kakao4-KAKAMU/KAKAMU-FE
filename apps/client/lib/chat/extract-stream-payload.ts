import type { ChatSseEvent, MovieItem, PostItem } from '@kakamu/types';

export type ChatStreamEventType = 'open' | 'node' | 'done';

export type NormalizedChatStreamEvent = {
  type: ChatStreamEventType | string;
  data: unknown;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

/**
 * SSE `event` 필드 또는 data 내부 `{ type, data }` 래퍼를 정규화한다.
 */
export function normalizeChatStreamEvent(sseEvent: ChatSseEvent): NormalizedChatStreamEvent {
  const root = asRecord(sseEvent.data);
  const embeddedType = root ? readString(root.type) : null;

  if (embeddedType && 'data' in root!) {
    return {
      type: embeddedType,
      data: root!.data,
    };
  }

  return {
    type: sseEvent.event,
    data: sseEvent.data,
  };
}

function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** `open` / `done` payload에서 `session_id`·`message_id`를 추출한다. */
export function extractIdsFromStreamData(
  data: unknown,
): { sessionId: string; messageId: number | null } | null {
  const root = asRecord(data);
  if (!root) {
    return null;
  }

  const sessionId = readString(root.session_id);
  if (!sessionId) {
    return null;
  }

  return {
    sessionId,
    messageId: readNumber(root.message_id),
  };
}

export type GenerateReplyPayload = {
  reply: string;
  movieList: MovieItem[];
  feedList: PostItem[];
};

/** `node` payload의 `generate_reply` 블록을 추출한다. */
export function extractGenerateReplyPayloadFromNodeData(
  data: unknown,
): GenerateReplyPayload | null {
  const root = asRecord(data);
  if (!root) {
    return null;
  }

  const generateReply = asRecord(root.generate_reply);
  if (!generateReply) {
    return null;
  }

  const reply = readString(generateReply.reply);
  if (!reply) {
    return null;
  }

  const movieList = Array.isArray(generateReply.movie_list)
    ? (generateReply.movie_list as MovieItem[])
    : [];
  const feedList = Array.isArray(generateReply.feed_list)
    ? (generateReply.feed_list as PostItem[])
    : [];

  return { reply, movieList, feedList };
}

/** `node` payload의 `persist_history.reply_id`를 추출한다. */
export function extractPersistHistoryReplyIdFromNodeData(data: unknown): number | null {
  const root = asRecord(data);
  if (!root) {
    return null;
  }

  const persistHistory = asRecord(root.persist_history);
  if (!persistHistory) {
    return null;
  }

  return readNumber(persistHistory.reply_id);
}

/** `node` payload의 LangGraph 노드 키 (예: `plan_intent`) */
export function extractNodePhaseKey(data: unknown): string | null {
  const root = asRecord(data);
  if (!root) {
    return null;
  }

  const [firstKey] = Object.keys(root);
  return firstKey ?? null;
}
