import { useMemo } from 'react';
import { useAuthStore } from '@kakamu/store';
import { getUserIdFromAccessToken } from '@/lib/auth/parse-access-token';

/** 메모리 access token에서 현재 로그인 user_id를 추출합니다. */
export function useCurrentUserId(): string | null {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMemo(() => getUserIdFromAccessToken(accessToken), [accessToken]);
}
