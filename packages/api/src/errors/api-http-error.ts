import { API_ERROR_CODES, type ApiErrorBody } from '@kakamu/types';
import { HTTPError, isHTTPError } from 'ky';

/** ky `HTTPError` + 파싱된 API 에러 본문 */
export class ApiHttpError extends HTTPError {
  readonly apiBody: ApiErrorBody;

  constructor(error: HTTPError, apiBody: ApiErrorBody) {
    super(error.response, error.request, error.options);
    this.apiBody = apiBody;
    this.message = apiBody.detail.message;
    this.name = 'ApiHttpError';
  }
}

export function isApiHttpError(error: unknown): error is ApiHttpError {
  return error instanceof ApiHttpError;
}

export async function parseApiErrorBody(error: HTTPError): Promise<ApiErrorBody> {
  const fallback: ApiErrorBody = {
    detail: {
      code: API_ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
    },
  };

  try {
    const res = (await error.response.clone().json()) as Partial<ApiErrorBody>;
    return {
      detail: {
        code: res.detail?.code ?? API_ERROR_CODES.UNKNOWN_ERROR,
        message: res.detail?.message ?? error.message,
      },
    };
  } catch {
    return fallback;
  }
}

export async function toApiHttpError(error: HTTPError): Promise<ApiHttpError> {
  const body = await parseApiErrorBody(error);
  return new ApiHttpError(error, body);
}

export function getApiErrorCode(error: unknown): string | null {
  if (isApiHttpError(error)) {
    return error.apiBody.detail.code;
  }
  return null;
}

export async function resolveApiErrorCode(error: unknown): Promise<string | null> {
  const code = getApiErrorCode(error);
  if (code) return code;
  return isHTTPError(error) ? (await parseApiErrorBody(error)).detail.code : null;
}

export function getApiErrorMessage(error: unknown): string | null {
  if (isApiHttpError(error)) {
    return error.apiBody.detail.message;
  }
  if (isHTTPError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return null;
}
