import type { TFunction } from 'i18next';
import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPostUpdateError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.post.update.failedRequest.description');
  let title = t('account.post.update.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.POST_NOT_FOUND:
      title = t('account.post.update.error.notFound.title');
      message = t('account.post.update.error.notFound.description');
      break;
    case API_ERROR_CODES.FORBIDDEN_POST_UPDATE:
      title = t('account.post.update.error.forbidden.title');
      message = t('account.post.update.error.forbidden.description');
      break;
    case API_ERROR_CODES.HASHTAG_LIMIT_EXCEEDED:
      title = t('account.post.update.error.hashtagLimitExceeded.title');
      message = t('account.post.update.error.hashtagLimitExceeded.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
