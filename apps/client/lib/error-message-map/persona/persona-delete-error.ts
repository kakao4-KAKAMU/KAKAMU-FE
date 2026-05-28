import type { TFunction } from 'i18next';
import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapPersonaDeleteError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.persona.delete.failedRequest.description');
  let title = t('account.persona.delete.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case 'BAD_REQUEST':
    case 'PERSONA_DELETE_MIN_REQUIRED':
    case 'PERSONA_MIN_REQUIRED':
      title = t('account.persona.delete.error.minimumRequired.title');
      message = t('account.persona.delete.error.minimumRequired.description');
      break;
    case 'NOT_FOUND':
    case 'PERSONA_NOT_FOUND':
      title = t('account.persona.delete.error.notFound.title');
      message = t('account.persona.delete.error.notFound.description');
      break;
    case 'FORBIDDEN':
      title = t('account.persona.delete.error.forbidden.title');
      message = t('account.persona.delete.error.forbidden.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
