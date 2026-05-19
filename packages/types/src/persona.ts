export type Persona = {
  id: string;
  nickname: string;
  persona_type: string;
  /** 게시물 tag 활용 시 사용할 code */
  tag: string;
  profile_image_url?: string;
};
