import type { TFunction } from '@kakamu/i18n';

import { parseApiError } from './parse-api-error';

type ResetPasswordErrorView = {
  title: string;
  description: string;
};

export function mapPhoneVerificationError(error: unknown, t: TFunction): ResetPasswordErrorView {
  const fallback = t('guest.resetPassword.error.default.description');
  let title = t('guest.resetPassword.error.default.title');
  let { message, code } = parseApiError(error, fallback);

  if (code === 'USER_NOT_FOUND') {
    title = t('guest.resetPassword.error.USER_NOT_FOUND.title');
    message = t('guest.resetPassword.error.USER_NOT_FOUND.description');
  }

  return { title, description: message };
}

export function mapResetPasswordError(error: unknown, t: TFunction): ResetPasswordErrorView {
  const fallback = t('guest.resetPassword.error.default.description');
  let title = t('guest.resetPassword.error.default.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case 'USER_NOT_FOUND':
      title = t('guest.resetPassword.error.USER_NOT_FOUND.title');
      message = t('guest.resetPassword.error.USER_NOT_FOUND.description');
      break;
    case 'INVALID_FIREBASE_TOKEN':
      title = t('guest.resetPassword.error.INVALID_FIREBASE_TOKEN.title');
      message = t('guest.resetPassword.error.INVALID_FIREBASE_TOKEN.description');
      break;
    case 'AUTH_MISMATCH':
      title = t('guest.resetPassword.error.AUTH_MISMATCH.title');
      message = t('guest.resetPassword.error.AUTH_MISMATCH.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
