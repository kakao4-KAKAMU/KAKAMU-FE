export type CommentItem = {
  id: number;
  post_id: number;
  author_id: string | null;
  author: string | null;
  author_image: string | null;
  content: string;
  like_count: number;
  is_liked: boolean;
  created_at: string;
};

export type CommentCursorListResponse = {
  items: CommentItem[];
  next_cursor: number;
  has_next: boolean;
};
