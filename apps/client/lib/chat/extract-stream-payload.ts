import type { ChatSseEvent } from '@kakamu/types';

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

/** `open` / `done` payload에서 `session_id`를 추출한다. */
export function extractSessionIdFromStreamData(data: unknown): string | null {
  const root = asRecord(data);
  if (!root) {
    return null;
  }

  return readString(root.session_id);
}

/**
 * `node` payload에서 `generate_reply.reply`만 추출한다.
 * (embed_query, plan_intent, retrieve_movies 등은 UI에 반영하지 않음)
 */
/** `node` payload의 LangGraph 노드 키 (예: `plan_intent`) */
export function extractNodePhaseKey(data: unknown): string | null {
  const root = asRecord(data);
  if (!root) {
    return null;
  }

  const [firstKey] = Object.keys(root);
  return firstKey ?? null;
}

export function extractGenerateReplyFromNodeData(data: unknown): string | null {
  const root = asRecord(data);
  if (!root) {
    return null;
  }

  const generateReply = asRecord(root.generate_reply);
  if (!generateReply) {
    return null;
  }

  return readString(generateReply.reply);
}
