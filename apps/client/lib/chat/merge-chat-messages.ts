import type { ChatHistoryMessage } from '@kakamu/types';

/** 서버 히스토리와 스트리밍 중 로컬 메시지를 단일 `ChatHistoryMessage` 목록으로 합친다. */
export function mergeChatMessages(
  history: ChatHistoryMessage[],
  local: ChatHistoryMessage[],
): ChatHistoryMessage[] {
  if (local.length === 0) {
    return history;
  }

  if (history.length === 0) {
    return local;
  }

  const merged = new Map<number, ChatHistoryMessage>();
  for (const message of history) {
    merged.set(message.id, message);
  }
  for (const message of local) {
    merged.set(message.id, message);
  }

  return Array.from(merged.values()).sort(
    (left, right) =>
      new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
  );
}
