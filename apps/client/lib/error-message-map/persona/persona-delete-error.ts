import type { TFunction } from 'i18next';

import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPersonaDeleteError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.persona.delete.failedRequest.description');
  let title = t('account.persona.delete.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.MINIMUM_PERSONA_REQUIRED:
      title = t('account.persona.delete.error.minimumRequired.title');
      message = t('account.persona.delete.error.minimumRequired.description');
      break;
    case API_ERROR_CODES.PERSONA_NOT_FOUND:
      title = t('account.persona.delete.error.notFound.title');
      message = t('account.persona.delete.error.notFound.description');
      break;
    case API_ERROR_CODES.PERSONA_DELETE_FAILED:
      title = t('account.persona.delete.failedRequest.title');
      message = fallback;
      break;
    default:
      break;
  }

  return { title, description: message };
}
