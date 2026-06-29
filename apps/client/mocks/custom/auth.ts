import { http, HttpResponse } from 'msw';

import { getApiBaseUrl } from '../api-base';
import { MOCK_ACCOUNT_SETTINGS, MOCK_TOKEN_RESPONSE } from './fixtures';

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
];
