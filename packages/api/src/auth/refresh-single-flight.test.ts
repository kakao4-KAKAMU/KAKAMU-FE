import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiClient } from '../client';
import type { TokenBridge } from './token-bridge';
import { refreshTokensSingleFlight, resetRefreshSingleFlightForTests } from './refresh-single-flight';

const loginResponse = {
  is_new_user: false,
  access_token: 'new-access',
  refresh_token: 'new-refresh',
};

vi.mock('../users/refresh', () => ({
  postUserLoginRefresh: vi.fn(),
}));

import { postUserLoginRefresh } from '../users/refresh';

const mockPostUserLoginRefresh = vi.mocked(postUserLoginRefresh);

function createBareClient(): ApiClient {
  return {} as ApiClient;
}

function createTokenBridge(overrides: Partial<TokenBridge> = {}): TokenBridge {
  return {
    getAccessToken: () => null,
    getRefreshToken: vi.fn().mockResolvedValue('legacy-refresh'),
    setTokens: vi.fn().mockResolvedValue(undefined),
    clearSession: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('refreshTokensSingleFlight', () => {
  beforeEach(() => {
    resetRefreshSingleFlightForTests();
    vi.clearAllMocks();
    mockPostUserLoginRefresh.mockResolvedValue(loginResponse);
  });

  it('calls postUserLoginRefresh once when invoked concurrently', async () => {
    const bareClient = createBareClient();
    const tokenBridge = createTokenBridge();

    mockPostUserLoginRefresh.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 30));
      return loginResponse;
    });

    const [first, second] = await Promise.all([
      refreshTokensSingleFlight(bareClient, tokenBridge),
      refreshTokensSingleFlight(bareClient, tokenBridge),
    ]);

    expect(mockPostUserLoginRefresh).toHaveBeenCalledTimes(1);
    expect(first).toEqual(loginResponse);
    expect(second).toEqual(loginResponse);
    expect(tokenBridge.setTokens).toHaveBeenCalledWith('new-access', 'new-refresh');
  });

  it('clears session when refresh token is missing', async () => {
    const bareClient = createBareClient();
    const tokenBridge = createTokenBridge({
      getRefreshToken: vi.fn().mockResolvedValue(null),
    });

    await expect(refreshTokensSingleFlight(bareClient, tokenBridge)).rejects.toThrow(
      'No refresh token',
    );

    expect(mockPostUserLoginRefresh).not.toHaveBeenCalled();
    expect(tokenBridge.clearSession).toHaveBeenCalled();
  });

  it('clears session when refresh request fails', async () => {
    const bareClient = createBareClient();
    const tokenBridge = createTokenBridge();
    mockPostUserLoginRefresh.mockRejectedValue(new Error('refresh failed'));

    await expect(refreshTokensSingleFlight(bareClient, tokenBridge)).rejects.toThrow(
      'refresh failed',
    );

    expect(tokenBridge.clearSession).toHaveBeenCalled();
  });
});
