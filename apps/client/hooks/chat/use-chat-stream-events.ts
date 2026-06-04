import { useCallback } from 'react';
import type { TFunction } from '@kakamu/i18n';
import { chatKeys } from '@kakamu/query';
import type { ChatHistoryMessage, ChatSseEvent } from '@kakamu/types';
import { useQueryClient } from '@tanstack/react-query';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

import {
  extractGenerateReplyFromNodeData,
  extractIdsFromStreamData,
  extractNodePhaseKey,
  normalizeChatStreamEvent,
} from '@/lib/chat/extract-stream-payload';
import { getStreamStatusLabel } from '@/lib/chat/stream-status-label';

type BindSessionId = (
  sessionId: string,
  options?: { invalidateList?: boolean; replaceRoute?: boolean },
) => void;

type UseChatStreamEventsParams = {
  t: TFunction;
  bindSessionId: BindSessionId;
  assistantDraftIdRef: MutableRefObject<number | null>;
  setLocalMessages: Dispatch<SetStateAction<ChatHistoryMessage[]>>;
  setStreamStatus: Dispatch<SetStateAction<string | null>>;
  onStreamDone: (sessionId: string | null) => void | Promise<void>;
};

export function useChatStreamEvents({
  t,
  bindSessionId,
  assistantDraftIdRef,
  setLocalMessages,
  setStreamStatus,
  onStreamDone,
}: UseChatStreamEventsParams) {
  const queryClient = useQueryClient();

  const applyStreamEvent = useCallback(
    async (sseEvent: ChatSseEvent) => {
      const { type, data } = normalizeChatStreamEvent(sseEvent);
      const nodePhaseKey = type === 'node' ? extractNodePhaseKey(data) : null;

      setStreamStatus(getStreamStatusLabel(t, type, nodePhaseKey));

      switch (type) {
        case 'open': {
          const ids = extractIdsFromStreamData(data);
          if (ids?.sessionId) {
            bindSessionId(ids.sessionId);
          }
          break;
        }
        case 'node': {
          const reply = extractGenerateReplyFromNodeData(data);
          const targetId = assistantDraftIdRef.current;
          if (reply && targetId !== null) {
            setLocalMessages((prev) =>
              prev.map((message) =>
                message.id === targetId
                  ? {
                      ...message,
                      content: reply,
                      status: 'processing',
                      processing: true,
                    }
                  : message,
              ),
            );
          }
          break;
        }
        case 'done': {
          const ids = extractIdsFromStreamData(data);
          const sessionId = ids?.sessionId ?? null;

          if (sessionId) {
            bindSessionId(sessionId, { invalidateList: true });
          } else {
            void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
          }

          const targetId = assistantDraftIdRef.current;
          if (targetId !== null) {
            setLocalMessages((prev) =>
              prev.filter(
                (message) =>
                  message.id !== targetId || message.content.trim().length > 0,
              ),
            );
          }

          setStreamStatus(null);
          await onStreamDone(sessionId);
          break;
        }
        default:
          break;
      }
    },
    [
      assistantDraftIdRef,
      bindSessionId,
      onStreamDone,
      queryClient,
      setLocalMessages,
      setStreamStatus,
      t,
    ],
  );

  return { applyStreamEvent };
}
