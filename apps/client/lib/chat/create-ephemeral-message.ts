import type { ChatHistoryMessage } from '@kakamu/types';

type CreateEphemeralMessageParams = {
  id: number;
  sessionId: string;
  userId: string;
  role: ChatHistoryMessage['role'];
  content: string;
  status?: ChatHistoryMessage['status'];
  processing?: boolean;
};

export function createEphemeralChatMessage({
  id,
  sessionId,
  userId,
  role,
  content,
  status = 'pending',
  processing = true,
}: CreateEphemeralMessageParams): ChatHistoryMessage {
  return {
    id,
    session_id: sessionId,
    user_id: userId,
    role,
    content,
    created_at: new Date().toISOString(),
    status,
    processing,
  };
}
