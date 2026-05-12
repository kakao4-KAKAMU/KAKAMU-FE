import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

/**
 * SMS 인증번호 발송 후 `ConfirmationResult` 반환.
 * @see https://rnfirebase.io/auth/phone-auth
 */
export function sendPhoneSignInSmsNative(
  phoneE164: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return signInWithPhoneNumber(getAuth(), phoneE164);
}
