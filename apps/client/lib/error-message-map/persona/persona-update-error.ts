import type { TFunction } from 'i18next';

import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPersonaUpdateError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.persona.update.failedRequest.description');
  let title = t('account.persona.update.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.PERSONA_NOT_FOUND:
      title = t('account.persona.update.error.notFound.title');
      message = t('account.persona.update.error.notFound.description');
      break;
    case API_ERROR_CODES.FORBIDDEN_PERSONA_UPDATE:
      title = t('account.persona.update.error.forbidden.title');
      message = t('account.persona.update.error.forbidden.description');
      break;
    case API_ERROR_CODES.SAME_NICKNAME:
      title = t('account.persona.update.error.sameNickname.title');
      message = t('account.persona.update.error.sameNickname.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
