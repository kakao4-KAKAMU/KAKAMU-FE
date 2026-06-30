import { useLocalSearchParams } from 'expo-router';

import { ChatConversationScreenContent } from '@/components/featured/chat';
import { ChatStreamProvider } from '@/providers/ChatStreamProvider';

export default function ChatConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ChatStreamProvider>
      <ChatConversationScreenContent sessionId={id ?? 'new'} />
    </ChatStreamProvider>
  );
}
