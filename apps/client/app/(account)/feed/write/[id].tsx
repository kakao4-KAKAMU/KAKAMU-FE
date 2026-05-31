import { useCallback, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import type { PostWriteFormInput } from '@kakamu/schema';
import { usePostByIdQuery, useUpdatePostMutation } from '@kakamu/query';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Text, useErrorAlertDialog } from '@kakamu/ui';

import { ProfileSubpageHeader } from '@/components/featured/header/ProfileSubpageHeader';
import { PostWriteForm } from '@/components/featured/post/write';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { usePostWriteMovieSearch } from '@/hooks/post/usePostWriteMovieSearch';
import { usePersonaCreateGenreList } from '@/hooks/persona/usePersonaCreateGenreList';
import { mapPostDetailError } from '@/lib/error-message-map/post/post-detail-error';
import { mapPostUpdateError } from '@/lib/error-message-map/post/post-update-error';
import { usePostFormValidationKit } from '@/lib/post-form-validators';
import {
  mapPostItemToWriteFormInput,
  mapWriteFormInputToRequestBody,
  POST_WRITE_DEFAULT_VALUES,
} from '@/lib/post/post-form-mappers';
import { pickPostImages } from '@/lib/post/pick-post-images';

export default function FeedEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number.parseInt(id ?? '', 10);
  const { t } = useTranslation();
  const postSchema = usePostFormValidationKit(t);
  const resolver = useMemo(() => zodResolver(postSchema), [postSchema]);

  const form = useForm<PostWriteFormInput>({
    resolver,
    defaultValues: POST_WRITE_DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { control, handleSubmit, reset, setValue, getValues } = form;
  const apiClient = useBackendApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const genreQuery = usePersonaCreateGenreList();
  const movieSearch = usePostWriteMovieSearch(postId > 0);

  const postQuery = usePostByIdQuery(apiClient, postId, {
    enabled: postId > 0,
  });

  useEffect(() => {
    if (postQuery.data) {
      reset(mapPostItemToWriteFormInput(postQuery.data));
    }
  }, [postQuery.data, reset]);

  const updateMutation = useUpdatePostMutation(apiClient, {
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      openErrorAlert(mapPostUpdateError(error, t));
    },
  });

  const onSubmit = handleSubmit((values) => {
    updateMutation.mutate({
      postId,
      body: mapWriteFormInputToRequestBody(values),
    });
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

  const submitting = updateMutation.isPending;
  const canSubmit = !submitting && !postQuery.isLoading;
  const isReady = postId > 0 && (postQuery.isSuccess || postQuery.isLoading);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-background">
        <ProfileSubpageHeader title={t('account.layout.feedEdit')} />
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
            {postQuery.isLoading ? (
              <Text className="py-8 text-center text-sm text-muted-foreground">
                {t('account.post.write.loading')}
              </Text>
            ) : postQuery.isError ? (
              <Text className="py-8 text-center text-sm text-destructive">
                {mapPostDetailError(postQuery.error, t).description}
              </Text>
            ) : isReady ? (
              <PostWriteForm
                control={control}
                submitLabel={t('account.post.write.submitEdit')}
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
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
