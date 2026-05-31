import { useCallback, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import type { PostWriteFormInput } from '@kakamu/schema';
import { useCreatePostMutation } from '@kakamu/query';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useErrorAlertDialog } from '@kakamu/ui';

import { ProfileSubpageHeader } from '@/components/featured/header/ProfileSubpageHeader';
import { PostWriteForm } from '@/components/featured/post/write';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { usePostWriteMovieSearch } from '@/hooks/post/usePostWriteMovieSearch';
import { usePersonaCreateGenreList } from '@/hooks/persona/usePersonaCreateGenreList';
import { mapPostCreateError } from '@/lib/error-message-map/post/post-create-error';
import { usePostFormValidationKit } from '@/lib/post-form-validators';
import {
  mapWriteFormInputToRequestBody,
  POST_WRITE_DEFAULT_VALUES,
} from '@/lib/post/post-form-mappers';
import { pickPostImages } from '@/lib/post/pick-post-images';

export default function FeedWriteScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const postSchema = usePostFormValidationKit(t);
  const resolver = useMemo(() => zodResolver(postSchema), [postSchema]);

  const form = useForm<PostWriteFormInput>({
    resolver,
    defaultValues: POST_WRITE_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { control, handleSubmit, setValue, getValues } = form;
  const apiClient = useBackendApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const genreQuery = usePersonaCreateGenreList();
  const movieSearch = usePostWriteMovieSearch(true);

  const createMutation = useCreatePostMutation(apiClient, {
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      openErrorAlert(mapPostCreateError(error, t));
    },
  });

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(mapWriteFormInputToRequestBody(values));
  });

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const handlePickImages = useCallback(
    async (remaining: number) => {
      const picked = await pickPostImages(remaining);
      if (!picked?.length) {
        return;
      }
      setValue('image_urls', [...getValues('image_urls'), ...picked], { shouldValidate: true });
    },
    [getValues, setValue],
  );

  const submitting = createMutation.isPending;
  const canSubmit = !submitting;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background">
        <ProfileSubpageHeader title={t('account.layout.feedWrite')} />
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-4 px-4 pb-8 pt-2"
          >
            <PostWriteForm
              control={control}
              submitLabel={t('account.post.write.submitCreate')}
              onCancel={handleCancel}
              onSubmit={onSubmit}
              submitting={submitting}
              canSubmit={canSubmit}
              genres={genreQuery.data?.genres ?? []}
              sheetOpen={movieSearch.sheetOpen}
              onSheetOpenChange={movieSearch.setSheetOpen}
              filterOpen={movieSearch.filterOpen}
              onFilterOpenChange={movieSearch.setFilterOpen}
              search={movieSearch.search}
              searchQuery={movieSearch.searchQuery}
              onPickImages={handlePickImages}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
