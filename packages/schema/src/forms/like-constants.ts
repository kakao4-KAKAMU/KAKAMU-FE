import type { LikeTargetType } from '@kakamu/types';

export const LIKE_TARGET_TYPES = ['COMMENT', 'POST'] as const satisfies readonly LikeTargetType[];

export type LikeTargetTypeId = (typeof LIKE_TARGET_TYPES)[number];
