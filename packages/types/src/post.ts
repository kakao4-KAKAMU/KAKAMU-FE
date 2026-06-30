import type { MovieItem } from './movie';
import type { Mention, UserSimple } from './user';

export type { Mention as MentionUserItem } from './user';

export type PostItem = {
  id: number;
  user: UserSimple;
  hashtags: string[];
  mentions: Mention[];
  like_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string | null;
  title: string;
  content: string;
  image_urls: string[];
  is_spoiler: boolean;
  movies: MovieItem[];
  comment_count: number;
};

export type PostWriteRequestBody = {
  title: string;
  content: string;
  movie_ids: string[];
  image_urls?: string[] | null;
  is_spoiler?: number;
};

export type PostCreateRequest = PostWriteRequestBody;

export type PostIdResponse = {
  status?: string;
  message?: string | null;
  post_id: number;
};

export type PostCreateResponse = PostIdResponse;

export type PostUpdateRequest = PostWriteRequestBody;

export type PostUpdateResponse = PostIdResponse;

export type SuccessResponse = {
  status?: string;
  message?: string | null;
};

export type PostDeleteResponse = SuccessResponse;

export type PostListParams = {
  target_user_id: string;
  cursor?: number;
  limit: number;
};

export type LikedPostListParams = {
  cursor?: number;
  limit: number;
};

export type FeedPostListParams = {
  cursor?: number;
  limit: number;
};

export type PostCursorListResponse = {
  items: PostItem[];
  next_cursor: number | null;
  has_next: boolean;
};

export type SearchPost = PostItem;

export type PostSearchResponse = {
  status?: string;
  items: SearchPost[];
  meta: import('./pagination').CursorPaginationMeta;
  fallback?: boolean | null;
  message?: string | null;
};
