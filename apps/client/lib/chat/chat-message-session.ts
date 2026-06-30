import EventEmitter from 'eventemitter3';
import type { ChatHistoryMessage } from '@kakamu/types';

import { createEphemeralChatMessage } from '@/lib/chat/create-ephemeral-message';
import type { GenerateReplyPayload } from '@/lib/chat/extract-stream-payload';

let nextEphemeralId = -1;

function allocateEphemeralId(): number {
  const id = nextEphemeralId;
  nextEphemeralId -= 1;
  return id;
}

export type ChatMessageSessionEvents = {
  update: [session: ChatMessageSession];
  done: [session: ChatMessageSession];
  error: [session: ChatMessageSession, error: unknown];
};

type CreateSessionParams = {
  sessionId: string;
  userId: string;
  personaId: string | null;
  userContent: string;
};

export class ChatMessageSession extends EventEmitter<ChatMessageSessionEvents> {
  readonly uuid: string;
  userMessage: ChatHistoryMessage;
  assistantMessage: ChatHistoryMessage;

  private assistantRemoved = false;
  private streamCompleted = false;

  private constructor(
    uuid: string,
    userMessage: ChatHistoryMessage,
    assistantMessage: ChatHistoryMessage,
  ) {
    super();
    this.uuid = uuid;
    this.userMessage = userMessage;
    this.assistantMessage = assistantMessage;
  }

  static create({
    sessionId,
    userId,
    personaId,
    userContent,
  }: CreateSessionParams): ChatMessageSession {
    const userMessage = createEphemeralChatMessage({
      id: allocateEphemeralId(),
      sessionId,
      userId,
      personaId,
      role: 'user',
      content: userContent,
      status: 'pending',
      processing: true,
    });
    const assistantMessage = createEphemeralChatMessage({
      id: allocateEphemeralId(),
      sessionId,
      userId,
      personaId,
      role: 'assistant',
      content: '',
      status: 'processing',
      processing: true,
    });

    return new ChatMessageSession(crypto.randomUUID(), userMessage, assistantMessage);
  }

  get isStreamCompleted(): boolean {
    return this.streamCompleted;
  }

  getMessages(): ChatHistoryMessage[] {
    return this.assistantRemoved
      ? [this.userMessage]
      : [this.userMessage, this.assistantMessage];
  }

  applyOpen(ids: { sessionId: string; messageId: number | null }): void {
    this.patchSessionId(ids.sessionId);

    if (ids.messageId !== null) {
      this.userMessage = {
        ...this.userMessage,
        id: ids.messageId,
        session_id: ids.sessionId,
        status: 'done',
        processing: false,
      };
    }

    this.emitUpdate();
  }

  applyNode(payload: GenerateReplyPayload | null, replyId: number | null): void {
    if (payload) {
      this.assistantMessage = {
        ...this.assistantMessage,
        content: payload.reply,
        movie_list: payload.movieList,
        feed_list: payload.feedList,
        status: 'processing',
        processing: true,
      };
    }

    if (replyId !== null) {
      this.assistantMessage = {
        ...this.assistantMessage,
        id: replyId,
        status: 'processing',
        processing: true,
      };
    }

    this.emitUpdate();
  }

  applyDone(sessionId: string | null): void {
    if (sessionId) {
      this.patchSessionId(sessionId);
    }

    this.removeEmptyAssistant();
    this.finalize();
    this.streamCompleted = true;
    this.emitUpdate();
    this.emit('done', this);
  }

  finalize(): void {
    this.userMessage = {
      ...this.userMessage,
      status: 'done',
      processing: false,
    };

    if (!this.assistantRemoved) {
      this.assistantMessage = {
        ...this.assistantMessage,
        status: 'done',
        processing: false,
      };
    }
  }

  markFailed(error: unknown): void {
    this.assistantRemoved = true;
    this.finalize();
    this.emitUpdate();
    this.emit('error', this, error);
  }

  private removeEmptyAssistant(): void {
    if (this.assistantMessage.content.trim().length === 0) {
      this.assistantRemoved = true;
    }
  }

  private patchSessionId(sessionId: string): void {
    this.userMessage = { ...this.userMessage, session_id: sessionId };
    if (!this.assistantRemoved) {
      this.assistantMessage = { ...this.assistantMessage, session_id: sessionId };
    }
  }

  private emitUpdate(): void {
    this.emit('update', this);
  }
}
