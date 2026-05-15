/** 네이티브 앱 키 (`app.config.js` 플러그인과 동일) */
export function getKakaoNativeAppKey(): string {
  const key = process.env.EXPO_PUBLIC_KAKAO_APP_KEY
  if (!key) {
    throw new Error('[kakao] EXPO_PUBLIC_KAKAO_APP_KEY 가 설정되어 있어야 합니다.');
  }
  return key;
}

/** 웹 JS SDK 초기화용 JavaScript 키 */
export function getKakaoJsKey(): string {
  const key = process.env.EXPO_PUBLIC_KAKAO_JS_KEY
  if (!key) {
    throw new Error('[kakao] EXPO_PUBLIC_KAKAO_JS_KEY 가 설정되어 있어야 합니다.');
  }
  return key;
}
