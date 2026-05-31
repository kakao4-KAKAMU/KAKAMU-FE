import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapImageUploadError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.upload.failedRequest.description');
  const title = t('account.upload.failedRequest.title');
  const { message } = parseApiError(error, fallback);

  return { title, description: message };
}
