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

export function formatChatSessionTime(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
  }

  const diffMs = now.getTime() - date.getTime();
  const dayMs = 86_400_000;

  if (diffMs < dayMs * 7) {
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
  }

  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date);
}

export function formatChatMessageTime(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
