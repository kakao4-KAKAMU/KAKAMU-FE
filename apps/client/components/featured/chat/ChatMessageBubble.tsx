import { View } from 'react-native';
import { Text } from '@kakamu/ui';
import { useMemo } from 'react';
import type { ChatUiMessage } from '@/lib/chat/types';
import { formatChatMessageTime } from '@/lib/chat/format-session-label';
import { TFunction, i18n } from '@kakamu/i18n';
import { cn } from '@kakamu/ui';
import { ConditionalRender } from '@/components/utils';

type ChatMessageBubbleProps = {
  message: ChatUiMessage;
  t: TFunction;
  i18n: typeof i18n;
};

export function ChatMessageBubble({ message, t, i18n }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';

  if (!message.content.trim()) {
    return null;
  }
  const renderingState = useMemo(() => {
    if (message.pending) return 'pending';
    if (message.createdAt) return 'created';
    return 'unknown';
  }, [message.pending, message.createdAt]);
  return (
    <View className={cn('w-full', isUser ? 'items-end' : 'items-start')}>
      <View
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-3',
          isUser
            ? 'rounded-br-sm bg-foreground'
            : 'rounded-bl-sm bg-muted',
        )}
      >
        <Text
          className={cn(
            'text-sm leading-5',
            isUser ? 'text-background' : 'text-foreground',
          )}
        >
          {message.content}
        </Text>
        <View className="mt-1 flex-row items-center justify-end gap-1">
          <ConditionalRender
            condition={renderingState}
            render={{
              pending: <Text
                className={cn(
                  'text-[10px]',
                  isUser ? 'text-background/70' : 'text-muted-foreground',
                )}
              >
                {t('account.chat.message.pending')}
              </Text>,
              created: <Text
                className={cn(
                  'text-[10px]',
                  isUser ? 'text-background/70' : 'text-muted-foreground',
                )}
              >
                {formatChatMessageTime(message.createdAt!, i18n.language)}
              </Text>
            }}
          />
        </View>
      </View>
    </View>
  );
}
