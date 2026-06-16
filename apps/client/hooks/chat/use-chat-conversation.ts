import { useCallback, useRef } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { chatKeys, useChatListQuery } from '@kakamu/query';
import type { ChatSession, ChatSseEvent } from '@kakamu/types';
import { usePersonaStore } from '@kakamu/store';
import { useQueryClient } from '@tanstack/react-query';

import { useChatApiClient } from '@/hooks/api/useChatApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import { useChatMessages } from '@/hooks/chat/use-chat-messages';
import { useChatSend } from '@/hooks/chat/use-chat-send';
import { useChatSession } from '@/hooks/chat/use-chat-session';
import { useChatStreamEvents } from '@/hooks/chat/use-chat-stream-events';
import { formatChatSessionTitle } from '@/lib/chat/format-session-label';

function findSession(sessions: ChatSession[] | undefined, sessionId: string): ChatSession | undefined {
  return sessions?.find((item) => item.session_id === sessionId);
}

export function useChatConversation(routeSessionId: string | undefined) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const client = useChatApiClient();
  const currentUserId = useCurrentUserId();
  const listQuery = useChatListQuery(
    client,
    currentUserId
      ? {
          user_id: currentUserId,
        }
      : null,
  );
  const personaId = usePersonaStore((state) => state.selectedPersonaId);

  const assistantDraftIdRef = useRef<number | null>(null);
  const applyStreamEventRef = useRef<(event: ChatSseEvent) => void | Promise<void>>(async () => {});

  const invalidateList = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
  }, [queryClient]);

  const { isNewSession, activeSessionId, activeSessionIdRef, bindSessionId } = useChatSession({
    routeSessionId,
    onInvalidateList: invalidateList,
  });

  const {
    messages,
    setLocalMessages,
    allocateEphemeralId,
    clearLocalMessages,
    prefetchHistory,
    invalidateHistory,
    isHistoryLoading,
    isLoadingOlderMessages,
    hasMoreHistory,
    loadOlderMessages,
  } = useChatMessages(activeSessionId, isNewSession);

  const onStreamDone = useCallback(
    async (sessionId: string | null) => {
      if (!sessionId) {
        return;
      }

      invalidateHistory(sessionId);
      await prefetchHistory(sessionId);

      if (isNewSession) {
        bindSessionId(sessionId, { replaceRoute: true });
        return;
      }

      clearLocalMessages();
    },
    [
      bindSessionId,
      clearLocalMessages,
      invalidateHistory,
      isNewSession,
      prefetchHistory,
    ],
  );

  const send = useChatSend({
    t,
    personaId,
    activeSessionIdRef,
    assistantDraftIdRef,
    allocateEphemeralId,
    setLocalMessages,
    applyStreamEventRef,
  });

  const { applyStreamEvent } = useChatStreamEvents({
    t,
    bindSessionId,
    assistantDraftIdRef,
    setLocalMessages,
    setStreamStatus: send.setStreamStatus,
    onStreamDone,
  });

  applyStreamEventRef.current = applyStreamEvent;

  const matchedSession = findSession(listQuery.data, activeSessionId);
  const headerTitle = isNewSession
    ? t('account.chat.thread.untitled')
    : formatChatSessionTitle(
        matchedSession ?? {
          session_id: activeSessionId,
          user_id: personaId ?? '',
          started_at: '',
          last_active: '',
          metadata: {},
        },
        t('account.chat.thread.untitled'),
      );

  return {
    headerTitle,
    messages,
    draft: send.draft,
    setDraft: send.setDraft,
    sendMessage: send.sendMessage,
    canSend: send.canSend,
    isStreaming: send.isStreaming,
    streamStatus: send.streamStatus,
    isHistoryLoading,
    isLoadingOlderMessages,
    hasMoreHistory,
    loadOlderMessages,
    introText: t('account.chat.conversation.intro'),
    inputPlaceholder: t('account.chat.conversation.inputPlaceholder'),
    sendA11y: t('account.chat.conversation.sendA11y'),
  };
}
