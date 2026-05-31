import type { ApiClient } from '@kakamu/api';
import { useContext } from 'react';

import { ApiClientContext } from '@/providers/ApiClientProvider';

/** Root `ApiClientProvider`가 제공하는 인증 ky 클라이언트 */
export function useUploadApiClient(): ApiClient {
  const client = useContext(ApiClientContext);

  if (!client.upload) {
    throw new Error('useUploadApiClient must be used within ApiClientProvider');
  }

  return client.upload;
}
