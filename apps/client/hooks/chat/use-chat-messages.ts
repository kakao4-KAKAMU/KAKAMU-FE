import { useCallback, useMemo } from 'react';
import { chatKeys, useChatHistoryInfiniteQuery } from '@kakamu/query';
import type { ChatHistoryMessage } from '@kakamu/types';
import { useQueryClient } from '@tanstack/react-query';

import { useChatApiClient } from '@/hooks/api/useChatApiClient';
import { resolveHistoryMessagesFromInfinite } from '@/lib/chat/flatten-history-messages';
import { mergeChatMessages } from '@/lib/chat/merge-chat-messages';
import { useChatStream } from '@/providers/ChatStreamProvider';
import { useCurrentUserId } from '../auth/useCurrentUserId';

const HISTORY_PAGE_LIMIT = 30;

export function useChatMessages(activeSessionId: string, isNewSession: boolean) {
  const currentUserId = useCurrentUserId();
  if (!currentUserId) {
    throw new Error('Current user ID not found');
  }
  const client = useChatApiClient();
  const queryClient = useQueryClient();
  const { activeSessionMessages } = useChatStream();

  const historyQuery = useChatHistoryInfiniteQuery(
    client,
    isNewSession ? '' : activeSessionId,
    HISTORY_PAGE_LIMIT,
    currentUserId,
    {
      enabled: !isNewSession && Boolean(activeSessionId),
    },
  );

  const historyMessages = useMemo(
    () =>
      resolveHistoryMessagesFromInfinite(historyQuery.data, (messageId) =>
        queryClient.getQueryData<ChatHistoryMessage>(chatKeys.messageDetail(messageId)),
      ),
    [historyQuery.data, queryClient],
  );

  const messages = useMemo(
    () => mergeChatMessages(historyMessages, activeSessionMessages),
    [historyMessages, activeSessionMessages],
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
    isHistoryLoading: historyQuery.isLoading,
    isLoadingOlderMessages: historyQuery.isFetchingNextPage,
    hasMoreHistory,
    loadOlderMessages,
  };
}
