import { useCallback } from 'react';
import { useTranslation } from '@kakamu/i18n';
import {
  useAuthStatusQuery,
  useLinkSocialAuthMutation,
  useUnlinkSocialAuthMutation,
} from '@kakamu/query';
import type { SocialAuthStatus } from '@kakamu/types';
import { useActionAlertDialog, useErrorAlertDialog } from '@kakamu/ui';

import {
  mapAuthStatusLoadError,
  mapSocialLinkError,
  mapSocialUnlinkError,
} from '@/lib/error-message-map/account/account-setup-error';
import {
  getSocialProviderLabel,
} from '@/lib/account/social-provider-ui';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useKakaoLogin } from '@/lib/kakao-login';
import { parseSocialSignInError } from '@/lib/error-message-map/auth/sign-in-error';

export function useAccountSetupScreen() {
  const client = useBackendApiClient();
  const { t } = useTranslation();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const { open: openActionAlert } = useActionAlertDialog();
  const { login: loginWithKakao, isPending: isKakaoLoginPending } = useKakaoLogin();

  const authStatusQuery = useAuthStatusQuery(client);

  const loadErrorView = authStatusQuery.isError
    ? mapAuthStatusLoadError(authStatusQuery.error, t)
    : null;

  const linkMutation = useLinkSocialAuthMutation(client, {
    onSuccess: () => {
      openErrorAlert({
        title: t('account.setup.success.link.title'),
        description: t('account.setup.success.link.description'),
      });
    },
    onError: (error) => {
      openErrorAlert(mapSocialLinkError(error, t));
    },
  });

  const unlinkMutation = useUnlinkSocialAuthMutation(client, {
    onSuccess: () => {
      openErrorAlert({
        title: t('account.setup.success.unlink.title'),
        description: t('account.setup.success.unlink.description'),
      });
    },
    onError: (error) => {
      openErrorAlert(mapSocialUnlinkError(error, t));
    },
  });

  const linkKakao = useCallback(async () => {
    try {
      const token = await loginWithKakao();
      linkMutation.mutate({
        provider: 'kakao',
        provided_token: token.accessToken,
      });
    } catch (error) {
      openErrorAlert(parseSocialSignInError(error, t).alert);
    }
  }, [linkMutation, loginWithKakao, openErrorAlert, t]);

  const unlinkProvider = useCallback(
    (provider: string) => {
      openActionAlert({
        title: t('account.setup.unlinkConfirm.title'),
        description: t('account.setup.unlinkConfirm.message'),
        cancelLabel: t('account.setup.unlinkConfirm.cancel'),
        confirmLabel: t('account.setup.unlinkConfirm.confirm'),
        destructive: true,
        onConfirm: () => unlinkMutation.mutate(provider),
      });
    },
    [openActionAlert, t, unlinkMutation],
  );

  const onSocialProviderPress = useCallback(
    (social: SocialAuthStatus) => {
      if (social.is_linked) {
        unlinkProvider(social.provider);
        return;
      }

      if (social.provider === 'kakao') {
        void linkKakao();
        return;
      }

      if (social.provider === 'google') {
        openErrorAlert({
          title: t('account.setup.googleNotReady'),
          description: t('account.setup.googleNotReady'),
        });
      }
    },
    [linkKakao, openErrorAlert, t, unlinkProvider],
  );

  const getSocialDescription = useCallback(
    (social: SocialAuthStatus) => {
      if (!social.is_linked) {
        return t('account.setup.notLinked');
      }

      const label = social.email ?? social.provider;
      return t('account.setup.linkedDescription', { label });
    },
    [t],
  );

  const isBusy =
    authStatusQuery.isLoading ||
    isKakaoLoginPending ||
    linkMutation.isPending ||
    unlinkMutation.isPending;

  return {
    authStatus: authStatusQuery.data,
    isLoading: authStatusQuery.isLoading,
    loadErrorView,
    isBusy,
    onSocialProviderPress,
    getSocialDescription,
    labels: {
      pageTitle: t('account.setup.pageTitle'),
      loginAccountSection: t('account.setup.loginAccountSection'),
      snsSection: t('account.setup.snsSection'),
      email: t('account.setup.email'),
      password: t('account.setup.password'),
      linked: t('account.setup.linked'),
      notLinked: t('account.setup.notLinked'),
      connect: t('account.setup.connect'),
      footer: t('account.setup.footer'),
      loading: t('account.setup.loading'),
      emailEmpty: t('account.setup.emailEmpty'),
      getProviderLabel: (provider: string) => getSocialProviderLabel(provider, t),
      connectA11y: (provider: string) =>
        `${getSocialProviderLabel(provider, t)} ${t('account.setup.connect')}`,
      unlinkA11y: (provider: string) =>
        `${getSocialProviderLabel(provider, t)} ${t('account.setup.unlink')}`,
    },
  };
}
