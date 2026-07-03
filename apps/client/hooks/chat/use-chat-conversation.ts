import { useCallback } from 'react';
import { useTranslation } from '@kakamu/i18n';
import { chatKeys } from '@kakamu/query';
import type { ChatSession } from '@kakamu/types';
import { usePersonaStore } from '@kakamu/store';
import { useQueryClient } from '@tanstack/react-query';

import { useCurrentUserOrThrow } from '@/hooks/auth/useCurrentUserId';
import { useChatMessages } from '@/hooks/chat/use-chat-messages';
import { useChatSend } from '@/hooks/chat/use-chat-send';
import { useChatSession } from '@/hooks/chat/use-chat-session';
import { formatChatSessionTitle } from '@/lib/chat/format-session-label';

export function useChatConversation(routeSessionId: string | undefined) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserOrThrow();
  const personaId = usePersonaStore((state) => state.selectedPersonaId);

  const invalidateList = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
  }, [queryClient]);

  const { isNewSession, activeSessionId, activeSessionIdRef, bindSessionId } = useChatSession({
    routeSessionId,
    onInvalidateList: invalidateList,
  });

  const {
    messages,
    isHistoryLoading,
    isLoadingOlderMessages,
    hasMoreHistory,
    loadOlderMessages,
  } = useChatMessages(activeSessionId, isNewSession);

  const onStreamDone = useCallback(
    async (sessionId: string | null) => {
      if (!sessionId || !isNewSession) {
        return;
      }

      bindSessionId(sessionId, { replaceRoute: true });
    },
    [bindSessionId, isNewSession],
  );

  const send = useChatSend({
    t,
    userId: currentUserId.id,
    personaId: personaId ?? null,
    activeSessionIdRef,
    bindSessionId,
    onInvalidateList: invalidateList,
    onStreamDone,
  });

  const matchedSession = queryClient.getQueryData<ChatSession>(
    chatKeys.detail(activeSessionId),
  );
  const headerTitle = isNewSession
    ? t('account.chat.thread.untitled')
    : formatChatSessionTitle(
        matchedSession ?? {
          session_id: activeSessionId,
          user_id: personaId ?? '',
          persona_id: personaId ?? null,
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
