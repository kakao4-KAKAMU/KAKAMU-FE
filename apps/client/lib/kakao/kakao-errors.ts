export class KakaoLoginError extends Error {
  readonly name = 'KakaoLoginError';

  constructor(
    message: string,
    readonly code: 'NOT_CONFIGURED' | 'SDK_LOAD_FAILED' | 'LOGIN_FAILED' | 'CANCELLED' | 'UNKNOWN'
  ) {
    super(message);
  }
}

export function isKakaoLoginCancelled(error: unknown): boolean {
  if (error instanceof KakaoLoginError) {
    return error.code === 'CANCELLED';
  }
  if (!error || typeof error !== 'object') {
    return false;
  }
  const e = error as { code?: string; message?: string };
  const msg = (e.message ?? '').toLowerCase();
  return (
    e.code === 'E_CANCELLED_OPERATION' ||
    e.code === 'UserCancel' ||
    msg.includes('cancel') ||
    msg.includes('취소')
  );
}

export function toKakaoLoginError(error: unknown): KakaoLoginError {
  if (error instanceof KakaoLoginError) {
    return error;
  }
  if (isKakaoLoginCancelled(error)) {
    return new KakaoLoginError('카카오 로그인이 취소되었습니다.', 'CANCELLED');
  }
  if (error instanceof Error) {
    return new KakaoLoginError(error.message, 'UNKNOWN');
  }
  return new KakaoLoginError('카카오 로그인에 실패했습니다.', 'UNKNOWN');
}
