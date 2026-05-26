export type PersonaCreateRequest = {
  name: string;
  description: string;
  profile_image_url?: string;
  movie_ids: string[];
  person_ids: string[];
};

export type PersonaCreateResponse = {
  id: string;
  name: string;
  description: string;
  persona_type: string;
  tag: string;
  profile_image_url?: string;
};
