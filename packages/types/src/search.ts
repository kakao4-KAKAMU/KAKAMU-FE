export type MovieSort = 'year-desc' | 'year-asc' | 'name-desc' | 'name-asc';

export type PersonSort = 'name-desc' | 'name-asc';

export type MovieSearchItem = {
  id: string;
  name: string;
  year?: number;
  poster_url?: string;
};

export type PersonSearchItem = {
  id: string;
  name: string;
  job?: string;
  profile_image_url?: string;
};

export type MovieSearchParams = {
  genre?: string[];
  name?: string;
  year?: number;
  sort?: MovieSort;
  cursor?: string;
  limit?: number;
};

export type PersonSearchParams = {
  name?: string;
  job?: string[];
  sort?: PersonSort;
  cursor?: string;
  limit?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  next_cursor?: string | null;
};
