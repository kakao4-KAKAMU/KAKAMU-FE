import { useTranslation } from '@kakamu/i18n';
import { View } from 'react-native';
import { useErrorAlertDialog } from '@kakamu/ui';
import { SonarHeader } from '@/components/featured/header';
import {
  SonarHint,
  SONAR_MOCK_TRAILERS,
  TrailerSwipeDeck,
} from '@/components/featured/sonar';

export default function SonarScreen() {
  const { t } = useTranslation();
  const { open: openErrorAlert } = useErrorAlertDialog();

  return (
    <View className="flex-1">
      <SonarHeader
        onInfoPress={() =>
          openErrorAlert({
            title: t('account.sonar.infoDialogTitle'),
            description: t('account.sonar.infoDialogMessage'),
          })
        }
      />
      <SonarHint />
      <TrailerSwipeDeck initialItems={SONAR_MOCK_TRAILERS} />
    </View>
  );
}
