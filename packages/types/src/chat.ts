export type ChatSessionMetadata = Record<string, unknown>;

export type ChatSession = {
  session_id: string;
  user_id: string;
  started_at: string;
  last_active: string;
  metadata: ChatSessionMetadata;
};

export type ChatListResponse = ChatSession[];

export type ChatHistoryMessage = {
  id: number;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant' | string;
  content: string;
  created_at: string;
  reply_metadata?: {
    type: 'movie',
    id: string
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
};

export type ChatStreamRequestBody = {
  user_id: string;
  session_id: string;
  message: string;
};

export type ChatSseEvent = {
  event: string;
  data: unknown;
};
