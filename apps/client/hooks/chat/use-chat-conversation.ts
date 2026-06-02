import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import { chatKeys, useChatHistoryInfiniteQuery, useChatListQuery } from '@kakamu/query';
import type { ChatHistoryMessage, ChatSession, ChatSseEvent } from '@kakamu/types';
import { usePersonaStore } from '@kakamu/store';
import { useQueryClient } from '@tanstack/react-query';
import { useErrorAlertDialog } from '@kakamu/ui';

import { useChatApiClient } from '@/hooks/api/useChatApiClient';
import { usePostChatStream } from '@/hooks/chat/use-post-chat-stream';
import {
  extractGenerateReplyFromNodeData,
  extractNodePhaseKey,
  extractSessionIdFromStreamData,
  normalizeChatStreamEvent,
} from '@/lib/chat/extract-stream-payload';
import { formatChatSessionTitle } from '@/lib/chat/format-session-label';
import { getStreamStatusLabel } from '@/lib/chat/stream-status-label';
import { NEW_CHAT_SESSION_ID, type ChatUiMessage } from '@/lib/chat/types';
import { mapChatStreamError } from '@/lib/error-message-map/chat/chat-stream-error';

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function findSession(sessions: ChatSession[] | undefined, sessionId: string): ChatSession | undefined {
  return sessions?.find((item) => item.session_id === sessionId);
}

function mapHistoryMessageToUiMessage(message: ChatHistoryMessage): ChatUiMessage {
  return {
    id: `history-${message.id}`,
    role: message.role === 'assistant' ? 'assistant' : 'user',
    content: message.content,
    createdAt: message.created_at,
    metadata: {
      source: 'history',
      historyId: message.id,
      sessionId: message.session_id,
      userId: message.user_id,
    },
  };
}

