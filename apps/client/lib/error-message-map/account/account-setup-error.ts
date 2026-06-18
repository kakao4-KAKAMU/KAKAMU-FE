import type { TFunction } from 'i18next';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapAuthStatusLoadError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.setup.error.load.description');
  const title = t('account.setup.error.load.title');
  const { message } = parseApiError(error, fallback);
  return { title, description: message };
}

export function mapSocialLinkError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.setup.error.link.description');
  const title = t('account.setup.error.link.title');
  const { message } = parseApiError(error, fallback);
  return { title, description: message };
}

export function mapSocialUnlinkError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.setup.error.unlink.description');
  const title = t('account.setup.error.unlink.title');
  const { message } = parseApiError(error, fallback);
  return { title, description: message };
}
