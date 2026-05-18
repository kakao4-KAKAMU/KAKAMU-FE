import { KakaoLoginError } from './kakao-errors';
import { getKakaoJsKey } from './kakao-env';
import type { KakaoWebAuthResponse, KakaoWebLoginOptions } from './kakao-types';

const KAKAO_SDK_URL = 'https://developers.kakao.com/sdk/js/kakao.min.js';
const KAKAO_SDK_SCRIPT_ID = 'kakao-sdk';

type KakaoAuthLoginSettings = KakaoWebLoginOptions & {
  success: (response: KakaoWebAuthResponse) => void;
  fail: (error: unknown) => void;
};

type KakaoGlobal = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Auth: {
    login: (settings: KakaoAuthLoginSettings) => void;
    getAccessToken: () => string | null;
  };
};

declare global {
  // eslint-disable-next-line no-var
  var Kakao: KakaoGlobal | undefined;
}

let sdkLoadPromise: Promise<void> | null = null;
let initPromise: Promise<void> | null = null;

function getKakaoGlobal(): KakaoGlobal {
  if (typeof globalThis.Kakao === 'undefined') {
    throw new KakaoLoginError('Kakao JS SDK가 로드되지 않았습니다.', 'SDK_LOAD_FAILED');
  }
  return globalThis.Kakao;
}

/** [react-kakao-login](https://github.com/wonism/react-kakao-login) 과 동일한 SDK URL 로드 */
export function loadKakaoSdk(): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.reject(new KakaoLoginError('웹 환경에서만 Kakao SDK를 사용할 수 있습니다.', 'SDK_LOAD_FAILED'));
  }

  if (globalThis.Kakao?.isInitialized()) {
    return Promise.resolve();
  }

  const existing = document.getElementById(KAKAO_SDK_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    sdkLoadPromise ??= new Promise((resolve, reject) => {
      if (globalThis.Kakao) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new KakaoLoginError('Kakao SDK 스크립트 로드에 실패했습니다.', 'SDK_LOAD_FAILED')),
        { once: true }
      );
    });
    return sdkLoadPromise;
  }

  sdkLoadPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = KAKAO_SDK_SCRIPT_ID;
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new KakaoLoginError('Kakao SDK 스크립트 로드에 실패했습니다.', 'SDK_LOAD_FAILED'));
    document.body.appendChild(script);
  });

  return sdkLoadPromise;
}

export async function ensureKakaoSdkInitialized(): Promise<KakaoGlobal> {
  await loadKakaoSdk();
  const kakao = getKakaoGlobal();

  if (kakao.isInitialized()) {
    return kakao;
  }

  initPromise ??= Promise.resolve().then(() => {
    kakao.init(getKakaoJsKey());
    if (!kakao.isInitialized()) {
      throw new KakaoLoginError('Kakao SDK 초기화에 실패했습니다.', 'SDK_LOAD_FAILED');
    }
  });

  await initPromise;
  return kakao;
}

/** `Kakao.Auth.login` — access_token 발급 */
export async function loginWithKakaoWebSdk(options: KakaoWebLoginOptions = {}): Promise<KakaoWebAuthResponse> {
  const kakao = await ensureKakaoSdkInitialized();
  const { throughTalk = true, persistAccessToken = true } = options;

  return new Promise<KakaoWebAuthResponse>((resolve, reject) => {
    kakao.Auth.login({
      throughTalk,
      persistAccessToken,
      success: resolve,
      fail: reject,
    });
  });
}
