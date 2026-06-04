import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { NEW_CHAT_SESSION_ID } from '@/lib/chat/constants';

export function isNewChatRouteSessionId(routeSessionId: string | undefined): boolean {
  return routeSessionId === NEW_CHAT_SESSION_ID || !routeSessionId;
}

type BindSessionOptions = {
  invalidateList?: boolean;
  replaceRoute?: boolean;
};

type UseChatSessionParams = {
  routeSessionId: string | undefined;
  onInvalidateList?: () => void;
};

export function useChatSession({ routeSessionId, onInvalidateList }: UseChatSessionParams) {
  const router = useRouter();
  const isNewSession = isNewChatRouteSessionId(routeSessionId);
  const [activeSessionId, setActiveSessionId] = useState(
    isNewSession ? '' : (routeSessionId ?? ''),
  );
  const activeSessionIdRef = useRef(activeSessionId);
  const hasReplacedRouteRef = useRef(false);

  activeSessionIdRef.current = activeSessionId;

  useEffect(() => {
    hasReplacedRouteRef.current = false;
    if (isNewSession) {
      setActiveSessionId('');
      return;
    }
    setActiveSessionId(routeSessionId ?? '');
  }, [isNewSession, routeSessionId]);

  const bindSessionId = useCallback(
    (sessionId: string, options?: BindSessionOptions) => {
      if (!sessionId) {
        return;
      }

      if (sessionId !== activeSessionIdRef.current) {
        activeSessionIdRef.current = sessionId;
        setActiveSessionId(sessionId);
      }

      if (options?.invalidateList) {
        onInvalidateList?.();
      }

      if (options?.replaceRoute && isNewSession && !hasReplacedRouteRef.current) {
        hasReplacedRouteRef.current = true;
        router.replace(`/chat/${sessionId}` as const);
      }
    },
    [isNewSession, onInvalidateList, router],
  );

  return {
    isNewSession,
    activeSessionId,
    activeSessionIdRef,
    bindSessionId,
  };
}
