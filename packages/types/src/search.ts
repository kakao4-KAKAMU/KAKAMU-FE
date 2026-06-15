
export type PersonSort = 'name_asc' | 'name_desc';

export type FeedContentType = 'review' | 'short' | 'question';

export type FeedPeriod = 'today' | 'week' | 'month';

export type FeedSort = 'latest' | 'popular' | 'relevance';


export type PersonSearchItem = {
  id: string;
  name: string;
  job?: string;
  profile_image?: string;
};

export type PersonSearchRequestBody = {
  name: string;
  job: string[];
  sort: PersonSort;
  page: number;
  limit: number;
};

export type PersonSearchParams = {
  name?: string;
  job?: string[];
  sort?: PersonSort;
  page?: number;
  limit?: number;
};

export type FeedSearchItem = {
  id: string;
  body?: string;
  content_type?: FeedContentType;
  author_name?: string;
  author_handle?: string;
  movie_title?: string;
  like_count?: number;
  comment_count?: number;
  created_at?: string;
};

export type FeedSearchParams = {
  q?: string;
  content_type?: FeedContentType;
  period?: FeedPeriod;
  sort?: FeedSort;
  cursor?: string;
  limit?: number;
};

export type SearchPageResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  next_cursor?: string | null;
};
