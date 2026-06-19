export type MovieSort = 'year_asc' | 'year_desc' | 'name_asc' | 'name_desc';

export type MovieItem = {
  id: string;
  title: string;
  poster_url?: string | null;
  release_date?: string | null;
};

export type MovieSearchRequestBody = {
  name: string;
  genre: string[];
  year?: number;
  sort: MovieSort;
  skip: number;
  limit: number;
};

export type MovieSearchParams = {
  name?: string;
  genre?: string[];
  year?: number;
  sort?: MovieSort;
  skip?: number;
  limit?: number;
};

export type MovieFilterSearchResponse = {
  status?: string;
  items: MovieItem[];
  skip: number;
  limit: number;
  total_count: number;
};

export type MovieTabSearchResponse = {
  status?: string;
  items: MovieItem[];
  meta: import('./pagination').CursorPaginationMeta;
};

export type MovieRecommendationResponse = {
  recommendations: string;
  for_persona: string;
};

export type WatchMovieResponse = {
  status?: string;
  message: string;
};
