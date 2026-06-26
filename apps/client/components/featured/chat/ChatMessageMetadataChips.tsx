import { useRouter } from 'expo-router';
import { Newspaper } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import type { TFunction } from '@kakamu/i18n';
import { Badge, cn, Icon, Text, TextClassProvider } from '@kakamu/ui';

import type { ChatMessageFeedChip } from '@/lib/chat/resolve-message-metadata-chips';

type ChatMessageMetadataChipsProps = {
  chips: ChatMessageFeedChip[];
  align: 'start' | 'end';
  t: TFunction;
};

export function ChatMessageMetadataChips({ chips, align, t }: ChatMessageMetadataChipsProps) {
  const router = useRouter();

  if (chips.length === 0) {
    return null;
  }

  return (
    <View
      className={cn(
        'max-w-[78%] flex-row flex-wrap gap-1.5',
        align === 'end' ? 'self-end' : 'self-start',
      )}
    >
      {chips.map((chip) => (
        <Pressable
          key={chip.key}
          onPress={() => {
            router.push(`/feed/${chip.id}` as const);
          }}
          accessibilityRole="button"
          accessibilityLabel={t('account.chat.message.chip.feedA11y', { title: chip.label })}
          className="active:opacity-80"
        >
          <Badge variant="outline" className="max-w-full gap-1 bg-card px-2.5 py-1">
            <TextClassProvider value="text-foreground">
              <Icon as={Newspaper} size={12} />
            </TextClassProvider>
            <Text className="shrink text-xs text-foreground" numberOfLines={1}>
              {chip.label}
            </Text>
          </Badge>
        </Pressable>
      ))}
    </View>
  );
}
