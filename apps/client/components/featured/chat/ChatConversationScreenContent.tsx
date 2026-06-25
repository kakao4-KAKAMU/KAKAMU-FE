import { useFocusEffect } from 'expo-router';
import { Bot } from 'lucide-react-native';
import { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Text, TextClassProvider } from '@kakamu/ui';
import { useTranslation } from '@kakamu/i18n';

import { ProfileSubpageHeader } from '@/components/featured/header/ProfileSubpageHeader';
import { useChatConversation } from '@/hooks/chat/use-chat-conversation';
import { AppSuspenseBoundary } from '@/components/error-boundary';

import { ChatComposer } from './ChatComposer';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ConditionalRender } from '@/components/utils';
import { ChatConversationScreenContentSkeleton } from './ChatConversationScreenContent.skeleton';

type ChatConversationScreenContentProps = {
  sessionId: string;
};

const SCROLL_BOTTOM_THRESHOLD = 200;

export function ChatConversationScreenContent({
  sessionId,
}: ChatConversationScreenContentProps) {
  return (
    <AppSuspenseBoundary fallback={<ChatConversationScreenContentSkeleton />}>
      <ChatConversationScreenContentInner sessionId={sessionId} />
    </AppSuspenseBoundary>
  );
}

function ChatConversationScreenContentInner({
  sessionId,
}: ChatConversationScreenContentProps) {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const {
    headerTitle,
    messages,
    draft,
    setDraft,
    sendMessage,
    canSend,
    isStreaming,
    streamStatus,
    isHistoryLoading,
    isLoadingOlderMessages,
    hasMoreHistory,
    loadOlderMessages,
    introText,
    inputPlaceholder,
    sendA11y,
  } = useChatConversation(sessionId);

  const listRef = useRef<FlatList>(null);
  const isUserControllingScrollRef = useRef(false);

  const scrollToBottom = useCallback((animated = false) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated });
    });
  }, []);

  const scrollIfAllowed = useCallback(() => {
    if (isHistoryLoading || isLoadingOlderMessages || isUserControllingScrollRef.current) {
      return;
    }
    scrollToBottom();
  }, [isHistoryLoading, isLoadingOlderMessages, scrollToBottom]);

  const handleScrollBeginDrag = useCallback(() => {
    isUserControllingScrollRef.current = true;
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    if (
      contentSize.height - layoutMeasurement.height - contentOffset.y <=
      SCROLL_BOTTOM_THRESHOLD
    ) {
      isUserControllingScrollRef.current = false;
    }
  }, []);

  const handleContentSizeChange = useCallback(() => {
    scrollIfAllowed();
  }, [scrollIfAllowed]);

  useFocusEffect(
    useCallback(() => {
      isUserControllingScrollRef.current = false;
      scrollIfAllowed();
    }, [sessionId, scrollIfAllowed]),
  );

  useEffect(() => {
    if (isHistoryLoading) {
      return;
    }
    isUserControllingScrollRef.current = false;
    scrollToBottom();
  }, [isHistoryLoading, sessionId, scrollToBottom]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof messages)[number] }) => (
      <ChatMessageBubble message={item} t={t} i18n={i18n} />
    ),
    [],
  );

  return (
    <View className="flex-1 bg-background">
      <ProfileSubpageHeader title={headerTitle} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <FlatList
          data={messages}
          ref={listRef}
          keyExtractor={(item) => String(item.id)}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 12,
            gap: 12,
            flexGrow: messages.length === 0 ? 1 : 0,
          }}
          ListHeaderComponent={
            <View className="mb-2 gap-2">
              <View className="flex-row items-start gap-2.5 rounded-xl bg-muted px-3 py-3">
                <TextClassProvider value="text-foreground">
                  <Icon as={Bot} size={22} />
                </TextClassProvider>
                <Text className="flex-1 text-[13px] leading-5 text-foreground">{introText}</Text>
              </View>
              <ConditionalRender.Boolean
                condition={hasMoreHistory}
                render={{
                  true: <Pressable
                    className="items-center rounded-md py-2 active:opacity-80"
                    onPress={loadOlderMessages}
                    disabled={isLoadingOlderMessages}
                  >
                    <ConditionalRender.Boolean
                      condition={isLoadingOlderMessages}
                      render={{
                        true: <ActivityIndicator size="small" />,
                        false: (
                          <Text className="text-xs text-muted-foreground">
                            {t('account.chat.conversation.loadOlder')}
                          </Text>
                        ),
                      }}
                    />
                  </Pressable>
                }}
              />
              <ConditionalRender.Boolean
                condition={isHistoryLoading}
                render={{
                  true: <View className="py-1">
                    <ActivityIndicator size="small" />
                  </View>
                }}
              />
            </View>
          }
          ListFooterComponent={
            <ConditionalRender.Boolean
              condition={streamStatus}
              render={{
                true: <Text className="text-center text-xs text-muted-foreground">{streamStatus}</Text>
              }}
            />
          }
          renderItem={renderItem}
        />

        <ChatComposer
          value={draft}
          onChangeText={setDraft}
          onSend={sendMessage}
          canSend={canSend}
          isStreaming={isStreaming}
          placeholder={inputPlaceholder}
          sendA11y={sendA11y}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
