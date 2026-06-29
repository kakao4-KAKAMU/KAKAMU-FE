import { http, HttpResponse } from 'msw';

import { getApiBaseUrl } from '../api-base';
import {
  MOCK_ACCOUNT_SETTINGS,
  MOCK_TOKEN_RESPONSE,
  MOCK_USER_ACCOUNT,
  MOCK_USER_PUBLIC,
} from './fixtures';

function apiUrl(path: string): string {
  return `${getApiBaseUrl()}/${path.replace(/^\//, '')}`;
}

/** login/refresh 등 세션 일관성이 필요한 인증 엔드포인트 */
export const authHandlers = [
  http.post(apiUrl('users/login/local'), () => {
    return HttpResponse.json(MOCK_TOKEN_RESPONSE);
  }),
  http.post(apiUrl('users/login/social'), () => {
    return HttpResponse.json(MOCK_TOKEN_RESPONSE);
  }),
  http.post(apiUrl('users/login/refresh'), () => {
    return HttpResponse.json(MOCK_TOKEN_RESPONSE);
  }),
  http.post(apiUrl('users/register/social'), () => {
    return HttpResponse.json(MOCK_TOKEN_RESPONSE);
  }),
  http.get(apiUrl('users/auth-status'), () => {
    return HttpResponse.json(MOCK_ACCOUNT_SETTINGS);
  }),
  http.get(apiUrl('users/me'), () => {
    return HttpResponse.json(MOCK_USER_PUBLIC);
  }),
  http.put(apiUrl('users/me'), async ({ request }) => {
    const body = (await request.json()) as {
      nickname?: string | null;
      profile_image_url?: string | null;
    };

    return HttpResponse.json({
      ...MOCK_USER_ACCOUNT,
      ...(body.nickname != null ? { nickname: body.nickname } : {}),
      ...(body.profile_image_url !== undefined
        ? { profile_image_url: body.profile_image_url }
        : {}),
    });
  }),
];
