import { useTranslation } from '@kakamu/i18n';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  SonarHeader,
  SonarHint,
  SONAR_MOCK_TRAILERS,
  TrailerSwipeDeck,
} from '@/components/featured/sonar';

export default function SonarScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <SonarHeader
        onInfoPress={() =>
          Alert.alert(t('account.sonar.infoDialogTitle'), t('account.sonar.infoDialogMessage'))
        }
      />
      <SonarHint />
      <TrailerSwipeDeck initialItems={SONAR_MOCK_TRAILERS} />
    </SafeAreaView>
  );
}
