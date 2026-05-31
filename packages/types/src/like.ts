export type LikeTargetType = 'COMMENT' | 'POST';

export const LIKE_TARGET_TYPES = ['COMMENT', 'POST'] as const satisfies readonly LikeTargetType[];

export type LikeRequestBody = {
  target_type: LikeTargetType;
  target_id: number;
};

export type LikeResponse = {
  status: 'success';
};
