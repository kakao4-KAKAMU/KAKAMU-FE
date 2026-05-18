import { z } from 'zod';

import {
  AUTH_NICKNAME_MAX_LENGTH,
  AUTH_NICKNAME_MIN_LENGTH,
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  AUTH_PROFILE_MAX_LENGTH,
  AUTH_SNS_SIGN_UP_PROVIDERS,
  AUTH_USERNAME_MAX_LENGTH,
  AUTH_USERNAME_MIN_LENGTH,
  AUTH_USERNAME_PATTERN,
} from './auth-constants';
import type { AuthFormValidationMessages } from './auth-messages';

function emailField(messages: AuthFormValidationMessages['email']) {
  return z
    .string()
    .trim()
    .min(1, messages.required)
    .email(messages.invalid);
}

/** ITU-T E.164: `+` 와 국가코드 이후 7~15자리 숫자 */
function phoneField(messages: AuthFormValidationMessages['phone']) {
  return z
    .string()
    .trim()
    .min(1, messages.required)
    .regex(/^\+[1-9]\d{6,14}$/, messages.invalid);
}

function usernameField(messages: AuthFormValidationMessages['username']) {
  return z
    .string()
    .trim()
    .min(1, messages.required)
    .min(AUTH_USERNAME_MIN_LENGTH, messages.min)
    .max(AUTH_USERNAME_MAX_LENGTH, messages.max)
    .regex(AUTH_USERNAME_PATTERN, messages.pattern);
}

function nicknameField(messages: AuthFormValidationMessages['nickname']) {
  return z
    .string()
    .trim()
    .min(1, messages.required)
    .min(AUTH_NICKNAME_MIN_LENGTH, messages.min)
    .max(AUTH_NICKNAME_MAX_LENGTH, messages.max);
}

function passwordField(messages: AuthFormValidationMessages['password']) {
  return z
    .string()
    .min(1, messages.required)
    .min(AUTH_PASSWORD_MIN_LENGTH, messages.min)
    .max(AUTH_PASSWORD_MAX_LENGTH, messages.max);
}

function passwordConfirmRefine(
  messages: AuthFormValidationMessages['passwordConfirm'],
  data: { password: string; passwordConfirm: string },
  ctx: z.RefinementCtx
) {
  if (!data.passwordConfirm?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: messages.required,
      path: ['passwordConfirm'],
    });
    return;
  }
  if (data.password !== data.passwordConfirm) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: messages.mismatch,
      path: ['passwordConfirm'],
    });
  }
}

export function createAuthFormSchemas(messages: AuthFormValidationMessages) {
  const email = emailField(messages.email);
  const phone = phoneField(messages.phone);
  const username = usernameField(messages.username);
  const nickname = nicknameField(messages.nickname);
  const password = passwordField(messages.password);

  const signIn = z
    .object({
      username: email,
      password: z.string().min(1, messages.password.required),
    })
    .strict();

  const signInWithRemember = signIn.extend({
    rememberMe: z.boolean(),
  });

  const phoneValidation = z
    .object({
      phone,
      phoneValid: z.boolean(),
    })
    .strict()
  const phoneValidationRefine = (data: z.infer<typeof phoneValidation>, ctx: z.RefinementCtx) => {
    if (data.phoneValid !== true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.phone.invalidPhone,
        path: ['phoneValid'],
      });
    }
  }

  const signUpBase = z
    .object({
      email,
      username,
      nickname,
      password,
      passwordConfirm: z.string(),
    })
    .strict();

  const signUpWithTerms = signUpBase
    .extend({
      agreedToTerms: z.boolean(),
    })
    .merge(phoneValidation)
    .strict()
    .superRefine((data, ctx) => {
      passwordConfirmRefine(messages.passwordConfirm, data, ctx);
      phoneValidationRefine(data, ctx);
      if (data.agreedToTerms !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.agreedToTerms.required,
          path: ['agreedToTerms'],
        });
      }
    });

  const snsSignUp = z
    .object({
      email,
      username,
      nickname,
      profile: z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : val),
        z.string().max(AUTH_PROFILE_MAX_LENGTH, messages.profile.max).optional()
      ),
      snsType: z.enum(AUTH_SNS_SIGN_UP_PROVIDERS, {
        required_error: messages.snsType.invalid,
        invalid_type_error: messages.snsType.invalid,
      }),
      token: z.string().min(1, messages.token.required),
    })
    .strict()
    .merge(phoneValidation)
    .superRefine((data, ctx) => phoneValidationRefine(data, ctx));

  const findPassword = z
    .object({
      email,
    })
    .strict();

  const resetPassword = z
    .object({
      password,
      passwordConfirm: z.string(),
    })
    .strict()
    .superRefine((data, ctx) => passwordConfirmRefine(messages.passwordConfirm, data, ctx));

  return {
    signIn,
    signInWithRemember,
    phoneValidation,
    signUpWithTerms,
    snsSignUp,
    findPassword,
    resetPassword,
  };
}

export type AuthFormSchemas = ReturnType<typeof createAuthFormSchemas>;
export type PhoneValidationFormInput = z.infer<AuthFormSchemas['phoneValidation']>;
export type SignInFormInput = z.infer<AuthFormSchemas['signIn']>;
export type SignInWithRememberFormInput = z.infer<AuthFormSchemas['signInWithRemember']>;
export type SignUpWithTermsFormInput = z.infer<AuthFormSchemas['signUpWithTerms']>;
export type SnsSignUpFormInput = z.infer<AuthFormSchemas['snsSignUp']>;
export type FindPasswordFormInput = z.infer<AuthFormSchemas['findPassword']>;
export type ResetPasswordFormInput = z.infer<AuthFormSchemas['resetPassword']>;
