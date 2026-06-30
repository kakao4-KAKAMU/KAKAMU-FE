import type { Genre } from './genre';

export type PersonaMovie = {
  id: string;
  title: string;
  poster_url?: string | null;
  release_date?: string | null;
};

export type PersonaPerson = {
  id: string;
  name: string;
  job?: string | null;
  profile_image?: string | null;
};

export type Persona = {
  id: string;
  user_id: string;
  nickname: string;
  profile_image_url: string | null;
  fav_genres?: Genre[];
  fav_movies?: PersonaMovie[];
  fav_people?: PersonaPerson[];
};

export type PersonaCreateRequest = {
  nickname: string;
  profile_image_url?: string | null;
  fav_movie_ids?: string[] | null;
  fav_genre_ids?: string[] | null;
  fav_people_ids?: string[] | null;
};

export type PersonaCreateResponse = Persona;

export type PersonaUpdateRequest = {
  nickname?: string | null;
  profile_image_url?: string | null;
  fav_movie_ids?: string[] | null;
  fav_genre_ids?: string[] | null;
  fav_people_ids?: string[] | null;
};

export type PersonaUpdateResponse = Persona;
export type PersonaListResponse = Persona[];
export type PersonaDetailResponse = Persona;
