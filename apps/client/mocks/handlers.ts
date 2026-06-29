import type { RequestHandler } from 'msw';

import { authHandlers } from './custom/auth';
import { chatStreamHandlers } from './custom/chat-stream';
import { uploadHandlers } from './custom/upload';
import { createGeneratedHandlers } from './handlers.generated';
import { wrapHandlerWithImageUrls } from './lib/patch-image-urls';

const customHandlers: RequestHandler[] = [
  ...authHandlers,
  ...chatStreamHandlers,
  ...uploadHandlers,
];

let handlersPromise: Promise<RequestHandler[]> | null = null;

/** custom override가 generated보다 먼저 매칭되도록 병합 */
export function getHandlers(): Promise<RequestHandler[]> {
  if (!handlersPromise) {
    handlersPromise = createGeneratedHandlers().then((generatedHandlers) => [
      ...customHandlers,
      ...generatedHandlers.map(wrapHandlerWithImageUrls),
    ]);
  }

  return handlersPromise;
}
