import { useLocalSearchParams } from 'expo-router';

import { ChatConversationScreenContent } from '@/components/featured/chat';

export default function ChatConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ChatConversationScreenContent sessionId={id ?? 'new'} />;
}
