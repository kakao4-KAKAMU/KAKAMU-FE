export type MovieSort = 'year_asc' | 'year_desc' | 'name_asc' | 'name_desc';

import type { Genre } from './genre';

export type MovieItem = {
  id: string;
  title: string;
  poster_url?: string | null;
  release_date?: string | null;
};

export type MovieTitle = {
  title_name: string;
  country: string;
  is_original: boolean;
};

export type MovieOverview = {
  platform: string;
  lang?: string | null;
  overview: string;
};

export type MovieStaff = {
  id: string;
  name: string;
  job?: string | null;
  profile_image?: string | null;
};

export type MovieDetail = {
  id: string;
  titles: MovieTitle[];
  poster_url?: string | null;
  nation?: string | null;
  release_date?: string | null;
  producing_year?: number | null;
  runtime?: number | null;
  is_adult: boolean;
  youtube_videos?: YoutubeVideo[];
  overviews?: MovieOverview[];
  genres?: Genre[];
  staffs?: MovieStaff[];
  is_saved?: boolean;
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

export type MovieRecommendParams = {
  query?: string;
};

export type MovieRecommendItem = {
  id: string;
  title: string;
  plot_summary: string;
  score: number;
};

export type MovieRecommendationResponse = {
  arm_id: string;
  movies: MovieRecommendItem[];
  keywords: string[];
  themes: string[];
  moods: string[];
};

export type WatchMovieResponse = {
  status?: string;
  message: string;
};

export type MovieEvaluation = 'LIKE' | 'DISLIKE';

export type YoutubeVideo = {
  movie_id: string;
  is_trailer: boolean;
  language: string;
  youtube_video_id: string;
};

export type MovieWithTrailers = {
  id: string;
  title: string;
  poster_url?: string | null;
  release_date?: string | null;
  youtube_videos?: YoutubeVideo[];
};

export type MovieToEvaluateParams = {
  persona_id?: string | null;
  limit?: number;
};

export type MovieToEvaluateListResponse = {
  items: MovieWithTrailers[];
};

export type MovieEvaluationRequest = {
  movie_id: string;
  evaluation: MovieEvaluation;
  persona_id?: string | null;
};

export type MovieEvaluationResponse = {
  message: string;
  user_id: string;
  persona_id?: string | null;
  movie_id: string;
  evaluation: string;
};
