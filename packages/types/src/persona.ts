export type Persona = {
  id: string;
  user_id: string;
  nickname: string;
  /** 게시물 tag 활용 시 사용할 code */
  tag: string;
  persona_msg: string;
  profile_image_url?: string;
};
