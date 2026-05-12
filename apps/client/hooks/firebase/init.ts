import { Platform } from 'react-native';

/**
 * Firebase 초기화
 * - **Web**: `firebase/app` 으로 `initializeApp` 수행 (`EXPO_PUBLIC_FIREBASE_WEB_*` 필요)
 * - **iOS / Android**: `@react-native-firebase/app` 이 네이티브 설정으로 자동 초기화됩니다.
 *
 * @see https://rnfirebase.io/
 */
export async function ensureFirebaseInitialized(): Promise<void> {
  if (Platform.OS === 'web') {
    const { ensureFirebaseWebInitialized } = await import('./initWeb');
    ensureFirebaseWebInitialized();
  }
}

/**
 * 웹 전용 Firebase 앱. 네이티브에서는 `null` 입니다.
 */
export async function getFirebaseWebAppOrNull(): Promise<
  import('firebase/app').FirebaseApp | null
> {
  if (Platform.OS !== 'web') {
    return null;
  }
  const { getFirebaseWebApp } = await import('./initWeb');
  return getFirebaseWebApp();
}
