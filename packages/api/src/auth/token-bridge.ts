/** 앱·플랫폼별 토큰 저장소를 `@kakamu/api`에 주입하기 위한 계약 */
export type TokenBridge = {
  getAccessToken: () => string | null;
  getRefreshToken: () => Promise<string | null>;
  setTokens: (access: string, refresh: string) => Promise<void>;
  clearSession: () => Promise<void>;
};
