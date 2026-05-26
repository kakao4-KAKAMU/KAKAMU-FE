import { describe, expect, it } from 'vitest';
import { HTTPError } from 'ky';

import { API_ERROR_CODES } from '@kakamu/types';

import { ApiHttpError, getApiErrorCode, isApiHttpError } from './api-http-error';

function createHttpError(): HTTPError {
  const response = new Response(JSON.stringify({ code: 'TOKEN_EXPIRED', message: 'expired' }), {
    status: 401,
    statusText: 'Unauthorized',
  });
  const request = new Request('https://api.example.com/users/me');
  return new HTTPError(response, request as never, {} as never);
}

describe('ApiHttpError', () => {
  it('exposes api error code via helpers', () => {
    const httpError = createHttpError();
    const apiError = new ApiHttpError(httpError, {
      code: API_ERROR_CODES.TOKEN_EXPIRED,
      message: 'expired',
    });

    expect(isApiHttpError(apiError)).toBe(true);
    expect(getApiErrorCode(apiError)).toBe(API_ERROR_CODES.TOKEN_EXPIRED);
    expect(apiError.message).toBe('expired');
  });

  it('returns null code for non-api errors', () => {
    expect(getApiErrorCode(new Error('x'))).toBeNull();
  });
});
