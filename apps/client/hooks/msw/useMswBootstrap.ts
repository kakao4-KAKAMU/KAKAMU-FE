import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { isMswEnabled } from '@/lib/msw/is-msw-enabled';

/**
 * Expo Router root layout에서 MSW를 부트스트랩합니다.
 * `EXPO_PUBLIC_USE_MSW=true`일 때만 polyfill + enable-msw를 로드하고,
 * 완료 전까지 false를 반환해 API 호출 레이스를 방지합니다.
 */
export function useMswBootstrap(): boolean {
  const [ready, setReady] = useState(() => !isMswEnabled());

  useEffect(() => {
    if (!isMswEnabled()) {
      return;
    }

    let cancelled = false;

    async function bootstrapMsw() {
      if (process.env.NODE_ENV === 'development') {
        if (Platform.OS !== 'web') {
          await import('@/mocks/msw.polyfills');
        }
  
        const { enableMsw } = await import('@/mocks/enable-msw');
        await enableMsw();
  
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    void bootstrapMsw();

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
