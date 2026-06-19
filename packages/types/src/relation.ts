import type { UserSimpleWithFollow } from './user';

export type RelationResponse = {
  status: string;
  message: string;
};

export type BlockLevel = 'PERSONA' | 'USER';

export const BLOCK_LEVELS = {
  PERSONA: 'PERSONA',
  USER: 'USER',
} as const satisfies Record<string, BlockLevel>;

export type BlockRequest = {
  level?: BlockLevel;
};

/** @deprecated `UserSimpleWithFollow` 사용 */
export type UserSimpleInfo = UserSimpleWithFollow;

export type FollowListParams = {
  target_user_id: string;
  cursor?: string;
  limit: number;
};

export type FollowListResponse = {
  items: UserSimpleWithFollow[];
  next_cursor: string | null;
  has_next: boolean;
};
