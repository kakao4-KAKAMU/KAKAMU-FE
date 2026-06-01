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
import { usePendingLocalImages } from '@/hooks/upload/usePendingLocalImages';
import { usePostWriteMovieSearch } from '@/hooks/post/usePostWriteMovieSearch';
import { usePersonaCreateGenreList } from '@/hooks/persona/usePersonaCreateGenreList';
import { mapPostCreateError } from '@/lib/error-message-map/post/post-create-error';
import { mapImageUploadError } from '@/lib/error-message-map/upload/image-upload-error';
import { usePostFormValidationKit } from '@/lib/post-form-validators';
import {
  mapWriteFormInputToRequestBody,
  POST_WRITE_DEFAULT_VALUES,
} from '@/lib/post/post-form-mappers';
import { pickPostImages } from '@/lib/post/pick-post-images';
import { useResolveFormImageUrls } from '@/hooks/upload/useResolveFormImageUrls';
import { useUploadApiClient } from '@/hooks/api/useUploadApiClient';

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
  const uploadClient = useUploadApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const { registerLocalImage, releaseLocalImage, getPendingLocalImages } = usePendingLocalImages();
  const { resolveFormImageUrls, isUploading: uploadingImages } = useResolveFormImageUrls(uploadClient);
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

  const onSubmit = handleSubmit(async (values) => {
    try {
      const image_urls = await resolveFormImageUrls(
        values.image_urls,
        'feed',
        getPendingLocalImages(),
      );
      createMutation.mutate(mapWriteFormInputToRequestBody({ ...values, image_urls }));
    } catch (error) {
      openErrorAlert(mapImageUploadError(error, t));
    }
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

      for (const image of picked) {
        registerLocalImage(image.previewUri, image.pick);
      }
      setValue(
        'image_urls',
        [...getValues('image_urls'), ...picked.map((image) => image.previewUri)],
        { shouldValidate: true },
      );
    },
    [getValues, registerLocalImage, setValue],
  );

  const handleRemoveImage = useCallback(
    (url: string) => {
      releaseLocalImage(url);
    },
    [releaseLocalImage],
  );

  const submitting = uploadingImages || createMutation.isPending;
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
              onRemoveImage={handleRemoveImage}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
