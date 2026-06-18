import type { ChatSession } from '@kakamu/types';

function readMetadataTitle(metadata: ChatSession['metadata']): string | null {
  const title = metadata.title;
  return typeof title === 'string' && title.trim().length > 0 ? title.trim() : null;
}

function readMetadataPreview(metadata: ChatSession['metadata']): string | null {
  const preview = metadata.preview ?? metadata.last_message;
  return typeof preview === 'string' && preview.trim().length > 0 ? preview.trim() : null;
}

export function formatChatSessionTitle(session: ChatSession, untitledLabel: string): string {
  return readMetadataTitle(session.metadata) ?? untitledLabel;
}

export function formatChatSessionPreview(
  session: ChatSession,
  fallback: string,
): string {
  return readMetadataPreview(session.metadata) ?? fallback;
}

export { formatMessageTime as formatChatMessageTime } from '@/lib/time';
export { formatSessionListTime as formatChatSessionTime } from '@/lib/time';
