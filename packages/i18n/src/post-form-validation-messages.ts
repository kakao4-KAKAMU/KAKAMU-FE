import type { TFunction } from 'i18next';

import {
  POST_CONTENT_MAX_LENGTH,
  POST_IMAGE_MAX_COUNT,
  POST_TITLE_MAX_LENGTH,
  type PostFormValidationMessages,
} from '@kakamu/schema';

export function buildPostFormValidationMessages(t: TFunction): PostFormValidationMessages {
  return {
    title: {
      required: t('account.post.write.validation.title.required'),
      max: t('account.post.write.validation.title.max', { max: POST_TITLE_MAX_LENGTH }),
    },
    content: {
      required: t('account.post.write.validation.content.required'),
      max: t('account.post.write.validation.content.max', { max: POST_CONTENT_MAX_LENGTH }),
    },
    imageUrls: {
      max: t('account.post.write.validation.images.max', { max: POST_IMAGE_MAX_COUNT }),
    },
  };
}
