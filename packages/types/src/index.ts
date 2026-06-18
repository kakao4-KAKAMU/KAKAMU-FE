/** Domain types (User, Post, …) — expand per rule.md */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type { ApiErrorBody, ApiErrorCode } from './api-error';
export { API_ERROR_CODES } from './api-error';

export type {
  Persona,
  PersonaCreateRequest,
  PersonaCreateResponse,
  PersonaUpdateRequest,
  PersonaUpdateResponse,
  PersonaListResponse,
  PersonaDetailResponse,
 } from './persona';
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
  CommentCreateRequest,
  CommentDeleteResponse,
  CommentIdResponse,
  CommentItem,
  CommentListParams,
  CommentListResponse,
  CommentSpoilerDetailResponse,
  PaginationMeta,
} from './comment';

export type {
  LikeRequestBody,
  LikeResponse,
  LikeTargetType,
} from './like';
export { LIKE_TARGET_TYPES } from './like';

export type { ImageUploadResponse, ImageUploadType } from './upload';
export { IMAGE_UPLOAD_TYPES } from './upload';

export type {
  PostCreateRequest,
  PostCreateResponse,
  PostCursorListResponse,
  PostDeleteResponse,
  PostItem,
  PostListParams,
  LikedPostListParams,
  PostUpdateRequest,
  PostUpdateResponse,
} from './post';

export type {
  ChatHistoryMessage,
  ChatHistoryParams,
  ChatHistoryResponse,
  ChatListParams,
  ChatListResponse,
  ChatSession,
  ChatSessionMetadata,
  ChatSseEvent,
  ChatStreamRequestBody,
} from './chat';

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
  UserInfo,
} from './auth';

export type {
  BlockLevel,
  BlockRequest,
  FollowListParams,
  FollowListResponse,
  RelationResponse,
  UserSimpleInfo,
} from './relation';
export { BLOCK_LEVELS } from './relation';
