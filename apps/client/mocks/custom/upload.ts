import { http, HttpResponse } from 'msw';

import { getUploadApiBaseUrl } from '../api-base';

/** OpenAPI 스펙에 없는 업로드 API mock */
export const uploadHandlers = [
  http.post(`${getUploadApiBaseUrl()}/`, () => {
    return HttpResponse.json({
      image_url: 'https://picsum.photos/seed/filma-mock/800/600',
    });
  }),
  http.post(getUploadApiBaseUrl(), () => {
    return HttpResponse.json({
      image_url: 'https://picsum.photos/seed/filma-mock/800/600',
    });
  }),
];
