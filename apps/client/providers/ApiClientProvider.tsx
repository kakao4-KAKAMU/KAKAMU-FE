import {
  createAuthenticatedApiClient,
  type ApiClient,
} from '@kakamu/api';
import { createContext, useRef, type ReactNode } from 'react';

import { createTokenBridge } from '@/lib/auth/create-token-bridge';
import { getBackendApiPrefixUrl } from '@/lib/env/backend-api-url';
import { createPersonaBridge } from '@/lib/persona/create-persona-bridge';

const ApiClientContext = createContext<ApiClient | null>(null);

export function ApiClientProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<ApiClient | null>(null);
  const tokenBridgeRef = useRef(createTokenBridge());
  const personaBridgeRef = useRef(createPersonaBridge());

  if (!clientRef.current) {
    const prefixUrl = getBackendApiPrefixUrl();

    if (__DEV__ && !prefixUrl) {
      console.warn(
        '[ApiClientProvider] EXPO_PUBLIC_BACKEND_API_URL is not set; API requests may fail.',
      );
    }

    clientRef.current = createAuthenticatedApiClient(
      prefixUrl,
      tokenBridgeRef.current,
      personaBridgeRef.current,
    );
  }

  return (
    <ApiClientContext.Provider value={clientRef.current}>
      {children}
    </ApiClientContext.Provider>
  );
}

export { ApiClientContext };
