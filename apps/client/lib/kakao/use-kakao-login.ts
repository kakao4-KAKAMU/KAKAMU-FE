import { useCallback, useRef, useState } from 'react';

import { KakaoLoginError, toKakaoLoginError } from './kakao-errors';
import { performKakaoLogin } from './perform-kakao-login';
import type { KakaoLoginToken, KakaoWebLoginOptions } from './kakao-types';

export type UseKakaoLoginOptions = {
  /** 웹 전용 — `Kakao.Auth.login` 옵션 */
  web?: KakaoWebLoginOptions;
};

export type UseKakaoLoginResult = {
  /** 카카오 OAuth access token 발급 */
  login: () => Promise<KakaoLoginToken>;
  isPending: boolean;
  error: KakaoLoginError | null;
  reset: () => void;
};

export function useKakaoLogin(options?: UseKakaoLoginOptions): UseKakaoLoginResult {
  const webOptionsRef = useRef(options?.web);
  webOptionsRef.current = options?.web;

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<KakaoLoginError | null>(null);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (): Promise<KakaoLoginToken> => {
    setIsPending(true);
    setError(null);
    try {
      const token = await performKakaoLogin(webOptionsRef.current);
      return token;
    } catch (err) {
      const kakaoError = toKakaoLoginError(err);
      setError(kakaoError);
      throw kakaoError;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { login, isPending, error, reset };
}
