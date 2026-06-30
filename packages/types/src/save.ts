import type { MovieItem } from './movie';

export type SaveTargetType = 'POST' | 'COMMENT' | 'MOVIE';

export const SAVE_TARGET_TYPES = ['POST', 'COMMENT', 'MOVIE'] as const satisfies readonly SaveTargetType[];

export type SaveToggleRequest = {
  target_type: SaveTargetType;
  target_id?: number | null;
  movie_id?: string | null;
};

export type SaveToggleResponse = {
  status?: string;
  is_saved: boolean;
};

export type SavedPostListParams = {
  cursor?: number;
  limit: number;
};

export type SavedCommentListParams = {
  page?: number;
  size?: number;
};

export type SavedMovieListParams = {
  cursor?: number;
  limit: number;
};

export type SavedMovieListResponse = {
  status?: string;
  items: MovieItem[];
  next_cursor?: number | null;
  has_next?: boolean;
};
