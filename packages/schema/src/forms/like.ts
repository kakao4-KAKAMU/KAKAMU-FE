import { z } from 'zod';

import { LIKE_TARGET_TYPES } from './like-constants';

export const likeRequestSchema = z.object({
  target_type: z.enum(LIKE_TARGET_TYPES),
  target_id: z.number().int().positive(),
});

export type LikeRequestInput = z.infer<typeof likeRequestSchema>;
