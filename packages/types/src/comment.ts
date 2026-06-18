import { MentionUserItem } from "./post";

export type PaginationMeta = {
  total_count: number;
  current_page: number;
  page_size: number;
  total_pages: number;
};

export type CommentItem = {
  id: number;
  /** 목록 조회 시 클라이언트가 post 컨텍스트로 보강 */
  post_id: number;
  parent_id: number | null;
  author_id: string | null;
  author: string;
  content: string;
  is_spoiler: boolean;
  like_count: number;
  is_liked: boolean;
  hashtags: string[];
  mentions: MentionUserItem[];
  created_at: string;
};

export type CommentCreateRequest = {
  content: string;
  parent_id?: number | null;
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
  meta: PaginationMeta;
};

export type CommentSpoilerDetailResponse = {
  id: number;
  content: string;
};

export type CommentDeleteResponse = {
  status: 'success';
};

export type CommentListParams = {
  page?: number;
  size?: number;
};
