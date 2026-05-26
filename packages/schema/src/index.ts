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
  type FindPasswordFormInput,
  type ResetPasswordFormInput,
  type SignInFormInput,
  type SignInWithRememberFormInput,
  type PhoneValidationFormInput,
  type SignUpWithTermsFormInput,
  type SnsSignUpFormInput,
} from './forms/auth';

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
