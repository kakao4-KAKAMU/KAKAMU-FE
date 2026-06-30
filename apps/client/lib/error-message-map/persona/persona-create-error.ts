import type { TFunction } from 'i18next';

import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPersonaCreateError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.persona.create.failedRequest.description');
  let title = t('account.persona.create.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.PERSONA_LIMIT_EXCEEDED:
      title = t('account.persona.create.error.limitExceeded.title');
      message = t('account.persona.create.error.limitExceeded.description');
      break;
    case API_ERROR_CODES.MISSING_NICKNAME:
      title = t('account.persona.create.failedRequest.title');
      message = t('account.persona.create.validation.name.required');
      break;
    case API_ERROR_CODES.DATABASE_SAVE_FAILED:
      title = t('account.persona.create.failedRequest.title');
      message = fallback;
      break;
    default:
      break;
  }

  return {
    title,
    description: message,
  };
}
