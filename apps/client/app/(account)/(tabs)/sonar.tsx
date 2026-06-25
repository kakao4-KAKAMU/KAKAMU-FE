import { useTranslation } from '@kakamu/i18n';
import { ActivityIndicator, View } from 'react-native';
import { useErrorAlertDialog } from '@kakamu/ui';
import { SonarHeader } from '@/components/featured/header';
import { SonarHint, TrailerSwipeDeck } from '@/components/featured/sonar';
import { useSonarDeck } from '@/hooks/sonar/useSonarDeck';

export default function SonarScreen() {
  const { t } = useTranslation();
  const { open: openErrorAlert } = useErrorAlertDialog();
  const { items, deckKey, isLoading, isFetching, onVote, onQueueEmpty } = useSonarDeck();

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
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <TrailerSwipeDeck
          key={deckKey}
          initialItems={items}
          onQueueEmpty={onQueueEmpty}
          onVote={onVote}
        />
      )}
      {isFetching && !isLoading ? (
        <View className="pointer-events-none absolute inset-0 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : null}
    </View>
  );
}
