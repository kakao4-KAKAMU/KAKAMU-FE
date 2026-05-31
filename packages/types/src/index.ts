/** Domain types (User, Post, …) — expand per rule.md */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type { ApiErrorBody, ApiErrorCode } from './api-error';
export { API_ERROR_CODES } from './api-error';

export type { Persona } from './persona';
export type {
  PersonaCreateRequest,
  PersonaCreateResponse,
  PersonaUpdateRequest,
  PersonaUpdateResponse,
  PersonaListResponse,
} from './persona-create';
export type { Genre, GenreListResponse } from './genre';
export type {
  FeedContentType,
  FeedPeriod,
  FeedSearchItem,
  FeedSearchParams,
  FeedSort,
  PaginatedResponse,
  PersonSearchItem,
  PersonSearchParams,
  PersonSearchRequestBody,
  PersonSort,
  SearchPageResponse,
} from './search';

export type {
  MovieSort,
  MovieItem,
  MovieSearchParams,
  MovieSearchRequestBody,
} from './movie';

export type {
  CommentCursorListResponse,
  CommentItem,
} from './comment';

export type {
  LikeRequestBody,
  LikeResponse,
  LikeTargetType,
} from './like';
export { LIKE_TARGET_TYPES } from './like';

export type {
  PostCreateRequest,
  PostCreateResponse,
  PostCursorListResponse,
  PostDeleteResponse,
  PostItem,
  PostListParams,
  PostUpdateRequest,
  PostUpdateResponse,
} from './post';

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
