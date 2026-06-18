import { z } from 'zod';

import { COMMENT_CONTENT_MAX_LENGTH } from './comment-constants';
import type { CommentFormValidationMessages } from './comment-messages';

export function createCommentFormSchema(messages: CommentFormValidationMessages) {
  return z.object({
    content: z
      .string()
      .trim()
      .min(1, messages.content.required)
      .max(COMMENT_CONTENT_MAX_LENGTH, messages.content.max),
    is_spoiler: z.boolean(),
  });
}

export type CommentFormInput = z.infer<ReturnType<typeof createCommentFormSchema>>;
