/**
 * 웹(Expo Web) 전용. 네이티브 번들에서는 이 파일을 import 하지 마세요.
 */
import type { FirebaseApp } from 'firebase/app';
import type { ApplicationVerifier, ConfirmationResult } from 'firebase/auth';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';

/**
 * invisible reCAPTCHA 등 웹 전화 인증용 검증기.
 * DOM에 `containerId` 요소가 있어야 합니다.
 *
 * @see https://firebase.google.com/docs/auth/web/phone-auth
 */
export function createWebPhoneRecaptchaVerifier(
  app: FirebaseApp,
  containerId: string,
  options: { size?: 'invisible' | 'normal' } = { size: 'invisible' }
): RecaptchaVerifier {
  const auth = getAuth(app);
  return new RecaptchaVerifier(auth, containerId, { size: options.size ?? 'invisible' });
}

export function sendPhoneSignInSmsWeb(
  app: FirebaseApp,
  phoneE164: string,
  appVerifier: ApplicationVerifier
): Promise<ConfirmationResult> {
  const auth = getAuth(app);
  return signInWithPhoneNumber(auth, phoneE164, appVerifier);
}

export function firebaseSignOutWeb(
  app: FirebaseApp,
): Promise<void> {
  const auth = getAuth(app);
  return signOut(auth);
}