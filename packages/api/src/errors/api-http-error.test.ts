import { describe, expect, it } from 'vitest';
import { HTTPError } from 'ky';

import { API_ERROR_CODES } from '@kakamu/types';

import { ApiHttpError, getApiErrorCode, isApiHttpError, parseApiErrorBody, toApiHttpError } from './api-http-error';

function createHttpError(body: unknown = { detail: { code: 'TOKEN_EXPIRED', message: 'expired' } }): HTTPError {
  const response = new Response(JSON.stringify(body), {
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
      detail: {
        code: API_ERROR_CODES.TOKEN_EXPIRED,
        message: 'expired',
      }
    });

    expect(isApiHttpError(apiError)).toBe(true);
    expect(getApiErrorCode(apiError)).toBe(API_ERROR_CODES.TOKEN_EXPIRED);
    expect(apiError.message).toBe('expired');
  });

  it('returns null code for non-api errors', () => {
    expect(getApiErrorCode(new Error('x'))).toBeNull();
  });

  it('parses API error body from HTTPError', async () => {
    const httpError = createHttpError();
    const body = await parseApiErrorBody(httpError);

    expect(body.detail.code).toBe(API_ERROR_CODES.TOKEN_EXPIRED);
    expect(body.detail.message).toBe('expired');
  });

  it('normalizes HTTPError to ApiHttpError', async () => {
    const apiError = await toApiHttpError(createHttpError());

    expect(isApiHttpError(apiError)).toBe(true);
    expect(getApiErrorCode(apiError)).toBe(API_ERROR_CODES.TOKEN_EXPIRED);
    expect(apiError.message).toBe('expired');
  });
});
