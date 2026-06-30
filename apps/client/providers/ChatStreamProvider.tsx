import type { ChatHistoryMessage } from '@kakamu/types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';

import type { ChatMessageSession } from '@/lib/chat/chat-message-session';
import type { ChatStreamConnection } from '@/lib/chat/chat-stream-connection';

type ChatStreamContextValue = {
  activeSessionMessages: ChatHistoryMessage[];
  isStreaming: boolean;
  registerSession: (session: ChatMessageSession) => void;
  registerConnection: (uuid: string, connection: ChatStreamConnection) => void;
  unregisterConnection: (uuid: string) => void;
};

const ChatStreamContext = createContext<ChatStreamContextValue | null>(null);

function collectSessionMessages(
  sessions: Record<string, ChatMessageSession>,
): ChatHistoryMessage[] {
  return Object.values(sessions).flatMap((session) => session.getMessages());
}

export function ChatStreamProvider({ children }: { children: ReactNode }) {
  const sessionsRef = useRef<Record<string, ChatMessageSession>>({});
  const connectionsRef = useRef<Record<string, ChatStreamConnection>>({});
  const [version, bumpVersion] = useReducer((v: number) => v + 1, 0);

  const registerSession = useCallback((session: ChatMessageSession) => {
    sessionsRef.current[session.uuid] = session;

    const onChange = () => bumpVersion();
    session.on('update', onChange);
    session.on('done', onChange);
    session.on('error', onChange);
    bumpVersion();
  }, []);

  const registerConnection = useCallback((uuid: string, connection: ChatStreamConnection) => {
    connectionsRef.current[uuid] = connection;
    bumpVersion();
  }, []);

  const unregisterConnection = useCallback((uuid: string) => {
    delete connectionsRef.current[uuid];
    bumpVersion();
  }, []);

  const value = useMemo<ChatStreamContextValue>(
    () => ({
      activeSessionMessages: collectSessionMessages(sessionsRef.current),
      isStreaming: Object.keys(connectionsRef.current).length > 0,
      registerSession,
      registerConnection,
      unregisterConnection,
    }),
    [version, registerSession, registerConnection, unregisterConnection],
  );

  return <ChatStreamContext.Provider value={value}>{children}</ChatStreamContext.Provider>;
}

export function useChatStream(): ChatStreamContextValue {
  const context = useContext(ChatStreamContext);
  if (!context) {
    throw new Error('useChatStream must be used within ChatStreamProvider');
  }
  return context;
}
