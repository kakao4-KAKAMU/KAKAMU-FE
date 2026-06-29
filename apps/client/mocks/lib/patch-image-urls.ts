import {
  HttpHandler,
  HttpResponse,
  type JsonBodyType,
  type RequestHandler,
  type RequestHandlerOptions,
  type ResponseResolver,
} from 'msw';

import {
  isImageUrlField,
  mockContentImageUrl,
  mockImageUrlForField,
} from './faker-images';

type HandlerInternals = {
  resolver: ResponseResolver;
  options?: RequestHandlerOptions;
};

function patchImageUrlScalar(key: string, value: unknown): unknown {
  if (value !== null && value !== undefined && typeof value !== 'string') {
    return value;
  }

  return mockImageUrlForField(key);
}

function patchImageUrlArray(value: unknown): unknown {
  if (value === null || value === undefined) {
    return [mockContentImageUrl()];
  }

  if (!Array.isArray(value)) {
    return value;
  }

  if (value.length === 0) {
    return value;
  }

  return value.map(() => mockContentImageUrl());
}

/** JSON 응답 본문의 이미지 URL 필드를 Faker URL로 치환 */
export function patchImageUrlsInData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => patchImageUrlsInData(item));
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  const record = value as Record<string, unknown>;
  const patched: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(record)) {
    if (key === 'image_urls') {
      patched[key] = patchImageUrlArray(child);
      continue;
    }

    if (isImageUrlField(key)) {
      patched[key] = patchImageUrlScalar(key, child);
      continue;
    }

    patched[key] = patchImageUrlsInData(child);
  }

  return patched;
}

async function patchJsonResponseImageUrls(response: Response): Promise<Response> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return response;
  }

  let data: unknown;
  try {
    data = await response.clone().json();
  } catch {
    return response;
  }

  return HttpResponse.json(patchImageUrlsInData(data) as JsonBodyType, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

/** OpenAPI generated handler 응답에 이미지 URL 패치 적용 */
export function wrapHandlerWithImageUrls(handler: RequestHandler): RequestHandler {
  if (!(handler instanceof HttpHandler)) {
    return handler;
  }

  const { method, path } = handler.info;
  const { resolver: originalResolver, options } =
    handler as unknown as HandlerInternals;

  return new HttpHandler(
    method,
    path,
    async (info) => {
      const response = await originalResolver(info);
      if (!(response instanceof Response)) {
        return response;
      }

      return patchJsonResponseImageUrls(response);
    },
    options,
  );
}
