import type { TFunction } from 'i18next';
import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPostDeleteError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.post.delete.failedRequest.description');
  let title = t('account.post.delete.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.POST_NOT_FOUND:
      title = t('account.post.delete.error.notFound.title');
      message = t('account.post.delete.error.notFound.description');
      break;
    case API_ERROR_CODES.FORBIDDEN_POST_UPDATE:
      title = t('account.post.delete.error.forbidden.title');
      message = t('account.post.delete.error.forbidden.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
