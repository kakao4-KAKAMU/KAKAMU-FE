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

export type UserSimpleInfo = {
  id: string;
  nickname: string;
  username: string;
};

export type FollowListParams = {
  target_user_id: string;
  cursor?: string;
  limit: number;
};

export type FollowListResponse = {
  items: UserSimpleInfo[];
  next_cursor: string | null;
  has_next: boolean;
};
