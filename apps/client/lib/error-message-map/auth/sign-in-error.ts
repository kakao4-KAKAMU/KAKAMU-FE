import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapSignInError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('guest.form.signIn.failedRequest.description');
  let title = t('guest.form.signIn.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case 'INVALID_CREDENTIALS':
    case 'UNAUTHORIZED':
    case 'WRONG_PASSWORD':
    case 'USER_NOT_FOUND':
      title = t('guest.form.signIn.invalidCredentials.title');
      message = t('guest.form.signIn.invalidCredentials.description');
      break;
    case 'LOGIN_FAILED':
      title = t('guest.form.signIn.failedRequest.title');
      message = t('guest.form.signIn.failedRequest.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}

export function parseSocialSignInError(error: unknown, t: TFunction) {
  const fallback = t('guest.form.signIn.failedRequest.description');
  const title = t('guest.form.signIn.failedRequest.title');
  const { message, code } = parseApiError(error, fallback);

  return {
    code,
    alert: {
      title,
      description: message,
    } satisfies ErrorView,
  };
}
