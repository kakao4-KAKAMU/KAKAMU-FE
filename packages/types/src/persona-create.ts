export type PersonaCreateRequest = {
  nickname: string;
  profile_image_url: string;
  profile_msg: string;
  fav_movie_ids: string[];
  fav_genre_ids: string[];
  fav_people_ids: string[];
};

export type PersonaCreateResponse = import('./persona').Persona;

export type PersonaUpdateRequest = Partial<PersonaCreateRequest>;
export type PersonaUpdateResponse = import('./persona').Persona;
export type PersonaListResponse = import('./persona').Persona[];
