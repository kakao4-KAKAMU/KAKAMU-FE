export type Persona = {
  id: string;
  user_id: string;
  nickname: string;
  profile_image_url: string | null;
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
