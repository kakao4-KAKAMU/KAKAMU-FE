import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { PersonaUpdateRequest } from '@kakamu/types';
import { usePersonasQuery, useUpdatePersonaMutation } from '@kakamu/query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useErrorAlertDialog } from '@kakamu/ui';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import {
  PersonaCreateStep1Form,
  PersonaCreateStep2Form,
  PersonaCreateStep3Form,
  PersonaCreateStep4Form,
} from '@/components/featured/persona';
import { usePendingLocalImages } from '@/hooks/upload/usePendingLocalImages';
import { usePersonaCreateGenreList } from '@/hooks/persona/usePersonaCreateGenreList';
import { usePersonaCreateStep3Search } from '@/hooks/persona/usePersonaCreateStep3Search';
import { usePersonaCreateStep4Search } from '@/hooks/persona/usePersonaCreateStep4Search';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { useCurrentUserId } from '@/hooks/auth/useCurrentUserId';
import { mapPersonaUpdateError } from '@/lib/error-message-map/persona/persona-update-error';
import { mapPersonaListError } from '@/lib/error-message-map/persona/persona-list-error';
import { mapImageUploadError } from '@/lib/error-message-map/upload/image-upload-error';
import { usePersonaFormValidationKit } from '@/lib/persona-form-validators';
import { pickProfileImage } from '@/lib/upload/pick-profile-image';
import { useResolveFormImageUrls } from '@/hooks/upload/useResolveFormImageUrls';
import { useUploadApiClient } from '@/hooks/api/useUploadApiClient';
import { ConditionalRender } from '@/components/utils';

const DEFAULT_VALUES: PersonaCreateFormInput = {
  name: '',
  description: '',
  profile_image_url: '',
  selectedGenreIds: [],
  selectedMovies: [],
  selectedPersons: [],
};

type PersonaCreateStep = 1 | 2 | 3 | 4;

