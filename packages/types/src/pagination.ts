export type CursorPaginationMeta = {
  total_count: number;
  status?: string;
  next_cursor?: number | string | null;
  has_next: boolean;
};

export type PagePaginationMeta = {
  total_count: number;
  current_page: number;
  page_size: number;
  total_pages: number;
};
