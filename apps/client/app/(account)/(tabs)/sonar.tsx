import { useTranslation } from '@kakamu/i18n';
import { Alert, View } from 'react-native';

import {
  SonarHeader,
  SonarHint,
  SONAR_MOCK_TRAILERS,
  TrailerSwipeDeck,
} from '@/components/featured/sonar';

export default function SonarScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1">
      <SonarHeader
        onInfoPress={() =>
          Alert.alert(t('account.sonar.infoDialogTitle'), t('account.sonar.infoDialogMessage'))
        }
        />
      <SonarHint />
      <TrailerSwipeDeck initialItems={SONAR_MOCK_TRAILERS} />
    </View>
  );
}
