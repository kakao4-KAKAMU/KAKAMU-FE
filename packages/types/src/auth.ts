/** SNS 가입 시 사용하는 제공자 식별자 — 상수는 `@kakamu/schema`의 `AUTH_SNS_SIGN_UP_PROVIDERS`와 맞춥니다. */
export type AuthSnsSignUpProvider = 'kakao' | 'google';

export interface Email {
  email: string;
}

export interface User extends Email {
  username: string;
  nickname: string;
  /** 선택 프로필(자유 문자열 — 스키마에서 길이만 제한) */
  profile?: string;
}

export interface Password {
  password: string;
}

export interface PasswordConfirm extends Password {
  passwordConfirm: string;
}

/** `POST /users/register/local` 요청 본문 */
export type RegisterUserRequest = {
  username: string;
  nickname: string;
  firebase_id_token: string;
  email: string;
  password: string;
};

/** `POST /users/register/social` 요청 본문 */
export type SignUpSNS = {
  provider: AuthSnsSignUpProvider | string;
  provided_token: string;
  username: string;
  nickname: string;
  firebase_id_token: string;
  email?: string | null;
};

export type SignIn = { email: string } & Password;

export type SignInSocial = SocialAuthLoginRequest;

/** `POST /users/login/local` · `POST /social-auth/login` 응답 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  is_new_user?: boolean;
}

export type TokenResponse = LoginResponse;

/** `POST /social-auth/login` 요청 본문 */
export interface SocialAuthLoginRequest {
  provider: AuthSnsSignUpProvider | string;
  provided_token: string;
}

export type LocalLoginRequest = SignIn;

export type ResetPasswordEmail = Email;

export type ResetPassword = PasswordConfirm;

export type PhoneVerificationRequest = {
  email: string;
  firebase_id_token: string;
};

export type ResetPasswordRequest = {
  email: string;
  firebase_id_token: string;
  new_password: string;
};

/** `PATCH /users/password` 요청 본문 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export type LocalLinkRequest = {
  email?: string | null;
  password: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type { UserPublic } from './user';

/** @deprecated `UserPublic` 사용 */
export type UserInfo = import('./user').UserPublic;
