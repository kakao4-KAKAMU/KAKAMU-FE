import { useCallback, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useTranslation } from '@kakamu/i18n';
import { usePersonaStore } from '@kakamu/store';
import {
  PersonaGrid,
  PersonaIntro,
  PersonaManageButton,
} from '@/components/featured/persona';
import { Persona } from '@kakamu/types';

export default function PersonaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [personas, ] = useState<Persona[]>([]);
  const selectPersona = usePersonaStore((state) => state.selectPersona);
  const [isManaging, setIsManaging] = useState(false);

  const onAddPress = useCallback(() => {
    router.push('/persona/create');
  }, [router]);

  const onSelect = useCallback(
    (id: string) => {
      selectPersona(id);
      router.replace('/');
    },
    [router, selectPersona],
  );

  const onDelete = useCallback(
    (id: string) => {
    },
    [],
  );

  const onManagePress = useCallback(() => {
    setIsManaging((current) => !current);
  }, []);

  const getSelectAccessibilityLabel = useCallback(
    (nickname: string) => t('account.persona.selectA11y', { name: nickname }),
    [t],
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background">
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
              personas={personas}
              isManaging={isManaging}
              addLabel={t('account.persona.addNew')}
              deleteAccessibilityLabel={t('account.persona.deleteA11y')}
              getSelectAccessibilityLabel={getSelectAccessibilityLabel}
              onSelect={onSelect}
              onDelete={onDelete}
              onAddPress={onAddPress}
            />

            <PersonaManageButton
              label={isManaging ? t('account.persona.manageDone') : t('account.persona.manage')}
              onPress={onManagePress}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
