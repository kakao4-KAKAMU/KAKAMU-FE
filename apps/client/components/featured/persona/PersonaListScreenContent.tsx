import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { useDeletePersonaMutation, usePersonasQuery } from '@kakamu/query';
import { usePersonaStore } from '@kakamu/store';
import { useErrorAlertDialog, Button, Text } from '@kakamu/ui';
import { PersonaGrid, PersonaIntro } from '@/components/featured/persona';
import { useBackendApiClient } from '@/hooks/api/useBackendApiClient';
import { mapPersonaDeleteError } from '@/lib/error-message-map/persona/persona-delete-error';

export function PersonaListScreenContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const apiClient = useBackendApiClient();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const personasQuery = usePersonasQuery(apiClient);
  const personas = personasQuery.data;
  const deleteMutation = useDeletePersonaMutation(apiClient, {
    onError: (err) => {
      openErrorAlert(mapPersonaDeleteError(err, t));
    },
  });
  const selectPersona = usePersonaStore((state) => state.selectPersona);
  const [isManaging, setIsManaging] = useState(false);

  const onAddPress = useCallback(() => {
    router.push('/persona/create');
  }, [router]);

  const onSelect = useCallback(
    (id: string) => {
      if (isManaging) {
        router.push(`/persona/${id}` as const);
        return;
      }
      selectPersona(id);
      router.replace('/');
    },
    [isManaging, router, selectPersona],
  );

  const onDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate({ personaId: id });
    },
    [deleteMutation],
  );

  const onManagePress = useCallback(() => {
    setIsManaging((current) => !current);
  }, []);

  const getSelectAccessibilityLabel = useCallback(
    (nickname: string) => t('account.persona.selectA11y', { name: nickname }),
    [t],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      <View className="flex-col gap-6 px-5 pb-8 pt-7">
        <PersonaIntro
          title={t('account.persona.title')}
          description={t('account.persona.description')}
        />

        <PersonaGrid
          personasIds={personas}
          isManaging={isManaging}
          addLabel={t('account.persona.addNew')}
          deleteAccessibilityLabel={t('account.persona.deleteA11y')}
          getSelectAccessibilityLabel={getSelectAccessibilityLabel}
          onSelect={onSelect}
          onDelete={onDelete}
          onAddPress={onAddPress}
        />

        <Button size="default" variant="outline" onPress={onManagePress}>
          <Text>{isManaging ? t('account.persona.manageDone') : t('account.persona.manage')}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
