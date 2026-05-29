import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPasswordChangeError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.password.error.default.description');
  let title = t('account.password.error.default.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case 'INVALID_CREDENTIALS':
    case 'UNAUTHORIZED':
    case 'WRONG_PASSWORD':
      title = t('account.password.error.invalidCurrentPassword.title');
      message = t('account.password.error.invalidCurrentPassword.description');
      break;
    case 'PASSWORD_CHANGE_FAILED':
      message = fallback;
      break;
    default:
      break;
  }

  return { title, description: message };
}
