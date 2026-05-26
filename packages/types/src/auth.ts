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

/** `User`에서 `profile` 제외 + 비밀번호/확인 */
/** `POST /users/register` 요청 본문 — API 필드명과 동일 */
export type RegisterUserRequest = Omit<User, 'profile'> & Password & {
  /** 본인인증 CI 등 — 미연동 시 빈 문자열은 백엔드 정책에 따름 */
  firebase_id_token: string;
  email: string
};

export type SignUpSNS = User &
  SocialAuthLoginRequest & {
    firebase_id_token: string;
  };

export type SignIn = { email: string } & Password;

export type SignInSocial = SocialAuthLoginRequest;

/** `POST /users/login/local` 응답 — 백엔드에서 내려주는 액세스 토큰 */
export interface LoginResponse {
  is_new_user: boolean;
  access_token: string;
  refresh_token: string;
}

/** `POST /social-auth/login` 요청 본문 */
export interface SocialAuthLoginRequest {
  provider: AuthSnsSignUpProvider;
  provided_token: string;
}

export type FindPassword = Email;

export type ResetPassword = PasswordConfirm;

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
