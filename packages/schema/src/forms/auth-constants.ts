import type { AuthSnsSignUpProvider } from '@kakamu/types';

export const AUTH_USERNAME_MIN_LENGTH = 3;
export const AUTH_USERNAME_MAX_LENGTH = 20;
/** 영문, 숫자, 밑줄 */
export const AUTH_USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export const AUTH_NICKNAME_MIN_LENGTH = 2;
export const AUTH_NICKNAME_MAX_LENGTH = 20;

export const AUTH_PASSWORD_MIN_LENGTH = 8;
export const AUTH_PASSWORD_MAX_LENGTH = 20;
/** 영문·숫자 각 1자 이상 */
export const AUTH_PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

export const AUTH_PROFILE_MAX_LENGTH = 2000;

export const AUTH_SNS_SIGN_UP_PROVIDERS = ['kakao', 'google'] as const satisfies readonly AuthSnsSignUpProvider[];

export type AuthSnsSignUpProviderId = (typeof AUTH_SNS_SIGN_UP_PROVIDERS)[number];
