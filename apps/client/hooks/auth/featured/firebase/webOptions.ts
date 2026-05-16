/** `firebase/app` 의 설정 객체 형태 — 웹 번들에서만 런타임 import 합니다. */
export type FirebaseWebOptions = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

/**
 * Firebase JS SDK(웹) 초기화 옵션.
 * Firebase 콘솔 → 프로젝트 설정 → 내 앱 → 웹 앱의 `firebaseConfig`와 동일한 값을
 * `EXPO_PUBLIC_FIREBASE_WEB_*` 로 주입합니다.
 */
export function getFirebaseWebOptions(): FirebaseWebOptions {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_WEB_API_KEY;
  const authDomain = process.env.EXPO_PUBLIC_FIREBASE_WEB_AUTH_DOMAIN;
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_WEB_PROJECT_ID;
  const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_WEB_STORAGE_BUCKET;
  const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_WEB_MESSAGING_SENDER_ID;
  const appId = process.env.EXPO_PUBLIC_FIREBASE_WEB_APP_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw new Error(
      '[firebase] 웹 초기화: EXPO_PUBLIC_FIREBASE_WEB_API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID 가 모두 필요합니다.'
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}
