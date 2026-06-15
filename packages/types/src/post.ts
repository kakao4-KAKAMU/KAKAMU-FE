import type { MovieItem } from './movie';

export type PostItem = {
  id: number;
  author_id: string | null;
  author: string | null;
  author_image: string | null;
  title: string;
  content: string;
  image_urls: string[];
  is_spoiler: boolean;
  movies: MovieItem[];
  hashtags: string[];
  like_count: number;
  is_liked: boolean;
  is_following: boolean;
  comment_count: number;
  created_at: string;
};

export type PostWriteRequestBody = {
  title: string;
  content: string;
  movie_ids: string[];
  image_urls: string[];
  is_spoiler: boolean;
};

export type PostCreateRequest = PostWriteRequestBody;

export type PostCreateResponse = {
  status: 'success';
  post_id: number;
};

export type PostUpdateRequest = PostWriteRequestBody;

export type PostUpdateResponse = {
  status: 'success';
  post_id: number;
};

export type PostDeleteResponse = {
  status: 'success';
};

export type PostListParams = {
  target_user_id: string;
  cursor?: number;
  limit: number;
};

export type LikedPostListParams = {
  cursor?: number;
  limit: number;
};

export type PostCursorListResponse = {
  items: PostItem[];
  next_cursor: number;
  has_next: boolean;
};
