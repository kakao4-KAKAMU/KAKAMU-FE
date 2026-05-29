import { Stack, useRouter } from 'expo-router';
import { useTranslation } from '@kakamu/i18n';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import {
  IntroBackground,
  IntroCallToAction,
  IntroFeatureCardList,
  IntroHero,
  IntroTopBar,
  IntroVisualStage,
} from '@/components/featured/intro';
import { StatItem } from '@/components/featured/intro/IntroPersonaPreviewCard';
import { Users, Clapperboard, Bookmark } from 'lucide-react-native';

export default function IntroScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const onSkip = React.useCallback(() => {
    router.replace('./signin');
  }, [router]);

  const onStart = React.useCallback(() => {
    router.replace('./signin');
  }, [router]);

  const stats: StatItem[] = [
    { value: '86', label: t('guest.intro.statLikes'), tone: 'violet' },
    { value: '14', label: t('guest.intro.statSaved'), tone: 'blue' },
  ];

  return (
    <>
      <Stack.Screen options={{ title: t('guest.intro.screenTitle') }} />

      <View className="flex-1 bg-background">
        <IntroBackground />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-col gap-4 px-[18px] pb-6 pt-[18px]">
            <IntroTopBar brandName={t('guest.intro.brandName')} onSkip={onSkip} />

            <IntroHero
              badge={t('guest.intro.badge')}
              title={t('guest.intro.heroTitle')}
              description={t('guest.intro.heroSubtitle')}
            />

            <IntroVisualStage
              personaName={t('guest.intro.personaDemoTitle')}
              personaSubtitle={t('guest.intro.personaDemoSubtitle')}
              movieTitle={t('guest.intro.movieDemoTitle')}
              movieMeta={t('guest.intro.movieDemoMeta')}
              stats={stats}
            />

            <IntroFeatureCardList
              items={[
                { id: 'persona', icon: Users, title: t('guest.intro.featurePersona') },
                { id: 'trailer', icon: Clapperboard, title: t('guest.intro.featureTrailer') },
                { id: 'saved', icon: Bookmark, title: t('guest.intro.featureSave') },
              ]}
            />

            <IntroCallToAction label={t('guest.intro.cta')} onPress={onStart} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}