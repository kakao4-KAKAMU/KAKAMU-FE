
export type MovieSort = 'year_asc' | 'year_desc' | 'name_asc' | 'name_desc';

export type MovieItem = {
  id: number;
  title: string;
  release_date?: string;
  genres?: string[];
  poster_url?: string;
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
  genre?: number[];
  year?: number;
  sort?: MovieSort;
  skip?: number;
  limit?: number;
};