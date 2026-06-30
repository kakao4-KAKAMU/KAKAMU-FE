import type { TFunction } from '@kakamu/i18n';
import type { ChatSseEvent, ChatStreamRequestBody } from '@kakamu/types';

import type { ChatMessageSession } from '@/lib/chat/chat-message-session';
import {
  extractGenerateReplyPayloadFromNodeData,
  extractIdsFromStreamData,
  extractNodePhaseKey,
  extractPersistHistoryReplyIdFromNodeData,
  normalizeChatStreamEvent,
} from '@/lib/chat/extract-stream-payload';
import { getStreamStatusLabel } from '@/lib/chat/stream-status-label';
import type { BindSessionId } from '@/lib/chat/types';

type PostChatStreamFn = (
  body: ChatStreamRequestBody,
  onEvent: (event: ChatSseEvent) => void | Promise<void>,
  signal?: AbortSignal,
) => Promise<void>;

export type ChatStreamConnectionDeps = {
  postChatStream: PostChatStreamFn;
  bindSessionId: BindSessionId;
  onInvalidateList: () => void;
  onStreamDone: (sessionId: string | null) => void | Promise<void>;
  setStreamStatus: (status: string | null) => void;
  t: TFunction;
};

export class ChatStreamConnection {
  private abortController: AbortController | null = null;
  private aborted = false;

  constructor(
    readonly session: ChatMessageSession,
    private readonly deps: ChatStreamConnectionDeps,
  ) {}

  async start(body: ChatStreamRequestBody): Promise<void> {
    const controller = new AbortController();
    this.abortController = controller;
    this.aborted = false;

    try {
      await this.deps.postChatStream(
        body,
        (event) => this.applyStreamEvent(event),
        controller.signal,
      );
    } finally {
      this.abortController = null;
    }
  }

  abort(): void {
    this.aborted = true;
    this.abortController?.abort();
    this.abortController = null;
  }

  wasAborted(): boolean {
    return this.aborted;
  }

  private async applyStreamEvent(sseEvent: ChatSseEvent): Promise<void> {
    const { type, data } = normalizeChatStreamEvent(sseEvent);

    this.deps.setStreamStatus(
      getStreamStatusLabel(this.deps.t, type, type === 'node' ? extractNodePhaseKey(data) : null),
    );

    switch (type) {
      case 'open': {
        const ids = extractIdsFromStreamData(data);
        if (!ids?.sessionId) {
          return;
        }
        this.deps.bindSessionId(ids.sessionId);
        this.session.applyOpen(ids);
        return;
      }
      case 'node': {
        this.session.applyNode(
          extractGenerateReplyPayloadFromNodeData(data),
          extractPersistHistoryReplyIdFromNodeData(data),
        );
        return;
      }
      case 'done': {
        const sessionId = extractIdsFromStreamData(data)?.sessionId ?? null;

        requestAnimationFrame(() => {
          setTimeout(() => {
            this.session.applyDone(sessionId);
          }, 1000)
          this.deps.setStreamStatus(null);
        })
        await this.deps.onStreamDone(sessionId);
      }
    }
  }
}
