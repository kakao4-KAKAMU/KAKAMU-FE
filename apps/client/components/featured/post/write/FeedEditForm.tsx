import { useCallback, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import type { PostWriteFormInput } from '@kakamu/schema';
import { usePostByIdQuery, useUpdatePostMutation } from '@kakamu/query';
import { useForm } from 'react-hook-form';
import { useErrorAlertDialog } from '@kakamu/ui';

import { PostWriteForm } from '@/components/featured/post/write';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { usePendingLocalImages } from '@/hooks/upload/usePendingLocalImages';
import { usePostWriteMovieSearch } from '@/hooks/post/usePostWriteMovieSearch';
import { usePersonaCreateGenreList } from '@/hooks/persona/usePersonaCreateGenreList';
import { mapPostUpdateError } from '@/lib/error-message-map/post/post-update-error';
import { mapImageUploadError } from '@/lib/error-message-map/upload/image-upload-error';
import { usePostFormValidationKit } from '@/lib/post-form-validators';
import {
  mapPostItemToWriteFormInput,
  mapWriteFormInputToRequestBody,
  POST_WRITE_DEFAULT_VALUES,
} from '@/lib/post/post-form-mappers';
import { pickPostImages } from '@/lib/post/pick-post-images';
import { useResolveFormImageUrls } from '@/hooks/upload/useResolveFormImageUrls';
import { useUploadApiClient } from '@/hooks/api/useUploadApiClient';

type FeedEditFormProps = {
  postId: number;
};

export function FeedEditForm({ postId }: FeedEditFormProps) {
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

  const { control, handleSubmit, reset, setValue, getValues } = form;
  const apiClient = useBackendApiClient();
  const uploadClient = useUploadApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const { registerLocalImage, releaseLocalImage, getPendingLocalImages } = usePendingLocalImages();
  const { resolveFormImageUrls, isUploading: uploadingImages } = useResolveFormImageUrls(uploadClient);
  const genreQuery = usePersonaCreateGenreList();
  const movieSearch = usePostWriteMovieSearch(postId > 0);
  const postQuery = usePostByIdQuery(apiClient, postId);

  useEffect(() => {
    reset(mapPostItemToWriteFormInput(postQuery.data));
  }, [postQuery.data, reset]);

  const updateMutation = useUpdatePostMutation(apiClient, {
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      openErrorAlert(mapPostUpdateError(error, t));
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const image_urls = await resolveFormImageUrls(
        values.image_urls,
        'feed',
        getPendingLocalImages(),
      );
      updateMutation.mutate({
        postId,
        body: mapWriteFormInputToRequestBody({ ...values, image_urls }),
      });
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

  const submitting = uploadingImages || updateMutation.isPending;

  return (
    <PostWriteForm
      control={control}
      submitLabel={t('account.post.write.submitEdit')}
      onCancel={handleCancel}
      onSubmit={onSubmit}
      submitting={submitting}
      canSubmit={!submitting}
      genres={genreQuery.data}
      sheetOpen={movieSearch.sheetOpen}
      onSheetOpenChange={movieSearch.setSheetOpen}
      filterOpen={movieSearch.filterOpen}
      onFilterOpenChange={movieSearch.setFilterOpen}
      search={movieSearch.search}
      searchQuery={movieSearch.searchQuery}
      onPickImages={handlePickImages}
      onRemoveImage={handleRemoveImage}
    />
  );
}
