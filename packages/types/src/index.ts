/** Domain types (User, Post, …) — expand per rule.md */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type { ApiErrorBody, ApiErrorCode } from './api-error';
export { API_ERROR_CODES } from './api-error';

export type {
  Mention,
  UserAccount,
  UserPublic,
  UserSimple,
  UserSimpleWithFollow,
  UserUpdate,
} from './user';
export type { CursorPaginationMeta, PagePaginationMeta } from './pagination';

export type {
  Persona,
  PersonaMovie,
  PersonaPerson,
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
  PersonFilterSearchResponse,
  PersonSearchItem,
  PersonSearchParams,
  PersonSearchRequestBody,
  PersonSort,
  SearchPageResponse,
  TrendItem,
  TrendSearchResponse,
  ContentSearchSort,
  TabSearchParams,
  ContentSearchParams,
  UserSearchResponse,
} from './search';

export type {
  MovieEvaluation,
  MovieEvaluationRequest,
  MovieEvaluationResponse,
  MovieFilterSearchResponse,
  MovieItem,
  MovieRecommendationResponse,
  MovieSearchParams,
  MovieSearchRequestBody,
  MovieSort,
  MovieTabSearchResponse,
  MovieToEvaluateListResponse,
  MovieToEvaluateParams,
  MovieWithTrailers,
  WatchMovieResponse,
  YoutubeVideo,
} from './movie';

export type {
  CommentCreateRequest,
  CommentDeleteResponse,
  CommentIdResponse,
  CommentItem,
  CommentListParams,
  CommentListResponse,
  CommentSpoilerDetailResponse,
  CommentUpdateRequest,
  CommentUpdateResponse,
  PaginationMeta,
} from './comment';

export type {
  LikeRequestBody,
  LikeResponse,
  LikeTargetType,
  LikeToggleRequest,
  LikeToggleResponse,
} from './like';
export { LIKE_TARGET_TYPES } from './like';

export type { ImageUploadResponse, ImageUploadType } from './upload';
export { IMAGE_UPLOAD_TYPES } from './upload';

export type {
  MentionUserItem,
  PostCreateRequest,
  PostCreateResponse,
  PostCursorListResponse,
  PostDeleteResponse,
  PostIdResponse,
  PostItem,
  PostListParams,
  LikedPostListParams,
  FeedPostListParams,
  PostSearchResponse,
  PostUpdateRequest,
  PostUpdateResponse,
  SearchPost,
  SuccessResponse,
} from './post';

export type {
  ChatHistoryMessage,
  ChatHistoryParams,
  ChatHistoryResponse,
  ChatListParams,
  ChatListResponse,
  ChatMetadataItem,
  ChatMetadataList,
  ChatMetadataType,
  ChatRequest,
  ChatSession,
  ChatSessionMetadata,
  ChatSseEvent,
  ChatStreamRequestBody,
} from './chat';

export type {
  AuthSnsSignUpProvider,
  ChangePasswordRequest,
  Email,
  LocalLinkRequest,
  LocalLoginRequest,
  LoginResponse,
  Password,
  PasswordConfirm,
  PhoneVerificationRequest,
  RefreshRequest,
  RegisterUserRequest,
  ResetPassword,
  ResetPasswordEmail,
  ResetPasswordRequest,
  SignIn,
  SignInSocial,
  SignUpSNS,
  SocialAuthLoginRequest,
  TokenResponse,
  User,
} from './auth';

export type {
  BlockLevel,
  BlockRequest,
  FollowListParams,
  FollowListResponse,
  RelationResponse,
} from './relation';
export { BLOCK_LEVELS } from './relation';

export type {
  AccountSettingsResponse,
  ApiSuccessResponse,
  LocalAuthStatus,
  SocialAuthStatus,
  SocialLinkRequest,
} from './account';

export type { Notification, NotificationListResponse } from './notification';
export type { ActivityLogCreate, SuccessMessageResponse } from './activity';
