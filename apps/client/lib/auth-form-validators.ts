import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import type { z } from 'zod';

import { buildAuthFormValidationMessages } from '@kakamu/i18n';
import { createAuthFormSchemas, type AuthFormSchemas } from '@kakamu/schema';

/**
 * 현재 언어의 `t`에 맞춘 Zod 인증 폼 스키마 묶음.
 * - signIn / signInWithRemember: 기본 로그인(rememberMe 포함 시 후자)
 * - signUp: 약관 제외 도메인 가입 필드
 * - signUpWithTerms: 클라이언트 회원가입 화면(약관 동의 포함)
 * - snsSignUp: SNS 가입 — `useForm` + `zodResolver(kit.snsSignUp)` + `Controller` 권장
 * - findPassword: 이메일만
 * - resetPassword: 새 비밀번호 + 확인
 * - changePassword: 현재 비밀번호 + 새 비밀번호 + 확인
 */
export function useAuthFormValidationKit(t: TFunction) {
  return useMemo(
    () => createAuthFormSchemas(buildAuthFormValidationMessages(t)),
    [t]
  );
}

/** SNS 가입 폼 초안 타입 — `useForm<SnsSignUpFormDraft>({ resolver: zodResolver(kit.snsSignUp), ... })` */
export type SnsSignUpFormDraft = z.input<AuthFormSchemas['snsSignUp']>;

export function useSnsSignUpFormSchema(t: TFunction) {
  return useAuthFormValidationKit(t).snsSignUp;
}
