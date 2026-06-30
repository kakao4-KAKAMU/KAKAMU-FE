import { useCallback, useEffect, useRef, useState } from 'react';
import type { TFunction } from '@kakamu/i18n';
import { useErrorAlertDialog } from '@kakamu/ui';
import type { RefObject } from 'react';

import { usePostChatStream } from '@/hooks/chat/use-post-chat-stream';
import { ChatMessageSession } from '@/lib/chat/chat-message-session';
import { ChatStreamConnection } from '@/lib/chat/chat-stream-connection';
import { mapChatStreamError } from '@/lib/error-message-map/chat/chat-stream-error';
import type { BindSessionId } from '@/lib/chat/types';
import { useChatStream } from '@/providers/ChatStreamProvider';

type UseChatSendParams = {
  t: TFunction;
  userId: string;
  personaId: string | null;
  activeSessionIdRef: RefObject<string>;
  bindSessionId: BindSessionId;
  onInvalidateList: () => void;
  onStreamDone: (sessionId: string | null) => void | Promise<void>;
};

export function useChatSend({
  t,
  userId,
  personaId,
  activeSessionIdRef,
  bindSessionId,
  onInvalidateList,
  onStreamDone,
}: UseChatSendParams) {
  const postChatStream = usePostChatStream();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const { isStreaming, registerSession, registerConnection, unregisterConnection } = useChatStream();

  const [draft, setDraft] = useState('');
  const [streamStatus, setStreamStatus] = useState<string | null>(null);
  const activeConnectionRef = useRef<ChatStreamConnection | null>(null);

  useEffect(() => {
    return () => {
      activeConnectionRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed || isStreaming) {
      return;
    }

    setDraft('');

    const session = ChatMessageSession.create({
      sessionId: activeSessionIdRef.current,
      userId,
      personaId,
      userContent: trimmed,
    });

    const connection = new ChatStreamConnection(session, {
      postChatStream,
      bindSessionId,
      onInvalidateList,
      onStreamDone,
      setStreamStatus,
      t,
    });

    registerSession(session);
    registerConnection(session.uuid, connection);
    activeConnectionRef.current = connection;
    setStreamStatus(t('account.chat.streamStatus.sending'));

    try {
      await connection.start({
        persona_id: personaId,
        session_id: activeSessionIdRef.current,
        message: trimmed,
      });
    } catch (error) {
      if (connection.wasAborted()) {
        return;
      }
      session.markFailed(error);
      openErrorAlert(mapChatStreamError(error, t));
    } finally {
      requestAnimationFrame(() => {
        unregisterConnection(session.uuid);
        activeConnectionRef.current = null;
        setStreamStatus(null);
        if (!session.isStreamCompleted) {
          session.finalize();
        }
      })

    }
  }, [
    activeSessionIdRef,
    bindSessionId,
    draft,
    isStreaming,
    onInvalidateList,
    onStreamDone,
    openErrorAlert,
    personaId,
    postChatStream,
    registerConnection,
    registerSession,
    t,
    unregisterConnection,
    userId,
  ]);

  const canSend = draft.trim().length > 0 && !isStreaming && Boolean(userId);

  return {
    draft,
    setDraft,
    sendMessage,
    canSend,
    isStreaming,
    streamStatus,
  };
}
