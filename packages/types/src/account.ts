import type { AuthSnsSignUpProvider } from './auth';

export type LocalAuthStatus = {
  is_linked: boolean;
  email?: string | null;
};

export type SocialAuthStatus = {
  provider: string;
  is_linked: boolean;
  connected_at?: string | null;
  email?: string | null;
};

export type AccountSettingsResponse = {
  primary_provider: string;
  local_auth: LocalAuthStatus;
  social_auths: SocialAuthStatus[];
};

export type SocialLinkRequest = {
  provider: AuthSnsSignUpProvider | string;
  provided_token: string;
  email?: string | null;
};

export type ApiSuccessResponse = {
  status?: string;
  message?: string | null;
};
