import type { TFunction } from 'i18next';

import {
  AUTH_NICKNAME_MAX_LENGTH,
  AUTH_NICKNAME_MIN_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  AUTH_PROFILE_MAX_LENGTH,
  AUTH_USERNAME_MAX_LENGTH,
  AUTH_USERNAME_MIN_LENGTH,
} from '@kakamu/schema';
import type { AuthFormValidationMessages } from '@kakamu/schema';

/** i18n `t`로 스키마에 바인딩할 검증 문구 객체를 만듭니다. */
export function buildAuthFormValidationMessages(t: TFunction): AuthFormValidationMessages {
  return {
    email: {
      required: t('guest.validation.email.required'),
      invalid: t('guest.validation.email.invalid'),
    },
    phone: {
      required: t('guest.validation.phone.required'),
      invalid: t('guest.validation.phone.invalid'),
    },
    username: {
      required: t('guest.validation.username.required'),
      min: t('guest.validation.username.min', { min: AUTH_USERNAME_MIN_LENGTH }),
      max: t('guest.validation.username.max', { max: AUTH_USERNAME_MAX_LENGTH }),
      pattern: t('guest.validation.username.pattern'),
    },
    nickname: {
      required: t('guest.validation.nickname.required'),
      min: t('guest.validation.nickname.min', { min: AUTH_NICKNAME_MIN_LENGTH }),
      max: t('guest.validation.nickname.max', { max: AUTH_NICKNAME_MAX_LENGTH }),
    },
    profile: {
      max: t('guest.validation.profile.max', { max: AUTH_PROFILE_MAX_LENGTH }),
    },
    password: {
      required: t('guest.validation.password.required'),
      min: t('guest.validation.password.min', { min: AUTH_PASSWORD_MIN_LENGTH }),
      max: t('guest.validation.password.max', { max: AUTH_PASSWORD_MAX_LENGTH }),
    },
    passwordConfirm: {
      required: t('guest.validation.passwordConfirm.required'),
      mismatch: t('guest.validation.passwordConfirm.mismatch'),
    },
    snsType: {
      invalid: t('guest.validation.snsType.invalid'),
    },
    token: {
      required: t('guest.validation.token.required'),
    },
    agreedToTerms: {
      required: t('guest.validation.agreedToTerms.required'),
    },
  };
}
