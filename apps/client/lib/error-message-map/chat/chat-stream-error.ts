import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapChatStreamError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.chat.conversation.failedRequest.description');
  const { message } = parseApiError(error, fallback);

  return {
    title: t('account.chat.conversation.failedRequest.title'),
    description: message,
  };
}
