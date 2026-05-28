import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import { useChangePasswordMutation } from '@kakamu/query';
import type { ChangePasswordFormInput } from '@kakamu/schema';
import { Stack, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useErrorAlertDialog, Text } from '@kakamu/ui';
import {
  PasswordChangeForm,
  ProfileSubpageHeader,
  type PasswordChangeFormValues,
} from '@/components/featured/profile';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { parseApiError } from '@/lib/auth/parse-api-error';
import { useAuthFormValidationKit } from '@/lib/auth-form-validators';

const DEFAULT_VALUES: PasswordChangeFormValues = {
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
};

export default function PasswordSettingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const apiClient = useBackendApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const authForms = useAuthFormValidationKit(t);
  const resolver = useMemo(
    () => zodResolver(authForms.changePassword),
    [authForms.changePassword]
  );

  const { control, handleSubmit, reset } = useForm<ChangePasswordFormInput>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [submitting, setSubmitting] = useState(false);

  const changePasswordMutation = useChangePasswordMutation(apiClient, {
    onSuccess: () => {
      setSubmitting(false);
      reset(DEFAULT_VALUES);
      openErrorAlert({
        title: t('account.password.success.title'),
        description: t('account.password.success.description'),
      });
      router.back();
    },
    onError: (err) => {
      setSubmitting(false);
      const fallback = t('account.password.error.default.description');
      let title = t('account.password.error.default.title');
      let { message, code: errorCode } = parseApiError(err, fallback);

      switch (errorCode) {
        case 'INVALID_CREDENTIALS':
        case 'UNAUTHORIZED':
        case 'WRONG_PASSWORD':
          title = t('account.password.error.invalidCurrentPassword.title');
          message = t('account.password.error.invalidCurrentPassword.description');
          break;
        case 'PASSWORD_CHANGE_FAILED':
          message = fallback;
          break;
        default:
          break;
      }

      openErrorAlert({ title, description: message });
    },
  });

  const onValid = useCallback(
    (data: ChangePasswordFormInput) => {
      setSubmitting(true);
      changePasswordMutation.mutate(data);
    },
    [changePasswordMutation]
  );

  const isBusy = submitting || changePasswordMutation.isPending;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-background"
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-col gap-4 px-5 pb-6">
            <ProfileSubpageHeader title={t('account.password.pageTitle')} />
            <View className="gap-2">
              <Text className="text-sm leading-5 text-muted-foreground">
                {t('account.password.pageDescription')}
              </Text>
            </View>

            <PasswordChangeForm
              control={control}
              onSubmit={handleSubmit(onValid)}
              submitting={isBusy}
              canSubmit={!changePasswordMutation.isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
