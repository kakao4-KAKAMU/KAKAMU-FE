import type { TFunction } from 'i18next';
import { API_ERROR_CODES } from '@kakamu/types';

import { parseApiError } from '@/lib/auth/parse-api-error';

type ErrorView = {
  title: string;
  description: string;
};

export function mapSonarEvaluateError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.sonar.error.failedRequest.description');
  let title = t('account.sonar.error.failedRequest.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.ALREADY_EVALUATED:
      title = t('account.sonar.error.alreadyEvaluated.title');
      message = t('account.sonar.error.alreadyEvaluated.description');
      break;
    case API_ERROR_CODES.MOVIE_NOT_FOUND:
      title = t('account.sonar.error.movieNotFound.title');
      message = t('account.sonar.error.movieNotFound.description');
      break;
    case API_ERROR_CODES.PERSONA_NOT_FOUND_OR_FORBIDDEN:
      title = t('account.sonar.error.personaForbidden.title');
      message = t('account.sonar.error.personaForbidden.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}

export function mapSonarLoadError(error: unknown, t: TFunction): ErrorView {
  const fallback = t('account.sonar.loadFailed.description');
  let title = t('account.sonar.loadFailed.title');
  let { message, code } = parseApiError(error, fallback);

  switch (code) {
    case API_ERROR_CODES.PERSONA_NOT_FOUND_OR_FORBIDDEN:
      title = t('account.sonar.error.personaForbidden.title');
      message = t('account.sonar.error.personaForbidden.description');
      break;
    default:
      break;
  }

  return { title, description: message };
}
