import { http, HttpResponse } from 'msw';

import { getUploadApiBaseUrl } from '../api-base';
import { mockContentImageUrl } from '../lib/faker-images';

/** OpenAPI 스펙에 없는 업로드 API mock */
export const uploadHandlers = [
  http.post(`${getUploadApiBaseUrl()}/`, () => {
    return HttpResponse.json({
      image_url: mockContentImageUrl(),
    });
  }),
  http.post(getUploadApiBaseUrl(), () => {
    return HttpResponse.json({
      image_url: mockContentImageUrl(),
    });
  }),
];