export default function PersonaEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const personaForms = usePersonaFormValidationKit(t);
  const resolver = useMemo(() => zodResolver(personaForms.full), [personaForms.full]);

  const { control, handleSubmit, trigger, clearErrors, setValue, getValues, reset } =
    useForm<PersonaCreateFormInput>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [step, setStep] = useState<PersonaCreateStep>(1);
  const [submitting, setSubmitting] = useState(false);

  const genreQuery = usePersonaCreateGenreList();
  const genres = genreQuery.data?.genres ?? [];
  const step3Search = usePersonaCreateStep3Search(step === 3);
  const step4Search = usePersonaCreateStep4Search(step === 4);

  const handleContinueFromStep1 = useCallback(async () => {
    const ok = await trigger(['name', 'description', 'profile_image_url'], {
      shouldFocus: true,
    });
    if (ok) {
      setStep(2);
    }
  }, [trigger]);

  const handleContinueFromStep2 = useCallback(async () => {
    const ok = await trigger(['selectedGenreIds'], { shouldFocus: true });
    if (ok) {
      setStep(3);
    }
  }, [trigger]);

  const handleContinueFromStep3 = useCallback(async () => {
    const ok = await trigger(['selectedMovies'], { shouldFocus: true });
    if (ok) {
      setStep(4);
    }
  }, [trigger]);

  const handleBack = useCallback(() => {
    setStep((current) => (current > 1 ? ((current - 1) as PersonaCreateStep) : current));
  }, []);

  const apiClient = useBackendApiClient();
  const currentUserId = useCurrentUserId();
  const uploadClient = useUploadApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const { registerLocalImage, releaseLocalImage, getPendingLocalImages } = usePendingLocalImages();
  const { resolveFormImageUrl, isUploading: uploadingImages } = useResolveFormImageUrls(uploadClient);

  const personasQuery = usePersonasQuery(apiClient);
  const persona = useMemo(
    () => (id ? (personasQuery.data ?? []).find((item) => item.id === id) : undefined),
    [id, personasQuery.data],
  );

  useEffect(() => {
    if (!personasQuery.error) {
      return;
    }
    openErrorAlert(mapPersonaListError(personasQuery.error, t));
  }, [openErrorAlert, personasQuery.error, t]);

  useEffect(() => {
    if (!persona) {
      return;
    }
    console.log('persona', persona);
    reset({
      ...DEFAULT_VALUES,
      name: persona.nickname ?? '',
      description: persona.profile_msg ?? '',
      profile_image_url: persona.profile_image_url ?? '',
    });
  }, [persona, reset]);

  const handlePickProfileImage = useCallback(async () => {
    const picked = await pickProfileImage();
    if (!picked) {
      return;
    }

    const previousPreview = getValues('profile_image_url').trim();
    if (previousPreview) {
      releaseLocalImage(previousPreview);
    }

    registerLocalImage(picked.previewUri, picked.pick);
    setValue('profile_image_url', picked.previewUri, { shouldValidate: true });
  }, [getValues, registerLocalImage, releaseLocalImage, setValue]);

  const handleClearProfileImage = useCallback(
    (previewUri: string) => {
      releaseLocalImage(previewUri);
    },
    [releaseLocalImage],
  );

  const updateMutation = useUpdatePersonaMutation(apiClient, {
    onSuccess: () => {
      setSubmitting(false);
      router.replace('/persona');
    },
    onError: (err) => {
      setSubmitting(false);
      openErrorAlert(mapPersonaUpdateError(err, t));
    },
  });

  const onValid = useCallback(
    async (data: PersonaCreateFormInput) => {
      clearErrors('root');
      setSubmitting(true);

      try {
        const profileImagePreview = data.profile_image_url.trim();
        const profile_image_url = profileImagePreview
          ? await resolveFormImageUrl(
              profileImagePreview,
              'profile',
              getPendingLocalImages(),
            )
          : '';

        if (!id) {
          setSubmitting(false);
          router.replace('/persona');
          return;
        }

        const body: PersonaUpdateRequest = {
          nickname: data.name.trim() === persona?.nickname ? undefined : data.name.trim(),
          profile_image_url: profile_image_url === persona?.profile_image_url ? undefined : profile_image_url,
          profile_msg: data.description.trim() === persona?.profile_msg ? undefined : data.description.trim(),
          ...(data.selectedMovies.length > 0
            ? { fav_movie_ids: data.selectedMovies.map((movie) => movie.id) }
            : {}),
          ...(data.selectedGenreIds.length > 0 ? { fav_genre_ids: data.selectedGenreIds } : {}),
          ...(data.selectedPersons.length > 0
            ? { fav_people_ids: data.selectedPersons.map((person) => person.id) }
            : {}),
        };

        updateMutation.mutate({
          personaId: id,
          body,
          userId: currentUserId ?? undefined,
        });
      } catch (error) {
        setSubmitting(false);
        openErrorAlert(mapImageUploadError(error, t));
      }
    },
    [clearErrors, currentUserId, getPendingLocalImages, id, openErrorAlert, persona?.nickname, persona?.profile_image_url, persona?.profile_msg, resolveFormImageUrl, router, t, updateMutation],
  );

  const onInvalid = useCallback(async () => {
    if (step === 4) {
      await trigger(['selectedPersons'], { shouldFocus: true });
    }
  }, [step, trigger]);

  const handleSubmitPersona = useCallback(() => {
    void handleSubmit(onValid, onInvalid)();
  }, [handleSubmit, onInvalid, onValid]);

  const isBusy = submitting || updateMutation.isPending || uploadingImages || personasQuery.isLoading;

  return (
    <>
      <Stack.Screen options={{ title: t('account.layout.personaCreate') }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-background"
      >
        <ScrollView
          contentContainerClassName='flex-1'
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="min-h-full gap-8 px-5 py-6">
            <ConditionalRender
              render={{
                1: <PersonaCreateStep1Form
                  control={control}
                  onContinue={handleContinueFromStep1}
                  onPickProfileImage={handlePickProfileImage}
                  onClearProfileImage={handleClearProfileImage}
                  continuing={isBusy}
                />,
                2: <PersonaCreateStep2Form
                  control={control}
                  onBack={handleBack}
                  onContinue={handleContinueFromStep2}
                  continuing={isBusy}
                  genres={genres}
                  genresLoading={genreQuery.isLoading}
                />,
                3: <PersonaCreateStep3Form
                  control={control}
                  onBack={handleBack}
                  onContinue={handleContinueFromStep3}
                  continuing={isBusy}
                  genres={genres}
                  sheetOpen={step3Search.sheetOpen}
                  onSheetOpenChange={step3Search.setSheetOpen}
                  filterOpen={step3Search.filterOpen}
                  onFilterOpenChange={step3Search.setFilterOpen}
                  search={step3Search.search}
                  searchQuery={step3Search.searchQuery}
                />,
                4: <PersonaCreateStep4Form
                  control={control}
                  onBack={handleBack}
                  onSubmit={handleSubmitPersona}
                  submitting={isBusy}
                  canSubmit={!updateMutation.isPending}
                  sheetOpen={step4Search.sheetOpen}
                  onSheetOpenChange={step4Search.setSheetOpen}
                  filterOpen={step4Search.filterOpen}
                  onFilterOpenChange={step4Search.setFilterOpen}
                  search={step4Search.search}
                  searchQuery={step4Search.searchQuery}
                />,
              }}
              condition={step}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
