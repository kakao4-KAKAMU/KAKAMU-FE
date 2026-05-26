import { login, type KakaoOAuthToken } from '@react-native-seoul/kakao-login';

import { isKakaoLoginCancelled, KakaoLoginError, toKakaoLoginError } from './kakao-errors';
import type { KakaoLoginToken, KakaoWebLoginOptions } from './kakao-types';

function mapNativeToken(token: KakaoOAuthToken): KakaoLoginToken {
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken || undefined,
    idToken: token.idToken || undefined,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scopes: token.scopes?.length ? [...token.scopes] : undefined,
  };
}

/** [@react-native-seoul/kakao-login](https://github.com/crossplatformkorea/react-native-kakao-login) 네이티브 로그인 */
export async function performKakaoLogin(_options?: KakaoWebLoginOptions): Promise<KakaoLoginToken> {
  try {
    const token = (await login()) as KakaoOAuthToken;
    if (!token.accessToken) {
      throw new KakaoLoginError('카카오 액세스 토큰을 받지 못했습니다.', 'LOGIN_FAILED');
    }
    return mapNativeToken(token);
  } catch (error) {
    if (isKakaoLoginCancelled(error)) {
      throw new KakaoLoginError('카카오 로그인이 취소되었습니다.', 'CANCELLED');
    }
    throw toKakaoLoginError(error);
  }
}
