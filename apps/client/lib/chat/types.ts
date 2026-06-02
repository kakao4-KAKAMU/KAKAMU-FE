export type ChatUiMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
  pending?: boolean;
  metadata?: Record<string, unknown>;
};

export const NEW_CHAT_SESSION_ID = 'new';
