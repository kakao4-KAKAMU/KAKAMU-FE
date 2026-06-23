import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { chatKeys, useChatListQuery } from '@kakamu/query';
import type { ChatSession } from '@kakamu/types';

import { useChatApiClient } from '@/hooks/api/useChatApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import {
  formatChatSessionPreview,
  formatChatSessionTime,
  formatChatSessionTitle,
} from '@/lib/chat/format-session-label';
import { NEW_CHAT_SESSION_ID } from '@/lib/chat/constants';

export type ChatThreadRowViewModel = {
  sessionId: string;
  title: string;
  preview: string;
  timeLabel: string;
};

export function useChatListScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const client = useChatApiClient();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();
  const listQuery = useChatListQuery(
    client,
    currentUserId
      ? {
          user_id: currentUserId,
        }
      : null,
  );

  const mapSessionId = useCallback(
    (sessionId: string): ChatThreadRowViewModel => {
      const session = queryClient.getQueryData<ChatSession>(chatKeys.detail(sessionId));
      if (!session) {
        return {
          sessionId,
          title: t('account.chat.thread.untitled'),
          preview: t('account.chat.thread.newPreview'),
          timeLabel: '',
        };
      }
      return {
        sessionId,
        title: formatChatSessionTitle(session, t('account.chat.thread.untitled')),
        preview: formatChatSessionPreview(session, t('account.chat.thread.newPreview')),
        timeLabel: formatChatSessionTime(session.last_active, i18n.language),
      };
    },
    [i18n.language, queryClient, t],
  );

  const threads = (listQuery.data ?? []).map(mapSessionId);

  const onOpenThread = useCallback(
    (sessionId: string) => {
      router.push(`/chat/${sessionId}` as const);
    },
    [router],
  );

  const onStartNewChat = useCallback(() => {
    router.push(`/chat/${NEW_CHAT_SESSION_ID}` as const);
  }, [router]);

  return {
    threads,
    isRefetching: listQuery.isRefetching,
    refetch: listQuery.refetch,
    onOpenThread,
    onStartNewChat,
  };
}
