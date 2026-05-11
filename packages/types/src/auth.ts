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
export type SignUp = Omit<User, 'profile'> & PasswordConfirm;

export interface SignUpSNS extends User {
  snsType: AuthSnsSignUpProvider;
  token: string;
}

export type SignIn = Email & Password;

export type FindPassword = Email;

export type ResetPassword = PasswordConfirm;
