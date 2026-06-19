export type ChatSessionMetadata = Record<string, unknown>;

export type ChatSession = {
  session_id: string;
  user_id: string;
  started_at: string;
  last_active: string;
  metadata: ChatSessionMetadata;
};

export type ChatListResponse = ChatSession[];
export type ChatListParams = {
  user_id: string;
  cursor?: number | null;
  limit?: number;
};

export type ChatHistoryMessage = {
  id: number;
  session_id: string;
  user_id: string;
  persona_id: string | null;
  role: 'user' | 'assistant' | string;
  content: string;
  created_at: string;
  reply_metadata?: {
    type: 'movie';
    id: string;
  };
  status?: 'pending' | 'processing' | 'done';
  processing?: boolean;
};

export type ChatHistoryResponse = {
  messages: ChatHistoryMessage[];
  next_cursor: number | null;
  has_more: boolean;
};

export type ChatHistoryParams = {
  cursor?: number | null;
  limit: number;
  user_id: string;
};

export type ChatRequest = {
  message: string;
  session_id: string;
};

/** SSE 스트림 요청 — `user_id`는 클라이언트에서 추가 전송 */
export type ChatStreamRequestBody = ChatRequest & {
  user_id: string;
  persona_id: string | null;
};

export type ChatSseEvent = {
  event: string;
  data: unknown;
};
