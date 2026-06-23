import type { ChatHistoryMessage, ChatHistoryResponse } from '@kakamu/types';
import type { InfiniteData } from '@tanstack/react-query';

type ChatHistoryIdInfiniteData = InfiniteData<
  { messages: number[]; next_cursor: number | null; has_more: boolean },
  number | null
>;

/** API 페이지(최신→과거)를 화면 표시 순서(과거→최신)로 펼친다. */
export function flattenHistoryMessages(
  pages: ChatHistoryResponse[] | undefined,
): ChatHistoryMessage[] {
  if (!pages?.length) {
    return [];
  }

  return pages
    .flatMap((page) => page.messages)
    .slice()
    .reverse();
}

export function flattenHistoryMessageIds(
  pages: Array<{ messages: number[] }> | undefined,
): number[] {
  if (!pages?.length) {
    return [];
  }

  return pages.flatMap((page) => page.messages).slice().reverse();
}

export function flattenHistoryPagesFromInfinite(
  data: InfiniteData<ChatHistoryResponse, number | null> | undefined,
): ChatHistoryMessage[] {
  return flattenHistoryMessages(data?.pages);
}

export function resolveHistoryMessagesFromInfinite(
  data: ChatHistoryIdInfiniteData | undefined,
  getMessage: (messageId: number) => ChatHistoryMessage | undefined,
): ChatHistoryMessage[] {
  const ids = flattenHistoryMessageIds(data?.pages);
  return ids
    .map((messageId) => getMessage(messageId))
    .filter((message): message is ChatHistoryMessage => message != null);
}
