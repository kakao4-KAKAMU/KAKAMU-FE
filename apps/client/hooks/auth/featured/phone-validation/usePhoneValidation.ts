import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from '@kakamu/i18n';
import type { SignUpWithTermsFormInput } from '@kakamu/schema';
import { Platform } from 'react-native';
import type { UseFormGetValues, UseFormSetValue, UseFormTrigger } from 'react-hook-form';

import {
  type FirebasePhoneDeps,
  confirmPhoneSignInCode,
  ensureFirebaseInitialized,
  getFirebaseWebAppOrNull,
  sendPhoneSignInSms,
  type PhoneSignInConfirmation,
} from '@/hooks/auth/featured/firebase';
import { getFirebaseIdTokenFromPhoneCredential } from '@/lib/firebase-phone-id-token';

/** 웹 전화 인증용 DOM 컨테이너 id — `createWebPhoneRecaptchaVerifier` 와 동일해야 합니다 */
export const SIGNUP_PHONE_RECAPTCHA_CONTAINER_ID = 'signup-phone-recaptcha';
export const SIGNUP_SNS_PHONE_RECAPTCHA_CONTAINER_ID = 'signup-sns-phone-recaptcha';

export type PhoneVerificationFormFields = {
  phone: string;
  phoneValid: boolean;
};

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
  const firebasePhoneDepsRef = useRef<FirebasePhoneDeps | null>(null);

  const [smsSending, setSmsSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    const tempApp: FirebasePhoneDeps = { app: undefined, appVerifier: undefined };
    if (Platform.OS === 'web') {
      getFirebaseWebAppOrNull().then((app) => {
        if (!app) {
          throw new Error('[firebase] 웹 앱 초기화에 실패했습니다.');
        }
        tempApp.app = app;

        import('@/hooks/auth/featured/firebase/phoneAuthWeb').then(({ createWebPhoneRecaptchaVerifier }) => {
          if(!tempApp.app) {
            return;
          }
          tempApp.appVerifier = createWebPhoneRecaptchaVerifier(tempApp.app, recaptchaContainerId);
          firebasePhoneDepsRef.current = tempApp
        })
      })
    }
    return () => {
      if (firebasePhoneDepsRef.current) {
        if (Platform.OS === 'web') {
          firebasePhoneDepsRef.current.appVerifier?.clear();
        }
      }
    }
  }, [])

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
    try {
      await ensureFirebaseInitialized();
      if (!firebasePhoneDepsRef.current) {
        throw new Error('[firebase] 웹 앱 초기화에 실패했습니다.');
      }
      const confirmation = await sendPhoneSignInSms(phoneE164, firebasePhoneDepsRef.current);
      confirmationRef.current = confirmation;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setSmsError(t('guest.form.signUp.smsError'));
      if (__DEV__) {
        console.warn('[usePhoneValidation] sendSms', message);
      }
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
    firebasePhoneDepsRef: firebasePhoneDepsRef.current,
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
