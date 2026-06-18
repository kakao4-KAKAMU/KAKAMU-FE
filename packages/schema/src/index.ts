import { z } from 'zod';

export {
  AUTH_NICKNAME_MAX_LENGTH,
  AUTH_NICKNAME_MIN_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  AUTH_PASSWORD_PATTERN,
  AUTH_PROFILE_MAX_LENGTH,
  AUTH_SNS_SIGN_UP_PROVIDERS,
  AUTH_USERNAME_MAX_LENGTH,
  AUTH_USERNAME_MIN_LENGTH,
  AUTH_USERNAME_PATTERN,
  type AuthSnsSignUpProviderId,
} from './forms/auth-constants';

export type {
  AuthAgreedToTermsMessages,
  AuthEmailMessages,
  AuthFormValidationMessages,
  AuthNicknameMessages,
  AuthPasswordConfirmMessages,
  AuthPasswordMessages,
  AuthPhoneMessages,
  AuthProfileMessages,
  AuthSnsTypeMessages,
  AuthTokenMessages,
  AuthUsernameMessages,
} from './forms/auth-messages';

export {
  createAuthFormSchemas,
  type AuthFormSchemas,
  type ChangePasswordFormInput,
  type ResetPasswordEmailFormInput,
  type ResetPasswordFormInput,
  type SignInFormInput,
  type SignInWithRememberFormInput,
  type PhoneValidationFormInput,
  type SignUpWithTermsFormInput,
  type SnsSignUpFormInput,
} from './forms/auth';

export {
  PERSONA_DESCRIPTION_MAX_LENGTH,
  PERSONA_DESCRIPTION_MIN_LENGTH,
  PERSONA_GENRE_MAX_COUNT,
  PERSONA_NAME_MAX_LENGTH,
  PERSONA_NAME_MIN_LENGTH,
} from './forms/persona-constants';

export type { PersonaFormValidationMessages } from './forms/persona-messages';

export {
  createPersonaFormSchemas,
  type PersonaCreateFormInput,
  type PersonaFormSchemas,
} from './forms/persona';

export {
  POST_CONTENT_MAX_LENGTH,
  POST_IMAGE_MAX_COUNT,
  POST_TITLE_MAX_LENGTH,
} from './forms/post-constants';

export type { PostFormValidationMessages } from './forms/post-messages';

export {
  createPostFormSchema,
  type PostWriteFormInput,
} from './forms/post';

export {
  COMMENT_CONTENT_MAX_LENGTH,
} from './forms/comment-constants';

export type { CommentFormValidationMessages } from './forms/comment-messages';

export {
  createCommentFormSchema,
  type CommentFormInput,
} from './forms/comment';

export { LIKE_TARGET_TYPES, type LikeTargetTypeId } from './forms/like-constants';

export { likeRequestSchema, type LikeRequestInput } from './forms/like';

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
