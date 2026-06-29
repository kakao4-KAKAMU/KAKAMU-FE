/** 로컬 MSW 개발용 고정 mock 토큰·유저 ID */
export const MOCK_ACCESS_TOKEN = 'mock-access-token-dev';
export const MOCK_REFRESH_TOKEN = 'mock-refresh-token-dev';
export const MOCK_USER_ID = '11111111-1111-4111-8111-111111111111';
export const MOCK_PERSONA_ID = '22222222-2222-4222-8222-222222222222';

export const MOCK_TOKEN_RESPONSE = {
  access_token: MOCK_ACCESS_TOKEN,
  refresh_token: MOCK_REFRESH_TOKEN,
  is_new_user: false,
} as const;

export const MOCK_ACCOUNT_SETTINGS = {
  primary_provider: 'local',
  local_auth: {
    is_linked: true,
    email: 'mock@filma.dev',
  },
  social_auths: [
    {
      provider: 'kakao',
      is_linked: false,
      connected_at: null,
      email: null,
    },
  ],
} as const;
