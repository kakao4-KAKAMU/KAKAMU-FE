import type { Mention, UserSimple } from './user';
import type { PagePaginationMeta } from './pagination';

export type { PagePaginationMeta as PaginationMeta } from './pagination';

export type CommentItem = {
  id: number;
  parent_id: number | null;
  user: UserSimple;
  content: string;
  is_spoiler: boolean;
  created_at: string;
  like_count: number;
  is_liked: boolean;
  hashtags: string[];
  mentions: Mention[];
};

export type CommentCreateRequest = {
  content: string;
  parent_id?: number | null;
  is_spoiler?: number;
};

export type CommentUpdateRequest = {
  content: string;
  is_spoiler?: number;
};

export type CommentIdResponse = {
  status?: string;
  message?: string | null;
  comment_id: number;
};

export type CommentListResponse = {
  status?: string;
  items: CommentItem[];
  meta: PagePaginationMeta;
};

export type CommentSpoilerDetailResponse = {
  id: number;
  content: string;
};

export type SuccessResponse = {
  status?: string;
  message?: string | null;
};

export type CommentDeleteResponse = SuccessResponse;

export type CommentUpdateResponse = SuccessResponse;

export type CommentListParams = {
  page?: number;
  size?: number;
};
