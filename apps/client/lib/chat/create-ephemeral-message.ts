import type { ChatHistoryMessage } from '@kakamu/types';

type CreateEphemeralMessageParams = {
  id: number;
  sessionId: string;
  userId: string;
  personaId: string | null;
  role: ChatHistoryMessage['role'];
  content: string;
  status?: ChatHistoryMessage['status'];
  processing?: boolean;
};

export function createEphemeralChatMessage({
  id,
  sessionId,
  userId,
  personaId,
  role,
  content,
  status = 'pending',
  processing = true,
}: CreateEphemeralMessageParams): ChatHistoryMessage {
  return {
    id,
    session_id: sessionId,
    user_id: userId,
    persona_id: personaId,
    role,
    content,
    created_at: new Date().toISOString(),
    status,
    processing,
  };
}
