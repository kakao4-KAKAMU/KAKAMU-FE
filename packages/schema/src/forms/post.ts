import { z } from 'zod';

import {
  POST_CONTENT_MAX_LENGTH,
  POST_IMAGE_MAX_COUNT,
  POST_TITLE_MAX_LENGTH,
} from './post-constants';
import type { PostFormValidationMessages } from './post-messages';

const selectedMovieSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  release_date: z.string().optional(),
  poster_url: z.string().optional(),
});

export function createPostFormSchema(messages: PostFormValidationMessages) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, messages.title.required)
      .max(POST_TITLE_MAX_LENGTH, messages.title.max),
    content: z
      .string()
      .trim()
      .min(1, messages.content.required)
      .max(POST_CONTENT_MAX_LENGTH, messages.content.max),
    selectedMovies: z.array(selectedMovieSchema),
    image_urls: z
      .array(z.string().min(1))
      .max(POST_IMAGE_MAX_COUNT, messages.imageUrls.max),
    is_spoiler: z.boolean(),
  });
}

export type PostWriteFormInput = z.infer<ReturnType<typeof createPostFormSchema>>;
