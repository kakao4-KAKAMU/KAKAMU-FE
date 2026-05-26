import { useCallback, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@kakamu/i18n';
import type { PersonaCreateFormInput } from '@kakamu/schema';
import type { PersonaCreateRequest } from '@kakamu/types';
import { useCreatePersonaMutation } from '@kakamu/query';
import { usePersonaStore } from '@kakamu/store';
import { Stack, useRouter } from 'expo-router';
import { useErrorAlertDialog } from '@kakamu/ui';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import {
  PersonaCreateStep1Form,
  PersonaCreateStep2Form,
  PersonaIntro,
} from '@/components/featured/persona';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { parseApiError } from '@/lib/auth/parse-api-error';
import { mapPersonaFromCreateResponse } from '@/lib/persona/map-persona-from-create-response';
import { usePersonaFormValidationKit } from '@/lib/persona-form-validators';

const DEFAULT_VALUES: PersonaCreateFormInput = {
  name: '',
  description: '',
  profile_image_url: '',
  selectedGenreIds: [],
  selectedMovies: [],
  selectedPersons: [],
};

type PersonaCreateStep = 1 | 2;

export default function PersonaCreateScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const personaForms = usePersonaFormValidationKit(t);
  const resolver = useMemo(() => zodResolver(personaForms.full), [personaForms.full]);

  const { control, handleSubmit, trigger, clearErrors } = useForm<PersonaCreateFormInput>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [step, setStep] = useState<PersonaCreateStep>(1);
  const [submitting, setSubmitting] = useState(false);

  const addPersona = usePersonaStore((state) => state.addPersona);
  const selectPersona = usePersonaStore((state) => state.selectPersona);

  const handleContinueToTaste = useCallback(async () => {
    const ok = await trigger(['name', 'description', 'profile_image_url']);
    if (ok) {
      setStep(2);
    }
  }, [trigger]);

  const handleBackToBasics = useCallback(() => {
    setStep(1);
  }, []);

  const apiClient = useBackendApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();

  const createMutation = useCreatePersonaMutation(apiClient, {
    onSuccess: (response) => {
      const persona = mapPersonaFromCreateResponse(response);
      addPersona(persona);
      selectPersona(persona.id);
      setSubmitting(false);
      router.replace('/persona');
    },
    onError: (err) => {
      setSubmitting(false);
      const fallback = t('account.persona.create.failedRequest.description');
      const { message } = parseApiError(err, fallback);
      openErrorAlert({
        title: t('account.persona.create.failedRequest.title'),
        description: message,
      });
    },
  });

  const onValid = useCallback(
    (data: PersonaCreateFormInput) => {
      clearErrors('root');
      const body: PersonaCreateRequest = {
        name: data.name.trim(),
        description: data.description.trim(),
        movie_ids: data.selectedMovies.map((movie) => movie.id),
        person_ids: data.selectedPersons.map((person) => person.id),
      };
      const thumbnail = data.profile_image_url.trim();
      if (thumbnail) {
        body.profile_image_url = thumbnail;
      }
      setSubmitting(true);
      createMutation.mutate(body);
    },
    [clearErrors, createMutation],
  );

  const onInvalid = useCallback(async () => {
    if (step === 2) {
      await trigger(['selectedMovies', 'selectedPersons']);
    }
  }, [step, trigger]);

  const handleSubmitPersona = useCallback(() => {
    void handleSubmit(onValid, onInvalid)();
  }, [handleSubmit, onInvalid, onValid]);

  const isBusy = submitting || createMutation.isPending;

  const stepHeader =
    step === 1
      ? {
          title: t('account.persona.create.step1Title'),
          description: t('account.persona.create.step1Description'),
        }
      : {
          title: t('account.persona.create.step2Title'),
          description: t('account.persona.create.step2Description'),
        };

  return (
    <>
      <Stack.Screen options={{ title: t('account.layout.personaCreate') }} />
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
          <View className="gap-8 px-5 py-7">
            <PersonaIntro title={stepHeader.title} description={stepHeader.description} />

            {step === 1 ? (
              <PersonaCreateStep1Form
                control={control}
                onContinue={handleContinueToTaste}
                continuing={isBusy}
              />
            ) : (
              <PersonaCreateStep2Form
                control={control}
                onBack={handleBackToBasics}
                onSubmit={handleSubmitPersona}
                submitting={isBusy}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
