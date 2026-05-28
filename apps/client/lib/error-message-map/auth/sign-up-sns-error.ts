import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapSignUpSnsError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('guest.form.signUpSns.failedRequest.description');
  let title = t('guest.form.signUpSns.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case 'REGISTRATION_FAILED':
      title = t('guest.form.signUpSns.failedRequest.title');
      message = t('guest.form.signUpSns.failedRequest.description');
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