export function useChatConversation(routeSessionId: string | undefined) {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const client = useChatApiClient();
  const postChatStream = usePostChatStream();
  const listQuery = useChatListQuery(client);
  const isNewSession = routeSessionId === NEW_CHAT_SESSION_ID || !routeSessionId;
  const [activeSessionId, setActiveSessionId] = useState(
    isNewSession ? '' : (routeSessionId ?? ''),
  );
  const historyQuery = useChatHistoryInfiniteQuery(
    client,
    isNewSession ? '' : activeSessionId,
    30,
    {
      enabled: !isNewSession && Boolean(activeSessionId),
    },
  );
  const personaId = usePersonaStore((state) => state.selectedPersonaId);
  const { open: openErrorAlert } = useErrorAlertDialog();

  const [ephemeralMessages, setEphemeralMessages] = useState<ChatUiMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStatus, setStreamStatus] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const assistantDraftIdRef = useRef<string | null>(null);
  const activeSessionIdRef = useRef(activeSessionId);
  const hasReplacedRouteRef = useRef(false);

  activeSessionIdRef.current = activeSessionId;

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    hasReplacedRouteRef.current = false;
    if (isNewSession) {
      setActiveSessionId('');
      return;
    }
    setActiveSessionId(routeSessionId ?? '');
  }, [isNewSession, routeSessionId]);

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

  const historyMessages = useMemo(() => {
    if (isNewSession) {
      return [] as ChatUiMessage[];
    }

    const pages = historyQuery.data?.pages ?? [];
    const mapped = pages
      .flatMap((page) => page.messages)
      .map(mapHistoryMessageToUiMessage);

    return mapped.slice().reverse();
  }, [historyQuery.data?.pages, isNewSession]);

  const messages = useMemo(() => {
    if (historyMessages.length === 0) {
      return ephemeralMessages;
    }

    const merged = [...historyMessages];
    const existingIds = new Set(merged.map((message) => message.id));
    for (const message of ephemeralMessages) {
      if (!existingIds.has(message.id)) {
        merged.push(message);
      }
    }
    return merged;
  }, [ephemeralMessages, historyMessages]);

  const bindSessionIdRef = useRef<(sessionId: string, options?: { invalidateList?: boolean }) => void>(
    () => undefined,
  );

  bindSessionIdRef.current = (sessionId, options) => {
    if (!sessionId) {
      return;
    }

    if (sessionId !== activeSessionIdRef.current) {
      activeSessionIdRef.current = sessionId;
      setActiveSessionId(sessionId);

      if (isNewSession && !hasReplacedRouteRef.current) {
        hasReplacedRouteRef.current = true;
        router.replace(`/chat/${sessionId}` as const);
      }
    }

    if (options?.invalidateList) {
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    }
  };

  const applyStreamEvent = useCallback(async (sseEvent: ChatSseEvent) => {
    const { type, data } = normalizeChatStreamEvent(sseEvent);
    const nodePhaseKey = type === 'node' ? extractNodePhaseKey(data) : null;

    setStreamStatus(getStreamStatusLabel(t, type, nodePhaseKey));

    switch (type) {
      case 'open': {
        const sessionId = extractSessionIdFromStreamData(data);
        if (sessionId) {
          bindSessionIdRef.current(sessionId);
        }
        break;
      }
      case 'node': {
        const reply = extractGenerateReplyFromNodeData(data);
        const targetId = assistantDraftIdRef.current;
        if (reply && targetId) {
          setEphemeralMessages((prev) =>
            prev.map((message) =>
              message.id === targetId ? { ...message, content: reply } : message,
            ),
          );
        }
        break;
      }
      case 'done': {
        const sessionId = extractSessionIdFromStreamData(data);
        if (sessionId) {
          bindSessionIdRef.current(sessionId, { invalidateList: true });
        } else {
          void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
        }

        const targetId = assistantDraftIdRef.current;
        if (targetId) {
          setEphemeralMessages((prev) =>
            prev.filter(
              (message) => message.id !== targetId || message.content.trim().length > 0,
            ),
          );
        }
        setStreamStatus(null);
        break;
      }
      default:
        break;
    }
  }, [queryClient, t]);

  const sendMessage = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed || isStreaming || !personaId) {
      return;
    }

    setDraft('');
    const userMessage: ChatUiMessage = {
      id: createMessageId(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
      pending: true,
      metadata: {},
    };
    const assistantMessage: ChatUiMessage = {
      id: createMessageId(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      pending: true,
      metadata: {},
    };

    assistantDraftIdRef.current = assistantMessage.id;
    setEphemeralMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);
    setStreamStatus(t('account.chat.streamStatus.sending'));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await postChatStream(
        {
          user_id: personaId,
          session_id: activeSessionIdRef.current,
          message: trimmed,
        },
        applyStreamEvent,
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        openErrorAlert(mapChatStreamError(error, t));
        setEphemeralMessages((prev) =>
          prev.filter((message) => message.id !== assistantMessage.id),
        );
      }
    } finally {
      assistantDraftIdRef.current = null;
      setIsStreaming(false);
      setStreamStatus(null);
      abortRef.current = null;
      setEphemeralMessages((prev) =>
        prev.map((message) =>
          message.pending ? { ...message, pending: false } : message,
        ),
      );
    }
  }, [applyStreamEvent, draft, isStreaming, openErrorAlert, personaId, postChatStream, t]);

  const canSend = draft.trim().length > 0 && !isStreaming && Boolean(personaId);
  const hasMoreHistory = Boolean(historyQuery.hasNextPage);

  const loadOlderMessages = useCallback(() => {
    if (!hasMoreHistory || historyQuery.isFetchingNextPage) {
      return;
    }
    void historyQuery.fetchNextPage();
  }, [hasMoreHistory, historyQuery]);

  return {
    headerTitle,
    messages,
    draft,
    setDraft,
    sendMessage,
    canSend,
    isStreaming,
    streamStatus,
    isHistoryLoading: historyQuery.isLoading,
    isLoadingOlderMessages: historyQuery.isFetchingNextPage,
    hasMoreHistory,
    loadOlderMessages,
    introText: t('account.chat.conversation.intro'),
    inputPlaceholder: t('account.chat.conversation.inputPlaceholder'),
    sendA11y: t('account.chat.conversation.sendA11y'),
  };
}
