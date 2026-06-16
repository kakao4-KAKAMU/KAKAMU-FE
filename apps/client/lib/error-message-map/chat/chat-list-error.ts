import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapChatListError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.chat.list.failedRequest.description');
  const { message } = parseApiError(error, fallback);

  return {
    title: t('account.chat.list.failedRequest.title'),
    description: message,
  };
}
