export type LikeTargetType = 'COMMENT' | 'POST';

export const LIKE_TARGET_TYPES = ['COMMENT', 'POST'] as const satisfies readonly LikeTargetType[];

export type LikeRequestBody = {
  target_type: LikeTargetType;
  target_id: number;
};

export type LikeToggleRequest = LikeRequestBody;

export type LikeToggleResponse = {
  status?: string;
  is_liked: boolean;
  like_count: number;
};

export type LikeResponse = LikeToggleResponse;
