import type { ChatHistoryMessage } from '@kakamu/types';

export function isChatMessagePending(message: ChatHistoryMessage): boolean {
  return (
    message.status === 'pending' ||
    message.status === 'processing' ||
    message.processing === true
  );
}
