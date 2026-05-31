import {
  createAuthenticatedApiClient,
  type ApiClient,
} from '@kakamu/api';
import { createContext, useRef, type ReactNode } from 'react';

import { createTokenBridge } from '@/lib/auth/create-token-bridge';
import { getBackendApiPrefixUrl, getUploadApiPrefixUrl } from '@/lib/env/backend-api-url';
import { createPersonaBridge } from '@/lib/persona/create-persona-bridge';

const ApiClientContext = createContext<{
  backend: ApiClient | null;
  upload: ApiClient | null;
}>({
  backend: null,
  upload: null,
});

export function ApiClientProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<ApiClient | null>(null);
  const uploadClientRef = useRef<ApiClient | null>(null);
  const tokenBridgeRef = useRef(createTokenBridge());
  const personaBridgeRef = useRef(createPersonaBridge());

  if (!clientRef.current) {
    const prefixUrl = getBackendApiPrefixUrl();
    const uploadPrefixUrl = getUploadApiPrefixUrl();
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
    uploadClientRef.current = createAuthenticatedApiClient(
      uploadPrefixUrl,
      tokenBridgeRef.current,
      personaBridgeRef.current,
    );
  }

  return (
    <ApiClientContext.Provider value={{
      backend: clientRef.current,
      upload: uploadClientRef.current,
    }}>
      {children}
    </ApiClientContext.Provider>
  );
}

export { ApiClientContext };
