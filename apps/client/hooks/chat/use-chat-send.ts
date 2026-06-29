import { useCallback, useEffect, useRef, useState } from 'react';
import type { TFunction } from '@kakamu/i18n';
import type { ChatHistoryMessage, ChatSseEvent } from '@kakamu/types';
import { useErrorAlertDialog } from '@kakamu/ui';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

import { usePostChatStream } from '@/hooks/chat/use-post-chat-stream';
import { createEphemeralChatMessage } from '@/lib/chat/create-ephemeral-message';
import { mapChatStreamError } from '@/lib/error-message-map/chat/chat-stream-error';

type UseChatSendParams = {
  t: TFunction;
  userId: string;
  personaId: string | null;
  activeSessionIdRef: MutableRefObject<string>;
  assistantDraftIdRef: MutableRefObject<number | null>;
  allocateEphemeralId: () => number;
  setLocalMessages: Dispatch<SetStateAction<ChatHistoryMessage[]>>;
  applyStreamEventRef: MutableRefObject<(event: ChatSseEvent) => void | Promise<void>>;
};

export function useChatSend({
  t,
  userId,
  personaId,
  activeSessionIdRef,
  assistantDraftIdRef,
  allocateEphemeralId,
  setLocalMessages,
  applyStreamEventRef,
}: UseChatSendParams) {
  const postChatStream = usePostChatStream();
  const { open: openErrorAlert } = useErrorAlertDialog();

  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStatus, setStreamStatus] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const finalizeLocalMessages = useCallback(() => {
    setLocalMessages((prev) =>
      prev.map((message) =>
        message.status === 'pending' || message.processing
          ? {
              ...message,
              status: 'done' as const,
              processing: false,
            }
          : message,
      ),
    );
  }, [setLocalMessages]);

  const sendMessage = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed || isStreaming) {
      return;
    }

    setDraft('');
    const sessionId = activeSessionIdRef.current;
    const userMessage = createEphemeralChatMessage({
      id: allocateEphemeralId(),
      sessionId,
      userId: userId,
      personaId: personaId,
      role: 'user',
      content: trimmed,
      status: 'pending',
      processing: true,
    });
    const assistantMessage = createEphemeralChatMessage({
      id: allocateEphemeralId(),
      sessionId,
      userId: userId,
      personaId: personaId,
      role: 'assistant',
      content: '',
      status: 'processing',
      processing: true,
    });

    assistantDraftIdRef.current = assistantMessage.id;
    setLocalMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);
    setStreamStatus(t('account.chat.streamStatus.sending'));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await postChatStream(
        {
          persona_id: personaId,
          session_id: sessionId,
          message: trimmed,
        },
        (event) => applyStreamEventRef.current(event),
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        openErrorAlert(mapChatStreamError(error, t));
        setLocalMessages((prev) =>
          prev.filter((message) => message.id !== assistantMessage.id),
        );
      }
    } finally {
      assistantDraftIdRef.current = null;
      setIsStreaming(false);
      setStreamStatus(null);
      abortRef.current = null;
      finalizeLocalMessages();
    }
  }, [
    activeSessionIdRef,
    allocateEphemeralId,
    applyStreamEventRef,
    draft,
    finalizeLocalMessages,
    isStreaming,
    openErrorAlert,
    personaId,
    postChatStream,
    setLocalMessages,
    t,
  ]);

  const canSend = draft.trim().length > 0 && !isStreaming && Boolean(userId);

  return {
    draft,
    setDraft,
    sendMessage,
    canSend,
    isStreaming,
    streamStatus,
    setStreamStatus,
  };
}
