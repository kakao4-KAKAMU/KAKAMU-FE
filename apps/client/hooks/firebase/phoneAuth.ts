import { Platform } from 'react-native';

/** Native / Web 공통 — `confirm(code)` 로 SMS 코드 제출 */
export type PhoneSignInConfirmation = {
  confirm: (code: string) => Promise<unknown>;
};

type WebPhoneDeps = {
  app: import('firebase/app').FirebaseApp;
  appVerifier: import('firebase/auth').ApplicationVerifier;
};

/**
 * SMS로 전화 로그인 코드 발송.
 * - **Native**: `signInWithPhoneNumber(getAuth(), phone)` ([문서](https://rnfirebase.io/auth/phone-auth))
 * - **Web**: `RecaptchaVerifier` 가 필요합니다. `createWebPhoneRecaptchaVerifier` 로 생성한 뒤 `appVerifier` 로 전달하세요.
 */
export async function sendPhoneSignInSms(
  phoneE164: string,
  web?: WebPhoneDeps
): Promise<PhoneSignInConfirmation> {
  if (Platform.OS === 'web') {
    if (!web) {
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
