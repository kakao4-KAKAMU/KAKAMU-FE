import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserPhoneVerificationMutation, useUserResetPasswordMutation } from '@kakamu/query';
import type {
  PhoneValidationFormInput,
  ResetPasswordEmailFormInput,
  ResetPasswordFormInput,
} from '@kakamu/schema';
import { useErrorAlertDialog } from '@kakamu/ui';
import type { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';

import { mapPhoneVerificationError, mapResetPasswordError } from '@/lib/error-message-map/auth/reset-password-error';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { firebaseSignOut } from '@/hooks/auth/featured/firebase';
import { usePhoneValidation } from '@/hooks/auth/featured/phone-validation';

type Step1Values = ResetPasswordEmailFormInput & PhoneValidationFormInput;
type ResetPasswordStep = 1 | 2;

const STEP1_DEFAULT_VALUES: Step1Values = {
  email: '',
  phone: '',
  phoneValid: false,
};

const STEP2_DEFAULT_VALUES: ResetPasswordFormInput = {
  password: '',
  passwordConfirm: '',
};

type UseResetPasswordFlowParams = {
  t: TFunction;
  onResetCompleted: () => void;
};

export function useResetPasswordFlow({ t, onResetCompleted }: UseResetPasswordFlowParams) {
  const apiClient = useBackendApiClient();
  const authForms = useAuthFormValidationKit(t);
  const { open: openErrorAlert } = useErrorAlertDialog();

  const step1Resolver = useMemo(
    () => zodResolver(authForms.resetPasswordEmail.merge(authForms.phoneValidation)),
    [authForms.resetPasswordEmail, authForms.phoneValidation],
  );
  const step2Resolver = useMemo(() => zodResolver(authForms.resetPassword), [authForms.resetPassword]);

  const step1Form = useForm<Step1Values>({
    resolver: step1Resolver,
    defaultValues: STEP1_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const step2Form = useForm<ResetPasswordFormInput>({
    resolver: step2Resolver,
    defaultValues: STEP2_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [step, setStep] = useState<ResetPasswordStep>(1);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [verifiedFirebaseIdToken, setVerifiedFirebaseIdToken] = useState<string | null>(null);

  const phone = step1Form.watch('phone');
  const phoneValid = step1Form.watch('phoneValid');

  const handlePhoneChange = useCallback(() => {
    if (step === 2) {
      setStep(1);
      setVerifiedEmail(null);
      setVerifiedFirebaseIdToken(null);
      step2Form.reset(STEP2_DEFAULT_VALUES);
    }
  }, [step, step2Form]);

  const phoneValidation = usePhoneValidation({
    getPhone: () => step1Form.getValues('phone'),
    setPhoneValid: (value) => step1Form.setValue('phoneValid', value),
    triggerPhone: () => step1Form.trigger('phone'),
    triggerPhoneStep: () => step1Form.trigger(['phone', 'phoneValid']),
    phone,
    phoneValid,
    onPhoneChange: handlePhoneChange,
  });

  const phoneVerificationMutation = useUserPhoneVerificationMutation(apiClient, {
    onSuccess: (_, variables) => {
      setVerifiedEmail(variables.email);
      setVerifiedFirebaseIdToken(variables.firebase_id_token);
      setStep(2);
    },
    onError: (error) => {
      openErrorAlert(mapPhoneVerificationError(error, t));
    },
  });

  const resetPasswordMutation = useUserResetPasswordMutation(apiClient, {
    onSuccess: onResetCompleted,
    onError: (error) => {
      openErrorAlert(mapResetPasswordError(error, t));
    },
    onSettled: async () => {
      await firebaseSignOut(phoneValidation.firebasePhoneDepsRef ?? undefined);
    },
  });

  const handleContinueToReset = useCallback(async () => {
    const phoneStepOk = await phoneValidation.validatePhoneStep();
    if (!phoneStepOk) {
      return;
    }

    const emailOk = await step1Form.trigger('email');
    if (!emailOk) {
      return;
    }

    const { firebaseIdToken } = phoneValidation.getRegisterPhoneAuth();
    if (!firebaseIdToken) {
      step1Form.setError('root', {
        type: 'manual',
        message: t('guest.resetPassword.error.INVALID_FIREBASE_TOKEN.description'),
      });
      setStep(1);
      return;
    }

    step1Form.clearErrors('root');
    phoneVerificationMutation.mutate({
      email: step1Form.getValues('email').trim(),
      firebase_id_token: firebaseIdToken,
    });
  }, [phoneValidation, step1Form, t, phoneVerificationMutation]);

  const handleResetPassword = useCallback(
    (values: ResetPasswordFormInput) => {
      if (!verifiedEmail || !verifiedFirebaseIdToken) {
        setStep(1);
        return;
      }
      resetPasswordMutation.mutate({
        email: verifiedEmail.trim(),
        firebase_id_token: verifiedFirebaseIdToken,
        new_password: values.password,
      });
    },
    [resetPasswordMutation, verifiedEmail, verifiedFirebaseIdToken],
  );

  const isBusy =
    phoneValidation.isPhoneBusy || phoneVerificationMutation.isPending || resetPasswordMutation.isPending;
  const stepHeader =
    step === 1
      ? { title: t('guest.resetPassword.step1Title'), description: t('guest.resetPassword.step1Description') }
      : { title: t('guest.resetPassword.step2Title'), description: t('guest.resetPassword.step2Description') };

  return {
    step,
    stepHeader,
    step1Form,
    step2Form,
    phoneValidation,
    handleContinueToReset,
    handleResetPassword,
    isBusy,
    resetPasswordMutation,
  };
}
