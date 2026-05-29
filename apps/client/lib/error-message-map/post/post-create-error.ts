import type { TFunction } from 'i18next';
import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPostCreateError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.post.create.failedRequest.description');
  let title = t('account.post.create.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.HASHTAG_LIMIT_EXCEEDED:
      title = t('account.post.create.error.hashtagLimitExceeded.title');
      message = t('account.post.create.error.hashtagLimitExceeded.description');
      break;
    case API_ERROR_CODES.INVALID_REFERENCE_DATA:
      title = t('account.post.create.error.invalidReferenceData.title');
      message = t('account.post.create.error.invalidReferenceData.description');
      break;
    case API_ERROR_CODES.POST_CREATION_FAILED:
      message = fallback;
      break;
    default:
      break;
  }

  return { title, description: message };
}
