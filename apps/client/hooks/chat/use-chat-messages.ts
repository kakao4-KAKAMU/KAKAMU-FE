import { getChatHistory } from '@kakamu/api';
import { useCallback, useMemo, useRef, useState } from 'react';
import { chatKeys, useChatHistoryInfiniteQuery } from '@kakamu/query';
import type { ChatHistoryMessage, ChatHistoryResponse } from '@kakamu/types';
import { useQueryClient } from '@tanstack/react-query';

import { useChatApiClient } from '@/hooks/api/useChatApiClient';
import { flattenHistoryPagesFromInfinite } from '@/lib/chat/flatten-history-messages';
import { mergeChatMessages } from '@/lib/chat/merge-chat-messages';
import { useCurrentUserId } from '../auth/useCurrentUserId';

const HISTORY_PAGE_LIMIT = 30;

export function useChatMessages(activeSessionId: string, isNewSession: boolean) {
  const currentUserId = useCurrentUserId();
  if (!currentUserId) {
    throw new Error('Current user ID not found');
  }
  const client = useChatApiClient();
  const queryClient = useQueryClient();
  const historyQuery = useChatHistoryInfiniteQuery(
    client,
    isNewSession ? '' : activeSessionId,
    HISTORY_PAGE_LIMIT,
    currentUserId,
    {
      enabled: !isNewSession && Boolean(activeSessionId),
    },
  );

  const [localMessages, setLocalMessages] = useState<ChatHistoryMessage[]>([]);
  const nextEphemeralIdRef = useRef(-1);

  const allocateEphemeralId = useCallback(() => {
    const id = nextEphemeralIdRef.current;
    nextEphemeralIdRef.current -= 1;
    return id;
  }, []);

  const historyMessages = useMemo(
    () => flattenHistoryPagesFromInfinite(historyQuery.data),
    [historyQuery.data],
  );

  const messages = useMemo(
    () => mergeChatMessages(historyMessages, localMessages),
    [historyMessages, localMessages],
  );

  const clearLocalMessages = useCallback(() => {
    setLocalMessages([]);
  }, []);

  const prefetchHistory = useCallback(
    async (sessionId: string) => {
      await queryClient.prefetchInfiniteQuery({
        queryKey: chatKeys.historyList(sessionId, HISTORY_PAGE_LIMIT),
        queryFn: ({ pageParam }) =>
          getChatHistory(client, sessionId, {
            limit: HISTORY_PAGE_LIMIT,
            cursor: pageParam as number | null,
            user_id: currentUserId,
          }),
        initialPageParam: null as number | null,
        getNextPageParam: (lastPage: ChatHistoryResponse) =>
          lastPage.has_more ? lastPage.next_cursor : null,
      });
    },
    [client, queryClient],
  );

  const invalidateHistory = useCallback(
    (sessionId: string) => {
      void queryClient.invalidateQueries({
        queryKey: chatKeys.historyList(sessionId, HISTORY_PAGE_LIMIT),
      });
    },
    [queryClient],
  );

  const hasMoreHistory = Boolean(historyQuery.hasNextPage);

  const loadOlderMessages = useCallback(() => {
    if (!hasMoreHistory || historyQuery.isFetchingNextPage) {
      return;
    }
    void historyQuery.fetchNextPage();
  }, [hasMoreHistory, historyQuery]);

  return {
    messages,
    localMessages,
    setLocalMessages,
    allocateEphemeralId,
    clearLocalMessages,
    prefetchHistory,
    invalidateHistory,
    isHistoryLoading: historyQuery.isLoading,
    isLoadingOlderMessages: historyQuery.isFetchingNextPage,
    hasMoreHistory,
    loadOlderMessages,
  };
}
