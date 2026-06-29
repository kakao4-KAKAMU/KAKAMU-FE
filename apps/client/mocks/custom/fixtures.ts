/** 로컬 MSW 개발용 고정 mock 토큰·유저 ID */
export const MOCK_ACCESS_TOKEN = 'mock-access-token-dev';
export const MOCK_REFRESH_TOKEN = 'mock-refresh-token-dev';
export const MOCK_USER_ID = '11111111-1111-4111-8111-111111111111';
export const MOCK_PERSONA_ID = '22222222-2222-4222-8222-222222222222';

export const MOCK_USER_PUBLIC = {
  id: MOCK_USER_ID,
  nickname: 'mock_user',
  tag: '0001',
  profile_image: null,
  created_at: '2026-01-01T00:00:00.000Z',
  is_following: false,
  profile_msg: null,
  follower_count: 0,
  following_count: 0,
  post_count: 0,
} as const;

export const MOCK_USER_ACCOUNT = {
  id: MOCK_USER_ID,
  username: 'mock_user',
  nickname: 'mock_user',
  phone: '01000000000',
  tag: '0001',
  profile_image_url: null,
  profile_msg: null,
  created_at: '2026-01-01T00:00:00.000Z',
} as const;

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
