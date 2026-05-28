import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPersonaCreateError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.persona.create.failedRequest.description');
  const { message } = parseApiError(error, fallback);

  return {
    title: t('account.persona.create.failedRequest.title'),
    description: message,
  };
}
