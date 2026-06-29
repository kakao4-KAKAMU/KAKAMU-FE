export type Mention = {
  id: string;
  nickname: string;
  tag: string;
};

export type UserSimple = {
  id: string | null;
  nickname: string;
  tag: string;
  profile_image: string | null;
  created_at: string;
};

export type UserSimpleWithFollow = UserSimple & {
  is_following: boolean;
};

/** `GET /users/{user_id}` 응답 */
export type UserPublic = {
  id: string | null;
  nickname: string;
  tag: string;
  profile_image: string | null;
  created_at: string;
  is_following: boolean;
  profile_msg: string | null;
  follower_count: number;
  following_count: number;
  post_count: number;
};

/** `PUT /users/me` 응답 */
export type UserAccount = {
  id: string;
  username: string;
  nickname: string;
  phone: string;
  tag: string;
  profile_image_url: string | null;
  profile_msg: string | null;
  created_at: string;
};

export type UserUpdate = {
  nickname?: string | null;
  profile_image_url?: string | null;
};
