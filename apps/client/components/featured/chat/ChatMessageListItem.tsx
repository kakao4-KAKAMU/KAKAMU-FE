import { View } from 'react-native';
import type { TFunction, i18n } from '@kakamu/i18n';
import type { ChatHistoryMessage } from '@kakamu/types';

import {
  resolveMessageFeedChips,
  resolveMessageMovies,
} from '@/lib/chat/resolve-message-metadata-chips';

import { ChatMessageBubble } from './ChatMessageBubble';
import { ChatMessageMetadataChips } from './ChatMessageMetadataChips';
import { ChatMessageMoviePosterList } from './ChatMessageMoviePosterList';

type ChatMessageListItemProps = {
  message: ChatHistoryMessage;
  t: TFunction;
  i18n: typeof i18n;
};

export function ChatMessageListItem({ message, t, i18n }: ChatMessageListItemProps) {
  const isUser = message.role === 'user';
  const hasContent = message.content.trim().length > 0;
  const movies = isUser ? [] : resolveMessageMovies(message);
  const feedChips = isUser ? [] : resolveMessageFeedChips(message);
  const hasMetadata = movies.length > 0 || feedChips.length > 0;

  if (!hasContent && !hasMetadata) {
    return null;
  }

  const align = isUser ? 'end' : 'start';

  return (
    <View className="gap-1.5">
      {hasContent ? <ChatMessageBubble message={message} t={t} i18n={i18n} /> : null}
      <ChatMessageMoviePosterList movies={movies} align={align} t={t} />
      <ChatMessageMetadataChips chips={feedChips} align={align} t={t} />
    </View>
  );
}
