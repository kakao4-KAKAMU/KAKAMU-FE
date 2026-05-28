import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapSignUpError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('guest.form.signUp.failedRequest.description');
  let title = t('guest.form.signUp.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case 'REGISTRATION_FAILED':
      title = t('guest.form.signUp.failedRequest.title');
      message = t('guest.form.signUp.failedRequest.description');
      break;
    case 'INVALID_FIREBASE_TOKEN':
      title = t('guest.form.signUp.invalidFirebaseToken.title');
      message = t('guest.form.signUp.invalidFirebaseToken.description');
      break;
    case 'DUPLICATE_PHONE_NUMBER':
      title = t('guest.form.signUp.duplicatePhoneNumber.title');
      message = t('guest.form.signUp.duplicatePhoneNumber.description');
      break;
    case 'DUPLICATE_CI_VALUE':
      title = t('guest.form.signUp.duplicateCiValue.title');
      message = t('guest.form.signUp.duplicateCiValue.description');
      break;
    case 'DUPLICATE_EMAIL':
      title = t('guest.form.signUp.duplicateEmail.title');
      message = t('guest.form.signUp.duplicateEmail.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
