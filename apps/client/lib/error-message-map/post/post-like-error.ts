import type { TFunction } from 'i18next';
import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPostLikeError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.post.like.failedRequest.description');
  let title = t('account.post.like.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.TARGET_NOT_FOUND:
    case API_ERROR_CODES.POST_NOT_FOUND:
      title = t('account.post.like.error.notFound.title');
      message = t('account.post.like.error.notFound.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
