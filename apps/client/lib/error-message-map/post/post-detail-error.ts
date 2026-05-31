import type { TFunction } from 'i18next';
import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPostDetailError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.post.detail.failedRequest.description');
  let title = t('account.post.detail.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.POST_NOT_FOUND:
      title = t('account.post.detail.error.notFound.title');
      message = t('account.post.detail.error.notFound.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
