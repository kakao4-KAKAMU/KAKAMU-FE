/** Domain types (User, Post, …) — expand per rule.md */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type { ApiErrorBody, ApiErrorCode } from './api-error';
export { API_ERROR_CODES } from './api-error';

export type { Persona } from './persona';

export type {
  AuthSnsSignUpProvider,
  Email,
  FindPassword,
  LoginResponse,
  Password,
  PasswordConfirm,
  RegisterUserRequest,
  ResetPassword,
  SignIn,
  SignInSocial,
  SignUpSNS,
  SocialAuthLoginRequest,
  User,
} from './auth';
