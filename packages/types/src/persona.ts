export type Persona = {
  id: string;
  user_id: string;
  nickname: string;
  /** 게시물 tag 활용 시 사용할 code */
  tag: string;
  profile_msg: string;
  profile_image_url?: string;
};

export type PersonaCreateRequest = {
  nickname: string;
  profile_image_url: string;
  profile_msg: string;
  fav_movie_ids: string[];
  fav_genre_ids: string[];
  fav_people_ids: string[];
};

export type PersonaCreateResponse = Persona;

export type PersonaUpdateRequest = Partial<PersonaCreateRequest>;
export type PersonaUpdateResponse = Persona;
export type PersonaListResponse = Persona[];
export type PersonaDetailResponse = Persona;
