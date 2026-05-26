import { isKakaoLoginCancelled, KakaoLoginError, toKakaoLoginError } from './kakao-errors';
import { loginWithKakaoWebSdk } from './kakao-sdk-web';
import type { KakaoLoginToken, KakaoWebLoginOptions } from './kakao-types';

function mapWebToken(response: Awaited<ReturnType<typeof loginWithKakaoWebSdk>>): KakaoLoginToken {
  const expiresAt =
    typeof response.expires_in === 'number'
      ? new Date(Date.now() + response.expires_in * 1000)
      : undefined;
  const refreshExpiresAt =
    typeof response.refresh_token_expires_in === 'number'
      ? new Date(Date.now() + response.refresh_token_expires_in * 1000)
      : undefined;

  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    accessTokenExpiresAt: expiresAt,
    refreshTokenExpiresAt: refreshExpiresAt,
    scopes: response.scope ? response.scope.split(/\s+/).filter(Boolean) : undefined,
  };
}

/** [react-kakao-login](https://github.com/wonism/react-kakao-login) 방식 — Kakao JS SDK `Auth.login` */
export async function performKakaoLogin(options?: KakaoWebLoginOptions): Promise<KakaoLoginToken> {
  try {
    const response = await loginWithKakaoWebSdk(options);
    if (!response.access_token) {
      throw new KakaoLoginError('카카오 액세스 토큰을 받지 못했습니다.', 'LOGIN_FAILED');
    }
    return mapWebToken(response);
  } catch (error) {
    if (isKakaoLoginCancelled(error)) {
      throw new KakaoLoginError('카카오 로그인이 취소되었습니다.', 'CANCELLED');
    }
    throw toKakaoLoginError(error);
  }
}
