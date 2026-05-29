import type { TFunction } from 'i18next';

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
    case 'BAD_REQUEST':
    case 'PERSONA_LIMIT_EXCEEDED':
    case 'PERSONA_MAX_COUNT_EXCEEDED':
      title = t('account.persona.create.error.limitExceeded.title');
      message = t('account.persona.create.error.limitExceeded.description');
      break;
    default:
      break;
  }

  return {
    title,
    description: message,
  };
}
