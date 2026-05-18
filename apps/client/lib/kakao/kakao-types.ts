/** 플랫폼 공통 카카오 OAuth 토큰 (백엔드 SNS 연동 등에 사용) */
export type KakaoLoginToken = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scopes?: string[];
};

/** Kakao JS SDK `Auth.login` 성공 콜백 응답 */
export type KakaoWebAuthResponse = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  refresh_token_expires_in?: number;
};

export type KakaoWebLoginOptions = {
  /** 카카오톡 앱 로그인 우선 (기본 true) */
  throughTalk?: boolean;
  /** 로그인 상태 유지 (기본 true) */
  persistAccessToken?: boolean;
};
