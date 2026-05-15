import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { SignUpWithTermsFormInput } from '@kakamu/schema';
import type { RecaptchaVerifier } from 'firebase/auth';
import { Platform } from 'react-native';
import type { UseFormGetValues, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID } from '@/components/featured/auth';
import {
  confirmPhoneSignInCode,
  ensureFirebaseInitialized,
  getFirebaseWebAppOrNull,
  sendPhoneSignInSms,
  type PhoneSignInConfirmation,
} from '@/hooks/firebase';
import { getFirebaseIdTokenFromPhoneCredential } from '@/lib/firebase-phone-id-token';

export type PhoneRegisterAuth = {
  firebaseIdToken: string | null;
  firebaseUuid: string | null;
};

export type UsePhoneValidationOptions = {
  getValues: UseFormGetValues<SignUpWithTermsFormInput>;
  setValue: UseFormSetValue<SignUpWithTermsFormInput>;
  trigger: UseFormTrigger<SignUpWithTermsFormInput>;
  phone: string;
  phoneValid: boolean;
  /** 휴대전화 번호 변경 시 (예: 회원가입 step 1 복귀) */
  onPhoneChange?: () => void;
  recaptchaContainerId?: string;
};

export function usePhoneValidation({
  getValues,
  setValue,
  trigger,
  phone,
  phoneValid,
  onPhoneChange,
  recaptchaContainerId = SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID,
}: UsePhoneValidationOptions) {
  const { t } = useTranslation();

  const confirmationRef = useRef<PhoneSignInConfirmation | null>(null);
  const firebaseIdTokenRef = useRef<string | null>(null);
  const firebaseUuidRef = useRef<string | null>(null);
  const prevPhoneRef = useRef(phone);

  const [smsSending, setSmsSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    if (prevPhoneRef.current === phone) {
      return;
    }
    prevPhoneRef.current = phone;
    confirmationRef.current = null;
    firebaseIdTokenRef.current = null;
    firebaseUuidRef.current = null;
    setValue('phoneValid', false);
    void trigger('phoneValid');
    setSmsError(null);
    setOtpError(null);
    onPhoneChange?.();
  }, [onPhoneChange, phone, setValue, trigger]);

  const getRegisterPhoneAuth = useCallback((): PhoneRegisterAuth => {
    return {
      firebaseIdToken: firebaseIdTokenRef.current,
      firebaseUuid: firebaseUuidRef.current,
    };
  }, []);

  const sendSms = useCallback(async () => {
    setSmsError(null);
    setOtpError(null);
    const ok = await trigger('phone');
    if (!ok) {
      return;
    }
    const phoneE164 = getValues('phone').trim();
    setSmsSending(true);
    let verifier: RecaptchaVerifier | null = null;
    try {
      await ensureFirebaseInitialized();
      if (Platform.OS === 'web') {
        const app = await getFirebaseWebAppOrNull();
        if (!app) {
          throw new Error('[firebase] 웹 앱 초기화에 실패했습니다.');
        }
        const { createWebPhoneRecaptchaVerifier } = await import('@/hooks/firebase/phoneAuthWeb');
        verifier = createWebPhoneRecaptchaVerifier(app, recaptchaContainerId);
        const confirmation = await sendPhoneSignInSms(phoneE164, { app, appVerifier: verifier });
        confirmationRef.current = confirmation;
      } else {
        const confirmation = await sendPhoneSignInSms(phoneE164);
        confirmationRef.current = confirmation;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setSmsError(t('guest.form.signUp.smsError'));
      if (__DEV__) {
        console.warn('[usePhoneValidation] sendSms', message);
      }
      verifier?.clear();
    } finally {
      setSmsSending(false);
    }
  }, [getValues, recaptchaContainerId, trigger, t]);

  const verifyOtp = useCallback(
    async (otp: string) => {
      setOtpError(null);
      const confirmation = confirmationRef.current;
      if (!confirmation) {
        setOtpError(t('guest.form.signUp.smsError'));
        return;
      }
      setOtpVerifying(true);
      try {
        const credential = await confirmPhoneSignInCode(confirmation, otp);
        const idToken = await getFirebaseIdTokenFromPhoneCredential(credential);

        firebaseUuidRef.current = (credential as { user: { uid: string } }).user.uid ?? null;
        firebaseIdTokenRef.current = idToken;
        setValue('phoneValid', true);
        await trigger(['phone', 'phoneValid']);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setOtpError(t('guest.form.signUp.otpError'));
        if (__DEV__) {
          console.warn('[usePhoneValidation] verifyOtp', message);
        }
      } finally {
        setOtpVerifying(false);
      }
    },
    [setValue, trigger, t]
  );

  const validatePhoneStep = useCallback(async () => {
    const ok = await trigger(['phone', 'phoneValid']);
    return ok && phoneValid === true;
  }, [phoneValid, trigger]);

  const isPhoneBusy = smsSending || otpVerifying;

  return {
    smsSending,
    otpVerifying,
    smsError,
    otpError,
    phoneVerified: phoneValid === true,
    isPhoneBusy,
    sendSms,
    verifyOtp,
    validatePhoneStep,
    getRegisterPhoneAuth,
  };
}
