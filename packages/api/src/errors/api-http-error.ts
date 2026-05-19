import type { ApiErrorBody } from '@kakamu/types';
import { HTTPError } from 'ky';

/** ky `HTTPError` + 파싱된 API 에러 본문 */
export class ApiHttpError extends HTTPError {
  readonly apiBody: ApiErrorBody;

  constructor(error: HTTPError, apiBody: ApiErrorBody) {
    super(error.response, error.request, error.options);
    this.apiBody = apiBody;
    this.message = apiBody.message;
    this.name = 'ApiHttpError';
  }
}

export function isApiHttpError(error: unknown): error is ApiHttpError {
  return error instanceof ApiHttpError;
}

export function getApiErrorCode(error: unknown): string | null {
  if (isApiHttpError(error)) {
    return error.apiBody.code;
  }
  return null;
}

export function getApiErrorMessage(error: unknown): string | null {
  if (isApiHttpError(error)) {
    return error.apiBody.message;
  }
  if (error instanceof HTTPError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return null;
}
