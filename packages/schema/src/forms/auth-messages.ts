/** `createAuthFormSchemas`에 넘기는 검증 문구 묶음 — `@kakamu/i18n`에서 `t`로 채웁니다. */
export interface AuthEmailMessages {
  required: string;
  invalid: string;
}

/** E.164 등 국제 전화번호 형식 (`+` 로 시작) */
export interface AuthPhoneMessages {
  required: string;
  invalid: string;
  invalidPhone: string;
}

export interface AuthUsernameMessages {
  required: string;
  min: string;
  max: string;
  pattern: string;
}

export interface AuthNicknameMessages {
  required: string;
  min: string;
  max: string;
}

export interface AuthProfileMessages {
  max: string;
}

export interface AuthPasswordMessages {
  required: string;
  min: string;
  max: string;
  pattern: string;
}

export interface AuthPasswordConfirmMessages {
  required: string;
  mismatch: string;
}

export interface AuthSnsTypeMessages {
  invalid: string;
}

export interface AuthTokenMessages {
  required: string;
}

export interface AuthAgreedToTermsMessages {
  required: string;
}

export interface AuthFormValidationMessages {
  email: AuthEmailMessages;
  phone: AuthPhoneMessages;
  username: AuthUsernameMessages;
  nickname: AuthNicknameMessages;
  profile: AuthProfileMessages;
  password: AuthPasswordMessages;
  passwordConfirm: AuthPasswordConfirmMessages;
  snsType: AuthSnsTypeMessages;
  token: AuthTokenMessages;
  agreedToTerms: AuthAgreedToTermsMessages;
}
