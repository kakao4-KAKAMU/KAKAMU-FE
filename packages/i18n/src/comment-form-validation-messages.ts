import type { TFunction } from 'i18next';

import {
  COMMENT_CONTENT_MAX_LENGTH,
  type CommentFormValidationMessages,
} from '@kakamu/schema';

export function buildCommentFormValidationMessages(t: TFunction): CommentFormValidationMessages {
  return {
    content: {
      required: t('shared.feedDetail.validation.content.required'),
      max: t('shared.feedDetail.validation.content.max', { max: COMMENT_CONTENT_MAX_LENGTH }),
    },
  };
}
