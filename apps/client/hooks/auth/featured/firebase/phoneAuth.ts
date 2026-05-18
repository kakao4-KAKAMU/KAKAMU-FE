import { Platform } from 'react-native';

import type { RecaptchaVerifier } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';

/** Native / Web 공통 — `confirm(code)` 로 SMS 코드 제출 */
export type PhoneSignInConfirmation = {
  confirm: (code: string) => Promise<unknown>;
};

export type FirebasePhoneDeps = {
  app?: FirebaseApp;
  appVerifier?: RecaptchaVerifier;
};

/**
 * SMS로 전화 로그인 코드 발송.
 * - **Native**: `signInWithPhoneNumber(getAuth(), phone)` ([문서](https://rnfirebase.io/auth/phone-auth))
 * - **Web**: `RecaptchaVerifier` 가 필요합니다. `createWebPhoneRecaptchaVerifier` 로 생성한 뒤 `appVerifier` 로 전달하세요.
 */
export async function sendPhoneSignInSms(
  phoneE164: string,
  web?: FirebasePhoneDeps
): Promise<PhoneSignInConfirmation> {
  if (Platform.OS === 'web') {
    if (!web || !web.app || !web.appVerifier) {
      throw new Error(
        '[firebase] 웹 전화 인증은 FirebaseApp 과 Recaptcha ApplicationVerifier 가 필요합니다.'
      );
    }
    const { sendPhoneSignInSmsWeb } = await import('./phoneAuthWeb');
    return sendPhoneSignInSmsWeb(web.app, phoneE164, web.appVerifier);
  }
  const { sendPhoneSignInSmsNative } = await import('./phoneAuthNative');
  return sendPhoneSignInSmsNative(phoneE164);
}

/** 사용자가 입력한 OTP로 로그인 완료 */
export async function confirmPhoneSignInCode(
  confirmation: PhoneSignInConfirmation,
  smsCode: string
): Promise<unknown> {
  return confirmation.confirm(smsCode.trim());
}

export async function firebaseSignOut(
  web?: FirebasePhoneDeps
): Promise<void> {
  if (Platform.OS === 'web') {
    if (!web || !web.app) {
      throw new Error(
        '[firebase] 웹 전화 인증은 FirebaseApp 과 Recaptcha ApplicationVerifier 가 필요합니다.'
      );
    }
    const { firebaseSignOutWeb } = await import('./phoneAuthWeb');
    return firebaseSignOutWeb(web.app);
  } else {
    const { firebaseSignOutNative } = await import('./phoneAuthNative');
    return firebaseSignOutNative();
  }
}