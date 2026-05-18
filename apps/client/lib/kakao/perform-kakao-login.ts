import { KakaoLoginError } from './kakao-errors';
import type { KakaoLoginToken, KakaoWebLoginOptions } from './kakao-types';

/** Metro가 `.native` / `.web` 구현으로 대체합니다. */
export async function performKakaoLogin(_options?: KakaoWebLoginOptions): Promise<KakaoLoginToken> {
  throw new KakaoLoginError('지원하지 않는 플랫폼입니다.', 'UNKNOWN');
}
