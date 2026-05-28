/** Domain types (User, Post, …) — expand per rule.md */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type { ApiErrorBody, ApiErrorCode } from './api-error';
export { API_ERROR_CODES } from './api-error';

export type { Persona } from './persona';
export type { PersonaCreateRequest, PersonaCreateResponse } from './persona-create';
export type { Genre, GenreListResponse } from './genre';
export type {
  MovieSearchItem,
  MovieSearchParams,
  MovieSort,
  PaginatedResponse,
  PersonSearchItem,
  PersonSearchParams,
  PersonSort,
} from './search';

export type {
  AuthSnsSignUpProvider,
  ChangePasswordRequest,
  Email,
  ResetPasswordEmail,
  PhoneVerificationRequest,
  LoginResponse,
  Password,
  PasswordConfirm,
  RegisterUserRequest,
  ResetPassword,
  ResetPasswordRequest,
  SignIn,
  SignInSocial,
  SignUpSNS,
  SocialAuthLoginRequest,
  User,
} from './auth';
