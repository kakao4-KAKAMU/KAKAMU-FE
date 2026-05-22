/** 백엔드 API 에러 응답 본문 (`{ code, message }`) */
export interface ApiErrorBody {
  code: string;
  message: string;
}

export const API_ERROR_CODES = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
