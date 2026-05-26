import { getApiErrorCode, getApiErrorMessage } from '@kakamu/api';

export type ParsedApiError = {
  message: string;
  code: string | null;
};

/** UI·알림용 API 에러 파싱 (`ApiHttpError` 및 일반 Error) */
export function parseApiError(
  error: unknown,
  fallbackMessage: string,
): ParsedApiError {
  return {
    code: getApiErrorCode(error),
    message: getApiErrorMessage(error) ?? fallbackMessage,
  };
}
