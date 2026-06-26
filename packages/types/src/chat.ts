import type { MovieItem } from './movie';
import type { PostItem } from './post';

export type ChatSessionMetadata = Record<string, unknown>;

export type ChatMetadataType = 'movie' | 'feed';

export type ChatMetadataItem = {
  type: ChatMetadataType | null;
  id: string | null;
};

export type ChatMetadataList = {
  movie?: ChatMetadataItem[];
  feed?: ChatMetadataItem[];
};

export type ChatSession = {
  session_id: string;
  user_id: string;
  persona_id: string | null;
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
  role: 'user' | 'assistant' | string;
  content: string;
  created_at: string;
  reply_metadata?: ChatMetadataList | null;
  feed_list?: PostItem[];
  movie_list?: MovieItem[];
  /** 클라이언트 낙관적 메시지용 */
  persona_id?: string | null;
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
