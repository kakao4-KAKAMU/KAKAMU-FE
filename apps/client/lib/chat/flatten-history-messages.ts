import type { ChatHistoryMessage, ChatHistoryResponse } from '@kakamu/types';
import type { InfiniteData } from '@tanstack/react-query';

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

export function flattenHistoryPagesFromInfinite(
  data: InfiniteData<ChatHistoryResponse, number | null> | undefined,
): ChatHistoryMessage[] {
  return flattenHistoryMessages(data?.pages);
}
