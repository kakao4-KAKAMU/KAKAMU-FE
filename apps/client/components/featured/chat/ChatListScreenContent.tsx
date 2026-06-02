import { Plus, Sparkles } from 'lucide-react-native';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { Button, Icon, Text, TextClassProvider } from '@kakamu/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChatListScreen } from '@/hooks/chat/use-chat-list-screen';

import { ChatThreadRow } from './ChatThreadRow';
import { ConditionalRender } from '@/components/utils';

export function ChatListScreenContent() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { threads, isLoading, isRefetching, refetch, onOpenThread, onStartNewChat } =
    useChatListScreen();

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <Text variant="h3" className="font-bold">
            {t('account.chat.list.title')}
          </Text>
          <View className="size-8 items-center justify-center rounded-full bg-muted">
            <TextClassProvider value="text-foreground">
              <Icon as={Sparkles} size={18} />
            </TextClassProvider>
          </View>
        </View>
        <Text className="mt-2 text-sm text-muted-foreground">
          {t('account.chat.list.subtitle')}
        </Text>
      </View>
      
      <ConditionalRender.Boolean
        condition={isLoading}
        render={{
          true: <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>,
          false: <FlatList
            data={threads}
            keyExtractor={(item) => item.sessionId}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: insets.bottom + 96,
              gap: 10,
              flexGrow: threads.length === 0 ? 1 : 0,
            }}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-16">
                <Text className="text-center text-sm text-muted-foreground">
                  {t('account.chat.list.empty')}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <ChatThreadRow thread={item} onPress={() => onOpenThread(item.sessionId)} />
            )}
          />
        }}
      />

      <View
        className="absolute right-4"
        style={{ bottom: insets.bottom + 88 }}
      >
        <Button
          size="icon"
          className="size-14 rounded-full shadow-lg shadow-black/20"
          onPress={onStartNewChat}
          accessibilityRole="button"
          accessibilityLabel={t('account.chat.list.newChatA11y')}
        >
          <TextClassProvider value="text-primary-foreground">
            <Icon as={Plus} size={24} />
          </TextClassProvider>
        </Button>
      </View>
    </View>
  );
}
